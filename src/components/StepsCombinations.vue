<template>
    <div class="ma-4">
        <h1>{{ $t(`'{0}' combinations`).format(step.localname) }}</h1>  

        <p style="text-align: center;" >{{ $t("Ingredients")+": " }} <v-icon small v-if="step.can_products_in_step" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_products_in_step" >mdi-check-outline</v-icon>
        {{ $t("Container")+": " }} <v-icon small v-if="step.can_container" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_container" >mdi-check-outline</v-icon>
        {{ $t("Container to")+": " }} <v-icon small v-if="step.can_container_to" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_container_to" >mdi-check-outline</v-icon>
        {{ $t("Temperatures")+": " }} <v-icon small v-if="step.can_temperatures" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_temperatures" >mdi-check-outline</v-icon>
        {{ $t("Stir")+": " }} <v-icon small v-if="step.can_stir" >mdi-check-outline</v-icon><v-icon small color="red" v-if="step.man_stir" >mdi-check-outline</v-icon></p>
        <v-data-table density="compact" :headers="items_headers" :items="items" class="elevation-1" hide-default-footer :items-per-page="10000" :loading="loading" :key="'T'+key" height="70vh">
            <template v-slot:[`item.can_products_in_step`]="{ item }"><v-icon small v-if="item.can_products_in_step" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.can_container`]="{ item }"><v-icon small v-if="item.can_container" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.can_container_to`]="{ item }"><v-icon small v-if="item.can_container_to" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.can_temperatures`]="{ item }"><v-icon small v-if="item.can_temperatures" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.can_stir`]="{ item }"><v-icon small v-if="item.can_stir" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.has_comment`]="{ item }"><v-icon small v-if="item.has_comment" >mdi-check-outline</v-icon></template>   
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
                        { text: this.$t('Ingredients'), sortable: true, value: 'can_products_in_step', width:"5%"},
                        { text: this.$t('Container'), sortable: true, value: 'can_container', width:"5%"},
                        { text: this.$t('Container to'), sortable: true, value: 'can_container_to', width:"5%"},
                        { text: this.$t('Temperatures'), sortable: true, value: 'can_temperatures', width:"5%"},
                        { text: this.$t('Stir'), sortable: true, value: 'can_stir', width:"5%"},
                        { text: this.$t('Comment'), sortable: true, value: 'has_comment', width:"5%"},
                        { text: this.$t('Wording'), sortable: true, value: 'wording'},
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