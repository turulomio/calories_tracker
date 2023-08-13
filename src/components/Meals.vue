<template>
    <div class="ma-4">
        <h1>{{ $t(`Meals`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>

            <v-card width="20%" class="pa-5 mx-auto" outlined>
                <MyDatePicker density="compact" :label="$t('Select a date')" v-model="day" hidenullicon @input="on_day_input()"></MyDatePicker>
            </v-card>


            <v-data-table density="compact" class="mt-4 elevation-1" :headers="meals_headers" :items="meals" sort-by="name" hide-default-footer disable-pagination :loading="loading" :key="'T'+key">
                <template v-slot:[`item.datetime`]="{ item }">
                    {{localtime(item.datetime).slice(10)}}
                </template>          
                <template v-slot:[`item.products`]="{ item }"><div v-html="products_html_fullname(item.products,4)" @click="on_product_click(item)"></div></template>                       
                <template v-slot:[`item.amount`]="{ item }"><div v-html="my_round(item.amount,0)"></div></template>                  
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
                    <v-icon small class="mr-1" @click="copyMeal(item)">mdi-content-copy</v-icon>
                    <v-icon small class="mr-1" @click="editMeal(item)">mdi-pencil</v-icon>
                    <v-icon small class="mr-1" @click="deleteMeal(item)">mdi-delete</v-icon>
                </template>            
                <template v-slot:[`body.append`]="{headers}" v-if="meals.length>0">
                    <tr style="background-color: WhiteSmoke">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'products'">{{ $t(`Total ({0} meals):`).format(meals.length)}}</div>
                            <div v-if="header.value == 'amount'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'amount'),0)"></div>
                            <div v-if="header.value == 'calories'" :class="(biometric.bmr>listobjects_sum(meals,'calories')) ? 'boldgreen d-flex justify-end':'boldred d-flex justify-end'" v-html="my_round(listobjects_sum(meals,'calories'),0)"></div>
                            <div v-if="header.value == 'fat'" :class="(biometric.recommended_fat>listobjects_sum(meals,'fat')) ? 'boldgreen d-flex justify-end':'boldred d-flex justify-end'" v-html="my_round(listobjects_sum(meals,'fat'),0)"></div>
                            <div v-if="header.value == 'protein'" :class="(biometric.recommended_protein>listobjects_sum(meals,'protein')) ? 'boldgreen d-flex justify-end':'boldred d-flex justify-end'" v-html="my_round(listobjects_sum(meals,'protein'),0)"></div>
                            <div v-if="header.value == 'carbohydrate'" :class="(biometric.recommended_carbohydrate>listobjects_sum(meals,'carbohydrate')) ? 'boldgreen d-flex justify-end':'boldred d-flex justify-end'" v-html="my_round(listobjects_sum(meals,'carbohydrate'),0)"></div>
                            <div v-if="header.value == 'fiber'" :class="(biometric.recommended_fiber<listobjects_sum(meals,'fiber')) ? 'boldgreen d-flex justify-end':'boldred d-flex justify-end'" v-html="my_round(listobjects_sum(meals,'fiber'),0)"></div>
                            <div v-if="header.value == 'salt'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'salt'),0)"></div>
                            <div v-if="header.value == 'cholesterol'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'cholesterol'),0)"></div>
                            <div v-if="header.value == 'sodium'" :class="(biometric.recommended_sodium>total_sodium()) ? 'boldgreen d-flex justify-end':'boldred d-flex justify-end'"  v-html="total_sodium()"></div>
                            <div v-if="header.value == 'potassium'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'potassium'),0)"></div>
                            <div v-if="header.value == 'ferrum'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'ferrum'),0)"></div>
                            <div v-if="header.value == 'magnesium'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'magnesium'),0)"></div>
                            <div v-if="header.value == 'phosphor'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'phosphor'),0)"></div>
                            <div v-if="header.value == 'calcium'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'calcium'),0)"></div>
                            <div v-if="header.value == 'sugars'" :class="(biometric.recommended_sugars>listobjects_sum(meals,'sugars')) ? 'boldgreen d-flex justify-end':'boldred d-flex justify-end'" v-html="my_round(listobjects_sum(meals,'sugars'),0)"></div>
                            <div v-if="header.value == 'saturated_fat'" class="d-flex justify-end" v-html="my_round(listobjects_sum(meals,'saturated_fat'),0)"></div>
                        </td>
                    </tr>
                    <tr class="bold" style="background-color: WhiteSmoke" v-if="biometric">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'products'">{{ $t(`Recomendation for {0} kg and {1} cm`).format(biometric.weight,biometric.height)}}</div>
                            <div v-if="header.value == 'calories'" class="d-flex justify-end" v-html="my_round(biometric.bmr,0)"></div>
                            <div v-if="header.value == 'fat'" class="d-flex justify-end" v-html="my_round(biometric.recommended_fat,0)"></div>
                            <div v-if="header.value == 'protein'" class="d-flex justify-end" v-html="my_round(biometric.recommended_protein,0)"></div>
                            <div v-if="header.value == 'carbohydrate'" class="d-flex justify-end" v-html="my_round(biometric.recommended_carbohydrate,0)"></div>
                            <div v-if="header.value == 'fiber'" class="d-flex justify-end" v-html="my_round(biometric.recommended_fiber,0)"></div>
                            <div v-if="header.value == 'sugars'" class="d-flex justify-end" v-html="my_round(biometric.recommended_sugars,0)"></div>
                            <div v-if="header.value == 'sodium'" class="d-flex justify-end" v-html="my_round(biometric.recommended_sodium,0)"></div>
                            <div v-if="header.value == 'salt'" class="d-flex justify-end" @click="on_icon_salt_info()" ><v-icon small >mdi-information-outline</v-icon></div>

                        </td>
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
                                code: function(this_){
                                    this_.meals_crud_mode="C"
                                    this_.meal=this_.empty_meals()
                                    this_.key=this_.key+1
                                    this_.meals_crud_dialog=true
                                },
                            },
                            {
                                name: this.$t("Delete selected day meals"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    var r = confirm(this_.$t("Do you want to delete selected day meals?"))
                                    if(r == true) {
                                        let day_meals=[]
                                        this_.meals.forEach(element => {
                                            day_meals.push(element.url)
                                        })

                                        axios.post(`${this_.store().apiroot}/api/meals/delete_several/`, {meals:day_meals},  this_.myheaders())
                                        .then(() => {
                                            this_.update_all()
                                        }, (error) => {
                                            this_.parseResponseError(error)
                                        })
                                    }
                                
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
        methods:{
            empty_meals,
            on_MealsCRUD_cruded(){
                this.meals_crud_dialog=false
                this.update_all()
            },
            update_all(){
                this.loading=true
                axios.all([
                    axios.get(`${this.store().apiroot}/api/biometrics/?day=${this.day}`, this.myheaders()),
                    axios.get(`${this.store().apiroot}/api/meals/?day=${this.day}`, this.myheaders())
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
            on_day_input(){
                this.update_all()
            },
            on_icon_glutenfree(){
                alert(this.$t("This meal is gluten free"))
            },
            on_icon_salt_info(){
                var salt=this.listobjects_sum(this.meals,"salt")
                var salt_as_sodium=salt*396
                var sodium=this.listobjects_sum(this.meals,'sodium')
                var total=sodium+salt_as_sodium



                alert(this.$t(`Salt is converted to sodium to calculate recommended daily amount.
    - Salt amount: {0} g => {1} sodium mg
    - Sodium amount: {2} mg
    - Total sodium: {3} mg
                `).format(this.my_round(salt,2) , this.my_round(salt_as_sodium,0), sodium, this.my_round(total,0)))
            },
            total_sodium(){
                var sum_sodium=this.listobjects_sum(this.meals,'sodium')
                var salt=this.listobjects_sum(this.meals,"salt")
                return  this.my_round(sum_sodium+salt*396,0)
            },
            on_product_click(item){
                var product=this.store().getters.getObjectByUrl("products",item.products)
                this.key=this.key+1
                if (product.elaborated_products!=null){ //ELABORATED PRODUCT
                    this.elaborated_product_crud_mode="R"
                    this.elaborated_product=this.store().getters.getObjectByUrl("elaborated_products",product.elaborated_products)
                    this.elaborated_product_crud_dialog=true
                } else { // SYSTEM PRODUCTS AND PRODUCTS
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
        },
        created(){
            this.update_all()
        }
    }
</script>