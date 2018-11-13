<!-- 漏洞等级表 -->
 
<template>
    <div style="width:100%;height:100%;" :id="idname"></div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'lodash';

export default {
    name: 'serviceRequests',
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
            for(var name in this.bugvalue){
                for(var value in this.bugvalue[name]){
                    if(this.bughead.indexOf(value)==-1){
                        this.bughead.push(value);
                    } 
                }
            }
            this.bughead = this.bughead.sort();
            for(var name in this.bugvalue){
                let data = [];
                this.bughead.forEach(head=>{
                    if(this.bugvalue[name].hasOwnProperty(head)){
                        data.push(this.bugvalue[name][head]);
                    }else{
                        data.push(0); 
                    }
                });
                var d = {};
                d['name'] = name;
                d['type'] = 'line';
                d['areaStyle'] = {};
                d['data'] = data;
                d['smooth'] = true;
                this.bugdata.push(d);
            }
            this.option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    }
                },
                grid: {
                    top: '3%',
                    left: '1.2%',
                    right: '1%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.bughead
                },
                yAxis: {type: 'value'},
                series: this.bugdata
            };
        }
    }
};
</script>



