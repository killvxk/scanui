<style lang="less">
.message{
    &-main-con{
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
    }
    &-mainlist-con{
        position: absolute;
        left: 0;
        top: 10px;
        width: 300px;
        bottom: 0;
        padding: 10px 0;
        div{
            padding: 10px;
            margin: 0 20px;
            border-bottom: 1px dashed #d2d3d2;
            &:last-child{
                border: none;
            }
            .message-count-badge-outer{
                float: right;
            }
            .message-count-badge{
                background: #d2d3d2;
            }
            &:first-child .message-count-badge{
                background: #ed3f14;
            }
            .mes-type-btn-text{
                margin-left: 10px;
            }
        }
    }
    &-content-con{
        position: absolute;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 300px;
        background: white;
        border-radius: 3px;
        box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, .1);
        overflow: auto;
        .message-title-list-con{
            width: 100%;
            height: 100%;
        }
        .message-content-top-bar{
            height: 40px;
            width: 100%;
            background: white;
            position: absolute;
            left: 0;
            top: 0;
            border-bottom: 1px solid #dededb;
            .mes-back-btn-con{
                position: absolute;
                width: 70px;
                height: 30px;
                left: 0;
                top: 5px;
            }
            .mes-title{
                position: absolute;
                top: 0;
                right: 70px;
                bottom: 0;
                left: 70px;
                line-height: 40px;
                padding: 0 30px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
            }
        }
        .mes-time-con{
            position: absolute;
            width: 100%;
            top: 40px;
            left: 0;
            padding: 20px 0;
            text-align: center;
            font-size: 14px;
            color: #b7b7b5;
        }
        .message-content-body{
            position: absolute;
            top: 90px;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            .message-content{
                padding: 10px 20px;
            }
        }
    }
}
.back-message-list-enter, .back-message-list-leave-to{
    opacity: 0;
}
.back-message-list-enter-active, .back-message-list-leave-active{
    transition: all .5s;
}
.back-message-list-enter-to, .back-message-list-leave{
    opacity: 1;
}
.view-message-enter, .view-message-leave-to{
    opacity: 0;
}
.view-message-enter-active, .view-message-leave-active{
    transition: all .5s;
}
.view-message-enter-to, .view-message-leave{
    opacity: 1;
}
.mes-current-type-btn-enter, .mes-current-type-btn-leave-to{
    opacity: 0;
    width: 0;
}
.mes-current-type-btn-enter-active, .mes-current-type-btn-leave-active{
    transition: all .3s;
}
.mes-current-type-btn-enter-to, .mes-current-type-btn-leave{
    opacity: 1;
    width: 12px;
}
</style>

<template>
    <div class="message-main-con">
        <div class="message-mainlist-con">
            <div>
                <Button @click="newmsg=true;" size="large" long type="success">新建消息</Button>
            </div>
            <div>
                <Button @click="setCurrentMesType('unread')" size="large" long type="text"><transition name="mes-current-type-btn"><Icon v-show="currentMessageType === 'unread'" type="checkmark"></Icon></transition><span class="mes-type-btn-text">未读消息</span><Badge class="message-count-badge-outer" class-name="message-count-badge" :count="unreadCount"></Badge></Button>
            </div>
            <div>
                <Button @click="setCurrentMesType('hasread')" size="large" long type="text"><transition name="mes-current-type-btn"><Icon v-show="currentMessageType === 'hasread'" type="checkmark"></Icon></transition><span class="mes-type-btn-text">已读消息</span><Badge class="message-count-badge-outer" class-name="message-count-badge" :count="hasreadCount"></Badge></Button>
            </div>
            <div>
                <Button @click="setCurrentMesType('recyclebin')" size="large" long type="text"><transition name="mes-current-type-btn"><Icon v-show="currentMessageType === 'recyclebin'" type="checkmark"></Icon></transition><span class="mes-type-btn-text">回收站</span><Badge class="message-count-badge-outer" class-name="message-count-badge" :count="recyclebinCount"></Badge></Button>
            </div>
        </div>
        <div class="message-content-con">
            <transition name="view-message">
                <div v-if="showMesTitleList" class="message-title-list-con">
                    <Table ref="messageList" :columns="mesTitleColumns" :data="currentMesList" :no-data-text="noDataText"></Table>
                </div>
            </transition>
            <transition name="back-message-list">
                <div v-if="!showMesTitleList" class="message-view-content-con">
                    <div class="message-content-top-bar">
                        <span class="mes-back-btn-con"><Button type="text" @click="backMesTitleList"><Icon type="chevron-left"></Icon>&nbsp;&nbsp;返回</Button></span>
                        <h3 class="mes-title">{{ mes.title }}</h3>
                    </div>
                    <p class="mes-time-con">@{{mes.sendid}}&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="android-time"></Icon>&nbsp;&nbsp;{{ mes.senddate }}</p>
                    <div class="message-content-body">
                        <p class="message-content">{{ mes.content }}</p>
                    </div>
                </div>
            </transition>
        </div>
        <Modal 
            v-model="newmsg" 
            title="群发消息"
            okText= "发射"
            @on-ok="sendmessage">
            <Form :label-width="80">
                <FormItem label="消息标题">
                    <Input v-model="msgtitle"></Input>
                </FormItem>
                <FormItem label="消息标题">
                    <Input v-model="msgcontent" :rows="4" type="textarea"></Input>
                </FormItem>
                <FormItem label="接收人">
                    <Select multiple filterable remote
                    v-model="msguser" placeholder="请输入关键字搜索"
                    :remote-method="usersearch">
                    <Option v-for="item in systemuser" :value="item.uid" :key="item.uid">{{item.username}}({{item.realname}})</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';

export default {
    name: 'message',
    data () {
        const markAsreadBtn = (h, params) => {
            return h('Button', {
                props: {
                    size: 'small'
                },
                on: {
                    click: () => {
                        this.hasreadMesList.unshift(this.currentMesList.splice(params.index, 1)[0]);
                        util.ajax({
                            method:'POST',
                            action:'setmessagestat',
                            json:{'msgid':params.row.msgid,msgstat:'1'}
                        }).then(res => {
                           
                        }).catch(err => {
                            this.$Message.error(err);
                        });
                    }
                }
            }, '标为已读');
        };
        const deleteMesBtn = (h, params) => {
            return h('Button', {
                props: {
                    size: 'small',
                    type: 'error'
                },
                on: {
                    click: () => {
                        this.recyclebinList.unshift(this.hasreadMesList.splice(params.index, 1)[0]);
                        util.ajax({
                            method:'POST',
                            action:'setmessagestat',
                            json:{'msgid':params.row.msgid,msgstat:'-1'}
                        }).then(res => {
                           
                        }).catch(err => {
                            this.$Message.error(err);
                        });
                    }
                }
            }, '删除');
        };
        const restoreBtn = (h, params) => {
            return h('Button', {
                props: {
                    size: 'small'
                },
                on: {
                    click: () => {
                        this.hasreadMesList.unshift(this.recyclebinList.splice(params.index, 1)[0]);
                        util.ajax({
                            method:'POST',
                            action:'setmessagestat',
                            json:{'msgid':params.row.msgid,msgstat:'1'}
                        }).then(res => {
                           
                        }).catch(err => {
                            this.$Message.error(err);
                        });
                    }
                }
            }, '还原');
        };
        return {
            currentMesList: [],
            unreadMesList: [],
            hasreadMesList: [],
            recyclebinList: [],
            currentMessageType: 'unread',
            showMesTitleList: true,
            unreadCount: 0,
            hasreadCount: 0,
            recyclebinCount: 0,
            noDataText: '暂无未读消息',
            newmsg:false,
            msgtitle:'',
            msgcontent:'',
            systemuser:[],
            msguser:[],
            mes: {
                msgid:'',
                title: '',
                content: '',
                sendid:'',
                senddate: '',
                msgstat:'',
            },
            mesTitleColumns: [
                // {
                //     type: 'selection',
                //     width: 50,
                //     align: 'center'
                // },
                {
                    title: ' ',
                    key: 'title',
                    align: 'left',
                    ellipsis: true,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.showMesTitleList = false;
                                    this.getmsgcontent(params.row.msgid);
                                }
                            }
                        }, "[ " + params.row.sendid + " ]  " + params.row.title);
                    }
                },
                {
                    title: ' ',
                    key: 'time',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('span', [
                            h('Icon', {
                                props: {
                                    type: 'android-time',
                                    size: 12
                                },
                                style: {
                                    margin: '0 5px'
                                }
                            }),
                            h('span', {
                                props: {
                                    type: 'android-time',
                                    size: 12
                                }
                            }, util.formatDate(params.row.senddate))
                        ]);
                    }
                },
                {
                    title: ' ',
                    key: 'asread',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        if (this.currentMessageType === 'unread') {
                            return h('div', [
                                markAsreadBtn(h, params)
                            ]);
                        } else if (this.currentMessageType === 'hasread') {
                            return h('div', [
                                deleteMesBtn(h, params)
                            ]);
                        } else if (this.currentMessageType === 'recyclebin') {
                            return h('div', [
                                restoreBtn(h, params)
                            ]);
                        }
                    }
                }
            ]
        };
    },
    methods: {
        backMesTitleList () {
            this.showMesTitleList = true;
        },
        setCurrentMesType (type) {
            if (this.currentMessageType !== type) {
                this.showMesTitleList = true;
            }
            this.currentMessageType = type;
            if (type === 'unread') {
                this.noDataText = '暂无未读消息';
                this.currentMesList = this.unreadMesList;
            } else if (type === 'hasread') {
                this.noDataText = '暂无已读消息';
                this.currentMesList = this.hasreadMesList;
            } else if (type === 'recyclebin') {
                this.noDataText = '回收站无消息';
                this.currentMesList = this.recyclebinList;
            }else{
                //
            }
        },sendmessage() {
            util.ajax({
                method:'POST',
                action:'sendmessage',
                json:{'title':this.msgtitle,content:this.msgcontent,'rid':this.msguser}
            }).then(res => {
               this.$Message.info('发射成功');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
        getmsgcontent (msgid) {
            util.ajax({
                method:'POST',
                action:'getmsgcontent',
                json:{'msgid':msgid}
            }).then(res => {
               this.mes = res;
               this.mes.senddate = util.formatdate(this.mes.senddate);
            }).catch(err => {
                this.$Message.error(err);
            });
        },usersearch(keyword) {
            util.ajax({
                method:'POST',
                action:'usersearch',
                json:{'keyword':keyword}
            }).then(res => {
               this.systemuser = res.ret;
            }).catch(err => {
                this.$Message.error(err);
            });
        }, 
    },
    mounted () {
        util.ajax({
            method:'POST',
            action:'getmessage',
            json  :{}
        }).then(res => {
            this.currentMesList = res.message;
            this.currentMesList.forEach(msg=>{
                switch (msg.msgstat) {
                    case '1':this.hasreadMesList.push(msg);
                    case '-1':this.recyclebinList.push(msg);
                    default:this.unreadMesList.push(msg);
                }
            });
            this.unreadCount = this.unreadMesList.length;
            this.hasreadCount = this.hasreadMesList.length;
            this.recyclebinCount = this.recyclebinList.length;
        }).catch(err => {
            this.$Message.error(err);
        });
    },
    watch: {
        unreadMesList (arr) {
            this.unreadCount = arr.length;
        },
        hasreadMesList (arr) {
            this.hasreadCount = arr.length;
        },
        recyclebinList (arr) {
            this.recyclebinCount = arr.length;
        }
    }
};
</script>

