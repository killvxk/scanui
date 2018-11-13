<template>
    <div>
        <Card>
            <Button size="large">
            </Button>
            <Input  icon="search" slot="extra" style="width: 300px;" 
                v-model="searchdata"
                @on-click="pluginsearch(1)"
                @keydown.enter.native = "pluginsearch(1)" 
                placeholder="请输入插件名称或描述进行搜索..." />
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
                <Page show-elevator :current="current" :total="total" :page-size=30 @on-change="pluginsearch"></Page>
            </div>
        </div>      
    </div>
</template>

<script>
import util from '@/libs/util.js';

export default {
    name: 'plugin-table',

    data () {
        return {
            searchdata: '',
            current:1,
            total:100,
            selectlist: [],
            tabledata: [/*{
                plugname: 'FtpNoAuth',
                plugdesc: 'ftp 未授权访问',
                plugtype: 'host',
                plugfile: 'host.py',
                updatedate:'12345678a',
                _checked: true,
            }*/],
            tablehead: [
                {
                    title: '插件名称',
                    align: 'left',
                    key: 'plugname',
                },{
                    title: '插件描述',
                    key: 'plugdesc',
                    sortable: true,
                },{
                    title: '插件类型',
					align: 'left',
                    key: 'plugtype',
                },/*{
                    title: '更新时间',
                    align: 'center',
                    width: 180,
                    key: 'updatedate',
                    render: (h, params) => {
                        return h('span', [
                            h('Icon', {
                                props: {
                                    type: 'android-time',
                                },
                            }),
                            h('span', util.formatdate(params.row.updatedate))
                        ]);
                    }
                },*/{
                    title: '操作',
                    align: 'center',
                    width: 100,
                    key: 'action',
                    render: (h, params) => {
                        return h('Button', {
                                props: {
                                    icon:'reply',
                                    shape:"circle"
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'task_list',
                                            params: {
                                                isadd:true,
                                                taskinfo:{
                                                    task_host: localStorage.projectid ,
                                                    task_args: '-plug='+params.row.plugname ,
                                                    task_name:["pluginscan"],
                                                }
                                            }
                                        });
                                    }
                                }
                            }, '扫描');
                    }
                }
            ],
            showCurrentTableData: true
        };
    },
    methods: {
        pluginedit () {
            var selected = this.$refs.selection.getSelection();
            this.selectlist = [];
            for(var i in this.tabledata){
                if(this.array_contain(selected,this.tabledata[i])){
                    this.selectlist.push({
                        plugname:this.tabledata[i].plugname,
                        plugstat:true
                    });
                }else{
                    this.selectlist.push({
                        plugname:this.tabledata[i].plugname,
                        plugstat:false
                    });
                }
            }
            util.ajax({
                method:'POST',
                action:'pluginedit',
                json:{'selectlist':this.selectlist}
            }).then(res => {
                this.$Message.info('更新成功！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        pluginsearch(page){
            util.ajax({
                method:'POST',
                action:'pluginsearch',
                json:{page:page,'keyword':this.searchdata},
            }).then(res => {
                this.tabledata = res.ret;
                this.total = res.total;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        array_contain(array, obj){
            for (var i in array){
                if (array[i].plugname == obj.plugname)
                    return true;
            }
            return false;
        },
    },
    created () {
        if(localStorage.projectid != 'null' && localStorage.projectid != undefined){
            this.pluginsearch(1);
        }else{
            this.$Message.error('请先选择当前系统'); 
            this.$router.push({
                name: 'project_index'
            });
        };
    }
};
</script>





