
<template>
    <div ref="chart_div" :style="{ width: '100%', height: `${height}px` }"></div>
</template>
<script setup>
    import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
    import * as echarts from 'echarts';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();

    const props = defineProps({
        data: { // Must be an array [(date, float)]
            type: Array,
            required: true,
        },
        height: {
            type: Number,
            default: 500,
        },
    });

    const chart_div = ref(null);
    const chart = ref(null);

    const chartSeries = computed(() => [{
        type: 'line',
        name: t("Weight evolution"),
        data: props.data,
        showSymbol: false,
    }]);

    const chartOption = computed(() => ({
        legend: {
            top: 'top',
            data: [t("Weight evolution")],
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
            left: 80
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
        series: chartSeries.value
    }));

    watch(chartOption, (newOption) => {
        if (chart.value) {
            chart.value.setOption(newOption, true);
        }
    }, { deep: true });

    const resizeChart = () => {
        if (chart.value) {
            chart.value.resize();
        }
    };

    onMounted(() => {
        if (chart_div.value) {
            chart.value = echarts.init(chart_div.value);
            chart.value.setOption(chartOption.value);
            window.addEventListener('resize', resizeChart);
        }
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeChart);
        if (chart.value) {
            chart.value.dispose();
            chart.value = null;
        }
    });
</script>
