<template>
    <div>
        <Card>
            <Button type="primary" size="large" @click="usershow(0,true)">
                <Icon type="ios-download-outline"></Icon>
                新增部门
            </Button>
            <Poptip confirm placement="bottom" title="确认删除？"
                @on-ok="userdelete">
                <Button type="error" size="large">
                <Icon type="ios-download-outline"></Icon>
                删除部门
            </Button>
            </Poptip>
            <Input icon="search" slot="extra" style="width: 300px;" 
                v-model="searchdata"
                @on-click="usersearch"
                @keydown.enter.native = "usersearch()" 
                placeholder="请输入部门名或姓名进行搜索..." />
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
            v-model="modalinfo"
            :styles="{top: '30px'}"
            title="新增部门"
            @on-ok="useredit">
            <Form :model="userinfo" :label-width="80">
                <FormItem label="名称">
                    <Input type="text" v-model="userinfo.name"></Input>
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
            selectlist: [],
            userinfo: {
				bid:'',
                name: '',
                time:'',
            },
            tabledata: [{
                bid:'',
                name: '',
                time:'',
            }],
            tablehead: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    title: '部门名称',
                    align: 'center',
                    key: 'name',
                    sortable: true,
                },{
                    title: '创建时间',
                    key: 'time',
                    sortable: true,
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
        
    },
    created () {
        this.usersearch();
    }
};
</script>





