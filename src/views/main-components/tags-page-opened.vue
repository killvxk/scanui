<style lang="less">
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}
.lock-screen-back{
    border-radius: 50%;
    z-index: -1;
    box-shadow: 0 0 0 0 #667aa6 inset;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    transition: all 3s;
}
.main{
    position: absolute;
    width: 100%;
    height: 100%;
    .unlock-con{
        width: 0px;
        height: 0px;
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 11000;
    }
    .sidebar-menu-con{
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 21;
        transition: width .3s;
    }
    .layout-text{
        display: inline-block;
        white-space:nowrap;
        position: absolute;
    }
    .main-hide-text .layout-text{
        display: none;
    }
    &-content-container{
        position: relative;
    }
    &-header-con{
        box-sizing: border-box;
        position: fixed;
        display: block;
        padding-left: 200px;
        width: 100%;
        height: 100px;
        z-index: 20;
        box-shadow: 0 2px 1px 1px rgba(100,100,100,.1);
        transition: padding .3s;
    }
    &-breadcrumb{
        padding: 8px 15px 0;
    }
    &-menu-left{
        background: #464c5b;
        height: 100%;
    }
    .tags-con{
        height: 40px;
        z-index: -1;
        overflow: hidden;
        background: #f0f0f0;
        .tags-outer-scroll-con{
            position: relative;
            box-sizing: border-box;
            padding-right: 120px;
            width: 100%;
            height: 100%;
            .tags-inner-scroll-body{
                position: absolute;
                padding: 2px 10px;
                overflow: visible;
                white-space: nowrap;
                transition: left .3s ease;
            }
            .close-all-tag-con{
                position: absolute;
                right: 0;
                top: 0;
                box-sizing: border-box;
                padding-top: 8px;
                text-align: center;
                width: 110px;
                height: 100%;
                background: white;
                box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
                z-index: 10;
            }
        }
    }
    &-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 2px 1px 1px rgba(100,100,100,.1);
        position: relative;
        z-index: 11;
        .navicon-con{
            margin: 6px;
            display: inline-block;
        }
        .header-middle-con{
            position: absolute;
            left: 60px;
            top: 0;
            right: 340px;
            bottom: 0;
            padding: 10px;
            overflow: hidden;
        }
        .header-avator-con{
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 300px;
            .switch-theme-con{
                display: inline-block;
                width: 40px;
                height: 100%;
            }
            .message-con{
                display: inline-block;
                width: 30px;
                padding: 18px 0;
                text-align: center;
                cursor: pointer;
                i{
                    vertical-align: middle;
                }
            }
            .change-skin{
                font-size: 14px;
                font-weight: 500;
                padding-right: 5px;
            }
            .switch-theme{
                height: 100%;
            }
            .user-dropdown{
                &-menu-con{
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 150px;
                    height: 100%;
                    .main-user-name{
                        display: inline-block;
                        width: 80px;
                        word-break: keep-all;
                        white-space: nowrap;
                        vertical-align: middle;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        text-align: right;
                    }
                }
                &-innercon{
                    height: 100%;
                    padding-right: 14px;
                }
            }
            .full-screen-btn-con{
                display: inline-block;
                width: 30px;
                padding: 18px 0;
                text-align: center;
                cursor: pointer;
                i{
                    vertical-align: middle;
                }
            }
            .lock-screen-btn-con{
                display: inline-block;
                width: 30px;
                padding: 18px 0;
                text-align: center;
                cursor: pointer;
                i{
                    vertical-align: middle;
                }
            }
        }
    }
    .single-page-con{
        position: absolute;
        top: 100px;
        right: 0;
        bottom: 0;
        overflow: auto;
        background-color: #F0F0F0;
        z-index: 1;
        transition: left .3s;
        .single-page{
            margin: 10px;
        }
    }
    &-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
}
.taglist-moving-animation-move{
    transition: transform .3s;
}
.logo-con{
    padding: 8px;
    text-align: center;
    img{
        height: 44px;
        width: auto;
    }
}
</style>

<template>
    <div ref="scrollCon" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll" class="tags-outer-scroll-con">
        <div class="close-all-tag-con">
            <Dropdown transfer @on-click="handleTagsOption">
                <Button size="small" type="primary">
                    标签选项
                    <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">关闭所有</DropdownItem>
                    <DropdownItem name="clearOthers">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
            <transition-group name="taglist-moving-animation">
                <Tag 
                    type="dot"
                    v-for="(item, index) in pageTagsList" 
                    ref="tagsPageOpened"
                    :key="item.name" 
                    :name="item.name" 
                    @on-close="closePage"
                    @click.native="linkTo(item)"
                    :closable="item.name==='home_index'?false:true"
                    :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
                >{{ itemTitle(item) }}</Tag>
            </transition-group>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
//import VueI18n from 'vue-i18n';
//Vue.use(VueI18n);
export default {
    name: 'tagsPageOpened',
    data () {
        return {
            currentPageName: this.$route.name,
            tagBodyLeft: 0,
            refsTag: [],
            tagsCount: 1
        };
    },
    props: {
        pageTagsList: Array,
        beforePush: {
            type: Function,
            default: (item) => {
                return true;
            }
        }
    },
    computed: {
        title () {
            return this.$store.state.app.currentTitle;
        },
        tagsList () {
            return this.$store.state.app.pageOpenedList;
        }
    },
    methods: {
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        },
        closePage (event, name) {
            let pageOpenedList = this.$store.state.app.pageOpenedList;
            let lastPageObj = pageOpenedList[0];
            if (this.currentPageName === name) {
                let len = pageOpenedList.length;
                for (let i = 1; i < len; i++) {
                    if (pageOpenedList[i].name === name) {
                        if (i < (len - 1)) {
                            lastPageObj = pageOpenedList[i + 1];
                        } else {
                            lastPageObj = pageOpenedList[i - 1];
                        }
                        break;
                    }
                }
            }
            this.$store.commit('removeTag', name);
            this.$store.commit('closePage', name);
            pageOpenedList = this.$store.state.app.pageOpenedList;
            localStorage.pageOpenedList = JSON.stringify(pageOpenedList);
            if (this.currentPageName === name) {
                this.linkTo(lastPageObj);
            }
        },
        linkTo (item) {
            let routerObj = {};
            routerObj.name = item.name;
            if (item.argu) {
                routerObj.params = item.argu;
            }
            if (item.query) {
                routerObj.query = item.query;
            }
            if (this.beforePush(item)) {
                this.$router.push(routerObj);
            }
        },
        handlescroll (e) {
            var type = e.type;
            let delta = 0;
            if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
            }
            let left = 0;
            if (delta > 0) {
                left = Math.min(0, this.tagBodyLeft + delta);
            } else {
                if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
                    if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
                        left = this.tagBodyLeft;
                    } else {
                        left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100);
                    }
                } else {
                    this.tagBodyLeft = 0;
                }
            }
            this.tagBodyLeft = left;
        },
        handleTagsOption (type) {
            if (type === 'clearAll') {
                this.$store.commit('clearAllTags');
                this.$router.push({
                    name: 'home_index'
                });
            } else {
                this.$store.commit('clearOtherTags', this);
            }
            this.tagBodyLeft = 0;
        },
        moveToView (tag) {
            if (tag.offsetLeft < -this.tagBodyLeft) {
                // 标签在可视区域左侧
                this.tagBodyLeft = -tag.offsetLeft + 10;
            } else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100) {
                // 标签在可视区域
            } else {
                // 标签在可视区域右侧
                this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 20);
            }
        }
    },
    mounted () {
        this.refsTag = this.$refs.tagsPageOpened;
        setTimeout(() => {
            this.refsTag.forEach((item, index) => {
                if (this.$route.name === item.name) {
                    let tag = this.refsTag[index].$el;
                    this.moveToView(tag);
                }
            });
        }, 1);  // 这里不设定时器就会有偏移bug
        this.tagsCount = this.tagsList.length;
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.name;
            this.$nextTick(() => {
                this.refsTag.forEach((item, index) => {
                    if (to.name === item.name) {
                        let tag = this.refsTag[index].$el;
                        this.moveToView(tag);
                    }
                });
            });
            this.tagsCount = this.tagsList.length;
        }
    }
};
</script>
