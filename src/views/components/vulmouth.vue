<template>
    <div style="width:100%;height:100%;" :id="idname"></div>
</template>

<script>
import echarts from 'echarts';
import { debounce } from 'lodash';

export default {
    name: 'VulMouth',
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
            this.bugdata = []; 
            for(var name in this.bugvalue){
                var d = {};
                d['name'] = name;
                d['type'] = 'line';
                d['stack'] = '总量';
                d['areaStyle'] = {normal: {}};
                let data = [];
                this.bughead = [];
                for(var e in this.bugvalue[name]){
                    this.bughead.push(e);
                    data.push(this.bugvalue[name][e]);
                }
                d['data'] = data;
                d['smooth'] = true;
                this.bugdata.push(d);
            }
            this.option = {
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					data:['搜索引擎','百度','谷歌','必应','其他']
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis : [
					{
						type : 'category',
						axisLabel: {  
						   interval:0,  
						   rotate:40  
						},
						data : [],
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name:'其他',
						type:'bar',
						stack: '搜索引擎',
						data:[62, 82, 91, 84, 109, 110, 120]
					}
				]
			};
        }
    }
};
</script>




