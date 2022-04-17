<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDateTimePicker :readonly="deleting" v-model="newmeal.datetime" :label="$t('Set transfer date and time')"></MyDateTimePicker>
                <AutoCompleteApiIdName returnobject v-model="product" :url="`${this.$store.state.apiroot}/api/products/`" :label="$t('Select a system product')" @input="on_products_input()"></AutoCompleteApiIdName>
                <v-autocomplete :readonly="deleting" :items="products_formats" v-model="product_format" :label="$t('Select your product format')" item-text="name" item-value="amount" :rules="RulesSelection(false)"  @input="on_product_format_input()"></v-autocomplete>
                <v-text-field :readonly="deleting" v-model="newmeal.amount" type="number" :label="$t('Set your amount')" :placeholder="$t('Set your amount')" :rules="RulesInteger(10,true)" counter="10"/>
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
    import MyDateTimePicker from './reusing/MyDateTimePicker.vue'
    import AutoCompleteApiIdName from './AutoCompleteApiIdName.vue'
    export default {
        components: {
            MyDateTimePicker,
            AutoCompleteApiIdName,
        },
        props: {
            // An account object
            meal: { // An account transfer object
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
                newmeal: null,
                mode: "", // CRUD mode

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
                if( this.$refs.form.validate()==false) return   
                    this.newmeal.products=this.product.url

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/meals/`, this.newmeal,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newmeal.url, this.newmeal,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this meal register?"))
                    if(r == true) {
                        axios.delete(this.newmeal.url, this.myheaders())
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
                if (this.product==null) return
                this.products_formats=[]
                this.product.formats.forEach(element => {
                    this.products_formats.push({name: `${this.$store.getters.getObjectPropertyByUrl("formats",element.formats,"name")} (${element.amount} g)`, amount: element.amount})
                    
                });
            },
            on_product_format_input(){
                this.newmeal.amount=this.product_format
            }
        },
        created(){
            // Guess crud mode
            this.newmeal=Object.assign({},this.meal)
            if ( this.meal.url==null){ 
                this.mode="C"
            } else if (this.meal.url!= null && this.deleting ==false) { 
                this.mode="U"
            } else if (this.meal.url!= null && this.deleting ==true) { 
                this.mode="D"
            }


        }
    }
</script>

