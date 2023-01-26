<template>
    <div class="ma-4">
        <h1>{{ $t(`Products`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
          <v-text-field class="ml-10 mr-10 mb-5" :disabled="loading" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')" v-on:keyup.enter="on_search_change()"></v-text-field>
    
        <v-tabs  background-color="primary" dark v-model="tab" >
            <v-tab key="products"><v-icon left>mdi-apple</v-icon>{{ $t('Products') }}<v-badge v-if="products.length>0" color="error" class="ml-2" :content="products.length"/></v-tab>
            <v-tab key="elaborated_products"><v-icon left>mdi-food-takeout-box</v-icon>{{ $t('Elaborated products') }}<v-badge v-if="elaborated_products.length>0" color="error" class="ml-2" :content="elaborated_products.length"/></v-tab>
            <v-tab key="system_products"><v-icon left>mdi-database</v-icon>{{ $t('System products') }}<v-badge v-if="system_products.length>0" color="error" class="ml-2" :content="system_products.length"/></v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="ma-5">
            <v-tab-item key="products" >
                <v-data-table dense :headers="products_headers" :items="products" sort-by="fullname" class="elevation-1 cursorpointer" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500" @click:row="viewProduct">
                    <template v-slot:[`item.fullname`]="{ item }"><div v-html="products_html_fullname(item,2)"></div></template>
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
                        <v-icon v-if="item.system_products==null && item.elaborated_products==null" small class="mr-1" @click="convertToSystemProduct(item)">mdi-database-arrow-right</v-icon>
                        <v-icon v-if="item.is_editable" small class="mr-1" @click="editProduct(item)">mdi-pencil</v-icon>
                        <v-icon v-if="item.is_deletable" small @click="deleteProduct(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
            <v-tab-item key="elaborated_products">
                <v-data-table dense :headers="elaborated_products_headers" :items="elaborated_products" sort-by="name" class="elevation-1 cursorpointer" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500" @click:row="viewElaboratedProduct">
                    <template v-slot:[`item.fullname`]="{ item }"><div v-html="products_html_fullname(item,3)"></div></template>
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
                        <v-icon small class="mr-1" @click="editElaboratedProduct(item)">mdi-pencil</v-icon>
                        <v-icon small v-if="is_product_elaborated_deletable(item)" @click="deleteElaboratedProduct(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
            <v-tab-item key="system_products" >                 
                <v-data-table dense :headers="system_products_headers" :items="system_products" sort-by="fullname" class="elevation-1 cursorpointer" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500" @click:row="viewSystemProduct">
                    <template v-slot:[`item.fullname`]="{ item }"><div v-html="products_html_fullname(item,1)"></div></template>
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
                        <v-icon small class="mr-1" @click="linkProduct(item)">mdi-link-variant</v-icon>   
                        <v-icon class="mr-1" small @click="editSystemProduct(item)"  color="#AA0000" v-if="$store.state.catalog_manager">mdi-pencil</v-icon>
                        <v-icon small @click="deleteSystemProduct(item)" color="#AA0000" v-if="$store.state.catalog_manager">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
        </v-tabs-items>



        <!-- DIALOG ELABORATED PRODUCTS CRUD -->
        <v-dialog v-model="dialog_elaborated_products_crud" width="45%" persistent>
            <v-card class="pa-4">
                <ElaboratedProductsCRUD  :ep="elaborated_product" :mode="elaborated_product_mode" :key="'B'+key" @cruded="on_ElaboratedProductsCRUD_cruded()"></ElaboratedProductsCRUD>
            </v-card>
        </v-dialog>

        <!-- DIALOG PRODUCTS CRUD -->
        <v-dialog v-model="dialog_products_crud" width="45%" persistent>
            <v-card class="pa-4">
                <ProductsCRUD :product="product" :mode="product_cu_mode" :key="'B'+key" @cruded="on_ProductsCRUD_cruded()"></ProductsCRUD>
            </v-card>
        </v-dialog>
        <!-- DIALOG SYSTEM PRODUCTS CRUD -->
        <v-dialog v-model="dialog_system_products_crud" width="45%" persistent>
            <v-card class="pa-4">
                <SystemProductsCRUD :system_product="system_product" :mode="system_product_cu_mode" :key="'B'+key" @cruded="on_SystemProductsCRUD_cruded()"></SystemProductsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_products,empty_elaborated_products,empty_system_products } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import ProductsCRUD from './ProductsCRUD.vue'
    import SystemProductsCRUD from './SystemProductsCRUD.vue'
    import ElaboratedProductsCRUD from './ElaboratedProductsCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            ProductsCRUD,
            SystemProductsCRUD,
            ElaboratedProductsCRUD,
        },
        data(){
            return {
                products:[],
                products_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'fullname',width:"30%"},    
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
                    { text: this.$t('Actions'), value: 'actions', sortable: false},
                ],
                system_products:[],
                system_products_headers: [ 
                    { text: this.$t('Name'), sortable: true, value: 'name',width:"30%"},          
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
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width: "7%"},
                ],

                elaborated_products:[],
                elaborated_products_headers: [   
                    { text: this.$t('Name'), sortable: true, value: 'fullname',width:"30%"},
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
                    { text: this.$t('Actions'), value: 'actions', sortable: false},
                ],

                //CRUD ELABORATED PRODUCTS
                elaborated_product:null,
                elaborated_product_mode:null,
                dialog_elaborated_products_crud:false,

                loading:false,
                key:0,
                tab:0,
                search: "",

                //CRUD PRODUCT
                product:null,
                product_cu_mode:null,
                dialog_products_crud:false,

                //DIALOG FORMATS
                dialog_formats:false,

                //CRUD SYSTEM PRODUCT
                system_product:null,
                system_product_cu_mode:null,
                dialog_system_products_crud:false,
            }
        },     
        methods:{
            empty_products,
            empty_system_products,
            empty_elaborated_products,

            menuinline_items(){
                let r= [
                    {
                        subheader: this.$t("Product options"),
                        children: [
                            {
                                name: this.$t("Add product"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.product_cu_mode="C"
                                    this_.product=this_.empty_products()
                                    this_.key=this_.key+1
                                    this_.dialog_products_crud=true
                                },
                            },
                        ]
                    },
                    {
                        subheader: this.$t("ElaboratedProduct options"),
                        children: [
                            {
                                name: this.$t("Add a elaborated product"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.elaborated_product_mode='C'
                                    this_.elaborated_product=this_.empty_elaborated_products()
                                    this_.key=this_.key+1
                                    this_.dialog_elaborated_products_crud=true
                                },
                            },
                        ]
                    },
                ]
                if (this.$store.state.catalog_manager){
                    r.push({
                        subheader: this.$t("System product options"),
                        children: [
                            {
                                name: this.$t("Add system product"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.system_product_cu_mode="C"
                                    this_.system_product=this_.empty_system_products()
                                    this_.key=this_.key+1
                                    this_.dialog_system_products_crud=true
                                },
                            },
                        ]
                    })
                }
                return r
            },
            on_ProductsCRUD_cruded(){
                this.dialog_products_crud=false
                this.update_all(true)
            },
            on_SystemProductsCRUD_cruded(){
                this.dialog_system_products_crud=false
                this.update_all(true)
            },
            on_ElaboratedProductsCRUD_cruded(){
                this.dialog_elaborated_products_crud=false
                this.update_all(true)
            },
            linkProduct(item){
                axios.post(`${item.url}create_product/`, {}, this.myheaders())
                .then(() => {
                    this.update_all(true)
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            editProduct(item){
                this.product=item
                this.product_cu_mode="U"
                this.key=this.key+1

                this.dialog_products_crud=true
            },
            deleteProduct(item){
                this.product=item

                if (this.product.elaborated_products){
                    alert(this.$t("This is an elaborated products. Please remove from elaborated products tab"))
                    return
                }
                this.product_cu_mode="D"
                this.key=this.key+1

                this.dialog_products_crud=true
            },
            viewProduct(item){
                console.log(item)
                this.product=item
                this.product_cu_mode="R"
                this.key=this.key+1

                this.dialog_products_crud=true
            },
            editSystemProduct(item){
                this.system_product=item
                this.system_product_cu_mode="U"
                this.key=this.key+1
                this.dialog_system_products_crud=true
            },
            deleteSystemProduct(){
                alert(this.$t("System products never should be deleted. You can set obsolete or rename to REUSABLE when needed."))
            },

            viewSystemProduct(item){
                this.system_product=item
                this.system_product_cu_mode="R"
                this.key=this.key+1
                this.dialog_system_products_crud=true
            },
            convertToSystemProduct(item){

                axios.post(`${this.$store.state.apiroot}/products_to_system_products/`, {product: item.url}, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.update_all(true)
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            editElaboratedProduct(item){
                this.elaborated_product=item
                this.elaborated_product_mode='U'
                this.key=this.key+1
                this.dialog_elaborated_products_crud=true
            },
            deleteElaboratedProduct(item){
                this.elaborated_product=item
                this.elaborated_product_mode='D'
                this.key=this.key+1
                this.dialog_elaborated_products_crud=true
            },
            viewElaboratedProduct(item){
                this.elaborated_product=item
                this.elaborated_product_mode='R'
                this.key=this.key+1
                this.dialog_elaborated_products_crud=true
            },
            on_icon_glutenfree(){
                alert(this.$t("This product is gluten free"))
            },
            on_icon_elaborated_product(){
                alert(this.$t("This is an elaborated product"))
            },
            on_icon_system_product(){
                alert(this.$t("This is a system product"))
            },
            on_search_change(){
                //Pressing enter
                this.update_all(true)
            },
            update_products(with_dispatch){
                if (with_dispatch){
                    return this.$store.dispatch("getProducts")
                    .then(() => {             
                        this.products=this.$store.state.products.filter(o=> o.fullname.toLowerCase().includes(this.search.toLowerCase()))
                    })
                } else {                
                    this.products=this.$store.state.products.filter(o=> o.fullname.toLowerCase().includes(this.search.toLowerCase()))
                }
            },
            update_elaborated_products(with_dispatch){
                if (with_dispatch){
                    return this.$store.dispatch("getElaboratedProducts")
                    .then(() => {             
                       this.elaborated_products=this.$store.state.elaborated_products.filter(o=> o.name.toLowerCase().includes(this.search.toLowerCase()))
                    })
                } else {                
                    this.elaborated_products=this.$store.state.elaborated_products.filter(o=> o.name.toLowerCase().includes(this.search.toLowerCase()))
                }
            },
            update_system_products(){
                if (this.search==null)return
                return axios.get(`${this.$store.state.apiroot}/api/system_products/?search=${this.search}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.system_products=response.data
               }, (error) => {
                    this.parseResponseError(error)
                })
            },
            update_all( with_dispatch=false){
                // Refresh products and elaborated products filtering products and elaborated products
                // Refresh system products making a query
                this.loading=true
                Promise.all([this.update_products(with_dispatch), this.update_elaborated_products(with_dispatch), this.update_system_products()])        
                .then( ()=> {
                    this.loading=false
                    this.key=this.key+1
                })
            },
            is_product_elaborated_deletable(item){
                let product
                this.$store.state.products.forEach(element => {
                    if (element.elaborated_products==item.url) product=element
                });
                if (product==null) return true
                return product.is_deletable
            },

        },
    }
</script>