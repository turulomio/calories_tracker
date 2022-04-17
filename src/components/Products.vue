<template>
    <div class="ma-4">
        <h1>{{ $t(`Products`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
          <v-text-field class="ml-10 mr-6" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')"></v-text-field>
    
        <v-tabs  background-color="primary" dark v-model="tab" >
            <v-tab key="products">{{ $t('Products') }}</v-tab>
            <v-tab key="system_products">{{ $t('System products') }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="ma-5">
            <v-tab-item key="products" >
                <v-data-table dense :headers="products_headers"  :search="search" :items="$store.state.products" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
                    <template v-slot:[`item.version`]="{ item }">
                        {{localtime(item.version)}}
                    </template>       
                    <template v-slot:[`item.companies`]="{ item }">
                        <div v-html="$store.getters.getObjectPropertyByUrl('companies',item.companies,'name')"></div>
                    </template>   
                    <template v-slot:[`item.elaborated_products`]="{ item }">
                        <v-icon small v-if="item.elaborated_products" >mdi-check-outline</v-icon>
                    </template>  
                    <template v-slot:[`item.system_products`]="{ item }">
                        <v-icon small v-if="item.system_products" >mdi-check-outline</v-icon>
                    </template>               
                    <template v-slot:[`item.obsolete`]="{ item }">
                            <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon v-if="item.is_editable" small class="mr-2" @click="editCompany(item)">mdi-pencil</v-icon>
                        <v-icon v-if="item.is_deletable" small @click="deleteCompany(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
            <v-tab-item key="system_products" >                 
                <v-data-table dense :headers="system_products_headers"  :search="search" :items="system_products" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
                    <template v-slot:[`item.version`]="{ item }">
                        {{localtime(item.version)}}
                    </template>   
                    <template v-slot:[`item.obsolete`]="{ item }">
                            <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small @click="linkProduct(item)">mdi-link-variant</v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
        </v-tabs-items>




        <!-- DIALOG PRODUCTS CRUD -->
        <v-dialog v-model="dialog_products_crud" width="45%" persistent>
            <v-card class="pa-4">
                <ProductsCRUD :product="product" :deleting="product_deleting" :key="'B'+key" @cruded="on_ProductsCRUD_cruded()"></ProductsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_products } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import ProductsCRUD from './ProductsCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            ProductsCRUD,
        },
        data(){
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Product options"),
                        children: [
                            {
                                name: this.$t("Add product"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.product_deleting=false
                                    this_.product=this_.empty_products()
                                    this_.key=this_.key+1
                                    this_.dialog_products_crud=true
                                },
                            },
                        ]
                    },
                ],
                products:[],
                products_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'fullname'},
                    { text: this.$t('Elaborated products'), value: 'elaborated_products'},
                    { text: this.$t('System products'), value: 'system_products'},
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
                    { text: this.$t('Uses'), value: 'uses'},
                    { text: this.$t('Obsolete'), value: 'obsolete'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false},
                ],
                system_products:[],
                system_products_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('System company'), sortable: true, value: 'system_company_name'},           
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
                    { text: this.$t('Version'), value: 'version', align:'right'},
                    { text: this.$t('Obsolete'), value: 'obsolete'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false},
                ],
                loading:false,
                key:0,
                tab:0,
                search:"",

                //CRUD COMPANY
                product:null,
                product_deleting:null,
                dialog_products_crud:false,

                //DIALOG FORMATS
                dialog_formats:false,
            }
        },        
        methods:{
            empty_products,
            on_ProductsCRUD_cruded(){
                this.dialog_products_crud=false
                this.$store.dispatch("getProducts")
            },
            linkProduct(item){
                this.loading=true
                axios.post(`${this.$store.state.apiroot}/system_products_to_products/`, {system_products: item.url}, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.$store.dispatch("getProducts")
                    this.update_system_products()
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

            },
            update_system_products(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/system_products/`, this.myheaders())
                .then((response) => {
                    this.system_products=response.data
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

            },
            editCompany(item){
                this.product=item
                this.product_deleting=false
                this.key=this.key+1

                this.dialog_products_crud=true
            },
            deleteCompany(item){
                this.product=item
                this.product_deleting=true
                this.key=this.key+1

                this.dialog_products_crud=true
            },
        },
        created(){
            this.update_system_products()
        }
    }
</script>