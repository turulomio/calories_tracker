<template>
    <div>    
        <v-data-table dense :headers="products_in_headers" :items="elaboration.elaborations_products_in" sort-by="final_grams" :sort-desc="['final_grams']" class="elevation-1" hide-default-footer disable-pagination :key="'T'+key" height="50vh" fixed-header>
            <template v-slot:[`item.products`]="{ item }"><div v-html="products_html_fullname(item.products,4)"></div></template>
            <template v-slot:[`item.amount`]="{ item }">{{ fraction(item.amount).toFraction(true)}}</template>
            <template v-slot:[`item.measures_types`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('measures_types', item.measures_types,'localname')"></div></template> 
            <template v-slot:[`item.ni`]="{ item }"><v-icon small v-if="item.ni" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editProductIn(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteProductIn(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:[`body.append`]="{headers}" v-if="elaboration.elaborations_products_in.length>0">
                <tr style="background-color: WhiteSmoke">
                    <td v-for="(header,i) in headers" :key="i">
                        <div v-if="header.value=='products'">{{ $t("Total {0} products):").format(elaboration.elaborations_products_in.length) }}</div>
                        <div v-if="header.value == 'final_grams'" class="d-flex justify-end" v-html="listobjects_sum(elaboration.elaborations_products_in,'final_grams')"></div>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <!-- DIALOG PRODUCTS_IN CRUD -->
        <v-dialog v-model="dialog_products_in_crud" width="45%">
            <v-card class="pa-4">
                <ElaborationProductsInCRUD :elaboration="elaboration" :product_in="product_in" :mode="product_in_mode" :key="'B'+key" @cruded="on_ElaborationProductsInCRUD_cruded"></ElaborationProductsInCRUD>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import fraction from 'fraction.js'
    import ElaborationProductsInCRUD from './ElaborationProductsInCRUD.vue'
    import {empty_elaborations_products_in} from '../empty_objects.js'
    export default {
        components: {
            ElaborationProductsInCRUD,
        },
        props: {
            
            elaboration: { 
                required: true
            },
        },
        data(){ 
            return{
                products_in_headers: [
                    { text: this.$t('Product'), sortable: true, value: 'products'},
                    { text: this.$t('Comment'), value: 'comment', align:'right'},
                    { text: this.$t('Amount'), value: 'amount', align:'right', width:"10%"},
                    { text: this.$t('Measure type'), value: 'measures_types', width:"12%"},
                    { text: this.$t('Final grams'), value: 'final_grams', align:'right', width:"10%"},
                    { text: this.$t('NI'), value: 'ni', align:'right', width:"4%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],


                key:0,
                product_in:null,
                product_in_mode:null,
                dialog_products_in_crud:false,
            }
        },
        methods: {
            fraction,
            empty_elaborations_products_in,
            addProductIn(){
                this.tab=0
                this.product_in=this.empty_elaborations_products_in()
                this.product_in.measures_types=this.hyperlinked_url("measures_types",1)
                this.product_in.elaborations=this.elaboration.url
                this.product_in_mode='C'
                this.key=this.key+1
                this.dialog_products_in_crud=true

            },
            editProductIn(item){
                this.product_in=item
                this.product_in_mode='U'
                this.key=this.key+1
                this.dialog_products_in_crud=true

            },
            deleteProductIn(item){
                this.product_in=item
                this.product_in_mode='D'
                this.key=this.key+1
                this.dialog_products_in_crud=true

            },
            on_ElaborationProductsInCRUD_cruded(){
                this.dialog_products_in_crud=false  
                this.key=this.key+1
                this.$emit("cruded")
            },
        },
        created(){
        }
    }
</script>

