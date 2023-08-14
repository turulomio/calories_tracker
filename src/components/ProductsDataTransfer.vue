<template>
    <div>    
        <h1>{{ $t("Products data transfer") }}</h1>           
        <v-card class="pa-6 mt-4" style="overflow-y: scroll" :height="600" >
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <v-autocomplete :items="getArrayFromMap(store().products)" v-model="new_pdt.product_from" :label="$t('Select product to move data from')" item-title="fullname" item-value="url" :rules="RulesSelection(true)" @input="get_statistics()">
                    <template v-slot:item="{item}" ><div v-html="products_html_fullname(item,2)"></div></template>                
                </v-autocomplete>
                <v-autocomplete :items="getArrayFromMap(store().products)" v-model="new_pdt.product_to" :label="$t('Select product to move data to')" item-title="fullname" item-value="url" :rules="RulesSelection(true)" @input="get_statistics()">
                    <template v-slot:item="{item}" ><div v-html="products_html_fullname(item,2)"></div></template>
                </v-autocomplete>
            </v-form>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="transfer()" >{{ $t("Transfer") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import {empty_products_data_transfer} from '../empty_objects.js'
    export default {
        props: {
            pdt: { // Product data transfer
                required: false,
            },
        },
        data(){ 
            return{
                form_valid:false,
                new_pdt: null,
                key:0,
            }
        },
        methods: {
            empty_products_data_transfer,
            transfer(){    
                if (this.validate()==false) return          
                axios.post(`${this.store().apiroot}/products/datatransfer/`, this.new_pdt,  this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                })

            },
            validate(){
                if (this.new_pdt.product_from==this.new_pdt.product_to){
                    alert(this.$t("You can transfer the same product"))
                    return false
                }
                if( this.$refs.form.validate()==false) return false
                return true

            },

            get_statistics(){             
                if (this.validate()==false) return     
                let headers={...this.myheaders(),params: this.new_pdt}

                axios.get(`${this.store().apiroot}/products/datatransfer/`, headers)
                .then((response) => {
                    console.log(response.data)
                }, (error) => {
                    this.parseResponseError(error)
                }) 

            },
        },
        created(){
            if (this.pdt==null){
                this.new_pdt=empty_products_data_transfer()
            } else {
                this.new_pdt=Object.assign({},this.pdt)
            }
        }
    }
</script>

