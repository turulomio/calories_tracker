<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field :readonly="mode=='D'" v-model="new_item.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200)" counter="200"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
                <v-btn color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>

    </div>
</template>
<script>
    import axios from 'axios'
    import {RulesString} from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        props: {
            
            item: { 
                required: true
            },
            mode: {
                required: true,
            },
            apiname: { //Only works for onefield api models
                required: true,
                type:String,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_item: null,
                key:0,
            }
        },
        methods: {
            RulesString,
        useStore,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new item')
                if (this.mode=="R") return this.$t('View this item')
                if (this.mode=="U") return this.$t('Update this item')
                if (this.mode=="D") return this.$t('Delete this item')
            },
            acceptDialog(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }

                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/${this.apiname}/`, this.new_item,  this.myheaders())
                    .then((response) => {
                        this.useStore()[this.apiname].set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_item.url, this.new_item,  this.myheaders())
                    .then((response) => {
                        this.useStore()[this.apiname].set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this item?"))
                    if(r == true) {
                        axios.delete(this.new_item.url, this.myheaders())
                        .then(() => {
                            this.useStore()[this.apiname].delete(this.new_item.url)
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
        },
        created(){
            this.new_item=Object.assign({},this.item)
        }
    }
</script>

