import Vue from 'vue'
import axios from 'axios';
import Cookies from 'js-cookie';
import router from '@/router'
import store from '@/store'
import CryptoJS from 'crypto-js'

//增加反编译难度
let sha1 = CryptoJS.SHA1; 
let md5 = CryptoJS.MD5;
function str2hex(str) {  
    var val = "";  
    for (var i = 0; i < str.length; i++) {  
      if (val == "")  
        val = str.charCodeAt(i).toString(16);  
      else  
        val += str.charCodeAt(i).toString(16);  
    }
    return val  
};
function hex2str(hex) {  
    var arr = hex.split("")  
    var out = ""  
    for (var i = 0; i < arr.length / 2; i++) {  
      var tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]  
      var charValue = String.fromCharCode(tmp);  
      out += charValue  
    }  
    return out  
};
function xor(msg, key) {
    const arr = [];
    for (let i = 0; i < key.length; i++) {
        arr.push(String.fromCharCode(key.charCodeAt(i) ^ msg.charCodeAt(i%key.length)));
    }
    return arr.join('');
};
function sign(d){
    return sha1(JSON.stringify(d)).toString().substring(4,36);
};
function now(){
    return (new Date()).valueOf().toString(16).split("").reverse().join("");
};
function hash1(s){
    var t = (localStorage.token || md5(localStorage.token).toString());
    var s = sign(s);
    var d = xor(s,t);
    return d;
};
function hash(s){
    return sign(s) + (localStorage.token || md5(localStorage.token).toString());
};
let util = {};
util.ajax = function(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            url:'/api.php',
            timeout: 66666,
            headers: {
                'Access-Control-Allow-Credentials':true,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data:{}
        });

        instance.interceptors.request.use(
            config => {
                config.data.s = now();
                config.data.c = options.action;
                config.data.d = options.json; 
                config.headers.Control = hash(config.data);
                return config
            },
            err => {
                return Promise.reject(err)
        })

        instance.interceptors.response.use(
            response => {
                return response
            },
            error => {
                return Promise.reject(error) // 返回接口返回的错误信息
        })

        instance(options).then((res) => {
            resolve(res.data.result)
            return false
        }).catch((error) => {
            console.log(error);
            reject(error.response.data.error)
        })
    })
};

util.title = function (title) {
    title = title || '管理平台';
    window.document.title = title;
};

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess <= currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) {  // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.unix2date = function(date){
    return new Date(date * 1000).toLocaleString().substring(0,10);
};

util.formatdate = function(time) {
    return time.substring(0,19);
};

export default util;
