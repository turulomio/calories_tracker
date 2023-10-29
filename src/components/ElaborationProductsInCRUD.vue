<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <AutocompleteProducts :readonly="mode=='D'" :items="getArrayFromMap(store().products)" v-model="new_product_in.products" />

                <v-autocomplete  class="mx-2" :readonly="mode=='D'" :items="getArrayFromMap(store().measures_types)" v-model="new_product_in.measures_types" :label="$t('Select your measure type')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>

                <v-row class="pa-3">     
                    <v-text-field :readonly="mode=='D'" v-model.number="new_product_in.amount" :label="$t('Set product amount')" :placeholder="$t('Set product amount')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                    <v-autocomplete  class="mx-2" :readonly="mode=='D'" :items="products_formats" v-model="product_format" :label="$t('Select your product format')" item-title="name" item-value="amount" :rules="RulesSelection(false)"></v-autocomplete>
                    <Multiplier v-model="multiplier" :readonly="mode=='D'"></Multiplier>
                </v-row>                    
                <v-checkbox v-model="new_product_in.ni" :label="$t('Used for nutritional information calcs?')"></v-checkbox>
                <v-text-field :readonly="mode=='D'" v-model.number="new_product_in.automatic_percentage" :label="$t('Set automatic transformation percentage')" :placeholder="$t('Set automatic transformation percentage')" :rules="RulesInteger(3,true,3)" counter="3"/>

                <v-text-field :readonly="mode=='D'" v-model="new_product_in.comment" :label="$t('Set a product comment (cut, temperature ...)')" :placeholder="$t('Set a product comment (cut, temperature ...)')" :rules="RulesString(100,false)" counter="100"/>

            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import Multiplier from './Multiplier.vue'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    export default {
        components: {
            Multiplier,
            AutocompleteProducts,
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
        watch:{
            "new_product_in.products": function(){
                if (this.new_product_in.products==null) return
                let product=this.store().products.get(this.new_product_in.products)
                this.products_formats=[]
                product.formats.forEach(element => {
                    this.products_formats.push({name: `${this.store().formats.get(element.formats).name} (${element.amount} g)`, amount: element.amount})
                    
                });
                console.log(this.products_formats)

            },
            product_format(){
                this.calculate_format_multiplier()
            },
            multiplier(){
                this.calculate_format_multiplier()
            },
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
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/elaborationsproductsinthrough/`, this.new_product_in,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_product_in.url, this.new_product_in,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this elaboration product?"))
                    if(r == true) {
                        axios.delete(this.new_product_in.url, this.myheaders())
                        .then(() => {
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
            calculate_format_multiplier(){
                if (this.product_format) this.new_product_in.amount=this.my_round(this.multiplier*this.product_format,3)
            }
        },
        created(){
            this.new_product_in=Object.assign({},this.product_in)
        }
    }
</script>

