<template>
    <div class="ma-4">
        <h1>{{ $t('Meals') }}
            <MyMenuInline data-test="Meals_MyMenuInline" :items="menuinline_items"></MyMenuInline>
        </h1>

            <div class="d-flex flex-row mx-auto pa-4" width="40%" style="justify-content: center; align-items: center;">  
                <v-btn data-test="Meals_BtnDayBefore" color="secondary" @click="on_day_before" ><</v-btn>
                <MyDatePicker class="mr-6 ml-6" :label="$t('Select a date')" v-model="day" hidenullicon />
                <v-btn data-test="Meals_BtnDayAfter" color="secondary" @click="on_day_after" >></v-btn>
            </div>


            <v-data-table density="compact" class="mt-4 elevation-1" :headers="meals_headers" :items="meals" :sort-by="[{key:'name',order:'asc'}]"  :items-per-page="10000" :loading="loading" :key="'T'+key">
                <template #item.datetime="{item}">
                    {{localtime(item.datetime).slice(10)}}
                </template>          
                <template #item.products="{item}"><div v-html="products_html_fullname(item.products,4)" @click="on_product_click(item)"></div></template>                       
                <template #item.amount="{item}"><div v-html="my_round(item.amount,0)"></div></template>                  
                <template #item.calories="{item}"><div v-html="my_round(item.calories,0)"></div></template>  
                <template #item.fat="{item}"><div v-html="my_round(item.fat,0)"></div></template>  
                <template #item.protein="{item}"><div v-html="my_round(item.protein,0)"></div></template>  
                <template #item.carbohydrate="{item}"><div v-html="my_round(item.carbohydrate,0)"></div></template>  
                <template #item.salt="{item}"><div v-html="my_round(item.salt,0)"></div></template>  
                <template #item.fiber="{item}"><div v-html="my_round(item.fiber,0)"></div></template>  
                <template #item.sugars="{item}"><div v-html="my_round(item.sugars,0)"></div></template>  
                <template #item.saturated_fat="{item}"><div v-html="my_round(item.saturated_fat,0)"></div></template>  
                <template #item.cholesterol="{item}"><div v-html="my_round(item.cholesterol,0)"></div></template>  
                <template #item.sodium="{item}"><div v-html="my_round(item.sodium,0)"></div></template>  
                <template #item.potassium="{item}"><div v-html="my_round(item.potassium,0)"></div></template>  
                <template #item.ferrum="{item}"><div v-html="my_round(item.ferrum,0)"></div></template>  
                <template #item.magnesium="{item}"><div v-html="my_round(item.magnesium,0)"></div></template>  
                <template #item.phosphor="{item}"><div v-html="my_round(item.phosphor,0)"></div></template>  
                <template #item.calcium="{item}"><div v-html="my_round(item.calcium,0)"></div></template>  
                <template #item.actions="{item}">
                    <v-icon :data-test="`Meals_Table_IconCopy${item.id}`" small class="mr-1" @click="copyMeal(item)">mdi-content-copy</v-icon>
                    <v-icon :data-test="`Meals_Table_IconEdit${item.id}`" small class="mr-1" @click="editMeal(item)">mdi-pencil</v-icon>
                    <v-icon :data-test="`Meals_Table_IconDelete${item.id}`" small class="mr-1" @click="deleteMeal(item)">mdi-delete</v-icon>
                </template>       
                <template #bottom ></template>        
                <template #tbody>
                    <tr class="totalrow" v-if="biometric">
                        <td colspan="2">{{ $t(`Total ([0] meals):`).format(meals.length) }} </td>
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'amount'),0)"></td>
                        <td :class="(biometric.bmr>listobjects_sum(meals,'calories')) ? 'boldgreen text-right':'boldred text-right'" v-html="my_round(listobjects_sum(meals,'calories'),0)"></td>
                        <td :class="(biometric.recommended_fat>listobjects_sum(meals,'fat')) ? 'boldgreen text-right':'boldred text-right'" v-html="my_round(listobjects_sum(meals,'fat'),0)"></td>
                        <td :class="(biometric.recommended_protein>listobjects_sum(meals,'protein')) ? 'boldgreen text-right':'boldred text-right'" v-html="my_round(listobjects_sum(meals,'protein'),0)"></td>
                        <td :class="(biometric.recommended_carbohydrate>listobjects_sum(meals,'carbohydrate')) ? 'boldgreen text-right':'boldred text-right'" v-html="my_round(listobjects_sum(meals,'carbohydrate'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'salt'),0)"></td>
                        <td :class="(biometric.recommended_fiber<listobjects_sum(meals,'fiber')) ? 'boldgreen text-right':'boldred text-right'" v-html="my_round(listobjects_sum(meals,'fiber'),0)"></td>
                        <td :class="(biometric.recommended_sugars>listobjects_sum(meals,'sugars')) ? 'boldgreen text-right':'boldred text-right'" v-html="my_round(listobjects_sum(meals,'sugars'),0)"></td>               
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'saturated_fat'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'cholesterol'),0)"></td>
                        <td :class="(biometric.recommended_sodium>total_sodium()) ? 'boldgreen text-right':'boldred text-right'"  v-html="total_sodium()"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'potassium'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'ferrum'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'magnesium'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'phosphor'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(meals,'calcium'),0)"></td>   
                        <td></td>      
                    </tr>
                    <tr class="totalrow" v-if="biometric">
                        <td colspan="3">{{ $t(`Recomendation for [0] kg and [1] cm`).format(biometric.weight,biometric.height)}}</td>
                        <td  class="text-right" v-html="my_round(biometric.bmr,0)"></td>
                        <td class="text-right" v-html="my_round(biometric.recommended_fat,0)"></td>
                        <td class="text-right" v-html="my_round(biometric.recommended_protein,0)"></td>
                        <td class="text-right" v-html="my_round(biometric.recommended_carbohydrate,0)"></td>
                        <td class="text-right" @click="on_icon_salt_info()" ><v-icon size="small" icon="mdi-information-outline" /></td>  
                        <td class="text-right" v-html="my_round(biometric.recommended_fiber,0)"></td>
                        <td class="text-right" v-html="my_round(biometric.recommended_sugars,0)"></td>
                        <td></td>
                        <td></td>
                        <td class="text-right" v-html="my_round(biometric.recommended_sodium,0)"></td>    
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>             
                    </tr>
                </template>
            </v-data-table>
        <!-- DIALOG MEALS CRUD -->
        <v-dialog v-model="meals_crud_dialog" width="45%">
            <v-card class="pa-4">
                <MealsCRUD :meal="meal" :mode="meals_crud_mode" :key="'B'+key" @cruded="on_MealsCRUD_cruded()"></MealsCRUD>
            </v-card>
        </v-dialog>
        <!-- DIALOG ELABORATED PRODUCT CRUD -->
        <v-dialog v-model="elaborated_product_crud_dialog" width="45%">
            <v-card class="pa-4">
                <ElaboratedProductsCRUD :ep="elaborated_product" :mode="elaborated_product_crud_mode" :key="'B'+key" @cruded="on_ElaboratedProductsCRUD_cruded()"></ElaboratedProductsCRUD>
            </v-card>
        </v-dialog>
        <!-- DIALOG PRODUCT CRUD -->
        <v-dialog v-model="product_crud_dialog" width="45%">
            <v-card class="pa-4">
                <ProductsCRUD :product="product" :mode="product_crud_mode" :key="'B'+key" @cruded="on_ProductsCRUD_cruded()"></ProductsCRUD>
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
    import ElaboratedProductsCRUD from './ElaboratedProductsCRUD.vue'
    import ProductsCRUD from './ProductsCRUD.vue'
    import {my_round,localtime} from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        components: {
            MyMenuInline,
            MealsCRUD,
            MyDatePicker,
            ElaboratedProductsCRUD,
            ProductsCRUD,
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
                                code: function(){
                                    this.meals_crud_mode="C"
                                    this.meal=this.empty_meals()
                                    this.key=this.key+1
                                    this.meals_crud_dialog=true
                                }.bind(this),
                            },
                            {
                                name: this.$t("Delete selected day meals"),
                                icon: "mdi-plus",
                                code: function(){
                                    var r = confirm(this.$t("Do you want to delete selected day meals?"))
                                    if(r == true) {
                                        let day_meals=[]
                                        this.meals.forEach(element => {
                                            day_meals.push(element.url)
                                        })

                                        axios.post(`${this.useStore().apiroot}/api/meals/delete_several/`, {meals:day_meals},  this.myheaders())
                                        .then(() => {
                                            this.update_all()
                                        }, (error) => {
                                            this.parseResponseError(error)
                                        })
                                    }
                                
                                }.bind(this),
                            },
                        ]
                    },
                ],
                meals:[],
                biometric: null,
                meals_headers: [
                    { title: this.$t('Time'), sortable: true, key: 'datetime'},
                    { title: this.$t('Product'), sortable: true, key: 'products',width:"30%"},
                    { title: this.$t('Amount (g)'), sortable: true, key: 'amount',align:'end'},
                    { title: this.$t('Calories (kcal)'), sortable: true, key: 'calories',align:'end'},
                    { title: this.$t('Fat (g)'), sortable: true, key: 'fat',align:'end'},
                    { title: this.$t('Protein (g)'), sortable: true, key: 'protein',align:'end'},
                    { title: this.$t('Carbohydrate (g)'), sortable: true, key: 'carbohydrate',align:'end'},
                    { title: this.$t('Salt (g)'), sortable: true, key: 'salt',align:'end'},
                    { title: this.$t('Fiber (g)'), sortable: true, key: 'fiber',align:'end'},
                    { title: this.$t('Sugars (g)'), sortable: true, key: 'sugars',align:'end'},
                    { title: this.$t('Saturated fat (g)'), sortable: true, key: 'saturated_fat',align:'end'},
                    { title: this.$t('Cholesterol (g)'), sortable: true, key: 'cholesterol',align:'end'},
                    { title: this.$t('Sodium (mg)'), sortable: true, key: 'sodium',align:'end'},
                    { title: this.$t('Potassium (mg)'), sortable: true, key: 'potassium',align:'end'},
                    { title: this.$t('Ferrum (mg)'), sortable: true, key: 'ferrum',align:'end'},
                    { title: this.$t('Magnesium (mg)'), sortable: true, key: 'magnesium',align:'end'},
                    { title: this.$t('Phosphor (mg)'), sortable: true, key: 'phosphor',align:'end'},
                    { title: this.$t('Calcium (mg)'), sortable: true, key: 'calcium',align:'end'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false,width:"6%"},

                ],
                loading:false,
                key:0,
                tab:0,
                day:new Date().toISOString().substring(0, 10),
                //MEAL CRUD 
                meal:null,
                meals_crud_mode:null,
                meals_crud_dialog:false,

                //ELABORATED PRODUCT CRUD
                elaborated_product: null,
                elaborated_product_crud_mode:null,
                elaborated_product_crud_dialog:false,
                //PRODUCT CRUD
                product: null,
                product_crud_mode:null,
                product_crud_dialog:false,
            }
        },    
        watch:{
            day(){
                this.update_all()
            }
        }, 
        methods:{
            empty_meals,
            my_round,
            localtime,
        useStore,
            on_MealsCRUD_cruded(){
                this.meals_crud_dialog=false
                this.update_all()
            },
            update_all(){
                this.loading=true
                axios.all([
                    axios.get(`${this.useStore().apiroot}/api/biometrics/?day=${this.day}`, this.myheaders()),
                    axios.get(`${this.useStore().apiroot}/api/meals/?day=${this.day}`, this.myheaders())
                ])
                .then(([resBiometric,resMeals]) => {
                    this.meals=resMeals.data
                    this.biometric=resBiometric.data[0]
                    this.loading=false
                });
            },
            copyMeal(item){
                this.meals_crud_mode="C"
                this.meal=this.empty_meals()
                this.meal.products=item.products
                this.meal.amount=item.amount
                this.key=this.key+1
                this.meals_crud_dialog=true
            },
            editMeal(item){
                this.meal=item
                this.meals_crud_mode="U"
                this.key=this.key+1
                this.meals_crud_dialog=true
            },
            deleteMeal(item){
                this.meal=item
                this.meals_crud_mode="D"
                this.key=this.key+1
                this.meals_crud_dialog=true
            },
            on_icon_salt_info(){
                var salt=this.listobjects_sum(this.meals,"salt")
                var salt_as_sodium=salt*396
                var sodium=this.listobjects_sum(this.meals,'sodium')
                var total=sodium+salt_as_sodium



                alert(this.$t(`Salt is converted to sodium to calculate recommended daily amount.
    - Salt amount: [0] g => [1] sodium mg
    - Sodium amount: [2] mg
    - Total sodium: [3] mg
                `).format(this.my_round(salt,2) , this.my_round(salt_as_sodium,0), sodium, this.my_round(total,0)))
            },
            total_sodium(){
                var sum_sodium=this.listobjects_sum(this.meals,'sodium')
                var salt=this.listobjects_sum(this.meals,"salt")
                return  this.my_round(sum_sodium+salt*396,0)
            },
            on_product_click(item){
                var product=this.useStore().products.get(item.products)
                this.key=this.key+1
                if (product.elaborated_products!=null){ //ELABORATED PRODUCT
                    this.elaborated_product_crud_mode="R"
                    this.elaborated_product=this.useStore().elaborated_product.get(product.elaborated_products)
                    this.elaborated_product_crud_dialog=true
                } else { // AND PRODUCTS
                    this.product_crud_mode="R"
                    this.product=product
                    this.product_crud_dialog=true
                } 
            },
            on_ElaboratedProductsCRUD_cruded(){
                this.elaborated_product_crud_dialog=false
                this.update_all()
            },
            on_ProductsCRUD_cruded(){
                this.product_crud_dialog=false
                this.update_all()
            },
            on_day_after(){
                let date = new Date(this.day);
                date.setDate(date.getDate() + 1);
                this.day= date.toISOString().slice(0, 10); 
            },
            on_day_before(){
                let date = new Date(this.day);
                date.setDate(date.getDate() - 1);
                this.day= date.toISOString().slice(0, 10); 
            },
        },
        created(){
            this.update_all()
        }
    }
</script>