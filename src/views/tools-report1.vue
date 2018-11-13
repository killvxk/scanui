<template>
    <div>
        <Card>
            <Button></Button>
            <Input icon="search" slot="extra" style="width: 300px;" 
                v-model="searchdata" 
                @on-click = "vulsearch(1)" 
                @keydown.enter.native = "vulsearch(1)" 
                placeholder="请输入漏洞名或漏洞编号进行搜索..." />
        </Card>
        <Table stripe border size="small"
            ref="selection" 
            :columns="tablehead" 
            :data="tabledata">
        </Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page show-elevator :current="current" :total="total" :page-size=100 @on-change="vulsearch"></Page>
            </div>
        </div>
        <Modal
            v-model="modalinfo"
            :title="rowinfo.vulname"
            :styles="{top: '30px'}"
            okText= "保存"
            @on-ok="vuledit">
            <Form :model="rowinfo" :label-width="80">
                <FormItem label="漏洞名称">
                    <Input type="text" v-model="rowinfo.vulreal"></Input>
                </FormItem>
                <FormItem label="漏洞等级">
                     <Select v-model="rowinfo.vulrank">
                        <Option value="紧急">紧急</Option>
                        <Option value="高危">高危</Option>
                        <Option value="中危">中危</Option>
                        <Option value="低危">低危</Option>
                    </Select>
                </FormItem>
                <FormItem label="OWASP">
                    <Select v-model="rowinfo.vulowasp" filterable>
                        <Option value="A1:2017-注入">A1:2017-注入</Option>
                        <Option value="A2:2017-失效的身份认证和会话管理">A2:2017-失效的身份认证和会话管理</Option>
                        <Option value="A3:2017-敏感信息泄露">A3:2017-敏感信息泄露</Option>
                        <Option value="A4:2017-XML外部实体(XXE)">A4:2017-XML外部实体(XXE)</Option>
                        <Option value="A5:2017-失效的访问控制">A5:2017-失效的访问控制</Option>
                        <Option value="A6:2017-安全配置错误">A6:2017-安全配置错误</Option>
                        <Option value="A7:2017-跨站脚本(XSS)">A7:2017-跨站脚本(XSS)</Option>
                        <Option value="A8:2017-不安全的反序列化">A8:2017-不安全的反序列化</Option>
                        <Option value="A9:2017-使用含有已知漏洞的组件">A9:2017-使用含有已知漏洞的组件</Option>
                        <Option value="A10:2017-不足的日志记录和监控">A10:2017-不足的日志记录和监控</Option>
                    </Select>
                </FormItem>
                <FormItem label="漏洞编号">
                    <Input type="text" v-model="rowinfo.vulno" placeholder="以|分隔"></Input>
                </FormItem>
                <FormItem label="漏洞详情">
                    <Input type="textarea" :rows="4" v-model="rowinfo.vuldesc"></Input>
                </FormItem> 
                <FormItem label="修复建议">
                    <Input type="textarea" :rows="4" v-model="rowinfo.vulplan"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';

export default {
    name: 'vul-table',
    data () {
        return {
            modalinfo: false,
            current:1,
            total:100,
            searchdata:'',
            selectlist:[],
            rowinfo: {
                vulid: '',
                vulname:'',
                vulreal:'',
                vulplan:'',
                vulrank:'',
                vulowasp:'',
                vulno:'',
                vuldesc:'',
            },
            tabledata: [{
                vulid: '',
                vulname:'',
                vulplan:'',
                vulrank:'',
                vulowasp:'',
                vulno:'',
                vuldesc:'',
            }],
            tablehead: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                },
                {
                    title: '等级',
                    align: 'center',
                    key: 'vulrank',
                    width: 80,
                    sortable: true,
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.vulrank === '高危' ? 'red' 
                                    : row.vulrank === '中危' ? 'yellow' 
                                    : row.vulrank === '低危' ? 'blue' 
                                    : 'red';
                        return h('Tag', {
                            props: {
                                type: 'border',
                                color: color
                             }
                        },row.vulrank);
                     },
                },
                {
                    title: '漏洞索引',
                    key: 'vulname',
                    sortable: true,
                },
                {
                    title: '漏洞名称',
                    align: 'left',
                    key: 'vulreal',
                    sortable: true,
                },
                {
                    title: '漏洞编号',
                    align: 'center',
                    key: 'vulno',
                    sortable: true,
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 80,
                    key: 'action',
                    render: (h, params) => {
                        return h('Button', {
                                props: {
                                    type: 'primary',
                                },
                                on: {
                                    click: () => {
                                        this.vulshow(params.index, false)
                                    }
                                }
                            }, '编辑');
                    }
                }
            ],
            showCurrentTableData: false
        };
    },
    methods: {
        vulsearch(page){
            util.ajax({
                method:'POST',
                action:'vulsearch',
                json:{page:page,'keyword':this.searchdata}
            }).then(res => {
                this.tabledata = res.ret;
                this.total = res.total;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        vulshow (index,created) {
            if (created){
                this.rowinfo = {};//this.tabledata[index]; 
            }else{
                this.rowinfo = this.tabledata[index];   
            }
            this.modalinfo = true;
        },
        vuldelete () {
            var selected = this.$refs.selection.getSelection();
            this.selectlist = [];
            for(var k in selected){
                this.selectlist.push(selected[k].vulid);
                for(var d in this.tabledata){
                    if(selected[k].vulid == this.tabledata[d].vulid){
                        this.tabledata.splice(d,1);
                    }
                }
            }
            util.ajax({
                method:'POST',
                action:'vuldelete',
                json:{'selectlist':this.selectlist}
            }).then(res => {
                this.$Message.info('删除成功！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        vuledit () {
            util.ajax({
                method:'POST',
                action:'vuledit',
                json:this.rowinfo
            }).then(res => {
                if(res.created){
                    this.tabledata.unshift(res);
                }
                this.$Message.info(res.vulname + ' 更新成功！');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
    },
    created () {
        this.vulsearch(1);
    }
};
</script>
