<template>
    <div class="ma-4">
        <h1>{{ $t(`Products`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
          <v-text-field class="ml-10 mr-10 mb-5" :disabled="loading" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')" v-on:keyup.enter="on_search_change()"></v-text-field>
    
        <v-tabs  bg-color="primary" dark v-model="tab" >
            <v-tab key="products"><v-icon left>mdi-apple</v-icon>{{ $t('Products') }}<v-badge v-if="products.length>0" color="error" class="ml-2" :content="products.length" inline/></v-tab>
            <v-tab key="elaborated_products"><v-icon left>mdi-food-takeout-box</v-icon>{{ $t('Elaborated products') }}<v-badge v-if="elaborated_products.length>0" color="error" class="ml-2" :content="elaborated_products.length" inline/></v-tab>
            <v-tab key="system_products"><v-icon left>mdi-database</v-icon>{{ $t('System products') }}<v-badge v-if="system_products.length>0" color="error" class="ml-2" :content="system_products.length" inline/></v-tab>
        </v-tabs>
        <v-window v-model="tab" class="ma-5">
            <v-window-item key="products" >
                <v-data-table-virtual density="compact" :headers="products_headers" :items="products" :sort-by="[{key:'fullname',order:'asc'}]"  class="elevation-1 cursorpointer" :items-per-page="10000" :loading="loading" :key="'T'+key" height="65vh" @click:row="viewProduct" fixed-header>
                    <template #item.fullname="{item}"><div v-html="products_html_fullname(item,2)"></div></template>
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
                        <v-icon v-if="item.system_products==null && item.elaborated_products==null" small class="mr-1" @click.stop="convertToSystemProduct(item)">mdi-database-arrow-right</v-icon>
                        <v-icon v-if="item.is_editable" small class="mr-1" @click.stop="editProduct(item)">mdi-pencil</v-icon>
                        <v-icon v-if="item.is_deletable" small @click.stop="deleteProduct(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table-virtual>
            </v-window-item>
            <v-window-item key="elaborated_products">
                <v-data-table-virtual density="compact" :headers="elaborated_products_headers" :items="elaborated_products" :sort-by="[{key:'name',order:'asc'}]"  class="elevation-1 cursorpointer" :items-per-page="10000" :loading="loading" :key="'T'+key" height="65vh" @click:row="viewElaboratedProduct"  fixed-header>
                    <template #item.fullname="{item}"><div v-html="products_html_fullname(item,3)"></div></template>
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
                        <v-icon small class="mr-1" @click.stop="editElaboratedProduct(item)">mdi-pencil</v-icon>
                        <v-icon small v-if="is_product_elaborated_deletable(item)" @click.stop="deleteElaboratedProduct(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table-virtual>
            </v-window-item>
            <v-window-item key="system_products" >                 
                <v-data-table-virtual density="compact" :headers="system_products_headers" :items="system_products" :sort-by="[{key:'fullname',order:'asc'}]" class="elevation-1 cursorpointer" :items-per-page="10000" :loading="loading" :key="'T'+key" height="65vh" @click:row="viewSystemProduct" fixed-header>
                    <template #item.fullname="{item}"><div v-html="products_html_fullname(item,5)"></div></template>
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
                        <v-icon small class="mr-1" @click.stop="linkProduct(item)">mdi-link-variant</v-icon>   
                        <v-icon class="mr-1" small @click.stop="editSystemProduct(item)"  color="#AA0000" v-if="store().catalog_manager">mdi-pencil</v-icon>
                        <v-icon small @click.stop="deleteSystemProduct(item)" color="#AA0000" v-if="store().catalog_manager">mdi-delete</v-icon>
                    </template>
                </v-data-table-virtual>
            </v-window-item>
        </v-window>



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
                    { title: this.$t('Name'), sortable: true, key: 'fullname',width:"30%"},    
                    { title: this.$t('Calories (kcal)'), sortable: true, key: 'calories',align:'right'},
                    { title: this.$t('Fat (g)'), sortable: true, key: 'fat',align:'right'},
                    { title: this.$t('Protein (g)'), sortable: true, key: 'protein',align:'right'},
                    { title: this.$t('Carbohydrate (g)'), sortable: true, key: 'carbohydrate',align:'right'},
                    { title: this.$t('Salt (g)'), sortable: true, key: 'salt',align:'right'},
                    { title: this.$t('Fiber (g)'), sortable: true, key: 'fiber',align:'right'},
                    { title: this.$t('Sugars (g)'), sortable: true, key: 'sugars',align:'right'},
                    { title: this.$t('Saturated fat (g)'), sortable: true, key: 'saturated_fat',align:'right'},
                    { title: this.$t('Cholesterol (g)'), sortable: true, key: 'cholesterol',align:'right'},
                    { title: this.$t('Sodium (mg)'), sortable: true, key: 'sodium',align:'right'},
                    { title: this.$t('Potassium (mg)'), sortable: true, key: 'potassium',align:'right'},
                    { title: this.$t('Ferrum (mg)'), sortable: true, key: 'ferrum',align:'right'},
                    { title: this.$t('Magnesium (mg)'), sortable: true, key: 'magnesium',align:'right'},
                    { title: this.$t('Phosphor (mg)'), sortable: true, key: 'phosphor',align:'right'},
                    { title: this.$t('Calcium (mg)'), sortable: true, key: 'calcium',align:'right'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false},
                ],
                system_products:[],
                system_products_headers: [ 
                    { title: this.$t('English name'), sortable: true, key: 'fullname',width:"30%"},          
                    { title: this.$t('Calories (kcal)'), sortable: true, key: 'calories',align:'right'},
                    { title: this.$t('Fat (g)'), sortable: true, key: 'fat',align:'right'},
                    { title: this.$t('Protein (g)'), sortable: true, key: 'protein',align:'right'},
                    { title: this.$t('Carbohydrate (g)'), sortable: true, key: 'carbohydrate',align:'right'},
                    { title: this.$t('Salt (g)'), sortable: true, key: 'salt',align:'right'},
                    { title: this.$t('Fiber (g)'), sortable: true, key: 'fiber',align:'right'},
                    { title: this.$t('Sugars (g)'), sortable: true, key: 'sugars',align:'right'},
                    { title: this.$t('Saturated fat (g)'), sortable: true, key: 'saturated_fat',align:'right'},
                    { title: this.$t('Cholesterol (g)'), sortable: true, key: 'cholesterol',align:'right'},
                    { title: this.$t('Sodium (mg)'), sortable: true, key: 'sodium',align:'right'},
                    { title: this.$t('Potassium (mg)'), sortable: true, key: 'potassium',align:'right'},
                    { title: this.$t('Ferrum (mg)'), sortable: true, key: 'ferrum',align:'right'},
                    { title: this.$t('Magnesium (mg)'), sortable: true, key: 'magnesium',align:'right'},
                    { title: this.$t('Phosphor (mg)'), sortable: true, key: 'phosphor',align:'right'},
                    { title: this.$t('Calcium (mg)'), sortable: true, key: 'calcium',align:'right'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width: "7%"},
                ],

                elaborated_products:[],
                elaborated_products_headers: [   
                    { title: this.$t('Name'), sortable: true, key: 'fullname',width:"30%"},
                    { title: this.$t('Calories (kcal)'), sortable: true, key: 'calories',align:'right'},
                    { title: this.$t('Fat (g)'), sortable: true, key: 'fat',align:'right'},
                    { title: this.$t('Protein (g)'), sortable: true, key: 'protein',align:'right'},
                    { title: this.$t('Carbohydrate (g)'), sortable: true, key: 'carbohydrate',align:'right'},
                    { title: this.$t('Salt (g)'), sortable: true, key: 'salt',align:'right'},
                    { title: this.$t('Fiber (g)'), sortable: true, key: 'fiber',align:'right'},
                    { title: this.$t('Sugars (g)'), sortable: true, key: 'sugars',align:'right'},
                    { title: this.$t('Saturated fat (g)'), sortable: true, key: 'saturated_fat',align:'right'},
                    { title: this.$t('Cholesterol (g)'), sortable: true, key: 'cholesterol',align:'right'},
                    { title: this.$t('Sodium (mg)'), sortable: true, key: 'sodium',align:'right'},
                    { title: this.$t('Potassium (mg)'), sortable: true, key: 'potassium',align:'right'},
                    { title: this.$t('Ferrum (mg)'), sortable: true, key: 'ferrum',align:'right'},
                    { title: this.$t('Magnesium (mg)'), sortable: true, key: 'magnesium',align:'right'},
                    { title: this.$t('Phosphor (mg)'), sortable: true, key: 'phosphor',align:'right'},
                    { title: this.$t('Calcium (mg)'), sortable: true, key: 'calcium',align:'right'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false},
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
                                code: function(){
                                    this.product_cu_mode="C"
                                    this.product=this.empty_products()
                                    this.key=this.key+1
                                    this.dialog_products_crud=true
                                }.bind(this),
                            },
                        ]
                    },
                    {
                        subheader: this.$t("ElaboratedProduct options"),
                        children: [
                            {
                                name: this.$t("Add a elaborated product"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.elaborated_product_mode='C'
                                    this.elaborated_product=this.empty_elaborated_products()
                                    this.key=this.key+1
                                    this.dialog_elaborated_products_crud=true
                                }.bind(this),
                            },
                        ]
                    },
                ]
                if (this.store().catalog_manager){
                    r.push({
                        subheader: this.$t("System product options"),
                        children: [
                            {
                                name: this.$t("Add system product"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.system_product_cu_mode="C"
                                    this.system_product=this.empty_system_products()
                                    this.key=this.key+1
                                    this.dialog_system_products_crud=true
                                }.bind(this),
                            },
                        ]
                    })
                }
                return r
            },
            on_ProductsCRUD_cruded(){
                this.dialog_products_crud=false
                this.update_all()
            },
            on_SystemProductsCRUD_cruded(){
                this.dialog_system_products_crud=false
                this.update_all()
            },
            on_ElaboratedProductsCRUD_cruded(){
                this.dialog_elaborated_products_crud=false
                this.update_all()
            },
            linkProduct(item){
                axios.post(`${item.url}create_product/`, {}, this.myheaders())
                .then((response) => {
                    this.store().products.set(response.data.url,response.data)
                    this.update_all()
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
            viewProduct(event,object){
                this.product=object.item
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

            viewSystemProduct(event,object){
                this.system_product=object.item
                this.system_product_cu_mode="R"
                this.key=this.key+1
                this.dialog_system_products_crud=true
            },
            convertToSystemProduct(item){

                axios.post(`${this.store().apiroot}/products_to_system_products/`, {product: item.url}, this.myheaders())
                .then(() => {
                    this.update_all()
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
            viewElaboratedProduct(event,object){
                this.elaborated_product=object.item
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
                this.update_all()
            },
            update_products(){
                this.products=this.getArrayFromMap(this.store().products).filter(o=> o.fullname.toLowerCase().includes(this.search.toLowerCase()))
            },
            update_elaborated_products(){
                this.elaborated_products=this.getArrayFromMap(this.store().elaborated_products).filter(o=> o.name.toLowerCase().includes(this.search.toLowerCase()))
            },
            update_system_products(){
                return axios.get(`${this.store().apiroot}/api/system_products/?search=${this.search}`, this.myheaders())
                .then((response) => {
                    this.system_products=response.data
               }, (error) => {
                    this.parseResponseError(error)
                })
            },
            update_all(){
                // Refresh products and elaborated products filtering products and elaborated products
                // Refresh system products making a query
                this.loading=true
                Promise.all([this.update_products(), this.update_elaborated_products(), this.update_system_products()])        
                .then( ()=> {
                    this.loading=false
                    this.key=this.key+1
                })
            },
            is_product_elaborated_deletable(item){
                let product
                this.store().products.forEach(element => {
                    if (element.elaborated_products==item.url) product=element
                });
                if (product==null) return true
                return product.is_deletable
            },

        },
    }
</script>