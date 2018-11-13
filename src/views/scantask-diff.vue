<template>
    <div>
        <div><Card>
            <Button type="primary" size="large" @click="modalinfo=true;">
                <Icon type="ios-download-outline"></Icon>
                重选任务
            </Button>
            <Button type="success" size="large" @click="bugfinish">
                <Icon type="ios-download-outline"></Icon>
                确认修复
            </Button>
            <Button type="warning" size="large" @click="bugfalse">
                <Icon type="ios-download-outline"></Icon>
                确认忽略
            </Button>
            <Button type="error" size="large" @click="bugdelete">
                <Icon type="ios-download-outline"></Icon>
                删除漏洞
            </Button>
        </Card></div>
        <Card>
            <p slot="title">与源任务相同漏洞</p>
            <Table stripe border size="small"
            ref="selection1" 
            :columns="tablecol" 
            :data="buginter" >
            </Table>
        </Card><Card>
            <p slot="title">本次新增漏洞</p>
            <Table stripe border size="small"
            ref="selection2" 
            :columns="tablecol" 
            :data="bugunion" >
            </Table>
        </Card>
        <Modal v-model="modalinfo"
                :styles="{top: '30px'}"
                okText= "对比"
                @on-ok="taskdiff(taska.task_id,taskb.task_id)">
            <Row><Col :lg="10">
                <Card><p slot="title">源任务</p>
                <div style="height:150px;">
                    <ul>
                        <li class="notwrap todolist-item">名称:{{taska.task_name}}</li>
                        <li class="notwrap todolist-item">状态:{{taska.task_code}}</li>
                        <li class="notwrap todolist-item">时间:{{taska.createdate}}</li>
                        <li class="notwrap todolist-item">主机:{{taska.task_host}}</li>
                        <li class="notwrap todolist-item">编号:{{taska.task_id}}</li>
                    </ul>
                </div>
                </Card>
                <Select remote 
                    v-model="taska.task_id"
                    :filterable = true
                    :transfer = true
                    :remote-method="scantasksearch"
                    @on-change="taskselecta">
                    <Option v-for="item in taskdata" 
                            :value="item.task_id">{{item.task_name}}[{{item.task_host}}]</Option>
                </Select>
            </Col><Col :lg="3">
                <Button style="margin:100px 5px 5px 2px;"
                        type="primary" 
                        shape="circle" 
                        @click="taskswitch">切换</Button>
            </Col><Col :lg="10">
                <Card><p slot="title">目标任务</p>
                <div style="height:150px;">
                    <ul>
                        <li class="notwrap todolist-item">名称:{{taskb.task_name}}</li>
                        <li class="notwrap todolist-item">状态:{{taskb.task_code}}</li>
                        <li class="notwrap todolist-item">时间:{{taskb.createdate}}</li>
                        <li class="notwrap todolist-item">主机:{{taskb.task_host}}</li>
                        <li class="notwrap todolist-item">编号:{{taskb.task_id}}</li>
                    </ul>
                </div>
                </Card>
                <Select remote 
                    v-model="taskb.task_id"
                    :filterable = true
                    :transfer = true
                    :remote-method="scantasksearch"
                    @on-change="taskselectb">
                    <Option v-for="item in taskdata" 
                            :value="item.task_id">{{item.task_name}}[{{item.task_host}}]</Option>
                </Select>
            </Col></Row>
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';

export default {
    name: 'task-diff',
    data () {
        return {
            modalinfo: false,
            taska:{},
            taskb:{},
            buginter: [],
            bugunion: [],
            taskdata:[],
            tablecol: [
                {
                    type: 'selection',
                    width: 40,
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
                    align: 'center',
                    key: 'bugname',
                    sortable: true,
                },{
                    title: '漏洞地址',
                    key: 'bugaddr',
                    sortable: true,
                },{
                    title: '状态',
                    key: 'bugstate',
                    width: 100,
                    sortable: true,
                },{
                    title: '创建时间',
                    align: 'center',
                    key: 'createdate',
                    sortable: true,
                    width: 120,
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
                    width: 80,
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
                        ]);
                    },
                }
            ],
            showCurrentTableData: true,
        };
    },
    methods: {
        taskdiff(tida,tidb){
            this.$route.query.tida = tida;
            this.$route.query.tidb = tidb;
            if((tida!=undefined)&&(tida!='null')&&(tidb!=undefined)&&(tidb!='null')){
                util.ajax({
                    method:'POST',
                    action:'taskdiff',
                    json:{'tida':tida,'tidb':tidb}
                }).then(res => {
                    this.buginter = res.inter;
                    this.bugunion = res.union;
                }).catch(err => {
                    this.$Message.error(err);
                }); 
            }else{
                this.$Message.error('请选取两个目标任务。');
            }    
        },
        scantasksearch (value) {
            util.ajax({
                method:'POST',
                action:'scantasksearch',
                json:{page:1,'keyword':value}
            }).then(res => {
                this.taskdata = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        taskselecta(taskid){
            this.taskdata.forEach(item=>{
                if(item.task_id == taskid){
                    this.taska = item;
                }
            });
        },
        taskselectb(taskid){
            this.taskdata.forEach(item=>{
                if(item.task_id==taskid){
                    this.taskb = item;
                }
            });
        },
        taskswitch(){
            var temp = this.taskb;
            this.taskb = this.taska;
            this.taska = temp;
            this.$route.query.tida = this.taska.task_id;
            this.$route.query.tidb = this.taskb.task_id;
            this.taskdata = [];
        },
        bugfinish () {
            this.selectlist = [];
            this.$refs.selection1.getSelection().forEach(item=>{
                 this.selectlist.push(item.bugid);
            });
            this.$refs.selection2.getSelection().forEach(item=>{
                 this.selectlist.push(item.bugid);
            });     
            util.ajax({
                method:'POST',
                action:'bugfinish',
                json:{'selectlist':this.selectlist}
            }).then(res => {
                this.$Message.info('确认修复！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        bugfalse () {
            this.selectlist = [];
            this.$refs.selection1.getSelection().forEach(item=>{
                 this.selectlist.push(item.bugid);
            });
            this.$refs.selection2.getSelection().forEach(item=>{
                 this.selectlist.push(item.bugid);
            });
            util.ajax({
                method:'POST',
                action:'bugfalse',
                json:{'selectlist':this.selectlist}
            }).then(res => {
                this.$Message.info('确认忽略！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        bugdelete () {
            this.selectlist = [];
            this.$refs.selection1.getSelection().forEach(item=>{
                 this.selectlist.push(item.bugid);
            });
            this.$refs.selection2.getSelection().forEach(item=>{
                 this.selectlist.push(item.bugid);
            });
            util.ajax({
                method:'POST',
                action:'bugdelete',
                json:{'selectlist':this.selectlist}
            }).then(res => {
                this.taskdiff(this.$route.query.tida,this.$route.query.tidb);
                this.$Message.info('删除成功！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        gettaskbyid(tid){
            util.ajax({
                method:'POST',
                action:'scantasksearch',
                json:{page:1,'keyword':tid}
            }).then(res => {
                res.ret.forEach(item=>{
                    if(item.task_id==tid){
                        this.taskb = item;
                    }
                })
            }).catch(err => {
                this.$Message.error(err);
            });
        }
    },
    created () {
        var tida = this.$route.query.tida;
        var tidb = this.$route.query.tidb;
        if((tida!=undefined)&&(tida!='null')&&(tidb!=undefined)&&(tidb!='null')){
            this.taskdiff(tida,tidb);
        }else{
            this.gettaskbyid(tidb);
            this.modalinfo = true;
        }
    }
};
</script>