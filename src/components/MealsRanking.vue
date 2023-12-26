<template>
    <div class="ma-4">
        <h1>{{ $t(`Meals ranking`) }}</h1>
            <div class="d-flex mx-auto" outlined>
                <MyDatePicker density="compact" :label="$t('Report from selected date')" v-model="from_date"></MyDatePicker>
            </div>

        <v-data-table density="compact" :headers="ranking_headers" :items="ranking" :sort-by="[{key:'position',order:'asc'}]"  class="elevation-1" :items-per-page="10000" :loading="loading" :key="key" fixed-header height="70vh">
            <template #item.products="{item}"><div v-html="products_html_fullname(item.products,4)"></div></template>            
            <template #item.amount="{item}">{{ my_round(item.amount,0)}}</template>
            <template #bottom></template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import {my_round} from 'vuetify_rules'
    import MyDatePicker from './reusing/MyDatePicker.vue'
    export default {
        components: {
            MyDatePicker,
        },
        data(){
            return {
                loading:false,
                key:0,
                ranking:[],
                search:"",
                from_date:null,

                ranking_headers: [
                    { title: this.$t('Position'), sortable: false, key: 'ranking', width:"8%",align:"right"},
                    { title: this.$t('Product'), sortable: false, key: 'products'},
                    { title: this.$t('Amount'), sortable: false, key: 'amount',width:"8%",align:"right"},
                ],
            }
        },
        watch:{
            from_date(){
                this.update()
            }
        },
        methods:{
            my_round,
            update(){
                this.loading=true
                axios.get(`${this.store().apiroot}/api/meals/ranking/?from_date=${this.from_date}`, this.myheaders())
                .then((response) => {
                    this.ranking=response.data
                    this.key=this.key+1
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        created(){
            let d = new Date()
            d.setDate(d.getDate()-365)
            this.from_date=d.toISOString().substring(0, 10)
        }
    }
</script>