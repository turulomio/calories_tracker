<template>
    <div>    
        <v-data-table density="compact" :headers="products_in_headers()" :items="elaboration.elaborations_products_in" :sort-by="[{key:'final_grams',order:'desc'}]" class="elevation-1" :items-per-page="10000" :key="'T'+key" height="50vh" fixed-header>
            <template #item.products="{item}"><div v-html="products_html_fullname(item.products,4)"></div></template>
            <template #item.amount="{item}">{{ fraction(item.amount).toFraction(true)}}</template>
            <template #item.measures_types="{item}"><div v-html="useStore().measures_types.get(item.measures_types).localname"></div></template> 
            <template #item.ni="{item}"><v-icon small v-if="item.ni" >mdi-check-outline</v-icon></template>
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editProductIn(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteProductIn(item)">mdi-delete</v-icon>
            </template>
            <template #tbody>
                <tr class="totalrow" v-if="elaboration.elaborations_products_in.length>0">
                    <td>{{ $t("Total ([0] products):").format(elaboration.elaborations_products_in.length) }} </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-right" v-html="listobjects_sum(elaboration.elaborations_products_in,'final_grams')"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
            <!-- <template v-slot:[`body.append`]="{headers}">
                <tr style="background-color: WhiteSmoke">
                    <td v-for="(header,i) in headers" :key="i">
                        <div v-if="header.value=='products'">{{ $t("Total ([0] products):").format(elaboration.elaborations_products_in.length) }}</div>
                        <div v-if="header.value == 'final_grams'" class="d-flex justify-end" v-html="listobjects_sum(elaboration.elaborations_products_in,'final_grams')"></div>
                    </td>
                </tr>
            </template> -->
            <template #bottom></template>
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
    import { hyperlinked_url } from '@/functions'
    import { useStore } from '@/store.js'
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


                key:0,
                product_in:null,
                product_in_mode:null,
                dialog_products_in_crud:false,
            }
        },
        methods: {
        useStore,
            fraction,
            empty_elaborations_products_in,
            hyperlinked_url,


            products_in_headers(){
                var r= [
                    { title: this.$t('Product'), sortable: true, key: 'products'},
                    { title: this.$t('Comment'), key: 'comment'},
                    { title: this.$t('Amount'), key: 'amount', align:'end', width:"10%"},
                    { title: this.$t('Measure type'), key: 'measures_types', width:"12%"},
                    { title: this.$t('Final grams'), key: 'final_grams', align:'end', width:"10%"},
                    { title: this.$t('NI'), key: 'ni', align:'end', width:"4%"},
                    { title: this.$t('Automatic %'), key: 'automatic_percentage', align:'end', width:"8%"},
                    
                ]
                if (this.elaboration.automatic==false){
                    r.push({ title: this.$t('Actions'), key: 'actions', sortable: false, width:"8%"})
                }
                return r
            },
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

