<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field id="ElaboratedProductsCRUD_Name" :readonly="['D','R'].includes(mode)" v-model="newep.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200)" counter="200"/>
                <v-autocomplete id="ElaboratedProductsCRUD_FoodTypes" :readonly="['D','R'].includes(mode)" :items="getArrayFromMap(useStore().food_types)" v-model="newep.food_types" :label="$t('Select product food type')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field id="ElaboratedProductsCRUD_Amount" :readonly="['D','R'].includes(mode)" v-model.number="newep.final_amount" :label="$t('Set your final amount')" :placeholder="$t('Set your final amount')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                <v-checkbox id="ElaboratedProductsCRUD_Obsolete" :readonly="['D','R'].includes(mode)" v-model="newep.obsolete" :label="$t('Is obsolete?')"></v-checkbox>
                <v-textarea id="ElaboratedProductsCRUD_Comment" :readonly="['D','R'].includes(mode)" v-model="newep.comment" :label="$t('Set your comment')" />              
                <v-card class="mt-4">
                    <v-data-table density="compact" :headers="products_in_headers" :items="newep.products_in" :sort-by="[{key:'name',order:'asc'}]"  class="elevation-1" :items-per-page="10000" :key="'T'+key" :height="250" fixed-header>
                        <template #item.products="{item}">
                            <div v-html="products_html_fullname(item.products,4)"></div>
                        </template>
                        <template #item.actions="{item}">
                            <v-icon id="ElaboratedProductsCRUD_iconEdit" v-if="['C','U'].includes(mode)" small class="mr-2" @click="editProductIn(item)">mdi-pencil</v-icon>
                            <v-icon id="ElaboratedProductsCRUD_iconDelete" v-if="['C','U'].includes(mode)" small @click="deleteProductIn(item)">mdi-delete</v-icon>
                        </template>
                        <template #bottom></template>
                        <template #tbody>
                            <tr class="totalrow">
                                <td>{{ $t("Total ([0] products):").format(newep.products_in.length) }} </td>
                                <td class="text-right" v-html="listobjects_sum(newep.products_in,'amount')"></td>
                                <td></td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn id="ElaboratedProductsCRUD_cmdProductIn" color="primary" v-if="['C','U'].includes(mode)" @click="addProductIn()" >{{ $t("Add a product") }}</v-btn>
                <v-btn id="ElaboratedProductsCRUD_cmd" color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
                <v-btn id="ElaboratedProductsCRUD_cmdCancel" color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>

        <!-- DIALOG PRODUCTS_IN CRUD -->
        <v-dialog v-model="dialog_products_in_crud" width="45%">
            <v-card class="pa-4">
                <ElaboratedProductsProductsInCRUD :product_in="product_in" :mode="product_in_mode" :key="'B'+key" @cruded="on_ProductsInCRUD_cruded" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from '@/store.js'
    import ElaboratedProductsProductsInCRUD from './ElaboratedProductsProductsInCRUD.vue'
    import {RulesSelection,RulesString,RulesFloatGEZ} from 'vuetify_rules'
    import {empty_products_in} from '../empty_objects.js'
    export default {
        components: {
            ElaboratedProductsProductsInCRUD,
        },
        props: {
            
            ep: { 
                required: true
            },
            mode: {
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                newep: null,

                loading_products: false,


                products_in_headers: [
                    { title: this.$t('Product'), sortable: true, key: 'products'},
                    { title: this.$t('Amount'), key: 'amount', align:'end'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width:"8%"},
                ],

                key:0,
                product_in:null,
                product_in_mode:null,
                dialog_products_in_crud:false
            }
        },
        methods: {
            empty_products_in,
            RulesFloatGEZ,
            RulesSelection,
            RulesString,
        useStore,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new elaborated product register')
                if (this.mode=="R") return this.$t('View this elaborated product register')
                if (this.mode=="U") return this.$t('Update this elaborated product register')
                if (this.mode=="D") return this.$t('Delete this elaborated product register')
            },
            acceptDialog(){                    
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }

                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/elaborated_products/`, this.newep,  this.myheaders())
                    .then((response) => {
                        this.useStore().elaborated_products.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newep.url, this.newep,  this.myheaders())
                    .then((response) => {
                        this.useStore().elaborated_products.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this elaborated product register?"))
                    if(r == true) {
                        axios.delete(this.newep.url, this.myheaders())
                        .then((response) => {
                            this.useStore().elaborated_products.delete(response.data.deleted_elaborated_product)
                            this.useStore().products.delete(response.data.deleted_product)
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
            addProductIn(){
                this.product_in=this.empty_products_in()
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
            on_ProductsInCRUD_cruded(mode,item,olditem){
                this.dialog_products_in_crud=false  
                if (mode=="C"){
                    this.newep.products_in.push(item)
                } else if (mode=="U"){
                    let index = this.newep.products_in.indexOf(olditem)
                    this.newep.products_in[index].products_in=item.products_in
                    this.newep.products_in[index].amount=item.amount
                    
                } else if (mode=="D"){
                    let index = this.newep.products_in.indexOf(olditem)
                    this.newep.products_in.splice(index,1)
                }
                this.key=this.key+1
            }
        },
        created(){
            // Guess crud mode
            this.newep=Object.assign({},this.ep)
        }
    }
</script>

