<style lang="less">
.data-source-row{
    height: 200px;
}
.line-chart-con{
    height: 200px;
}
</style>
<template>
    <div>
         <Row>
            <Col :md="6" :lg="6">
                <infor-card
                id-name="scanvul"
                :end-val="rankvalue.紧急"
                iconType="shuffle"
                color="#000000"
                intro-text="紧急漏洞">
                </infor-card>
            </Col><Col :md="6" :lg="6">
                <infor-card
                id-name="scanvul"
                :end-val="rankvalue.高危"
                iconType="shuffle"
                color="#f25e43"
                intro-text="高危漏洞">
                </infor-card>
            </Col><Col :md="6" :lg="6">
                <infor-card
                id-name="scanvul"
                :end-val="rankvalue.中危"
                iconType="shuffle"
                color="#ff9900"
                intro-text="中危漏洞">
                </infor-card>
            </Col><Col :md="6" :lg="6">
                <infor-card
                id-name="scanvul"
                :end-val="rankvalue.低危"
                iconType="shuffle"
                color="#ffff00"
                intro-text="低危漏洞">
                </infor-card>
            </Col>
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
            </Col></Row>
        <Row><Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-pulse-strong"></Icon>
                    各系统漏洞数量月度趋势
                </p>
                <div class="data-source-row">
                    <service-requests :bugvalue="mouthvalue"></service-requests>
                </div>
            </Card>
        </Row><Row><Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-pulse-strong"></Icon>
                    各系统漏洞数量每日趋势
                </p>
                <div class="data-source-row">
                    <service-requests :bugvalue="dayvalue"></service-requests>
                </div>
            </Card>
        </Row><!--
                <Row><Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-pulse-strong"></Icon>
                    各系统漏洞名称对比
                </p>
                <div class="data-source-row">
                    <vul-mouth :bugvalue="mouthnamevalue"></vul-mouth>
                </div>
                </Card>
                </Row><Row><Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-pulse-strong"></Icon>
                    各系统漏洞等级对比
                </p>
                <div class="data-source-row">
                    <vul-mouth :bugvalue="mouthrankvalue"></vul-mouth>
                </div>
                </Card>
                </Row><Row><Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-pulse-strong"></Icon>
                    各系统漏洞OWASP对比
                </p>
                <div class="data-source-row">
                    <vul-mouth :bugvalue="mouthowaspvalue"></vul-mouth>
                </div>
                </Card>
                </Row>-->
    </div>
</template>

<script>
import inforCard from './components/inforCard.vue';
import VulRank from './components/vulrank.vue';
import VulRank1 from './components/vulrank1.vue';
import VulMouth from './components/vulmouth.vue';
import visiteOwasp from './components/visiteOwasp.vue';
import serviceRequests from './components/serviceRequests.vue';
import util from '@/libs/util.js';

export default {
    name: 'home',
    components: {
        inforCard,
        serviceRequests,
        VulRank,
        VulRank1,
        VulMouth,
        visiteOwasp,
    }, 
    data () {
        return {
            rankvalue: {'紧急':0,'高危':0,'中危':0,'低危':0},
            namevalue: {},
            statevalue: {'已修复':1, '漏洞提交':1,'漏洞修复':1,'漏洞复查':1,'已忽略':1},
            mouthvalue: {},
            dayvalue: {},
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        bugdatabymouth(){
            util.ajax({
                method:'POST',
                action:'bugdatabymouth',
                json:{}
            }).then(res => {
                this.mouthvalue = res.mouthvalue;
                this.dayvalue = res.dayvalue;
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
        bugdatabypid(){
            util.ajax({
                method:'POST',
                action:'bugdatabypid',
                json:{}
            }).then(res => {
                this.statevalue = res.statevalue;
                this.namevalue = res.namevalue;
                this.rankvalue = res.rankvalue;
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
    },
    created() {
        this.bugdatabypid();
        this.bugdatabymouth();
    },
};
</script>
