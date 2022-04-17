<template>
    <div class="ma-4">
        <h1>{{ $t(`Elaborated products`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>

        <v-data-table dense :headers="elaborated_products_headers" :items="$store.state.elaborated_products" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
            <template v-slot:[`item.last`]="{ item }">
                {{localtime(item.last)}}
            </template>          
            <template v-slot:[`item.food_types`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('food_types',item.food_types,'localname')"></div>
            </template>            
            <template v-slot:[`item.obsolete`]="{ item }">
                    <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editElaboratedProduct(item)">mdi-pencil</v-icon>
                <v-icon small v-if="item.is_deletable" @click="deleteElaboratedProduct(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>

        <!-- DIALOG PRODUCTS CRUD -->
        <v-dialog v-model="dialog_elaborated_products_crud" width="45%" persistent>
            <v-card class="pa-4">
                <ElaboratedProductsCRUD  :ep="elaborated_product" :deleting="elaborated_product_deleting" :key="'B'+key" @cruded="on_ElaboratedProductsCRUD_cruded()"></ElaboratedProductsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { empty_elaborated_products } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import ElaboratedProductsCRUD from './ElaboratedProductsCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            ElaboratedProductsCRUD,
        },
        data(){
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("ElaboratedProduct options"),
                        children: [
                            {
                                name: this.$t("Add elaborated_product"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.elaborated_product_deleting=false
                                    this_.elaborated_product=this_.empty_elaborated_products()
                                    this_.key=this_.key+1
                                    this_.dialog_elaborated_products_crud=true
                                },
                            },
                        ]
                    },
                ],
                elaborated_products:[],
                elaborated_products_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Food type'), sortable: true, value: 'food_types'},
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
                    { text: this.$t('Uses'), sortable: true, value: 'uses'},
                    { text: this.$t('Last update'), sortable: true, value: 'last',align:'right'},
                    { text: this.$t('Obsolete'), sortable: true, value: 'obsolete',align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],
                loading:false,
                key:0,

                //CRUD ELABORATED PRODUCTS
                elaborated_product:null,
                elaborated_product_deleting:null,
                dialog_elaborated_products_crud:false,

            }
        },        
        methods:{
            empty_elaborated_products,
            on_ElaboratedProductsCRUD_cruded(){
                this.dialog_elaborated_products_crud=false
                this.$store.dispatch("getElaboratedProducts")
                this.$store.dispatch("getProducts")
            },
            editElaboratedProduct(item){
                this.elaborated_product=item
                this.elaborated_product_deleting=false
                this.key=this.key+1

                this.dialog_elaborated_products_crud=true
            },
            deleteElaboratedProduct(item){
                this.elaborated_product=item
                this.elaborated_product_deleting=true
                this.key=this.key+1

                this.dialog_elaborated_products_crud=true
            },
        },
        created(){
        }
    }
</script>