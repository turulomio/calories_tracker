<template>
    <div class="ma-4">
        <h1>{{ $t(`Meals`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>

            <v-card width="20%" class="pa-5 mx-auto" outlined>
                <MyDatePicker dense :label="$t('Select a date')" v-model="day" @input="on_day_input()"></MyDatePicker>
            </v-card>


            <v-data-table dense class="mt-4 elevation-1" :headers="meals_headers" :items="meals" sort-by="name" hide-default-footer disable-pagination :loading="loading" :key="'T'+key">
                <template v-slot:[`item.datetime`]="{ item }">
                    {{localtime(item.datetime).slice(10)}}
                </template>          
                <template v-slot:[`item.products`]="{ item }">
                    <div v-html="$store.getters.getObjectPropertyByUrl('products',item.products,'fullname')"></div>
                </template>                       
                <template v-slot:[`item.calories`]="{ item }"><div v-html="my_round(item.calories,0)"></div></template>  
                <template v-slot:[`item.fat`]="{ item }"><div v-html="my_round(item.fat,0)"></div></template>  
                <template v-slot:[`item.protein`]="{ item }"><div v-html="my_round(item.protein,0)"></div></template>  
                <template v-slot:[`item.carbohydrate`]="{ item }"><div v-html="my_round(item.carbohydrate,0)"></div></template>  
                <template v-slot:[`item.salt`]="{ item }"><div v-html="my_round(item.salt,0)"></div></template>  
                <template v-slot:[`item.fiber`]="{ item }"><div v-html="my_round(item.fiber,0)"></div></template>  
                <template v-slot:[`item.sugars`]="{ item }"><div v-html="my_round(item.sugars,0)"></div></template>  
                <template v-slot:[`item.saturated_fat`]="{ item }"><div v-html="my_round(item.saturated_fat,0)"></div></template>  
                <template v-slot:[`item.cholesterol`]="{ item }"><div v-html="my_round(item.cholesterol,0)"></div></template>  
                <template v-slot:[`item.sodium`]="{ item }"><div v-html="my_round(item.sodium,0)"></div></template>  
                <template v-slot:[`item.potassium`]="{ item }"><div v-html="my_round(item.potassium,0)"></div></template>  
                <template v-slot:[`item.ferrum`]="{ item }"><div v-html="my_round(item.ferrum,0)"></div></template>  
                <template v-slot:[`item.magnesium`]="{ item }"><div v-html="my_round(item.magnesium,0)"></div></template>  
                <template v-slot:[`item.phosphor`]="{ item }"><div v-html="my_round(item.phosphor,0)"></div></template>  
                <template v-slot:[`item.calcium`]="{ item }"><div v-html="my_round(item.calcium,0)"></div></template>  
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-1" @click="editMeal(item)">mdi-pencil</v-icon>
                    <v-icon small class="mr-1" @click="deleteMeal(item)">mdi-delete</v-icon>
                    <v-icon small v-if="item.glutenfree"  @click="on_icon_glutenfree">mdi-barley-off</v-icon>
                </template>            
                <template v-slot:[`body.append`]="{headers}" v-if="meals.length>0">
                    <tr style="background-color: WhiteSmoke">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'products'">{{ $t(`Total (${meals.length} meals):`)}}</div>
                            <div v-if="header.value == 'amount'" align="right" v-html="my_round(listobjects_sum(meals,'amount'),0)"></div>
                            <div v-if="header.value == 'calories'" align="right" v-html="my_round(listobjects_sum(meals,'calories'),0)"></div>
                            <div v-if="header.value == 'fat'" align="right" v-html="my_round(listobjects_sum(meals,'fat'),0)"></div>
                            <div v-if="header.value == 'protein'" align="right" v-html="my_round(listobjects_sum(meals,'protein'),0)"></div>
                            <div v-if="header.value == 'carbohydrate'" align="right" v-html="my_round(listobjects_sum(meals,'carbohydrate'),0)"></div>
                            <div v-if="header.value == 'fiber'" align="right" v-html="my_round(listobjects_sum(meals,'fiber'),0)"></div>
                            <div v-if="header.value == 'salt'" align="right" v-html="my_round(listobjects_sum(meals,'salt'),0)"></div>
                            <div v-if="header.value == 'cholesterol'" align="right" v-html="my_round(listobjects_sum(meals,'cholesterol'),0)"></div>
                            <div v-if="header.value == 'sodium'" align="right" v-html="my_round(listobjects_sum(meals,'sodium'),0)"></div>
                            <div v-if="header.value == 'potassium'" align="right" v-html="my_round(listobjects_sum(meals,'potassium'),0)"></div>
                            <div v-if="header.value == 'ferrum'" align="right" v-html="my_round(listobjects_sum(meals,'ferrum'),0)"></div>
                            <div v-if="header.value == 'magnesium'" align="right" v-html="my_round(listobjects_sum(meals,'magnesium'),0)"></div>
                            <div v-if="header.value == 'phosphor'" align="right" v-html="my_round(listobjects_sum(meals,'phosphor'),0)"></div>
                            <div v-if="header.value == 'calcium'" align="right" v-html="my_round(listobjects_sum(meals,'calcium'),0)"></div>
                            <div v-if="header.value == 'sugars'" align="right" v-html="my_round(listobjects_sum(meals,'sugars'),0)"></div>
                            <div v-if="header.value == 'saturated_fat'" align="right" v-html="my_round(listobjects_sum(meals,'saturated_fat'),0)"></div>
                        </td>
                    </tr>
                    <tr style="background-color: WhiteSmoke">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'products'">{{ $t(`Recomendation for {0} kg and {1} cm`).format(biometric.weight,biometric.height)}}</div>
                            <div v-if="header.value == 'calories'"  :class="(biometric.bmr>listobjects_sum(meals,'calories')) ? 'boldgreen':'boldred'" align="right" v-html="my_round(biometric.bmr,0)"></div>
                            <div v-if="header.value == 'fat'" :class="(biometric.recommended_fat>listobjects_sum(meals,'fat')) ? 'boldgreen':'boldred'" align="right" v-html="my_round(biometric.recommended_fat,0)"></div>
                            <div v-if="header.value == 'protein'"  :class="(biometric.recommended_protein>listobjects_sum(meals,'protein')) ? 'boldgreen':'boldred'" align="right" v-html="my_round(biometric.recommended_protein,0)"></div>
                            <div v-if="header.value == 'carbohydrate'" :class="(biometric.recommended_carbohydrate>listobjects_sum(meals,'carbohydrate')) ? 'boldgreen':'boldred'" align="right" v-html="my_round(biometric.recommended_carbohydrate,0)"></div>
                            <div v-if="header.value == 'fiber'"  :class="(biometric.recommended_fiber<listobjects_sum(meals,'fiber')) ? 'boldgreen':'boldred'" align="right" v-html="my_round(biometric.recommended_fiber,0)"></div>
                            <div v-if="header.value == 'sugars'" :class="(biometric.recommended_sugars>listobjects_sum(meals,'sugars')) ? 'boldgreen':'boldred'" align="right" v-html="my_round(biometric.recommended_sugars,0)"></div>
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
    import MyDatePicker from './reusing/MyDatePicker.vue'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import MealsCRUD from './MealsCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            MealsCRUD,
            MyDatePicker,
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
                biometric: null,
                meals_headers: [
                    { text: this.$t('Time'), sortable: true, value: 'datetime'},
                    { text: this.$t('Product'), sortable: true, value: 'products',width:"30%"},
                    { text: this.$t('Amount (g)'), sortable: true, value: 'amount',align:'right'},
                    { text: this.$t('Calories (kcal)'), sortable: true, value: 'calories',align:'right'},
                    { text: this.$t('Fat (g)'), sortable: true, value: 'fat',align:'right'},
                    { text: this.$t('Protein (g)'), sortable: true, value: 'protein',align:'right'},
                    { text: this.$t('Carbohydrate (g)'), sortable: true, value: 'carbohydrate',align:'right'},
                    { text: this.$t('Salt (g)'), sortable: true, value: 'salt',align:'right'},
                    { text: this.$t('Fiber (g)'), sortable: true, value: 'fiber',align:'right'},
                    { text: this.$t('Sugars (g)'), sortable: true, value: 'sugars',align:'right'},
                    { text: this.$t('Saturated fat (g)'), sortable: true, value: 'saturated_fat',align:'right'},
                    { text: this.$t('Cholesterol (g)'), sortable: true, value: 'cholesterol',align:'right'},
                    { text: this.$t('Sodium (mg)'), sortable: true, value: 'sodium',align:'right'},
                    { text: this.$t('Potassium (mg)'), sortable: true, value: 'potassium',align:'right'},
                    { text: this.$t('Ferrum (mg)'), sortable: true, value: 'ferrum',align:'right'},
                    { text: this.$t('Magnesium (mg)'), sortable: true, value: 'magnesium',align:'right'},
                    { text: this.$t('Phosphor (mg)'), sortable: true, value: 'phosphor',align:'right'},
                    { text: this.$t('Calcium (mg)'), sortable: true, value: 'calcium',align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false,width:"6%"},

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
                this.update_all()
            },
            update_all(){
                this.loading=true
                axios.all([
                    axios.get(`${this.$store.state.apiroot}/api/biometrics/?day=${this.day}`, this.myheaders()),
                    axios.get(`${this.$store.state.apiroot}/api/meals/?day=${this.day}`, this.myheaders())
                ])
                .then(([resBiometric,resMeals]) => {
                    this.meals=resMeals.data
                    this.biometric=resBiometric.data[0]
                    this.loading=false
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
                this.update_all()
            },
            on_icon_glutenfree(){
                alert(this.$t("This meal is gluten free"))
            },
        },
        created(){
            this.update_all()
        }
    }
</script>