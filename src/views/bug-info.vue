<style lang="less">
@import './../styles/common.less';
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
.preview{
    &-main{
        width: 100%;
        height: 100%;
        background: #d7e1ed;
    }
    &-header{
        padding-right: 20px;
        height: 60px;
        background: #4a5161;
        text-align: right;
        ul{
            display: inline-block !important;
        }
    }
    &-placeholderCon{
        height: 200px;
    }
    &-placeholder{
        height: 40px;
        margin-bottom: 10px;
        background: #9fafd4;
        border-radius: 3px;
    }
    &-tags-con{
        padding: 5px 0;
        margin: 10px 0;
    }
    &-tip{
        font-size: 12px;
        color: #c3c3c3;
    }
    &-content-con{
        border-top: 1px solid #edeff1;
        border-bottom: 1px solid #edeff1;
        padding: 12px 0 20px;
        margin-bottom: 20px;
    }
    &-classifition-con{
        padding: 5px 0;
    }
    &-classifition-item{
        margin-right: 8px;
    }
    &-publish-time{
        font-size: 12px;
        color: gray;
        margin-top: 5px;
    }
}
.split-pane-con{
    width: 100%;
    height: 100%;
}
.custom-trigger{
    position: absolute;
    width: 40px;
    height: 40px;
    box-sizing: border-box;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 50%;
    box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, .1) , 2px 2px 10px 2px rgba(0, 0, 0, .2) inset;
    border: 1px solid #c3c3c3;
    cursor: pointer;
}
.introduce-left-con h4{
    margin-bottom: 20px;
}
.introduce-left-con h5{
    margin-bottom: 10px;
    margin-left: 20px;
}
.split-pane-right-con{
    padding: 30px;
}
.split-pane-right-con p{
    font-size: 26px;
    font-weight: 700;
    color: white;
}
</style>

<template>
    <div>
        <Row>
            <Col :lg="20">
                <Card>
                    <H1 slot="title" >
                        [{{bugdata.vulinfo.vulrank}}]{{bugdata.vulinfo.vulname}} 
                    </H1>
                    <H4><p><Icon type="shuffle"></Icon>&nbsp;所属系统： {{bugdata.projectname}}</p></H4>
                    <H4><p><Icon type="shuffle"></Icon>&nbsp;漏洞地址：{{bugdata.bugaddr}}</p></H4>
                    <div class="preview-con">
                        <b class="preview-tip"><Icon type="pricetags"></Icon>&nbsp;漏洞编号：</b><Tag v-for="item in bugdata.vulinfo.vulnumber">{{item}}</Tag>
                    </div>
                    <div >
                        <b class="preview-tip"><Icon type="ios-pricetags-outline"></Icon>&nbsp;漏洞标签：</b><Tag v-for="item in bugdata.bugtag">{{item}}</Tag>
                    </div>
                    <p class="preview-publish-time"><Icon type="android-alarm-clock"></Icon>&nbsp;发布时间：{{ formatdate(bugdata.createdate) }}</p>
                    <p class="preview-publish-time"><Icon type="shuffle"></Icon>&nbsp;对应关系：{{bugdata.vulinfo.vulowasp}}</p>
                    <div class="preview-content-con">
                        <H3>漏洞描述：</H3><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{bugdata.vulinfo.vuldesc}}</div>
                        <H3>修复建议：</H3><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{bugdata.vulinfo.vulplan}}</div> 
                        <H3>漏洞详情：</H3>
                        <div class="word-wrap: break-word;white-space : normal">
                            <pre style="width:100%; overflow:hidden" v-html="bugdata.bugreq"></pre></div>
                        <hr/>
                        <div><pre style="width:100%; overflow:hidden">{{bugdata.bugres}}</pre></div>
                    </div>
                    <div class="preview-classifition-con">
                        <Row class="margin-left-10">
                            <Col :lg="16" class="margin-left-10">    
                                <Input 
                                    v-model="flownote" 
                                    type="textarea" 
                                    :disabled="hasSubmit" 
                                    placeholder="请输入评论" />
                            </Col>
                            <Col :lg="6" class="margin-left-10"> 
                                <Button type="success" size="large" :disabled="hasSubmit"  
                                        @click="stepsave">
                                    <Icon type="ios-download-outline"></Icon>
                                    发送
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                        </Row>
                    </div>
                </Card>
            </Col>
            <Col :lg="4">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        {{bugdata.bugstate}}
                    </p>
                    <Timeline>
                        <TimelineItem>
                            <p class="time">{{ formatdate(bugdata.createdate) }}</p>
                            <div class="content">{{ bugdata.createuser }} {{ bugdata.bugstate }}</div>
                        </TimelineItem>
                        <TimelineItem v-for="item in stepdata" >
                            <p class="time">{{ formatdate(item.updatedate) }}</p>
                            <div class="content">{{ item.flowname }} {{ item.flownote }}</div>
                        </TimelineItem>
                    </Timeline>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import splitPane from './components/splitpane.vue';
import util from '@/libs/util.js';
import Cookies from 'js-cookie';
export default {
    name: 'bug-workflow',
    components: {
        splitPane
    },
    data () {
        return {
            flownote:'',
            hasSubmit: false,
            bugdata:{
                projectid:'',
                projectname:'',
                bugid:'',
                bugaddr:'',
                bugtag:[],
                bugstate:'',
                bugreq:'',
                bugres:'',
                createdate:'',
                vulinfo:{
                    vulid:'',
                    bugrank:'',
                    bugname:'',
                    bugowasp:'',
                    bugnumber:[],
                    bugdesc:'',
                    bugplan:'',
                }
            },
            stepdata: [{
                flowid: '',
                flowname: '',
                flownote: '',
                updatedate:'',
            }],
            
        };
    },
    methods: {
        buginfoget(){
            util.ajax({
                method:'POST',
                action:'buginfoget',
                json:{'bugid':this.$route.query.id}
            }).then(res => {
                this.bugdata = res;           
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        stepinfoget(){
            util.ajax({
                method:'POST',
                action:'stepinfoget',
                json:{'bugid':this.$route.query.id}
            }).then(res => {
               this.stepdata = res;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        stepsave () {
            util.ajax({
                method:'POST',
                action:'stepsave',
                json:{
                    'bugid':this.$route.query.id,
                    'note':this.flownote
                }
            }).then(res => {
                this.stepdata.push(res);
                this.$Message.info('提交成功');
            }).catch(err => {
                this.$Message.error(err);
            });
            this.hasSubmit = true;
        }, 
        bugfinish () {
            this.stepsave();
            util.ajax({
                method:'POST',
                action:'bugfinish',
                json:{'selectlist':[this.$route.query.id]}
            }).then(res => {
                this.$Message.info('确认修复！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        bugfalse () {
            this.stepsave();
            util.ajax({
                method:'POST',
                action:'bugfalse',
                json:{'selectlist':[this.$route.query.id]}
            }).then(res => {
                this.$Message.info('确认忽略！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        formatdate(time) {
            return time.substring(0,19);
        }, 
    },
    created () {
        this.buginfoget()
        this.stepinfoget()
    },
};
</script>
