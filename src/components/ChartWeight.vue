
<template>
    <div>
        <v-card outlined class="ma-4 pa-4" :height="$attrs.height ? $attrs.height: 500" :width="($attrs.width)? $attrs.width: '100%'">
            <v-chart
                ref="chart"
                :option="chart_option()"
                autoresize
                :loading="loading"
            />
         </v-card>
    </div>

</template>
<script>
    export default {
        props:{
            data:{ //Must be an array [(date, float)]
                required:true,
            },
        },
        data(){ 
            return{
                loading:false,
                tuple_closes:[],

            }
        },
        methods: {
            chart_option(){
                return {
                    legend: {
                        data: [this.$t("Weight evolution")],
                        inactiveColor: '#777',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false,
                            type: 'cross',
                            lineStyle: {
                                color: '#376df4',
                                width: 2,
                                opacity: 1
                            }
                        }
                    },
                    xAxis: {
                        type: 'time',
                        axisLine: { lineStyle: { color: '#8392A5' } }
                    },
                    yAxis: {
                        scale: true,
                        axisLine: { lineStyle: { color: '#8392A5' } },
                        splitLine: { show: false }
                    },
                    grid: {
                        bottom: 80, 
                        left:80
                    },
                    dataZoom: [{
                        textStyle: {
                            color: '#8392A5'
                        },
                        handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        dataBackground: {
                            areaStyle: {
                                color: '#8392A5'
                            },
                            lineStyle: {
                                opacity: 0.8,
                                color: '#8392A5'
                            }
                        },
                        brushSelect: true
                    }, {
                        type: 'inside'
                    }],
                    series: this.series()
                }
            },
            series(){
                var r=[]
                r.push({
                    type: 'line',
                    name: this.$t("Weight evolution"),
                    data: this.data,
                    showSymbol:false, 
                })
                return r
            },
        },
    }


</script>

