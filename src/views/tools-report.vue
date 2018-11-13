<style lang="less">

</style>

<template>
    <div>
        <Row>
        <Col :lg="17">
            <Table stripe border highlight-row
                height="620"
                :columns="tablehead" 
                :data="bugdata" 
                no-data-text="<p>目前支持的报告格式：awvs-html、nessus-csv、天融信-html、绿盟-html</p><p>如发现有未翻译的漏洞，请自行登录后台进行翻译，再进行转化</p><p>如发现有未识别的报告，请将报告原件邮件发至<a href='mailto:guo_houtan@topsec.com.cn'>guo_houtan@topsec.com.cn</a></p>">
            </Table>
        </Col>
        <Col :lg="7">
            <Card>
                <Upload multiple 
                    action="/upload.php"
                    type="drag" 
                    :format="['html','htm','csv']"
                    :on-format-error="handleFormatError"
                    :show-upload-list="false"
                    :on-success="uploadsuccess">
                    <div>
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>上传报告文件</p>
                    </div>
                </Upload>
            </Card>
            <Table stripe border highlight-row
                size="small"
                height="430"
                :show-header="false"
                :columns="filehead" 
                :data="filedata"
                @on-row-click="bugsearch">
            </Table>
            <Card>
                <p align="center">vers: V0.01</p>
                <p align="center">date: 201808171601</p>
            </Card>
        </Col>
        </Row>
    </div>   
</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util.js';

export default {
    data () {
        return {
            filedata:[],
            bugdata:[],
            filehead:[{
                title: '名称',
                key: 'fname',
                sortable: true
            },{
                align: 'center',
                width: 80,
                key: 'fn',
                render: (h, params) => {
                    return h('Button', {
                        props: {
                            type: 'info',
                            size: 'small'
                        },on: {
                            click: () => {
                                this.downloadreport(params.row.fid,params.row.fname);
                            }
                        }
                    },'下载');
                }, 
            }],
            tablehead: [{
                title: '等级',
                align: 'center',
                width: 80,
                sortable: true,
                key: 'bugrank',
                render: (h, params) => {
                    const row = params.row.bugrank;
                    const color = row === '高危' ? 'red' 
                                : row === '中危' ? 'yellow' 
                                : row === '低危' ? 'blue' 
                                : 'red';
                    return h('Tag', {
                        props: {
                            type: 'border',
                            color: color
                        }
                    },row);
                }, 
            },{
                title: '名称',
                key: 'bugname',

            },{
                title: '地址',
                key: 'bugaddr',
            }],
        }
    },
    methods: {
        uploadsuccess(res, file){
            for(var i=0;i<res.result.length;i++){
                console.log(res.result[i]);
                this.bugimport(res.result[i].fid);
                this.filedata.push(res.result[i]);
            }
        },
        bugimport(fid){
            util.ajax({
                method:'POST',
                action:'bugimport',
                json:{'fid':fid}
            }).then(res => {
                this.$Message.info('后台导入中。。。');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        bugsearch(row,index,event){
            util.ajax({
                method:'POST',
                action:'bugsearch',
                json:{'fid':row.fid}
            }).then(res => {
                this.bugdata = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        downloadreport(fid,fname){
            window.open("./report.php?fid="+fid+'&fname='+fname);
        },
        handleFormatError(file){
            this.$Notice.warning({
                title: '报告类型错误',
                desc: file.name
            });
        }
    }
};
</script>

