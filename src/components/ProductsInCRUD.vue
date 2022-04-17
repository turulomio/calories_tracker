<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="deleting" :items="$store.state.products" v-model="newproduct_in.products" item-text="name" item-value="url" :label="$t('Select a product')" @input="on_products_input()"></v-autocomplete>

                <v-autocomplete :readonly="deleting" :items="products_formats" v-model="product_format" :label="$t('Select format')" item-text="name" item-value="amount" :rules="RulesSelection(false)" @input="on_product_format_input()"></v-autocomplete>
                <v-text-field :readonly="deleting" v-model="newproduct_in.amount" type="number" :label="$t('Set product_in amount (gr)')" :placeholder="$t('Set product_in amount (gr)')" :rules="RulesFloat(10,true)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    export default {
        props: {
            // An account object
            product_in: { // An account transfer object
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
                newproduct_in: null,
                mode: "", // CRUD mode

                products_formats:[],
                product_format:null,
            }
        },
        methods: {
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new product_in')
                if (this.mode=="U") return this.$t('Update this product_in')
                if (this.mode=="D") return this.$t('Delete this product_in')
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
                this.newproduct_in.amount=this.product_format
            }
        },
        created(){
            // Guess crud mode
            console.log(this.product_in)
            this.newproduct_in=Object.assign({},this.product_in)
            if ( this.product_in.products_in==null){ 
                this.mode="C"
            } else if (this.product_in.products_in!= null && this.deleting ==false) { 
                this.mode="U"
            } else if (this.product_in.products_in!= null && this.deleting ==true) { 
                this.mode="D"
            }


        }
    }
</script>

