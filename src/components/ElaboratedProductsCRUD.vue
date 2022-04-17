<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field :readonly="deleting" v-model="newep.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200)" counter="200"/>
                <v-autocomplete :readonly="deleting" :items="$store.state.food_types" v-model="newep.food_types" :label="$t('Select product food type')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="deleting" v-model="newep.final_amount" type="number" :label="$t('Set your final amount')" :placeholder="$t('Set your final amount')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-checkbox v-model="newep.obsolete" :label="$t('Is obsolete?')"></v-checkbox>                
                <v-card class="mt-4">
                    <v-data-table dense :headers="products_in_headers" :items="newep.products_in" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :key="'T'+key" :height="250">
                                
                        <template v-slot:[`item.products`]="{ item }">
                            {{$store.getters.getObjectPropertyByUrl("products",item.products,"name")}}
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="editProductIn(item)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteProductIn(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="addProductIn()" >{{ $t("Add a product") }}</v-btn>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn> 
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
            // An account object
            ep: { // An account transfer object
                required: true
            },
            deleting: {
                required: false,
                default: false,
            }
        },
        data(){ 
            return{
                form_valid:false,
                newep: null,
                mode: "", // CRUD mode

                loading_products: false,


                products_in_headers: [
                    { text: this.$t('Product'), sortable: true, value: 'products'},
                    { text: this.$t('Amount'), value: 'amount', align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
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
                if (this.mode=="U") return this.$t('Update this elaborated product register')
                if (this.mode=="D") return this.$t('Delete this elaborated product register')
            },
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return   

                console.log(this.newep)

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/elaborated_products/`, this.newep,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newep.url, this.newep,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
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
                            console.log(response.data)
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
            if ( this.ep.url==null){ 
                this.mode="C"
            } else if (this.ep.url!= null && this.deleting ==false) { 
                this.mode="U"
            } else if (this.ep.url!= null && this.deleting ==true) { 
                this.mode="D"
            }


        }
    }
</script>

