<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field :readonly="mode=='D'" v-model="new_pot.name" :label="$t('Set pot name')" :placeholder="$t('Set pot name')" :rules="RulesString(200)" counter="200"/>
                <v-text-field :readonly="mode=='D'" v-model.number="new_pot.diameter" :label="$t('Set pot diameter (cm)')" :placeholder="$t('Set pot diameter (cm)')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model.number="new_pot.weight" :label="$t('Set pot weight (g)')" :placeholder="$t('Set pot weight (g)')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model.number="new_pot.height" :label="$t('Set pot height (cm)')" :placeholder="$t('Set pot height (cm)')" :rules="RulesInteger(10,true)" counter="10"/>
                <PasteImage v-model="pasted_image" :rules="RulesSelection(false)" />
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
    import PasteImage from './PasteImage.vue'
    import {RulesSelection,RulesInteger,RulesString} from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        components: {
            PasteImage,
        },
        props: {
            
            pot: { 
                required: true
            },
            mode: {
                required: false,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_pot: null,
                pasted_image:null,
            }
        },
        methods: {
        useStore,
            RulesSelection,RulesInteger,RulesString,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new pot')
                if (this.mode=="U") return this.$t('Update this pot')
                if (this.mode=="D") return this.$t('Delete this pot')
            },
            acceptDialog(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.pasted_image){
                    this.new_pot.photo_mime=this.pasted_image.mime
                    this.new_pot.photo_content=this.pasted_image.image
                }
                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/pots/`, this.new_pot,  this.myheaders())
                    .then((response) => {
                        this.useStore().pots.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_pot.url, this.new_pot,  this.myheaders())
                    .then((response) => {
                        this.useStore().pots.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this pot?"))
                    if(r == true) {
                        axios.delete(this.new_pot.url, this.myheaders())
                        .then((response) => {
                            this.useStore().pots.delete(response.data.url,response.data)
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
        },
        created(){
            this.new_pot=Object.assign({},this.pot)
        }
    }
</script>

