<template>
    <div>
        <Card>
            <Dropdown style="margin-left: 20px">
                <Button type="primary" size="large" @click="modalinfo=true">
                    <Icon type="ios-download-outline"></Icon>
                    新建任务
                </Button>
            </Dropdown>
            <!--
            <Button type="warning" size="large" onclick="alert('暂未实现')">
                <Icon type="ios-download-outline"></Icon>
                暂停任务
            </Button>
            -->
            <Poptip confirm placement="bottom" title="确认删除？"
                @on-ok="scantaskfinish">
                <Button type="error" size="large" >
                    <Icon type="ios-download-outline"></Icon>
                    删除任务
                </Button>
            </Poptip>
            <Input icon="search" slot="extra" style="width: 300px;" 
                v-model = "searchdata" 
                @on-click = "scantasksearch(1)"
                @keydown.enter.native = "scantasksearch(1)"  
                placeholder="请输入任务目标进行搜索..." />
            </Input>

        </Card>
        <Table stripe border 
            ref="selection" 
            :columns="taskcol" 
            :data="taskdata" >
        </Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page show-elevator :current="current" :total="total" :page-size=30 @on-change="scantasksearch"></Page>
            </div>
        </div>
        <Modal
            v-model="modalinfo"
            :title="projectname"
            :styles="{top: '30px'}"
            okText= "保存"
            @on-ok="scantaskadd">
            <Form :model="taskinfo" :label-width="80">
                <Tabs>
                    <TabPane label="参数" >
                     <FormItem label="扫描目标">
                            <Input 
                                v-model="taskinfo.task_host"
                                :rows="5"
                                type="textarea" 
                                placeholder="一行一个目标网址,IP支持.1/24形式的C段简写">
                            </Input>
                        </FormItem> 
                        <FormItem label="扫描类型">
                            <RadioGroup v-model="taskinfo.task_name">
                                <Tag v-for="task in tasktype" type="border" color="yellow">
                                    <Radio :label="task.task_name">{{task.task_desc}}</Radio>
                                </Tag>
                            </RadioGroup>
                        </FormItem> 
                    </TabPane>
                    <TabPane label="选项">
                        <FormItem label="任务等级">
                            <Select v-model="taskinfo.task_level">
                                <Option value="0">立刻</Option>
                                <Option value="1">紧急</Option>
                                <Option value="2">优先</Option>
                                <Option value="3">一般</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="任务参数">
                            <Input type="text" 
                            v-model="taskinfo.task_args"
                            placeholder="-key1=value -key2=value"></Input>
                        </FormItem> 
                        <FormItem label="任务备注">
                            <Input type="text" v-model="taskinfo.task_note"></Input>
                        </FormItem> 
                    </TabPane>
                    <!--<TabPane label="上传">
                        <div class="margin-top-10">
                            <Card>
                                <div class="height-200px">
                                    <Upload
                                        multiple
                                        type="drag"
                                        action="/upload.php"
                                        :on-success="uploadsuccess">
                                        <div style="padding: 60px 0;height: 200px;">
                                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                            <p>上传文件</p>
                                        </div>
                                    </Upload>
                                </div>
                            </Card>
                        </div>
                    </TabPane>-->
                </Tabs>
            </Form>
        </Modal>
        <Modal
            v-model="scaninfo"
            title="任务详情"
            :styles="{top: '30px'}"
            >
            <div>
                <Button v-if="taskinfoview.taskcode=='finish'" type="primary" click="">重载</Button>
                <Button v-else-if="taskinfoview.taskcode=='working'" type="error" click="">结束</Button>
                <Button type="warning" @click="gotaskdiff(taskinfoview.taskid)">任务对比</Button>
            </div>
            <Row>
            <Col span="14">
                <div>
                    <ul>创建时间 : {{ taskinfoview.createdate}}</ul>
                    <ul>结束时间 : {{ taskinfoview.finishdate}}</ul>
                    <ul>任务标识 : {{ taskinfoview.taskid}}</ul>
                    <ul>任务主机 : {{ taskinfoview.taskhost}}</ul>
                    <ul>任务状态 : {{ taskinfoview.taskcode}}</ul>
                </div>
            </Col>
            <Col span="10">
                 <div>
                    <ul>任务参数 : {{ taskinfoview.taskargs}}</ul>
                    <ul>任务备注 : {{ taskinfoview.tasknote}}</ul>
                    <ul>任务进程 : {{ taskinfoview.taskpid}}</ul>
                    <ul>任务等级 : {{ taskinfoview.tasklevel}}</ul>
                    <ul>任务名称 : {{ taskinfoview.taskname}}</ul>
                    <ul>任务类型 : {{ taskinfoview.tasktype}}</ul>
                </div>
            </Col>
            </Row>
            <Card dis-hover v-if="taskinfoview.buglist.length > 0">
                <p slot="title">
                    <Icon type="ios-list"></Icon>
                    扫描结果
                </p>
                <div style="height: 300px;overflow-y:hidden;overflow-x: hidden;">
                    <ul id="todoList" class="iview-admin-draggable-list">
                        <a v-for="item in taskinfoview.buglist" :href="'/#/buginfo?id='+item.bugid">
                        <li class="notwrap todolist-item">【{{item.bugrank}}】{{item.bugname }}</li>
                        </a>
                    </ul>
                </div>
            </Card>
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';

export default {
    name: 'task-table',
    data () {
        return {
            modalinfo: false,
            scaninfo: false,
            projectname:localStorage.projectname,
            projectid:localStorage.projectid,
            current:1,
            total:100,
            searchdata:'',
            taskinfoview:{buglist:[]},
            tasklist:[],
            tasktype:[],
            taskinfo: {
                task_host:'',
                task_note:'',
                task_level:'3',
                task_name:'',
                task_args:'',
            },
            taskdata: [/*{
                task_id:'',
                task_code:'working',
                task_host:'127.0.0.1',
                task_name:'端口扫描',
                createdate:'1514430799',
            }*/],
            taskcol: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    title: '任务状态',
                    align: 'center',
                    width: 120,
                    key: 'task_code',
                    sortable: true,
                    render: (h, params) => {
                        const code = params.row.task_code;
                        const text = code === 'waiting' ? '等待运行' 
                                   : code === 'queueing' ? '排队中' 
                                   : code === 'working' ? '运行中' 
                                   : code === 'finish' ? '已完成' 
                                   : code === 'pause' ? '已暂停'
                                   : '出错了';
                        const color = code === 'waiting' ? 'green' 
                                   : code === 'queueing' ? 'green' 
                                   : code === 'working' ? 'green' 
                                   : code === 'finish' ? 'blue' 
                                   : code === 'pause' ? 'yellow'
                                   : 'red';
                        return h('Tag', {
                            props: {
                                checkable: true,
                                color: color
                             }
                        },text);
                     },
                },{
                    title: '任务目标',
                    key: 'task_host',
                },{
                    title: '任务类型',
                    key: 'task_name',
                    render: (h, params) => {
                        return h('div',{},
                            params.row.task_name + ' ' + params.row.task_args
                        );
                    },
                },{
                    title: '创建时间',
                    align: 'center',
                    key: 'createdate',
                    sortable: true,
                    width: 180,
                    render: (h, params) => {
                        return h('span', [
                            h('Icon', {
                                props: {
                                    type: 'android-time',
                                },
                            }),
                            h('span', util.formatdate(params.row.createdate))
                        ]);
                    }
                },{
                    title: '操作',
                    align: 'center',
                    width: 100,
                    key: 'action',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'info',
                                },
                                on: {
                                    click: () => {
                                        this.scantaskinfoview(params.row.task_id);
                                    },
                                }
                            },'详情'),
                            /*h('i-switch', {
                                props: {
                                    type: 'info',
                                    size: 'large',
                                    value: params.row.taskid == localStorage.taskid,
                                },
                                on: {
                                    'on-change': () => {
                                        this.selecttask(params.row.taskid);
                                    },
                                }
                            }),*/
                        ]);
                    }
                }
            ],
            showCurrentTableData: true,
        };
    },
    methods: {
        scantaskinfoview(tid){
            util.ajax({
                method:'POST',
                action:'scanntaskinfo',
                json:{'taskid':tid}
            }).then(res => {
                this.taskinfoview = res;
                this.scaninfo = true;
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
        tasktypeget(page){
           util.ajax({
                method:'POST',
                action:'tasktypeget',
                json:{'page':page}
            }).then(res => {
                this.tasktype = res;
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
        scantasksearch (page) {
            util.ajax({
                method:'POST',
                action:'scantasksearch',
                json:{page:page,'keyword':this.searchdata}
            }).then(res => {
                this.taskdata = res.ret;
                this.total = res.total;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        scantaskfinish () {
            var selected = this.$refs.selection.getSelection();
            this.tasklist = [];
            for(var k in selected){
                this.tasklist.push(selected[k].task_id);
                for(var d in this.taskdata){
                    if(selected[k].task_id == this.taskdata[d].task_id){
                        this.taskdata.splice(d,1);
                    }
                }
            }
            util.ajax({
                method:'POST',
                action:'scantaskfinish',
                json:{'selectlist':this.tasklist}
            }).then(res => {
                this.$Message.info('删除成功！');
                this.scantasksearch(1);
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        scantaskadd () {
            util.ajax({
                method:'POST',
                action:'scantaskadd',
                json:{
                    'task_host':this.taskinfo.task_host,
                    'task_name':[this.taskinfo.task_name],
                    'task_level':this.taskinfo.task_level,
                    'task_args':this.taskinfo.task_args,
                    'task_note':this.taskinfo.task_note,
                }
            }).then(res => {
                this.$Message.info('添加成功！');
                this.scantasksearch(1);
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        selecttask(taskid){
            localStorage.taskid = taskid;
            util.ajax({
                method:'POST',
                action:'scantaskselect',
                json:{'taskid':taskid}
            }).then(res => {
                localStorage.taskid = res.taskid;
                this.$Message.info('确定选择该任务');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        uploadsuccess(res, file){
            this.taskinfo.task_host += res.fid+'\n';
            this.taskinfo.task_note = res.fname;
            this.taskinfo.task_name = ['hashbrute'];
        },rands(){
            var items = ['red','blue','yellow','green'];
            return items[Math.floor(Math.random()*items.length)];
        },gotaskdiff(taskid){
            this.$router.push({
                name: 'task_diff',
                query: {tidb:taskid}
            });
        }
    },
    created () {
        this.tasktypeget();
        if(localStorage.projectid != 'null' && localStorage.projectid != undefined){
            this.scantasksearch(1);
        }else{
            this.$Message.error('请先选择当前系统'); 
            this.$router.push({
                name: 'project_index'
            });
        };
        if(this.$route.params.isadd){
            this.taskinfo = this.$route.params.taskinfo;
            return this.modalinfo = true;
        }
    }
};
</script>