import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = [{
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/user-login.vue'], resolve); }
}];


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{ 
        path: 'home', 
        title: '系统管理', 
        name: 'project_index', 
        component: resolve => {require(['@/views/project-list.vue'], resolve);} 
    },{ 
        path: 'bugedit', 
        title: '漏洞编辑', 
        name: 'bug_edit', 
        component: resolve => {require(['@/views/bug-edit.vue'], resolve); } 
    },{ 
        path: 'buginfo', 
        title: '漏洞详情', 
        name: 'bug_info', 
        component: resolve => {require(['@/views/bug-info.vue'], resolve); } 
    },{ 
        path: 'projectinfo', 
        title: '项目报表', 
        name: 'project_info', 
        component: resolve => {require(['@/views/project-info.vue'], resolve); } 
    },{ 
        path: 'taskdiff', 
        title: '任务对比', 
        name: 'task_diff', 
        component: resolve => {require(['@/views/scantask-diff.vue'], resolve); } 
    },{ 
        path: 'messageindex', 
        title: '站内信', 
        name: 'message_index', 
        component: resolve => {require(['@/views/main-components/message.vue'], resolve); } 
    },]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
{
    path: '/project',
    name: 'project',
    icon: 'shuffle',
    title: '分析报表',
    access: 2,
    component: Main,
    children: [{ 
        path: 'home', 
        title: '首页', 
        name: 'home_index', 
        component: resolve => {require(['@/views/home.vue'], resolve); } 
    }]
},{
    path: '/hostlist',
    name: 'hostlist',
    icon: 'shuffle',
    title: '资产管理',
    access: 2,
    component: Main,
    children: [{ 
        path: 'portlist', 
        title: '资产管理', 
        name: 'port_list', 
        component: resolve => {require(['@/views/port-list.vue'], resolve); } 
    }]
},{
    path: '/buglist',
    name: 'buglist',
    icon: 'shuffle',
    title: '漏洞管理',
    access: 2,
    component: Main,
    children: [{
        path: 'buglist', 
        title: '正在处理', 
        name: 'bug_list', 
        component: resolve => {require(['@/views/bug-list.vue'], resolve);},
    },{
        path: 'bughistory', 
        title: '历史漏洞', 
        name: 'bug_history', 
        component: resolve => {require(['@/views/bug-history.vue'], resolve);},
    }]
},{
    path: '/tasklist',
    name: 'tasklist',
    icon: 'shuffle',
    title: '任务管理',
    access: 2,
    component: Main,
    children: [{
        path: 'tasklist', 
        title: '用户任务', 
        name: 'task_list', 
        component: resolve => {require(['@/views/scantask-list.vue'], resolve);},
    },{
        path: 'pluginlist', 
        title: '插件扫描', 
        name: 'plugin_list', 
        component: resolve => {require(['@/views/setting-plugin.vue'], resolve); } 
    }]
},{
    path: '/search',
    name: 'search',
    icon: 'shuffle',
    title: '搜索中心',
    access: 3,
    component: Main,
    children: [{
        path: '/hostdata',
        title: '资产搜索',
        name: 'hostdata_search', 
        component: resolve => {require(['@/views/tools-hostdata.vue'], resolve); }
    },{
        path: '/httpdata',
        title: '网站搜索',
        name: 'httpdata_search', 
        component: resolve => {require(['@/views/tools-httpdata.vue'], resolve); }
    }]
},{
    path: '/settings',
    name: 'settings',
    icon: 'wrench',
    title: '基础设置',
    access: 3,
    component: Main,
    children: [{
        path: 'vulbaselist', 
        title: '基础漏洞', 
        name: 'vulbase_list', 
        component: resolve => {require(['@/views/setting-vulbase.vue'], resolve); } 
    },{
        path: 'userlist', 
        title: '用户管理', 
        name: 'user_list', 
        component: resolve => {require(['@/views/setting-user.vue'], resolve); } 
    }/*,{
        path: 'projectlist', 
        title: '项目管理', 
        name: 'project_list', 
        component: resolve => {require(['@/views/setting-project.vue'], resolve); } 
    }*/]
}];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    otherRouter,
    ...appRouter,
    ...loginRouter,
];
