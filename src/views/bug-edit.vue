<style lang="less">
@import './../styles/common.less';
.article-link-con{
    height: 32px;
    width: 100%;
}
.fixed-link-enter{
    opacity: 0;
}
.fixed-link-enter-active, .fixed-link-leave-active {
    transition: opacity .3s
}
.fixed-link-enter-to{
    opacity: 1
}
.openness-radio-con{
    margin-left: 40px;
    padding-left: 10px;
    height: 130px;
    border-left: 1px dashed #ebe9f3;
    overflow: hidden;
}
.publish-time-picker-con{
    margin-left: 40px;
    padding-left: 10px;
    height: 100px;
    border-left: 1px dashed #ebe9f3;
    overflow: hidden;
}
.openness-con-enter{
    height: 0;
}
.openness-con-enter-active, .openness-con-leave-active{
    transition: height .3s;
}
.openness-con-enter-to{
    height: 130px;
}
.openness-con-leave{
    height: 130px;
}
.openness-con-leave-to{
    height: 0;
}
.publish-button-con{
    border-top: 1px solid #f3eff1;
    padding-top: 14px;
}
.publish-button{
    float: right;
    margin-left: 10px;
}
.publish-time-enter{
    height: 0;
}
.publish-time-enter-active, .publish-time-leave-active{
    transition: height .3s;
}
.publish-time-enter-to{
    height: 100px;
}
.publish-time-leave{
    height: 100px;
}
.publish-time-leave-to{
    height: 0;
}
.classification-con{
    height: 200px;
    margin-top: -16px;
    border-left: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    border-radius: 0 0 3px 3px;
    padding: 10px;
    overflow: auto;
}
.add-new-tag-con{
    margin-top: 20px;
    border-top: 1px dashed #dbdddf;
    padding: 20px 0;
    height: 60px;
    overflow: hidden;
}
.add-new-tag-enter{
    height: 0;
    margin-top: 0;
    padding: 0px 0;
}
.add-new-tag-enter-active, .add-new-tag-leave-active{
    transition: all .3s;
}
.add-new-tag-enter-to{
    height: 60px;
    margin-top: 20px;
    padding: 20px 0;
}
.add-new-tag-leave{
    height: 60px;
    margin-top: 20px;
    padding: 20px 0;
}
.add-new-tag-leave-to{
    height: 0;
    margin-top: 0;
    padding: 0px 0;
}
.iview-admin-draggable-list{
    height: 100%;
}
.iview-admin-draggable-list li{
    padding: 9px;
    border: 1px solid #e7ebee;
    border-radius: 3px;
    margin-bottom: 5px;
    cursor: pointer;
    position: relative;
    transition: all .2s;
}
.iview-admin-draggable-list li:hover{
    color: #87b4ee;
    border-color: #87b4ee;
    transition: all .2s;
}
.iview-admin-draggable-delete{
    height: 100%;
    position: absolute;
    right: -8px;
    top: 0px;
    display: none;
}
.iview-admin-draggable-list li:hover .iview-admin-draggable-delete{
    display: block;
}
.placeholder-style{
    display: block !important;
    color: transparent;
    border-style: dashed !important;
}
.delte-item-animation{
    opacity: 0;
    transition: all .2s;
}
.iview-admin-draggable-list{
    overflow: auto
}
</style>


<template>
    <div>
        <Row>
            <Col :md="24" :lg="18">
                <Form :label-width="40">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        漏洞详情
                    </p>
                    <Button 
                        slot="extra" 
                        icon="ios-checkmark" 
                        type="primary"
                        @click="bugedit">
                        保存
                    </Button>
                    <Form>
                        <FormItem label="所属系统" :label-width="60">
                            <Select remote 
                                v-model="buginfo.projectname"
                                :filterable = true
                                :transfer = true
                                :remote-method="projectsearchbyname"
                                @on-change="projectselectbyname"
                                placeholder="输入系统名称">
                                <Option v-for="item in projectdata" 
                                    :value="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="漏洞名称" :label-width="60">
                            <Select remote
                                v-model = "vulinfo.vulid" 
                                :filterable = true
                                :transfer = true
                                :remote-method="vulsearch"
                                @on-change="vulselectbyname"
                                placeholder="输入漏洞名称">
                                <Option v-for="item in vulnerabledata" 
                                    :value="item.vulid">{{ item.vulname }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <FormItem label="漏洞地址" :label-width="60">
                        <Input v-model="buginfo.bugaddr" placeholder="http://127.0.0.1:8314/bugedit?id=1"></Input> 
                    </FormItem>
                    <div id="articleEditor1">
                    </div>
                </Card></Form> 
            </Col>
            <Col :md="24" :lg="6" class="padding-left-10">
                <Card dis-hover>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        发布历史
                    </p>
                    <div style="height:500px; overflow:auto">
                        <ul id="todoList" class="iview-admin-draggable-list">
                            <li v-for="(bug,i) in buglist" :key="i" class="notwrap todolist-item" :data-index="i">
                                {{ bug.bugname }}
                            </li>
                        </ul>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import E from 'wangeditor'
import util from '@/libs/util.js';

export default {
    name: 'artical-publish',

    data () {
        return {
            editor:'',
            projectdata: [],
            vulnerabledata:[],
            buginfo:{
                projectid: localStorage.projectid,
                projectname: localStorage.projectname,
                bugid:'',
                bugaddr:'',
                bugreq:'',
            },
            vulinfo:{
                    vulid:'',
                    vulname:'',
                    vulrank:'',
                    vulowasp:'',
                    vulno:'',
            },
            buglist:[],
        };
    },
    mounted() {
        this.editor = new E('#articleEditor1');
        var self = this;
        this.editor.customConfig.onchange = function(value){
            self.buginfo.bugreq = value;
        };
        this.editor.customConfig.uploadImgShowBase64 = true; 
        this.editor.create();
    },
    methods: {
        bugedit (){
            if(this.vulinfo.vulid!=''&&this.buginfo.projectid!=''){
                util.ajax({
                    method:'POST',
                    action:'bugedit',
                    json:{
                        'projectid':this.buginfo.projectid,
                        'vulid':this.vulinfo.vulid,
                        'bugid':this.buginfo.bugid,
                        'bugaddr':this.buginfo.bugaddr,
                        'bugreq':this.buginfo.bugreq,
                    }
                }).then(res => {
                    this.$Message.info('修改成功');
                    this.buginfo.bugaddr = '';
                    this.editor.txt.html('');
                    this.buglist.push(res);
                }).catch(err => {
                    this.$Message.error(err);
                });
            }else{
                this.$Message.error('请选择所属系统和漏洞名称。');
            }
        },
        projectsearchbyname (value){
            this.projectdata = '';
            util.ajax({
                method:'POST',
                action:'projectsearchbyname',
                json:{"keyword":value}
            }).then(res => {
                this.projectdata = res;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        projectselectbyname (pid){
            for (var i in this.projectdata) {
                if (this.projectdata[i].id == pid){
                    this.buginfo.projectid = this.projectdata[i].id;
                    this.buginfo.projectname = this.projectdata[i].name;
                }
            }
        },
        vulsearch (value){
            this.vulnerabledata = [];
            util.ajax({
                method:'POST',
                action:'vulsearch',
                json:{"keyword":value}
            }).then(res => {
                this.vulnerabledata = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        vulselectbyname (vid){
            this.vulinfo = {};
            for (var i in this.vulnerabledata) {
                if (this.vulnerabledata[i].vulid == vid){
                    this.vulinfo.vulid = this.vulnerabledata[i].vulid;
                    this.vulinfo.vulname = this.vulnerabledata[i].vulname;
                    this.vulinfo.vulrank = this.vulnerabledata[i].vulrank;
                    this.vulinfo.vulowasp = this.vulnerabledata[i].vulowasp;
                    this.vulinfo.vulno = this.vulnerabledata[i].vulno;
                }
            }
        },
        buginfoget(){
            util.ajax({
                method:'POST',
                action:'buginfoget',
                json:{'bugid':this.$route.query.id}
            }).then(res => {  
                this.buginfo.projectname = res.projectid;   
                this.buginfo.projectname = res.projectname;    
                this.buginfo.bugid = res.bugid;
                this.buginfo.bugaddr = res.bugaddr;  
                this.vulinfo.vulname = res.vulinfo.vulname;
                this.editor.txt.html(res.bugreq);
            }).catch(err => {
                this.$Message.error(err);
            });
        },
    },
    created(){
        if(this.$route.params.isedit){
            this.buginfoget();
        }
    },
};
</script>

