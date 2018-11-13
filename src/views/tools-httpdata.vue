<style lang="less">
pre{
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

<template>
    <div>
	   <Card><Button></Button>
            <!--<Card>
            <Button type="primary" size="large" @click="usershow(0,true)">
                <Icon type="ios-download-outline"></Icon>
                新增资产
            </Button>
            <Poptip confirm placement="bottom" title="确认删除？"
                @on-ok="userdelete">
                <Button type="error" size="large">
                <Icon type="ios-download-outline"></Icon>
                删除资产
            </Button>
            </Poptip>
            <Input  icon="search" slot="extra" style="width: 300px;" 
                v-model="searchdata"
                @on-click="usersearch"
                @keydown.enter.native = "usersearch()" 
                placeholder="请输入公司名或姓名进行搜索..." />
            </Input>
        </Card>-->
            <Input icon="search" slot="extra" style="width: 300px;" 
                v-model="searchdata"
                @on-click="httpsearch(1)"
                @keydown.enter.native = "httpsearch(1)" 
                placeholder="请输入关键字搜索..." />
            </Input>
        </Card>
        <Card v-for="item in tabledata">
            <Row>
                <Col :lg="12">
                    <p><h3><Button shape="circle" icon="reply" @click="taskadd(item.host,item.port)"></Button>&nbsp;&nbsp;&nbsp;{{item.host}}:{{item.port}}&nbsp;&nbsp;&nbsp;<a :href="makeurl(item.host,item.port)" target="_blank"><Icon type="forward"/></a></h3></p>
                    <p><font size="2" color="#ff0000">[{{item.state}}]</font>&nbsp;&nbsp;&nbsp;{{item.title}}</p>
                    <p>{{item.domain}}</p>
                    <p><Tag checkable v-for="sc in item.content" :color="rands()">{{sc}}</Tag></p>
                    <p><Icon type="ios-clock-outline"/>{{item.updatedate}}</p>
                </Col>
                <Col :lg="12">
                    <pre>{{jsonparse(item.headers)}}</pre>
                </Col>
            </Row>
        </Card>

        <div style="margin: 10px;overflow: hidden">
		<div style="float: left;">共 {{total}} 条</div>
            <div style="float: right;">
                <Page show-elevator :current="current" :total="total" :page-size=30 @on-change="httpsearch"></Page>
            </div>
        </div>
	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
    data () {
        return {
            searchdata: '',
            current:1,
            total:100,
            tabledata :[{
                host:'',
                port:'',
                domain:'',
                state:'',
                title:'',
                headers:'',
                content:[],
                updatedate:'',
            },],
        };
    },
    methods: {
        httpsearch(page){
           util.ajax({
                method:'POST',
                action:'httpsearch',
                json:{'page':page,'keyword':this.searchdata}
            }).then(res => {
                this.current = res.current;
                this.total = res.total;
                this.tabledata = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            }); 
        },
        jsonparse(s){
            s=s.replace(/{/g,"");
            s=s.replace(/}/g,"");
            s=s.replace(/'/g,"");
            s=s.replace(/, /g,"\r\n");
            return s;
        },
        rands(){
            var items = ['red','blue','yellow','green'];
            return items[Math.floor(Math.random()*items.length)];
        },
        taskadd(host,port){
            this.$router.push({
                name: 'task_list',
                params: {
                    isadd:true,
                    taskinfo:{
                        task_host: this.makeurl(host,port),
                        task_name:["bugscan"],
                    }
                }
            });
        },
        makeurl(h,p){
            if(p.indexOf('443') > -1){
                return 'https://' + h + ':' + p;
            }else{
               return 'http://' + h + ':' + p; 
            }
        }
    },
     created () {
        this.httpsearch(1);
    }
};
</script>

