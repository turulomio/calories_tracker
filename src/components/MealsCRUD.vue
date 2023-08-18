<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDateTimePicker :readonly="mode=='D'" v-model="newmeal.datetime" :label="$t('Set transfer date and time')"></MyDateTimePicker>
                <AutocompleteProducts :readonly="mode=='D'" :items="getArrayFromMap(store().products)" v-model="newmeal.products" @input="on_products_input()" />
                <v-row class="pa-3">     
                    <v-text-field :readonly="mode=='D'" v-model.number="newmeal.amount" :label="$t('Set your amount')" :placeholder="$t('Set your amount')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                    <v-autocomplete  class="mx-2" :readonly="mode=='D'" :items="products_formats" v-model="product_format" :label="$t('Select your product format')" item-title="name" item-value="amount" :rules="RulesSelection(false)"  @input="on_product_format_input()"></v-autocomplete>
                    <Multiplier v-model="multiplier" :readonly="mode=='D'" @input="on_multiplier_input()"></Multiplier>
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
    import axios from 'axios'
    import MyDateTimePicker from './reusing/MyDateTimePicker.vue'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import Multiplier from './Multiplier.vue'
    export default {
        components: {
            AutocompleteProducts,
            MyDateTimePicker,
            Multiplier,
        },
        props: {
            
            meal: { 
                required: true
            },
            mode: {
                required: true
            }
        },
        data(){ 
            return{
                form_valid:false,
                newmeal: null,
                multiplier:1,

                loading_formats: false,

                product:null,
                products_formats:[],
                product_format:null
            }
        },
        methods: {
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new meal register')
                if (this.mode=="U") return this.$t('Update this meal register')
                if (this.mode=="D") return this.$t('Delete this meal register')
            },
            acceptDialog(){                    
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }

                if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/meals/`, this.newmeal,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newmeal.url, this.newmeal,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this meal register?"))
                    if(r == true) {
                        axios.delete(this.newmeal.url, this.myheaders())
                        .then(() => {
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
            on_products_input(){
                if (this.newmeal.products==null) return
                this.products_formats=[]
                let product=this.store().products.get(this.newmeal.products)
                product.formats.forEach(element => {
                    this.products_formats.push({name: `${this.store().formats.get(element.formats).name} (${element.amount} g)`, amount: element.amount})
                    
                });
            },
            on_product_format_input(){
                this.on_multiplier_input()
            },
            on_multiplier_input(){
                if (this.product_format) this.newmeal.amount=this.my_round(this.multiplier*this.product_format,3)
            }
        },
        created(){
            // Guess crud mode
            this.newmeal=Object.assign({},this.meal)
            if (this.mode=="U"){ //To load formats in update mode
                this.on_products_input()
            } 


        }
    }
</script>

