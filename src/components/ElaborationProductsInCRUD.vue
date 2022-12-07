<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="mode=='D'" :items="$store.state.products" v-model="new_product_in.products" item-text="fullname" item-value="url" :label="$t('Select a product')" @input="on_products_input()">
                    <template v-slot:item="{item}" ><div v-html="products_html_fullname(item,2)"></div></template>
                </v-autocomplete>
                <v-autocomplete  class="mx-2" :readonly="mode=='D'" :items="$store.state.measures_types" v-model="new_product_in.measures_types" :label="$t('Select your measure type')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>

                <v-row class="pa-3">     
                    <v-text-field :readonly="mode=='D'" v-model="new_product_in.amount" :label="$t('Set product amount')" :placeholder="$t('Set product amount')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                    <v-autocomplete  class="mx-2" :readonly="mode=='D'" :items="products_formats" v-model="product_format" :label="$t('Select your product format')" item-text="name" item-value="amount" :rules="RulesSelection(false)"  @input="on_product_format_input()"></v-autocomplete>
                    <Multiplier v-model="multiplier" :readonly="mode=='D'" @input="on_multiplier_input()"></Multiplier>
                </v-row>                    
                <v-text-field :readonly="mode=='D'" v-model="new_product_in.comment" :label="$t('Set a product coment (cut, temperature ...)')" :placeholder="$t('Set product amount (cut, temperature ...)')" :rules="RulesString(100,false)" counter="100"/>

            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import Multiplier from './Multiplier.vue'
    export default {
        components: {
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
                new_product_in: null,

                products_formats:[],
                product_format:null,
                multiplier:1,
            }
        },
        methods: {
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new elaboration product')
                if (this.mode=="U") return this.$t('Update this elaboration product')
                if (this.mode=="D") return this.$t('Delete this elaboration product')
            },
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return
                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/elaborationsproductsinthrough/`, this.new_product_in,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_product_in.url, this.new_product_in,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this elaboration product?"))
                    if(r == true) {
                        axios.delete(this.new_product_in.url, this.myheaders())
                        .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },

            on_products_input(){
                if (this.new_product_in.products==null) return
                let product=this.$store.getters.getObjectByUrl("products",this.new_product_in.products)
                this.products_formats=[]
                product.formats.forEach(element => {
                    this.products_formats.push({name: `${this.$store.getters.getObjectPropertyByUrl("formats",element.formats,"name")} (${element.amount} g)`, amount: element.amount})
                    
                });
            },
            on_product_format_input(){
                this.on_multiplier_input()
            },
            on_multiplier_input(){
                if (this.product_format) this.new_product_in.amount=this.my_round(this.multiplier*this.product_format,3)
            }
        },
        created(){
            this.new_product_in=Object.assign({},this.product_in)
        }
    }
</script>

