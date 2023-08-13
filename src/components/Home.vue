<template>
    <div>
        <h1>{{ $t("Wellcome to Calories Tracker") }}</h1>
        <h2>{{ `${store().version} (${store().versiondate.toISOString().slice(0,10)})` }}</h2>
        <v-img :src="imgUrl" height="200px" contain ></v-img>
        <v-alert density="compact" class="mx-15 px-10 mb-2" outlined type="warning" v-if="time_message.length>0"> {{time_message}}</v-alert>   
    </div>
</template>
<script>
    import axios from 'axios'
    import imgUrl from '@/assets/calories_tracker.png'
    export default {
        components:{
        },
        data(){
            return {
                imgUrl:imgUrl,
                alerts:null,
                diff_time:null
            }
        },
        computed:{
            time_message(){
                return (this.diff_time>=Math.abs(1000)) ?  this.$t("There is a time difference between the browser and the server of [0] ms. Please contact server administrator.").format(this.diff_time): ""
            },
        },
        methods:{
        },
        created(){
        }
    }
</script>
