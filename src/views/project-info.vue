
<style lang="less">
.iview-admin-draggable-list{
    height: 100%;
}
.iview-admin-draggable-list li{
    padding: 1px;
    border: 1px solid #e7ebee;
    border-radius: 1px;
    margin-bottom: 1px;
    cursor: pointer;
    position: relative;
    transition: all .2s;
}
.iview-admin-draggable-list li:hover{
    color: #87b4ee;
    border-color: #87b4ee;
    transition: all .2s;
}
</style>
<template>
    <div>
    <Tabs>
        <!--<TabPane label="漏洞详情"></TabPane>-->
        <TabPane label="项目报表">
            <!--<Card>
                <Button type="warning" size="large" id="convert">
                    <Icon type="ios-download-outline"></Icon>
                    生成报告
                </Button>
            </Card>-->
            <div id="report">
             <Row>
                <Col :md="6" :lg="6"><infor-card
                    id-name="scanvul"
                    :end-val="rankvalue.紧急"
                    iconType="shuffle"
                    color="#000000"
                    intro-text="紧急漏洞">
                </infor-card></Col>
                <Col :md="6" :lg="6"><infor-card
                    id-name="scanvul"
                    :end-val="rankvalue.高危"
                    iconType="shuffle"
                    color="#f25e43"
                    intro-text="高危漏洞">
                </infor-card></Col>
                <Col :md="6" :lg="6"><infor-card
                    id-name="scanvul"
                    :end-val="rankvalue.中危"
                    iconType="shuffle"
                    color="#ff9900"
                    intro-text="中危漏洞">
                </infor-card></Col>
                <Col :md="6" :lg="6"><infor-card
                    id-name="scanvul"
                    :end-val="rankvalue.低危"
                    iconType="shuffle"
                    color="#ffff00"
                    intro-text="低危漏洞">
                </infor-card></Col>
            </Row>
            <Row><Col :md="24" :lg="8">
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="ios-pulse-strong"></Icon>
                            漏洞等级占比
                        </p>
                        <div class="data-source-row">
                            <vul-rank :bugvalue="rankvalue">
                            </vul-rank>
                        </div>
                    </Card>
                </Col><Col :md="24" :lg="8"> 
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="ios-pulse-strong"></Icon>
                            漏洞名称占比
                        </p>
                        <div class="data-source-row">
                            <vul-rank1 :bugvalue="namevalue">
                            </vul-rank1>
                        </div>
                    </Card>
                    </Col><Col :md="24" :lg="8">
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="ios-pulse-strong"></Icon>
                            处理状态占比
                        </p>
                        <div class="data-source-row">
                            <vul-rank :bugvalue="statevalue">
                            </vul-rank>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row><Card class="margin-top-10">
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        系统漏洞数量月趋势
                    </p>
                    <div class="data-source-row">
                        <service-requests :bugvalue="mouthvalue"></service-requests>
                    </div>
                </Card>
            </Row><Row>
                <Card class="margin-top-10">
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        系统漏洞数量日趋势
                    </p>
                    <div class="data-source-row">
                        <service-requests :bugvalue="dayvalue"></service-requests>
                    </div>
                </Card>
            </Row>
        </div>
        </TabPane>
        <TabPane label="项目设置">
            <Form :label-width="100" >
                <FormItem label="项目名称">
                    <Input v-model="pname" placeholder=""></Input>
                </FormItem>
                <FormItem label="项目描述">
                    <Input type="textarea" v-model="pdesc" placeholder=""></Input>
                </FormItem>
                <FormItem label="项目设置">
                    <Row><Col :lg="6">
                    <Card>
                        <Modal
                            v-model="modalmember"
                            title="添加项目成员">
                            <div style="height:200px;">
                                <ul class="iview-admin-draggable-list">
                                    <CheckboxGroup v-model="pmembers">
                                        <li v-for="item in systemuser">
                                        <Checkbox :label="item">{{item.username}}({{item.realname}})</Checkbox>
                                        </li>
                                    </CheckboxGroup>
                                </ul>
                            </div>
                        </Modal>
                        <p slot="title">项目成员</p>
                        <div style="height:200px;">
                            <ul class="iview-admin-draggable-list">
                                <li v-for="item in pmembers">{{item.username}}({{item.realname}})<Button shape="circle" icon="close" style="float:right" @click="memberpop(item)"/></li>
                            </ul>
                        </div>
                        <Input type="text" icon="plus" @on-click="memberadd" @on-focus="memberadd"></Input>
                    </Card>
                    </Col><Col :lg="1">&nbsp;
                    </Col><Col :lg="6"><Card>
                        <p slot="title">用户名</p>
                        <div style="height:200px;">
                            <ul class="iview-admin-draggable-list">
                                <li v-for="item in pusers">{{item}}<Button shape="circle" icon="close" style="float:right" @click="userpop(item)"/></li>
                            </ul>
                        </div>
                        <Input v-model="user" type="text"  icon="plus" @on-click="useradd"></Input>
                    </Card>
                    </Col><Col :lg="1">&nbsp;
                    </Col><Col :lg="6">
                    <Card dis-hover>
                        <p slot="title">用户密码</p>
                        <div style="height:200px;">
                            <ul class="iview-admin-draggable-list">
                                <li v-for="item in ppwds">{{item}}<Button shape="circle" icon="close" style="float:right" @click="pwdpop(item)"/></li>
                            </ul>
                            </ul>
                        </div>
                        <Input v-model="pwd" type="text"  icon="plus" @on-click="pwdadd"></Input>
                    </Card>
                    </Col></Row>
                </FormItem>
                <FormItem>
                    <Button type="primary" size="large" @click="psettingedit(true)">
                        <Icon type="ios-download-outline"></Icon>
                        保存设置
                    </Button>
                </FormItem>
            </Form>
        </TabPane>
    </Tabs>
    </div>
</template>

<script>
import inforCard from './components/inforCard.vue';
import VulRank from './components/vulrank.vue';
import VulRank1 from './components/vulrank1.vue';
import visiteOwasp from './components/visiteOwasp.vue';
import serviceRequests from './components/serviceRequests.vue';
import util from '@/libs/util.js';

export default {
    name: 'project-info',
    components: {
        inforCard,
        serviceRequests,
        VulRank,
        VulRank1,
        visiteOwasp,
    }, 
    data () {
        return {
            member:'',
            user:'',
            pwd:'',
            pname:'',
            pdesc:'',
            pmembers:[],
            pusers:[],
            ppwds:[],
            modalmember:false,
            systemuser:[],
            rankvalue: {'紧急':0,'高危':0,'中危':0,'低危':0},
            namevalue: {'A':2,'B':7,'C':6,'D':33},
            statevalue: {'已修复':1, '漏洞提交':1,'漏洞修复':1,'漏洞复查':1,'已忽略':1},
            mouthvalue: {},
            dayvalue: {},
        };
    },
    mounted() {
        const s1 = document.createElement('script');
        s1.type = 'text/javascript';
        s1.src = 'http://evidenceprime.github.io/html-docx-js/test/vendor/FileSaver.js';
        document.body.appendChild(s1);
        const s2 = document.createElement('script');
        s2.type = 'text/javascript';
        s2.src = 'http://evidenceprime.github.io/html-docx-js/build/html-docx.js';
        document.body.appendChild(s2);

        document.getElementById('convert').addEventListener('click', function(e) {
              e.preventDefault();
              var contentDocument = document.getElementById("report");
              var regularImages = contentDocument.querySelectorAll("img");
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              [].forEach.call(regularImages, function (imgElement) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = imgElement.width;
                    canvas.height = imgElement.height;
                    ctx.drawImage(imgElement, 0, 0);
                    var dataURL = canvas.toDataURL();
                    imgElement.setAttribute('src', dataURL);
              })
              canvas.remove();
              var canvas = contentDocument.querySelectorAll("canvas");
              [].forEach.call(canvas, function (cs) {
                    var image = new Image();
                    image.src = cs.toDataURL("image/png");
                    image.width = 600;
                    image.height = image.width/(cs.width/cs.height);
                    cs.appendChild(image);
                     
              })
              var content = '<!DOCTYPE html>' + contentDocument.outerHTML;
              var converted = htmlDocx.asBlob(content, {orientation: true});
              saveAs(converted, 'report.docx');
        });
    },
    methods: {
        bugdatabymouth(){
            util.ajax({
                method:'POST',
                action:'bugdatabymouth',
                json:{'projectid':this.$route.query.projectid}
            }).then(res => {
                this.mouthvalue = res.mouthvalue;
                this.dayvalue = res.dayvalue;;
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
        bugdatabypid(){
            util.ajax({
                method:'POST',
                action:'bugdatabypid',
                json:{'projectid':this.$route.query.projectid}
            }).then(res => {
                this.statevalue = res.statevalue;
                this.namevalue = res.namevalue;
                this.rankvalue = res.rankvalue;
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
        psettingedit(editd){
            util.ajax({
                method:'POST',
                action:'psettingedit',
                json:{
                    'editd':editd,
                    'pid':this.$route.query.projectid,
                    'pname':this.pname,
                    'pdesc':this.pdesc,
                    'pusers':this.pusers,
                    'ppwds':this.ppwds,
                    'pmembers':this.pmembers,
                }
            }).then(res => {
                this.pname = res.pname;
                this.pdesc = res.pdesc;
                this.pusers = res.pusers;
                this.ppwds = res.ppwds;
                this.pmembers = res.pmembers;
                if(editd){this.$Message.info('修改成功！');}
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        memberadd(){
            this.modalmember=true;
            this.userget(1);
        },memberpop(value){
            this.pmembers.shift(value);
        },
        useradd(){
            this.pusers.unshift(this.user);
        },userpop(value){
            this.pusers.shift(value);
        },
        pwdadd(){
            this.ppwds.unshift(this.pwd);
        },pwdpop(value){
            this.ppwds.shift(value);
        },
        userget (page) {
            util.ajax({
                method:'POST',
                action:'usersearch',
                json:{'page':page}
            }).then(res => {
               this.systemuser = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            });
        }, 
    },
    created() {
        this.psettingedit(false);
        this.bugdatabypid();
        this.bugdatabymouth();
    }
};
</script>
