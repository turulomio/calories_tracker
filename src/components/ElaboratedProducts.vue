<template>
    <div class="ma-4">
        <h1>{{ $t(`Elaborated products`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>

        <v-data-table dense :headers="elaborated_products_headers" :items="$store.state.elaborated_products" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
            <template v-slot:[`item.last`]="{ item }">
                {{localtime(item.last)}}
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