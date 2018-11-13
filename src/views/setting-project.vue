<template>
    <div>
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
            v-model="modalinfo"
            :styles="{top: '30px'}"
            title="联系人员"
            @on-ok="useredit">
            <Form :model="userinfo" :label-width="80">
                <FormItem label="项目名称">
                    <Input type="text" v-model="userinfo.username"></Input>
                </FormItem>
                <FormItem label="更新时间">
                    <Input type="text" v-model="userinfo.department"></Input>
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





