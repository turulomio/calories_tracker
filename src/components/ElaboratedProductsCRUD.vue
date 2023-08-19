<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field :readonly="mode=='D'" v-model="newep.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200)" counter="200"/>
                <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(store().food_types)" v-model="newep.food_types" :label="$t('Select product food type')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="mode=='D'" v-model="newep.final_amount" :label="$t('Set your final amount')" :placeholder="$t('Set your final amount')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                <v-checkbox v-model="newep.obsolete" :label="$t('Is obsolete?')"></v-checkbox>                
                <v-card class="mt-4">
                    <v-data-table density="compact" :headers="products_in_headers" :items="newep.products_in" :sort-by="[{key:'name',order:'asc'}]"  class="elevation-1" :items-per-page="10000" :key="'T'+key" :height="250" fixed-header>
                        <template #item.products="{item}">
                            <div v-html="products_html_fullname(item.rawproducts,4)"></div>
                        </template>
                        <template #item.actions="{item}">
                            <v-icon v-if="['C','U'].includes(mode)" small class="mr-2" @click="editProductIn(item.raw)">mdi-pencil</v-icon>
                            <v-icon v-if="['C','U'].includes(mode)" small @click="deleteProductIn(item.raw)">mdi-delete</v-icon>
                        </template>
                        <!-- <template v-slot:[`body.append`]="{headers}" v-if="newep.products_in.length>0">
                            <tr style="background-color: WhiteSmoke">
                                <td v-for="(header,i) in headers" :key="i">
                                    <div v-if="header.value=='products'">{{ $t("Total ([0] products):").format(newep.products_in.length) }}</div>
                                    <div v-if="header.value == 'amount'" class="d-flex justify-end" v-html="listobjects_sum(newep.products_in,'amount')"></div>
                                </td>
                            </tr>
                        </template> -->
                    </v-data-table>
                </v-card>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="['C','U'].includes(mode)" @click="addProductIn()" >{{ $t("Add a product") }}</v-btn>
                <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
                <v-btn color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>

        <!-- DIALOG PRODUCTS_IN CRUD -->
        <v-dialog v-model="dialog_products_in_crud" width="45%">
            <v-card class="pa-4">
                <ProductsInCRUD :product_in="product_in" :mode="product_in_mode" :key="'B'+key" @cruded="on_ProductsInCRUD_cruded"></ProductsInCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import ProductsInCRUD from './ProductsInCRUD.vue'
    import {empty_products_in} from '../empty_objects.js'
    export default {
        components: {
            ProductsInCRUD,
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
                    { title: this.$t('Amount'), key: 'amount', align:'right'},
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
                    axios.post(`${this.store().apiroot}/api/elaborated_products/`, this.newep,  this.myheaders())
                    .then((response) => {
                        this.store().elaborated_products.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newep.url, this.newep,  this.myheaders())
                    .then((response) => {
                        this.store().elaborated_products.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this elaborated product register?"))
                    if(r == true) {
                        axios.delete(this.newep.url, this.myheaders())
                        .then(() => {
                            this.store().elaborated_products.delete(this.newep.url)
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

