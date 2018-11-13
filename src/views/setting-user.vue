<template>
    <div>
        <Card>
            <Button type="primary" size="large" @click="usershow(0,true)">
                <Icon type="ios-download-outline"></Icon>
                新增用户
            </Button>
            <Poptip confirm placement="bottom" title="确认删除？"
                @on-ok="userdelete">
                <Button type="error" size="large">
                <Icon type="ios-download-outline"></Icon>
                删除用户
            </Button>
            </Poptip>
            <Input  icon="search" slot="extra" style="width: 300px;" 
                v-model="searchdata"
                @on-click="usersearch"
                @keydown.enter.native = "usersearch()" 
                placeholder="请输入公司名或姓名进行搜索..." />
            </Input>
        </Card>
        <Table stripe border size="small"
            ref="selection" 
            :columns="tablehead" 
            :data="tabledata" >
        </Table>
		<div style="margin: 10px;overflow: hidden">
        <div style="float: left;">共 {{total}} 条</div>
            <div style="float: right;">
                <Page show-elevator :current="1" :total="100" @on-change="usersearch"></Page>
            </div>
        </div>
        <Modal
            v-model="modalment"
            :styles="{top: '30px'}"
            title="新增部门"
            @on-ok="mentedit">
            <Form :label-width="80">
                <FormItem label="名称">
                    <Input type="text" v-model="mentname"></Input>
                </FormItem>
            </Form>
        </Modal> 
		<Modal
            v-model="modalinfo"
            z-index="100"
            :styles="{top: '30px'}"
            title="联系人员"
            @on-ok="useredit">
            <Form :model="userinfo" :label-width="80">
                <FormItem label="用户名">
                    <Input type="text" v-model="userinfo.username"></Input>
                </FormItem>
                <FormItem label="用户等级">
                    <Select v-model="userinfo.group">
                        <Option value="1">普通用户</Option>
                        <Option value="2">项目管理员</Option>
                        <Option value="3">系统管理员</Option>
                    </Select>
                </FormItem>
                <FormItem label="部门">
                <Select v-model="userinfo.department" :label="mentname"
                    filterable remote :remote-method="mentsearch">
                    <Option v-for="item in mentlist" 
                    :value="item.bid" :key="item.name">{{item.name}}</Option>
                <Button long icon="plus" @click="modalinfo=false;modalment=true">新增部门</Button>
                </Select>
                </FormItem>
                <FormItem label="公司">
                    <Input type="text" v-model="userinfo.company"></Input>
                </FormItem>
                <FormItem label="姓名">
                    <Input type="text" v-model="userinfo.realname"></Input>
                </FormItem>
                <FormItem label="电话">
                    <Input type="text" v-model="userinfo.phone"></Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input type="text" v-model="userinfo.email"></Input>
                </FormItem> 
            </Form>
        </Modal>       
    </div>
</template>


<script>
import util from '@/libs/util.js';

export default {
    name: 'user-table',

    data () {
        return {
            current:1,
            total:100,
            modalinfo: false,
            searchdata: '',
            modalment: false,
            mentname:'',
            mentlist: [],
            userlist: [],
            userinfo: {
				uid:'',
                username: '',
                password:'',
                group:'',
                company:'',
                department:'',
                realname:'',
                phone:'',
                email:''
            },
            tabledata: [{
                uid:'',
                username: '',
                password:'',
                group:'',
                company:'',
                department:'',
                realname:'',
                phone:'',
                email:''
            }],
            tablehead: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    title: '姓名',
                    align: 'center',
                    key: 'realname',
                },{
                    title: '公司',
                    key: 'company',
                    sortable: true,
                },{
                    title: '部门',
					align: 'center',
                    key: 'department',
                },{
                    title: '电话',
                    align: 'center',
                    width: 120,
                    key: 'phone',
                },
                {
                    title: '邮箱',
                    align: 'center',
                    key: 'email',
                },{
                    title: '操作',
                    align: 'center',
                    width: 100,
                    key: 'action',
                    render: (h, params) => {
                        return h('Button', {
                                props: {
                                    type: 'primary',
                                },
                                on: {
                                    click: () => {
                                        this.usershow(params.index, false)
                                    }
                                }
                            }, '编辑');
                    }
                }
            ],
            showCurrentTableData: true
        };
    },
    methods: {
        mentedit (index) {
            util.ajax({
                method:'POST',
                action:'mentedit',
                json: {name:this.mentname}
            }).then(res => {
                this.$Message.info('更新成功！');
                this.modalment=false;
                this.modalinfo=true;
                this.userinfo.department = res.bid;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
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
        },
        usershow (index,created) {
            if (created){
                this.userinfo = {};//this.tabledata[index]; 
            }else{
                this.userinfo = this.tabledata[index];   
            }
            this.modalinfo = true;
        },
        userdelete () {
            var selected = this.$refs.selection.getSelection();
            this.userlist = [];
            for(var k in selected){
                this.userlist.push(selected[k].uid);
            }
            util.ajax({
                method:'POST',
                action:'userdelete',
                json:{'selectlist':this.userlist},
            }).then(res => {
                this.usersearch();
                this.$Message.info('删除成功！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        useredit (index) {
            util.ajax({
                method:'POST',
                action:'useredit',
                json:this.userinfo
            }).then(res => {
                this.usersearch();
                this.$Message.info('更新成功！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        usersearch(page){
            util.ajax({
                method:'POST',
                action:'usersearch',
                json:{'keyword':this.searchdata,'page':page},
            }).then(res => {
                this.tabledata = res.ret;
                this.total = res.total;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
    },
    created () {
        this.usersearch();
    }
};
</script>





