<template>
    <div style="width:100%;height:100%;" :id="idname"></div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'lodash';

export default {
    name: 'VulRank',
    data () {
        return {
            chart:'',
            resize: debounce(this.chartResize, this.delayTime, { leading: false, trailing: true }),
            option: {},
        }     
    },
    props:{
        bugvalue:{
            type:Object,
            default:function(){
                return {};
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
        bugvalue(n,o){
            this.bugvalue = n;
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
            this.bughead = [];
            this.bugdata = [];
            for(var k in this.bugvalue){
                this.bughead.push(k);
                var d = {};
                d['name'] = k;
                d['value'] = this.bugvalue[k];
                console.log(d);
                this.bugdata.push(d);
            }
            this.option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}:{c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    data: this.bughead,
                    show:false
                },
                series: [{
                    name: '漏洞等级',
                    type: 'pie',
                    radius: '80%',
                    center: ['50%', '60%'],
                    data: this.bugdata,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
        }
    }
};
</script>
