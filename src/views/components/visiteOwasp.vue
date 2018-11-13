<template>
    <div style="width:100%;height:100%;" :id="idname"></div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'lodash';

export default {
    name: 'visiteOwasp',
    data () {
        return {
            chart:'',
            resize: debounce(this.chartResize, this.delayTime, { leading: false, trailing: true }),
            option: {},
        }     
    },
    props:{
        owaspvalue:{
            type:Array, 
            default:function(){
                return [];
            }
        },
        idname: {
            type: String,
            default() {return `app-echarts__${Math.random().toString(36).substring(3, 8)}`},
        },
        delayTime: {
            type: Number,
            default: 300,
        },
    },
    mounted() {
        this.init();
        this.$on('on-resize-change', (val) => {
            if (val) {this.chartResize();}
        })
    },
    beforeDestroy() {
        this.autoResizeHandler();
        if (this.chart) {
            this.chart.dispose();
        }
    },
    computed: {
        setOptions() {
            return this.option
        },
    },
    watch: {
        autoResize(val) {this.autoResizeHandler(val)},
        owaspvalue(n,o){
            this.owaspvalue = n;
            this.init();
        }
    },
    methods:{
        // 重绘图表
        chartResize() {this.chart.resize()},
        autoResizeHandler() {window.addEventListener('resize', this.resize, false);},
        init(){
            this.dwview();
            this.chart = echarts.init(document.getElementById(this.idname));
            this.chart.setOption(this.setOptions);
            this.autoResizeHandler();
        },
        dwview(){
            let owasp = {
                'A1:2017':'注入', 
                'A2:2017':'失效的身份认证和会话管理', 
                'A3:2017':'敏感信息泄露', 
                'A4:2017':'XML外部实体(XXE)', 
                'A5:2017':'失效的访问控制',
                'A6:2017':'安全配置错误',
                'A7:2017':'跨站脚本(XSS)',
                'A8:2017':'不安全的反序列化',
                'A9:2017':'使用含有已知漏洞的组件',
                'A10:2017':'不足的日志记录和监控'
            };
            this.owasphead = [];
            this.owaspdata = [];
            var i =0;
            for (var k in owasp) {
                let data = {};
                data['value'] = this.owaspvalue[i];
                data['name'] = k;
                data['itemStyle'] = {normal: {color: '#2d8cf0'}};
                this.owasphead.push(k);
                this.owaspdata.push(data);
                i += 1;
            };
            this.option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) { 
                        return params[0].name+'-' + owasp[params[0].name]+'<br>'+'漏洞数量: '+params[0].value;
                    }
                },
                grid: {
                    top: 0,
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    nameTextStyle: {color: '#c3c3c3'},
                    data: this.owasphead
                },
                series: [
                    {
                        name: '漏洞数量',
                        type: 'bar',
                        data: this.owaspdata
                    }
                ]
            };
        },
    }
};
</script>
