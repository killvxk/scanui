
<style lang="less">
</style>
<template>
    <div class="home-main">
        <Modal 
                v-model="modalproject"
                title="创建系统"
                okText= "保存"
                @on-ok="projectadd">
                <Form :label-width="80">
                    <FormItem label="系统名称">
                        <Input type="text" v-model="projectinfo.project_name" placeholder="必填"></Input>
                    </FormItem> 
                    <FormItem label="系统描述">
                        <Input type="textarea" v-model="projectinfo.project_desc">
                        </Input>
                    </FormItem>  
                </Form>
            </Modal>
        <Card>
            <Dropdown style="margin-left: 20px">
                <Button type="primary" size="large" @click="modalproject=true">
                    <Icon type="ios-download-outline"></Icon>
                    新建系统
                </Button>
            </Dropdown>
            <Button type="error" size="large" @click="projectfinish">
                <Icon type="ios-download-outline"></Icon>
                删除系统
            </Button>
        </Card> 
        <div><CheckboxGroup v-model="selectlist">
            <Card class="margin-top-10" v-for="item in projectdata">
                <p slot="title"><Checkbox :label="item.project_id">{{item.project_name}}</Checkbox>
                </p>
                <i-switch slot="extra" size="large" 
                    v-model="item.project_id==projectid"
                    @on-change="projectselect(item.project_id)">
                    <span slot="open">当前</span>
                    <span slot="close">选择</span>
                </i-switch>
                <Row>
                    <Col :lg="4">
                        <a @click="viewreport(item.project_id)">
                            <infor-card
                            id-name="scanvul"
                            :end-val="item.scanvul"
                            iconType="shuffle"
                            color="#f25e43"
                            intro-text="漏洞数量"></infor-card>
                        </a>
                    </Col>
                    <Col :lg="4">
                        <i-circle :percent="item.project_load">
                            <span class="demo-Circle-inner" style="font-size:24px">{{item.project_load}}%</span>
                            <br><span>任务进度</span>
                        </i-circle>
                    </Col>
                    <Col :lg="12">
                        <p>创建时间：{{formatdate(item.createdate)}}</p>
                        <p>任务总数：{{item.scantask}}</p>
                        <p>项目经理：{{item.createuser}}</p>
                        <p>项目成员：<span v-for="item in item.member">{{item}},</span></p>
                        <p>项目描述：{{item.project_desc}}</p>
                    </Col>
                    <Col :lg="2">
                        <Tag v-for="task in item.tasklist" :color="rands()">{{task}}</Tag>
                    </Col>
                    <Col :lg="2">
                        <Row>
                        <Button icon="ios-plus-empty" type="dashed" 
                        @click="scantaskadd(item.project_id)">新建任务</Button>
                        <Button icon="ios-plus-empty" type="dashed" 
                        @click="bugadd(item.project_id)">新增漏洞</Button>
                        <Button icon="ios-plus-empty" type="dashed" 
                        @click="portadd(item.project_id)">新增资产</Button>
                        <Button icon="ios-plus-empty" type="dashed" 
                        @click="downloadreport(item.project_id)">导出报告</Button>
                        </Row>
                    </Col>
                </Row>
            </Card></CheckboxGroup>
        </div>
    </div>
</template>

<script> 
import VulRank from './components/vulrank.vue';
import inforCard from './components/inforCard.vue';
import util from '@/libs/util.js';

export default {
    name: 'project',
    components: {
        VulRank,
        inforCard,
    },

    data () {
        return {
            modalproject: false,
            searchdata:'',
            projectinfo:{
                project_name:'',
                project_desc:'',
            },
            projectid:localStorage.projectid,
            selectlist:[],
            projectdata:[],
        };
    },
    methods :{
        downloadreport(pid){
            window.open("./report.php?pid="+pid+'&tid='+localStorage.token);
        },
        viewreport(projectid){
            this.$router.push({
                    name: 'project_info',
                    query: {projectid:projectid}
            });
        },
        scantaskadd(projectid){
            this.projectid = projectid;
            util.ajax({
                method:'POST',
                action:'projectselect',
                json:{'projectid':projectid}
            }).then(res => {
                localStorage.projectid = res.projectid;
                localStorage.projectname = res.projectname;
                this.$Message.info('确定选择该系统');
                this.$router.push({
                    name: 'task_list',
                    params: {
                        isadd:true,
                        taskinfo:{
                            task_host: '',
                            task_name:[],
                        }
                    }
                });
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        bugadd(projectid){
            this.projectid = projectid;
            util.ajax({
                method:'POST',
                action:'projectselect',
                json:{'projectid':projectid}
            }).then(res => {
                localStorage.projectid = res.projectid;
                localStorage.projectname = res.projectname;
                this.$Message.info('确定选择该系统');
                this.$router.push({
                    name: 'bug_edit'
                });
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        portadd(projectid){
            this.projectid = projectid;
            util.ajax({
                method:'POST',
                action:'projectselect',
                json:{'projectid':projectid}
            }).then(res => {
                localStorage.projectid = res.projectid;
                localStorage.projectname = res.projectname;
                this.$Message.info('确定选择该系统');
                this.$router.push({
                    name: 'port_list',
                    params: {isadd:true}
                });
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        projectadd(){
            util.ajax({
                method:'POST',
                action:'projectadd',
                json:this.projectinfo,
            }).then(res => {
                this.projectdata.unshift(res);
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        projectselect(projectid){
            this.projectid = projectid;
            util.ajax({
                method:'POST',
                action:'projectselect',
                json:{'projectid':projectid}
            }).then(res => {
                localStorage.projectid = res.projectid;
                localStorage.projectname = res.projectname;
                this.$Message.info('确定选择该系统');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        projectget(){
            util.ajax({
                method:'POST',
                action:'projectget',
                json:{}
            }).then(res => {
                this.projectdata = res;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        projectfinish(){
            util.ajax({
                method:'POST',
                action:'projectfinish',
                json:{'selectlist':this.selectlist}
            }).then(res => {
                for(var k in this.selectlist){
                    for(var d in this.projectdata){
                        if(this.projectdata[d].project_id == this.selectlist[k]){
                            this.projectdata.splice(d,1);
                            this.$Message.info('删除系统成功');
                        };
                    };
                };
                this.selectlist = [];
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
        formatdate(time) {
            return time.substring(0,19);
        },
        rands(){
            var items = ['red','blue','yellow','green'];
            return items[Math.floor(Math.random()*items.length)];
        },
    },
    created () {
        this.projectget();
    }

};
</script>
