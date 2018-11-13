<template>
    <div>
        <Card>
        <Dropdown style="margin-left: 20px">
            <Button type="primary" size="large" @click="bugadd">
                <Icon type="ios-download-outline"></Icon>
                新增漏洞
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem>
                <Button type="primary" size="large" @click="modalinfo=true">
                <Icon type="ios-download-outline"></Icon>
                导入漏洞
                </Button>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Button type="success" size="large" @click="bugfinish">
            <Icon type="ios-download-outline"></Icon>
            确认修复
        </Button>
        <Button type="warning" size="large" @click="bugfalse">
            <Icon type="ios-download-outline"></Icon>
            确认忽略
        </Button>
        <Input icon="search" slot="extra" style="width: 300px;" 
                v-model = "searchdata" 
                @on-click = "bugsearch(1)" 
                @keydown.enter.native = "bugsearch(1)" 
                placeholder="请输入ID,名称,地址搜索..." />
        </Input>
        </Card>
        <Table stripe border 
            ref="selection" 
            :columns="tablehead" 
            :data="bugdata" >
        </Table>
        <div style="margin: 10px;overflow: hidden">
		<div style="float: left;">共 {{total}} 条</div>
            <div style="float: right;">
                <Page show-elevator :current="current" :total="total" :page-size="30" @on-change="bugsearch"></Page>
            </div>
        </div>
        <Modal
            v-model="modalinfo"
            :title="projectname"
            :styles="{top: '30px'}"
            okText= "导入"
            @on-ok="bugimport">
            <div class="margin-top-10">
            <Card>
                <div class="height-400px">
                    <Upload multiple type="drag" action="/upload.php"
                        :on-success="uploadsuccess">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>上传报告文件</p>
                        <pre v-html="'目前支持的报告格式：<br>nessus-csv,awvs-html<br>天融信-html,绿盟-html'"></pre>
                    </Upload>
                </div>
                </Card>
            </div>
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'buglist-table',

    data () {
        return {
            modalinfo:false,
            current:1,
            total:100,
            projectname:localStorage.projectname,
            projectid:localStorage.projectid,
            tasklist:[],
            searchdata:'',
            selectlist:[],
            buginfo: {},
            bugdata:[/*{
                bugid:'',
                bugrank:'高危',
                bugname:'sql注入',
                bugaddr:'http://123.0.0.1:123/wd?q=sa',
                bugstate:'发现漏洞',
                updatedate:'2018-01-08 16:48:35.393997',
            }*/],
            tablehead: [{
                type: 'selection',
                width: 60,
                align: 'center'
            },{
                title: '等级',
                align: 'center',
                width: 80,
                sortable: true,
                key: 'bugrank',
                render: (h, params) => {
                        const row = params.row.bugrank;
                        const color = row === '高危' ? 'red' 
                                    : row === '中危' ? 'yellow' 
                                    : row === '低危' ? 'blue' 
                                    : 'red';
                        return h('Tag', {
                            props: {
                                type: 'border',
                                color: color
                             }
                        },row);
                     }, 
            },{
                    title: '漏洞名称',
                    key: 'bugname',

            },{
                    title: '漏洞地址',
                    key: 'bugaddr',
            },{
                    title: '漏洞状态',
                    align: 'center',
                    key: 'bugstate',
                    sortable: true,
                    width: 110,
            },{
                    title: '更新时间',
                    align: 'center',
                    key: 'updatedate',
                    sortable: true,
                    width: 180,
                    render: (h, params) => {
                        return h('span', [
                            h('Icon', {
                                props: {
                                    type: 'android-time',
                                },
                            }),
                            h('span', util.formatdate(params.row.updatedate))
                        ]);
                    }
                },{
                title: '操作',
                align: 'center',
                width: 120,
                key: 'action',
                render: (h, params) => {
                    return h('div', [  
                        h('Button', {
                            props: {
                                type: 'info',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    let query = {id: params.row.bugid};
                                    this.$router.push({
                                        name: 'bug_info',
                                        query: query
                                    });
                                }
                            }
                        }, '详情'),
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    let query = {id: params.row.bugid};
                                    this.$router.push({
                                        name: 'bug_edit',
                                        params: {'isedit':true},
                                        query: query,
                                        
                                    });
                                }
                            }
                        }, '编辑')
                    ]);
                },
            }],
            showCurrentTableData: true
        };
    },
    methods: {
        bugsearch(page){
            util.ajax({
                method:'POST',
                action:'bugsearch',
                json:{page:page,history:false,'keyword':this.searchdata}
            }).then(res => {
               this.bugdata = res.ret;
               this.total = res.total;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        bugfinish () {
            var selected = this.$refs.selection.getSelection();
            this.selectlist = [];
            for(var k in selected){
                this.selectlist.push(selected[k].bugid);
                for(var d in this.bugdata){
                    if(selected[k].bugid == this.bugdata[d].bugid){
                        this.bugdata[d].bugstate = "已修复";
                    }
                }
            }
            util.ajax({
                method:'POST',
                action:'bugfinish',
                json:{'selectlist':this.selectlist}
            }).then(res => {
                this.bugsearch(1);
                this.$Message.info('确认修复！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        bugfalse () {
            var selected = this.$refs.selection.getSelection();
            this.selectlist = [];
            for(var k in selected){
                this.selectlist.push(selected[k].bugid);
                for(var d in this.bugdata){
                    if(selected[k].bugid == this.bugdata[d].bugid){
                        this.bugdata[d].bugstate = "已忽略";
                    }
                }
            }
            util.ajax({
                method:'POST',
                action:'bugfalse',
                json:{'selectlist':this.selectlist}
            }).then(res => {
                this.bugsearch(1);
                this.$Message.info('确认忽略！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        bugadd (){
            this.$router.push({
                name: 'bug_edit'
            });
        },
        uploadsuccess(res, file){
            this.taskinfo = [];
            for(var i=0;i<res.result.length;i++){
                this.taskinfo.push(res.result[i].fid);
            }
        },
        bugimport(){
            util.ajax({
                method:'POST',
                action:'bugimport',
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
            this.bugsearch(1);
        }else{
            this.$Message.error('请先选择当前系统'); 
            this.$router.push({
                name: 'project_index'
            });
        };
    }
};
</script>





