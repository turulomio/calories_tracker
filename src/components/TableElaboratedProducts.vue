<template>
    <div class="ma-4">
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

        <!-- DIALOG ELABORATED PRODUCTS CRUD -->
        <v-dialog v-model="dialog_elaborated_products_crud" width="45%" persistent>
            <v-card class="pa-4">
                <ElaboratedProductsCRUD  :ep="elaborated_product" :mode="elaborated_product_mode" :key="'B'+key" @cruded="on_ElaboratedProductsCRUD_cruded()"></ElaboratedProductsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { empty_elaborated_products } from '../empty_objects.js'
    import {my_round} from 'vuetify_rules'
    import ElaboratedProductsCRUD from './ElaboratedProductsCRUD.vue'
    export default {
        components: {
            ElaboratedProductsCRUD,
        },
        props: {
            elaborated_products: { 
                required: true
            },
        },
        data(){
            return {
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

                //DIALOG FORMATS
                dialog_formats:false,

            }
        },     
        methods:{
            empty_elaborated_products,
            my_round,
            on_ElaboratedProductsCRUD_cruded(){
                this.dialog_elaborated_products_crud=false
                this.$emit("cruded")
            },
            on_new_click(){
                this.elaborated_product=this.empty_elaborated_products()
                this.elaborated_product_mode="C"
                this.key=this.key+1
                this.dialog_elaborated_products_crud=true
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