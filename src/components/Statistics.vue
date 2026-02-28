<template>
    <div v-show="this.useStore().logged">
            <h1>{{ $t("Statistics") }}</h1>
            <p class="ma-4 text-center">{{ $t("Here you can see the distribution of the registers in the application") }}</p>
            <div ref="chart_div" data-test="Statistics_Chart" style="width: 100%; height: 600px;"></div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import axios from "axios"
    import { useStore } from '@/store.js'
    export default {
        data () {
            return {
                resizeObserver: null,
            }
        },
        methods: {
            useStore,
            getStatistics(){
                axios.get(`${this.useStore().apiroot}/statistics/`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.initChart(response.data)
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            initChart(data) {
                if (!this.$refs.chart_div) return;

                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        containLabel: true
                    },
                    xAxis: {
                        type: 'log'
                    },
                    yAxis: {
                        type: 'category',
                        data: data.map(x => x.name),
                        inverse: true
                    },
                    series: [
                        {
                            name: this.$t('Calories Tracker registers'),
                            type: 'bar',
                            data: data.map(x => x.value),
                            colorBy: 'data',
                            label: {
                                show: true,
                                position: 'right'
                            }
                        }
                    ]
                };

                if (!this.chart) {
                    this.chart = echarts.init(this.$refs.chart_div);
                }
                this.chart.setOption(option);
            }
        },
        mounted(){
            this.getStatistics();
            this.resizeObserver = new ResizeObserver(() => {
                if (this.chart) this.chart.resize();
            });
            this.resizeObserver.observe(this.$refs.chart_div);
        },
        beforeUnmount() {
            if (this.resizeObserver) this.resizeObserver.disconnect();
            if (this.chart) {
                this.chart.dispose();
                this.chart = null;
            }
        }
    }
</script>
