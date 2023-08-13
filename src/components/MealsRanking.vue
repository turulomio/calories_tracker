<template>
    <div class="ma-4">
        <h1 class="mb-4">{{ $t(`Meals ranking`) }}</h1>
            <v-card width="30%" class="pa-5 mx-auto" outlined>
                <MyDatePicker dense :label="$t('Report from selected date')" v-model="from_date" @input="on_day_input()"></MyDatePicker>
            </v-card>

        <v-data-table dense :headers="ranking_headers" :items="ranking" sort-by="position" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="key" fixed-header height="500">
            <template v-slot:[`item.position`]="{ index }">{{index+1}}</template>    
            <template v-slot:[`item.product`]="{ item }"><div v-html="products_html_fullname(item.product,4)"></div></template>            
            <template v-slot:[`item.amount`]="{ item }">{{ my_round(item.amount,0)}}</template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios'
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
                    { text: this.$t('Position'), sortable: false, value: 'position', width:"8%",align:"right"},
                    { text: this.$t('Product'), sortable: false, value: 'product'},
                    { text: this.$t('Amount'), sortable: false, value: 'amount',width:"8%",align:"right"},
                ],
            }
        },        
        methods:{
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
            on_day_input(){
                this.update()
            },
        },
        created(){
            let d = new Date()
            d.setDate(d.getDate()-365)
            this.from_date=d.toISOString().substring(0, 10)
            this.update()
        }
    }
</script>