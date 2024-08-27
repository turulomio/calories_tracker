<template>
    <div class="ma-4">
        <h1>{{ $t(`Open Food Facts search`) }}
        </h1>
        <v-card width="50%" class="d-flex flex-row mx-auto my-5" flat >
                <v-text-field data-test="OpenFoodFactsSearch_Search" clearable density="default" :disabled="loading" class="mb-3"  v-model="search" prepend-icon="mdi-magnify" :label="$t('Search in Open Food Facts api')" single-line hide-details :placeholder="$t('Add a string to filter table')" @keyup.enter="on_search_change" />
                <v-btn class="ml-8" color="primary" @click="on_search_change">{{ $t("Search")}}</v-btn>
        </v-card>
        <v-data-table :headers="off_headers" :items="off_items" class="elevation-1 cursorpointer" :items-per-page="100000" :loading="loading" :key="key" @click:row="showOffPage" :sortBy="[{key:'nutriments_number', order:'desc'}]"  fixed-header height="60vh"  >
            <template #item.last_updated_t="{item}">
                {{ localtime(new Date(item.last_updated_t*1000).toISOString()) }}
            </template>
            <template #item.completeness="{item}">
                <v-rating readonly  :length="5" :size="32" :model-value="item.completeness*5" active-color="primary" />
            </template>
            <template #item.actions="{item}">
                <v-icon :data-test="`OpenFoodFactsSearch_Table_ButtonAddProduct${item.id}`" small class="mr-1" @click.stop="addProduct(item)">mdi-plus</v-icon>
                <v-icon small class="mr-1" @click.stop="showOffPage(null, {item:item})">mdi-search-web</v-icon>
            </template>
        </v-data-table>

        <!-- DIALOG PRODUCTS CRUD -->
        <v-dialog v-model="dialog_products_crud" width="90%">
            <v-card class="pa-4">
                <ProductsCRUD :product="product" :mode="product_cu_mode" :info="product_crud_info" :key="key" @cruded="on_ProductsCRUD_cruded" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import {localtime} from 'vuetify_rules'
    import { empty_products } from '@/empty_objects';
    import { useStore } from '@/store.js'
    import ProductsCRUD from './ProductsCRUD.vue';


    export default {
        components: {
            ProductsCRUD,
        },
        data(){
            return {                
                off_headers: [
                    { title: this.$t('Id'), sortable: true, key: 'id', width:"8%"},  
                    { title: this.$t('Date and time'), sortable: true, key: 'last_updated_t', width:"8%"},   
                    { title: this.$t('Name'), sortable: true, key: 'product_name', width:"40%"},    
                    { title: this.$t('Brand'), sortable: true, key: 'brands'},      
                    { title: this.$t('Country'), sortable: true, key: 'countries'},    
                    { title: this.$t('Nutriments'), sortable: true, key: 'nutriments_number'},    
                    { title: this.$t('Completeness'), sortable: true, key: 'completeness'},    
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width: "8%"},
                ],
                off_items:[],
                search:"",


                loading:false,
                key:0,
                //CRUD PRODUCT
                product:null,
                product_cu_mode:null,
                dialog_products_crud:false,
                product_crud_info:"",
            }
        },
        methods:{
        useStore,
            localtime,
            empty_products,
            async on_search_change(){
                this.loading=true
                const apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl';
                try {
                    const response = await axios.get(apiUrl, {
                    params: {
                        search_terms: this.search,
                        search_simple: 1,
                        action: 'process',
                        json: 1
                    }
                    });
                    this.off_items = response.data.products;
                    this.off_items.forEach(o=>{
                        o.nutriments_number=Object.keys(o.nutriments).length 
                    })
                    this.loading=false
                } catch (error) {
                    this.error = 'Error fetching data';
                    console.error('API Error:', error);
                } finally {
                    this.loading = false;
                }
            },
            showOffPage(event,object){
                window.open(`https://es.openfoodfacts.org/producto/${object.item.id}`)
            },
            get_off_products_info(item){
                console.log(item)
                var r={}
                r.id=item.id
                r.brand=item.brands
                r.additives=item.additives_original_tags
                r.ingredients=item.ingredients_text_with_allergens
                Object.entries(item.nutriments).forEach(([key, value]) => {
                    if (key.includes("_100g")){
                        r[key]=value
                    }
                });
                r.image_front_url=item.image_front_url
                r.image_url=item.image_url
                return r
            },
            objectToLinks(obj) {
                let html = '<ul>';
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'string' && obj[key].startsWith('http')) {
                            // If the value is a URL, create a link
                            html += `<li><strong>${key}:</strong> <a href="${obj[key]}" target="_blank">${obj[key]}</a></li>`;
                        } else {
                            // Otherwise, display the text normally
                            html += `<li><strong>${key}:</strong> ${obj[key]}</li>`;
                        }
                    }
                }
                html += '</ul>';
                return html;
            },
            addProduct(item){

                this.product_crud_info=this.objectToLinks(this.get_off_products_info(item))
                this.product_cu_mode="C"
                this.product=this.empty_products()
                this.product.name=item.product_name
                this.product.company=item.brands
                this.product.amount=100
                this.product.calories= Number(item.nutriments["energy-kcal_100g"] )|| null
                this.product.fat= Number(item.nutriments.fat_100g  )|| null
                this.product.saturated_fat= Number(item.nutriments["saturated-fat_100g"] )|| null
                this.product.protein= Number(item.nutriments.proteins_100g )|| null
                this.product.salt= Number(item.nutriments.salt_100g )|| null
                this.product.sodium= Number(item.nutriments.sodium_100g )|| null
                this.product.sugars= Number(item.nutriments.sugars_100g )|| null
                this.product.carbohydrate= Number(item.nutriments.carbohydrates_100g )|| null
                this.product.calcium= Number(item.nutriments.calcium_100g )|| null
                this.product.cholesterol= Number(item.nutriments.cholesterol_100g )|| null
                this.product.potassium= Number(item.nutriments.potassium_100g )|| null
                this.product.fiber= Number(item.nutriments.fiber_100g )|| null
                this.product.ferrum= Number(item.nutriments.iron_100g )|| null
                this.product.magnesium= Number(item.nutriments.magnesium_100g )|| null
                this.product.phosphor= Number(item.nutriments.phosphor_100g )|| null
                this.product.openfoodfacts_id=item.id
                this.key=this.key+1
                this.dialog_products_crud=true
            },

            on_ProductsCRUD_cruded(){
                this.dialog_products_crud=false
            },
        },
        mounted(){
        }
    }
</script>