<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>

                <AutocompleteProducts :readonly="mode=='D'" :items="getArrayFromMap(useStore().products)" v-model="newproduct_in.products" />
                <v-row class="pa-3">     
                    <v-text-field :readonly="mode=='D'" v-model.number="newproduct_in.amount" :label="$t('Set product amount')" :placeholder="$t('Set product amount')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                    <v-autocomplete  class="mx-2" :readonly="mode=='D'" :items="products_formats" v-model="product_format" :label="$t('Select your product format')" item-title="name" item-value="amount" :rules="RulesSelection(false)"></v-autocomplete>
                    <Multiplier v-model="multiplier" :readonly="mode=='D'" />
                </v-row>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import Multiplier from './Multiplier.vue'
    import {my_round,RulesFloatGEZ,RulesSelection} from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        components: {
            AutocompleteProducts,
            Multiplier,
        },
        props: {
            
            product_in: { 
                required: true
            },
            mode: { // C D U
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                newproduct_in: null,

                products_formats:[],
                product_format:null,
                multiplier:1,
            }
        },
        watch: {
            "newproduct_in.products": function(){
                this.product_formats_update()

            },
            product_format(){
                this.calculate_amount()

            },
            multiplier(){
                this.calculate_amount()
            },
        },
        methods: {
        useStore,
            RulesFloatGEZ,
            RulesSelection,
            my_round,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new product')
                if (this.mode=="U") return this.$t('Update this product')
                if (this.mode=="D") return this.$t('Delete this product')
            },
            acceptDialog(){                    
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                this.$emit("cruded",this.mode,this.newproduct_in,this.product_in)
            },

            product_formats_update(){
                if (this.newproduct_in.products==null) return
                let product=this.useStore().products.get(this.newproduct_in.products)
                this.products_formats=[]
                product.formats.forEach(element => {
                    this.products_formats.push({name: `${this.useStore().formats.get(element.formats).name} (${element.amount} g)`, amount: element.amount})
                    
                });
            },
            calculate_amount(){
                if (this.product_format) this.newproduct_in.amount=this.my_round(this.multiplier*this.product_format,3)
            }
        },
        created(){
            this.newproduct_in=Object.assign({},this.product_in)
        }
    }
</script>

