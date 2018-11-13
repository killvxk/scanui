<style lang="less">
.ivu-table-expanded-hidden{
    z-index:1 !important;
}
</style>
<template>
    <div style="z-index:1">
        <Modal
            v-model="modalimhost"
            :title="projectname"
            :styles="{top: '30px'}"
            okText= "导入"
            @on-ok="hostimport">
            <div class="margin-top-10">
                <Card>
                <div class="height-400px">
                    <Upload multiple type="drag" action="/upload.php"
                        :on-success="uploadsuccess">
                        <div style="padding: 60px 0;height: 200px;">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff">
                        </Icon>
                        <pre>支持XML格式的NMAP扫描结果</pre>
                        </div>
                    </Upload>
                </div>
                </Card>
            </div>
        </Modal>
        <Card>
            <Dropdown style="margin-left: 20px">
                <Button type="primary" size="large" @click="modalinfo=true">
                <Icon type="ios-download-outline"></Icon>
                新增资产
                </Button>
                <DropdownMenu slot="list">
                <DropdownItem>
                <Button type="primary" size="large" @click="modalimhost=true">
                <Icon type="ios-download-outline"></Icon>
                导入资产
                </Button>
                </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <a href="./static/portlist.xlsx">模板下载</a>
            <Input icon="search" slot="extra" style="width: 300px;" 
                v-model="searchdata" 
                @on-click="hostsearch(1)" 
                @keydown.enter.native = "hostsearch(1)"
                placeholder="请输入资产IP或中间件名称进行搜索..." />
        </Card>

        <can-edit-table stripe border id="table"
            ref="selection"
            :columns-list="hostcol" 
            v-model="hostdata"
            @on-delete="hostfinish"
            @on-change="hostedit"
            >
        </can-edit-table>

        <div style="margin: 10px;overflow: hidden">
			<div style="float: left;">共 {{total}} 条</div>
            <div style="float: right;">
                <Page show-elevator :current="current" :total="total" :page-size=30 @on-change="hostsearch"></Page>
            </div>
        </div>
        <Modal
            v-model="modalinfo"
            title="新增资产"
            :styles="{top: '30px'}"
            okText= "保存"
            @on-ok="portadd">
            <Form inline :label-width="80">
                <FormItem label="系统地址" >
                    <Input type="text" v-model="addinfo.hostip" placeholder="必填 127.0.0.1"></Input>
                </FormItem>
                <FormItem label="服务端口" >
                    <InputNumber :max="65535" :min="1" v-model="addinfo.hostport" placeholder="必填 80">
                    </InputNumber>
                </FormItem>
            </Form><Form inline :label-width="80">
                <FormItem label="主机名称">
                    <Input type="text" v-model="addinfo.hostname" placeholder="window/linux"></Input>
                </FormItem>
                <FormItem label="服务类型">
                    <Input type="text" v-model="addinfo.service" placeholder="http/dns/mysql"></Input>
                </FormItem>
            </Form><Form inline :label-width="80">
                <FormItem label="系统版本">
                    <Input type="text" v-model="addinfo.osver" placeholder="window7/centos6"></Input>
                </FormItem> 
                <FormItem label="软件版本">
                    <Input type="text" v-model="addinfo.softver" placeholder="iis6.0/mysql5.8"></Input>
                </FormItem>
            </Form><!--<Form :label-width="80"> 
                <FormItem label="中间件类型">
                    <Input type="text" v-model="addinfo.softtype"></Input>
                </FormItem>  
                <FormItem label="中间件版本">
                    <Input type="text" v-model="addinfo.softver"></Input>
                </FormItem> 
            </Form>--><Form :label-width="80">
                <FormItem label="备注">
                    <Input type="textarea" v-model="addinfo.note"></Input>
                </FormItem>   
            </Form>
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import tableExpand from './components/tableExpand';
import canEditTable from './components/canEditTable';
export default {
    name: 'hosts-table',
    components: {
        tableExpand,
        canEditTable,
    },
    data () {
        return {
            current:1,
            total:100,
            modalinfo: false,
            modalimhost:false,
            projectname:localStorage.projectname,
            projectid:localStorage.projectid,
            searchdata:'',
            addinfo: {
                hostip  :'',
                hostport:'', 
                hostname:'', 
                osver   :'',
                service :'', 
                softver :'',
                note    :'', 
            },
            taskinfo: [],
            hostdata: [],
            hosttemp: [],
            hostcol: [
                {
                    type: 'expand',
                    width: 30,
                    align: 'left',
                    render: (h, params) => {
                        return h(tableExpand, {
                            props: {
                                hostid: params.row.hostid,
                                hostip: params.row.hostip,
                            },
                        })
                    }
                },{
                    title: 'IP地址',
                    align: 'center',
                    key: 'hostip',
                    sortable: true,
                    render: (h, params) => {
                        return h('span', [
                            h('Button', {
                                props: {
                                    shape: 'circle',
                                    icon: 'reply',
                                    size: 'small'
                                },
                                on:{
                                    click:()=>{
                                        this.taskadd(params.row.hostip);
                                    }
                                }
                            }),
                            h('span', params.row.hostip),
                        ]);
                    }
                },{
                    title: '主机名字',
                    align: 'center',
                    key: 'hostname',
                    editable: true,
                },{
                    title: '系统版本',
                    align: 'center',
                    key: 'osver',
                    editable: true,
                },{
                    title: '备注',
                    align: 'center',
                    key: 'note',
                    editable: true,
                },{
                    title: '操作',
                    width: 180,
                    fixed: 'right',
                    key: 'handle',
                    handle: ['edit', 'delete'],
                }
            ],
            showCurrentTableData: true
        };
    },
    methods: {
        hostsearch(page) {
            util.ajax({
                method:'POST',
                action:'hostsearch',
                json:{page:page,'keyword':this.searchdata}
            }).then(res => {
                this.hostdata = res.ret;
                this.hosttemp = res.ret;
                this.total = res.total;
            }).catch(err => {
                this.$Message.error(err);
                console.log(err);
            });
        },
        hostedit (val, index) {
            util.ajax({
                method:'POST',
                action:'hostedit',
                json:this.hostdata[index]
            }).then(res => {
                this.$Message.info(res+'更新成功');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        hostfinish (val, index) {
            util.ajax({
                method:'POST',
                action:'hostfinish',
                json:{'hostid':this.hosttemp[index].hostid}
            }).then(res => {
                this.$Message.info('删除成功！');
                this.hosttemp = val;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        portadd(){
           util.ajax({
                method:'POST',
                action:'portadd',
                json:this.addinfo
            }).then(res => {
                this.$Message.info('增加成功！');
                this.hostsearch(1);
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
        taskadd(host){
            this.$router.push({
                name: 'task_list',
                params: {
                    isadd:true,
                    taskinfo:{
                        task_host: host,
                        task_name:["hostscan"],
                    }
                }
            });
        },
        uploadsuccess(res, file){
            this.taskinfo = [];
            for(var i=0;i<res.result.length;i++){
                this.taskinfo.push(res.result[i].fid);
            }
            this.$Message.info('上传成功。');
        },
        hostimport(){
            util.ajax({
                method:'POST',
                action:'hostimport',
                json:{'fids':this.taskinfo}
            }).then(res => {
                this.$Message.info('后台导入中。。。');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
    },
    created () {
        if(this.$route.params.isadd){
            return this.modalinfo = true;
        }
        if(localStorage.projectid != 'null' && localStorage.projectid != undefined){
            this.hostsearch(1);
        }else{
            this.$Message.error('请先选择当前系统'); 
            this.$router.push({
                name: 'project_index'
            });
        };
    }
};
</script>



