<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="mode=='D'" :items="$store.state.products" v-model="newproduct_in.products" item-text="fullname" item-value="url" :label="$t('Select a product')" @input="on_products_input()"></v-autocomplete>
                <v-row class="pa-3">     
                    <v-text-field :readonly="mode=='D'" v-model="newproduct_in.amount" type="number" :label="$t('Set product amount')" :placeholder="$t('Set product amount')" :rules="RulesInteger(10,true)" counter="10"/>
                    <v-autocomplete  class="mx-2" :readonly="mode=='D'" :items="products_formats" v-model="product_format" :label="$t('Select your product format')" item-text="name" item-value="amount" :rules="RulesSelection(false)"  @input="on_product_format_input()"></v-autocomplete>
                    <Multiplier v-model="multiplier" :readonly="mode=='D'" @input="on_multiplier_input()"></Multiplier>
                </v-row>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import Multiplier from './Multiplier.vue'
    export default {
        components: {
            Multiplier,
        },
        props: {
            // An account object
            product_in: { // An account transfer object
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
        methods: {
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
                if( this.$refs.form.validate()==false) return
                this.$emit("cruded",this.mode,this.newproduct_in,this.product_in)
            },

            on_products_input(){
                if (this.newproduct_in.products==null) return
                let product=this.$store.getters.getObjectByUrl("products",this.newproduct_in.products)
                this.products_formats=[]
                product.formats.forEach(element => {
                    this.products_formats.push({name: `${this.$store.getters.getObjectPropertyByUrl("formats",element.formats,"name")} (${element.amount} g)`, amount: element.amount})
                    
                });
            },
            on_product_format_input(){
                this.on_multiplier_input()
            },
            on_multiplier_input(){
                if (this.product_format) this.newproduct_in.amount=this.my_round(this.multiplier*this.product_format,3)
            }
        },
        created(){
            this.newproduct_in=Object.assign({},this.product_in)
        }
    }
</script>

