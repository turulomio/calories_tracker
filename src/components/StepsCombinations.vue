<template>
    <div class="ma-4">
        <h1>{{ $t(`'{0}' combinations`).format(step.localname) }}</h1>  

        <p style="text-align: center;" >{{ $t("Ingredients")+": " }} <v-icon small v-if="step.can_products_in_step" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_products_in_step" >mdi-check-outline</v-icon>
        {{ $t("Container")+": " }} <v-icon small v-if="step.can_container" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_container" >mdi-check-outline</v-icon>
        {{ $t("Container to")+": " }} <v-icon small v-if="step.can_container_to" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_container_to" >mdi-check-outline</v-icon>
        {{ $t("Temperatures")+": " }} <v-icon small v-if="step.can_temperatures" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_temperatures" >mdi-check-outline</v-icon>
        {{ $t("Stir")+": " }} <v-icon small v-if="step.can_stir" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_stir" >mdi-check-outline</v-icon></p>
        <v-data-table density="compact" :headers="items_headers" :items="items" class="elevation-1" hide-default-footer :items-per-page="10000" :loading="loading" :key="'T'+key" height="70vh">
            <template #item.can_products_in_step="{item}"><v-icon small v-if="item.raw.can_products_in_step" >mdi-check-outline</v-icon></template>
            <template #item.can_container="{item}"><v-icon small v-if="item.raw.can_container" >mdi-check-outline</v-icon></template>
            <template #item.can_container_to="{item}"><v-icon small v-if="item.raw.can_container_to" >mdi-check-outline</v-icon></template>
            <template #item.can_temperatures="{item}"><v-icon small v-if="item.raw.can_temperatures" >mdi-check-outline</v-icon></template>
            <template #item.can_stir="{item}"><v-icon small v-if="item.raw.can_stir" >mdi-check-outline</v-icon></template>
            <template #item.has_comment="{item}"><v-icon small v-if="item.raw.has_comment" >mdi-check-outline</v-icon></template>   
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        props: {
            step: { //object with .url parameter
                required: true
            },
        },
        data(){
            return {
                loading:false,
                key:0,
                items:[],
                items_headers: [
                        { title: this.$t('Ingredients'), sortable: true, key: 'can_products_in_step', width:"5%"},
                        { title: this.$t('Container'), sortable: true, key: 'can_container', width:"5%"},
                        { title: this.$t('Container to'), sortable: true, key: 'can_container_to', width:"5%"},
                        { title: this.$t('Temperatures'), sortable: true, key: 'can_temperatures', width:"5%"},
                        { title: this.$t('Stir'), sortable: true, key: 'can_stir', width:"5%"},
                        { title: this.$t('Comment'), sortable: true, key: 'has_comment', width:"5%"},
                        { title: this.$t('Wording'), sortable: true, key: 'wording'},
                    ]


            }
        },
        methods:{
            update_table(){
                this.loading=true
                axios.get(`${this.step.url}wordings/`, this.myheaders())
                .then((content) => {
                    this.items=content.data.data
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
                
            }
        },
        created(){
            this.update_table()
        }
    }
</script>