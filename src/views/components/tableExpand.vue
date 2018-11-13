<style scoped>
</style>
<template>
    <div style="position:relative;z-index:10">
        <can-edit-table stripe border id="tableex" 
            ref="selectionex" 
            :columns-list="columns" 
            v-model="tabledata"
            @on-delete="portfinish"
            @on-change="portedit"
        >
        </can-edit-table>
        <!--
        <table>
            <thead><tr><th v-for="head in columns">{{head.title}}</th></tr></thead>
            <tbody>
                <tr v-for="table in tabledata">
                    <td>{{table.port}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <Button type="primary" siza="small">编辑</Button>
                        <Button type="error" siza="small">删除</Button>
                    </td>
                </tr>
            </tbody>
        </table>-->
    </div>
</template>
<script>
import util from '@/libs/util.js';
import canEditTable from './canEditTable';
export default {
	name: 'tableExpand',
    components: {
        canEditTable
    },
    props: {
		hostid: String,
        hostip: String,
    },
    data(){
        return {
            tabledata:[],
            columns: [
                {
                    title: '服务端口',
                    align: 'center',
                    key: 'port',
                    width: 110,
                    sortable: true,
                    editable: true,
                },{
                    title: '服务类型',
                    align: 'center',
                    key: 'service',
                    width: 110,
                    editable: true,
                },{
                    title: '软件版本',
                    align: 'center',
                    key: 'softver',
                    editable: true,
                },{
                    title: '备注',
                    align: 'center',
                    key: 'note',
                    editable: true,
                    render: (h, params) => {
                        return h('pre', {},params.row.note);
                    }, 
                },{
                    title: '操作',
                    width: 146,
                    key: 'handle',
                    handle: ['edit','delete']
                },
            ],
        }
    },
    methods:{
        portlistget(){
            util.ajax({
                method:'POST',
                action:'portlistget',
                json:{'hostid':this.hostid}
            }).then(res => {
                this.tabledata = res;
                this.porttemp = res;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        portedit(val,index){
            var postdata = this.tabledata[index];
            postdata['hostid']=this.hostid
            util.ajax({
                method:'POST',
                action:'portedit',
                json:postdata
            }).then(res => {
                this.$Message.info('更新成功！');
                this.porttemp = val;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        portfinish(val,index){
            util.ajax({
                method:'POST',
                action:'portfinish',
                json:{'hostid':this.hostid,port:this.porttemp[index].port}
            }).then(res => {
                this.$Message.info('删除成功！');
                this.porttemp = val;
            }).catch(err => {
                this.$Message.error(err);
            });
        }
    },
    created(){
        this.portlistget();
    }

};
</script>