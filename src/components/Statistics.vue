<template>
    <div v-show="this.useStore().logged">
            <h1>{{ $t("Statistics") }}</h1>
            <chart-pie :name="$t('Calories Tracker registers')" :items="items" :height="600" :key="key"></chart-pie>
    </div>
</template>

<script>
    import ChartPie from './reusing/ChartPie.vue'
    import axios from "axios"
    import { useStore } from '@/store.js'
    export default {
        components: {
            ChartPie,
        },
        data () {
            return {
                items:[],
                key:0,
            }
        },
        methods: {
        useStore,
            getStatistics(){
                axios.get(`${this.useStore().apiroot}/statistics/`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.items=response.data 
                }, (error) => {
                    this.parseResponseError(error)
                })
                .finally(() => (this.isLoading = false));
            }
        },
        mounted(){
            this.getStatistics()
        }
    }
</script>
