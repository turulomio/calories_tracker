<template>
    <div class="ma-4">
        <h1>{{ $t(`Open Food Facts search`) }}
        </h1>
        <v-card width="50%" class="d-flex flex-row mx-auto my-5" flat >
                <v-text-field clearable density="default" :disabled="loading" class="mb-3"  v-model="search" prepend-icon="mdi-magnify" :label="$t('Search in Open Food Facts api')" single-line hide-details :placeholder="$t('Add a string to filter table')" @keyup.enter="on_search_change" />

                <v-btn class="ml-8" color="primary" @click="on_search_change">{{ $t("Search")}}</v-btn>
        </v-card>
        <v-data-table :headers="off_headers" :items="off_items" class="elevation-1 cursorpointer" :items-per-page="100000" :loading="loading" :key="key" @click:row="showOffPage"  fixed-header height="60vh"  >
            <template #item.last_updated_t="{item}">
                {{ localtime(new Date(item.last_updated_t*1000).toISOString()) }}
            </template>
            <template #item.actions="{item}">
                <v-icon small class="mr-1" @click.stop="addProduct(item)">mdi-plus</v-icon>
                <v-icon small class="mr-1" @click.stop="showOffPage(null, {item:item})">mdi-search-web</v-icon>
            </template>
        </v-data-table>

        <!-- DIALOG PRODUCTS CRUD -->
        <v-dialog v-model="dialog_products_crud" width="45%">
            <v-card class="pa-4">
                <ProductsCRUD :product="product" :mode="product_cu_mode" :info="product_crud_info" :key="'B'+key" @cruded="on_ProductsCRUD_cruded" />
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
                    { title: this.$t('Date and time'), sortable: false, key: 'last_updated_t', width:"8%"},   
                    { title: this.$t('Name'), sortable: false, key: 'product_name', width:"40%"},    
                    { title: this.$t('Brand'), sortable: true, key: 'brands'},      
                    { title: this.$t('Country'), sortable: true, key: 'countries'},    
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
                    console.log(this.off_items)
                    console.log
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
            addProduct(item){
                console.log(item)
                this.product_crud_info=""
                this.product_crud_info+=this.$t("Brand") + ": " + item.brands+"<br>"
                this.product_crud_info+=this.$t("Additives") + ": " + item.additives_original_tags+"<br>"
                this.product_crud_info+=this.$t("Ingredients") + ": " + item.ingredients_text_with_allergens+"<br>"
                this.product_crud_info+=this.$t("Nutriments") + ": " + JSON.stringify(item.nutriments)+"<br>"
                this.product_crud_info+=this.$t("Image front") + ": " + item.image_front_url+"<br>"
                this.product_crud_info+=this.$t("Image") + ": " + item.image_url+"<br>"

                this.product_cu_mode="C"
                this.product=this.empty_products()
                this.product.name=item.product_name
                this.product.company=item.brands
                this.product.amount=100
                this.product.calories=item.nutriments["energy-kcal_100g"]
                this.product.fat=item.nutriments.fat_100g
                this.product.saturated_fat=item.nutriments["saturated-fat_100g"]
                this.product.protein=item.nutriments.proteins_100g
                this.product.salt=item.nutriments.salt_100g
                this.product.sodium=item.nutriments.sodium_100g
                this.product.sugars=item.nutriments.sugars_100g
                this.product.carbohydrate=item.nutriments.carbohydrates_100g
                this.product.calcium=item.nutriments.calcium_100g
                this.product.cholesterol=item.nutriments.cholesterol_100g
                this.product.potassium=item.nutriments.potassium_100g
                this.product.fiber=item.nutriments.fiber_100g
                this.product.ferrum=item.nutriments.iron_100g
                this.product.magnesium=item.nutriments.magnesium_100g
                this.product.phosphor=item.nutriments.phosphor_100g
                this.key=this.key+1
                this.dialog_products_crud=true
            },
            on_ProductsCRUD_cruded(){
                this.dialog_products_crud=false
            }
        },
        mounted(){
        }
    }
</script>