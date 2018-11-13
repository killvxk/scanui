<style lang="less">
.ivu-table-expanded-hidden{
    z-index:1 !important;
}
</style>
<template>
    <div style="z-index:1">
        <Card>
            &nbsp;&nbsp;部门
            <Select v-model="search.ment" style="width:100px" 
                clearable filterable remote :remote-method="mentsearch">
                <Option v-for="item in mentlist" :value="item.bid" :key="item.name">{{item.name}}</Option>
            </Select>
            &nbsp;&nbsp;人员
            <Select v-model="search.user" style="width:100px" 
                clearable filterable remote :remote-method="usersearch">
                <Option v-for="item in userlist" :value="item.uid" :key="item.username">{{item.username}}({{item.realname}})</Option>
            </Select>
            &nbsp;&nbsp;服务
            <Input v-model="search.service" style="width:100px"></Input>
            <!--
            <Select v-model="search.service" style="width:100px" 
                clearable filterable remote :remote-method="servicesearch">
                <Option v-for="item in servicelist" :value="item.value" :key="item.value">{{ item.label }}</Option>&nbsp;
            </Select>-->
            &nbsp;&nbsp;端口
            <Input v-model="search.port" style="width:100px"></Input>
            &nbsp;&nbsp;关键字
            <Input v-model="search.keyword" style="width:150px"></Input>
            <Dropdown style="float: right;">
                <Button type="primary" size="large" @click="portsearch(1)">
                <Icon type="ios-download-outline"></Icon>
                搜索
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem>
                        <Button type="primary" size="large" @click="exportData">
                        <Icon type="ios-download-outline"></Icon>
                        导出
                        </Button>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </Card>

        <Table stripe border id="table"
            ref="selection1"
            :columns="hostcol" 
            :data="hostdata"
            >
        </Table>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: left;">共 {{total}} 条</div>
            <div style="float: right;">
                <Page show-elevator :current="current" :total="total" :page-size=30 @on-change="portsearch"></Page>
            </div>
        </div>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'hosts-table',
    components: {
    },
    data () {
        return {
            current:1,
            total:100,
            projectname:localStorage.projectname,
            projectid:localStorage.projectid,
            mentlist:[],
            userlist:[],
            servicelist:[],
            search:{
                ment:'',
                user:'',
                service:'',
                port:null,
                keyword:'',
            },
            hostdata: [],
            hostcol: [{
                    title: '部门',
                    align: 'center',
                    key: 'ment',
                    width: 150,
                    sortable: true,
                },{
                    title: '用户',
                    align: 'center',
                    key: 'user',
                    width: 150,
                    sortable: true,
                },{
                    title: '服务',
                    align: 'center',
                    key: 'service',
                    width: 120,
                    editable: true,
                },{
                    title: '地址',
                    align: 'center',
                    key: 'hostip',
                    width: 140,
                    sortable: true,
                },{
                    title: '端口',
                    align: 'center',
                    key: 'port',
                    width: 80,
                    sortable: true,
                },{
                    title: '版本',
                    align: 'center',
                    key: 'softver',
                    editable: true,
                }
            ],
            showCurrentTableData: true
        };
    },
    methods: {
        mentsearch(keyword){
            util.ajax({
                method:'POST',
                action:'mentsearch',
                json:{'keyword':keyword},
            }).then(res => {
                this.mentlist = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            });
        },usersearch(keyword){
            util.ajax({
                method:'POST',
                action:'usersearch',
                json:{'keyword':keyword},
            }).then(res => {
                this.userlist = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            });
        },servicesearch(keyword){
            util.ajax({
                method:'POST',
                action:'servicesearch',
                json:{'keyword':keyword},
            }).then(res => {
                this.servicelist = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            });
        },portsearch(page) {
            util.ajax({
                method:'POST',
                action:'portsearch',
                json:this.search
            }).then(res => {
                this.hostdata = res.ret;
                this.total = res.total;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        exportData(){
            this.$refs.selection1.exportCsv({
                filename: this.searchdata,
            });
        },
    },
    created () {
        this.portsearch(1);
    }
};
</script>



