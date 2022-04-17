<template>
    <div class="ma-4">
        <h1>{{ $t(`Meals`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>

        <div class="d-flex justify-center">
            <v-date-picker dense no-title v-model="day" @input="on_day_input()"></v-date-picker>
        </div>
        <v-data-table dense :headers="meals_headers" :items="meals" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
            <template v-slot:[`item.datetime`]="{ item }">
                {{localtime(item.datetime)}}
            </template>          
            <template v-slot:[`item.products`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('products',item.products,'name')"></div>
            </template>   
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editMeal(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteMeal(item)">mdi-delete</v-icon>
            </template>            
            <template v-slot:[`item.glutenfree`]="{ item }">
                    <v-icon small v-if="item.glutenfree" >mdi-check-outline</v-icon>           
            </template>
            <template v-slot:[`body.append`]="{headers}">
                <tr style="background-color: WhiteSmoke">
                    <td v-for="(header,i) in headers" :key="i">
                        <div v-if="header.value == 'products'">{{ $t(`Total (${meals.length} meals):`)}}</div>
                        <div v-if="header.value == 'amount'" align="right" v-html="my_round(listobjects_sum(meals,'amount'),2)"></div>
                        <div v-if="header.value == 'calories'" align="right" v-html="my_round(listobjects_sum(meals,'calories'),2)"></div>
                        <div v-if="header.value == 'fat'" align="right" v-html="my_round(listobjects_sum(meals,'fat'),2)"></div>
                        <div v-if="header.value == 'protein'" align="right" v-html="my_round(listobjects_sum(meals,'protein'),2)"></div>
                        <div v-if="header.value == 'carbohydrate'" align="right" v-html="my_round(listobjects_sum(meals,'carbohydrate'),2)"></div>
                        <div v-if="header.value == 'fiber'" align="right" v-html="my_round(listobjects_sum(meals,'fiber'),2)"></div>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <!-- DIALOG PRODUCTS CRUD -->
        <v-dialog v-model="dialog_meals_crud" width="45%">
            <v-card class="pa-4">
                <MealsCRUD :meal="meal" :deleting="meal_deleting" :key="'B'+key" @cruded="on_MealsCRUD_cruded()"></MealsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_meals } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import MealsCRUD from './MealsCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            MealsCRUD,
        },
        data(){
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Meal options"),
                        children: [
                            {
                                name: this.$t("Add meal"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.meal_deleting=false
                                    this_.meal=this_.empty_meals()
                                    this_.key=this_.key+1
                                    this_.dialog_meals_crud=true
                                },
                            },
                        ]
                    },
                ],
                meals:[],
                meals_headers: [
                    { text: this.$t('Date and time'), sortable: true, value: 'datetime'},
                    { text: this.$t('Product'), sortable: true, value: 'products'},
                    { text: this.$t('Amount'), sortable: true, value: 'amount',align:'right'},
                    { text: this.$t('Calories'), sortable: true, value: 'calories',align:'right'},
                    { text: this.$t('Fat'), sortable: true, value: 'fat',align:'right'},
                    { text: this.$t('Protein'), sortable: true, value: 'protein',align:'right'},
                    { text: this.$t('Carbohydrate'), sortable: true, value: 'carbohydrate',align:'right'},
                    { text: this.$t('Salt'), sortable: true, value: 'salt',align:'right'},
                    { text: this.$t('Cholesterol'), sortable: true, value: 'cholesterol',align:'right'},
                    { text: this.$t('Sodium'), sortable: true, value: 'sodium',align:'right'},
                    { text: this.$t('Potassium'), sortable: true, value: 'potassium',align:'right'},
                    { text: this.$t('Fiber'), sortable: true, value: 'fiber',align:'right'},
                    { text: this.$t('Sugars'), sortable: true, value: 'sugars',align:'right'},
                    { text: this.$t('Saturated fat'), sortable: true, value: 'saturated_fat',align:'right'},
                    { text: this.$t('Ferrum'), sortable: true, value: 'ferrum',align:'right'},
                    { text: this.$t('Magnesium'), sortable: true, value: 'magnesium',align:'right'},
                    { text: this.$t('Phosphor'), sortable: true, value: 'phosphor',align:'right'},
                    { text: this.$t('Calcium'), sortable: true, value: 'calcium',align:'right'},
                    { text: this.$t('Gluten free'), sortable: true, value: 'glutenfree',align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false},

                ],
                loading:false,
                key:0,
                tab:0,
                day:new Date().toISOString().substring(0, 10),
                //CRUD COMPANY
                meal:null,
                meal_deleting:null,
                dialog_meals_crud:false,

                //DIALOG FORMATS
                dialog_formats:false,
            }
        },        
        methods:{
            empty_meals,
            on_MealsCRUD_cruded(){
                this.dialog_meals_crud=false
                this.update_meals()
            },
            update_meals(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/meals/?day=${this.day}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.meals=response.data
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

            },
            editMeal(item){
                this.meal=item
                this.meal_deleting=false
                this.key=this.key+1

                this.dialog_meals_crud=true
            },
            deleteMeal(item){
                this.meal=item
                this.meal_deleting=true
                this.key=this.key+1

                this.dialog_meals_crud=true
            },
            on_day_input(){
                this.update_meals()
            }
        },
        created(){
            this.update_meals()
        }
    }
</script>