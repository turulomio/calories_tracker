<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDateTimePicker :readonly="deleting" v-model="newbiometric.datetime" :label="$t('Set date and time')"></MyDateTimePicker>
                <v-autocomplete :readonly="deleting" :items="getArrayFromMap(useStore().activities)" v-model="newbiometric.activities" :label="$t('Select your activity level')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete :readonly="deleting" :items="getArrayFromMap(useStore().weight_wishes)" v-model="newbiometric.weight_wishes" :label="$t('Select your weight wish')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="deleting" v-model.number="newbiometric.height" :label="$t('Set your height')" :placeholder="$t('Set your height')" :rules="RulesFloatGEZ(10,true,2)" counter="10"/>
                <v-text-field :readonly="deleting" v-model.number="newbiometric.weight" :label="$t('Set your weight')" :placeholder="$t('Set your weight')" :rules="RulesFloatGEZ(10,true,2)" counter="10"/>
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
    import {RulesSelection,RulesFloatGEZ} from 'vuetify_rules'
    import MyDateTimePicker from './reusing/MyDateTimePicker.vue'
import { useStore } from '@/store.js'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            
            biometric: { 
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
                newbiometric: null,
                mode: "", // CRUD mode
            }
        },
        methods: {
            RulesFloatGEZ,
            RulesSelection,
        useStore,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new biometric register')
                if (this.mode=="U") return this.$t('Update this biometric register')
                if (this.mode=="D") return this.$t('Delete this biometric register')
            },
            acceptDialog(){             
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }

                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/biometrics/`, this.newbiometric,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newbiometric.url, this.newbiometric,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this biometric register?"))
                    if(r == true) {
                        axios.delete(this.newbiometric.url, this.myheaders())
                        .then(() => {
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
        },
        created(){
            // Guess crud mode
            this.newbiometric=Object.assign({},this.biometric)
            if ( this.biometric.url==null){ 
                this.mode="C"
            } else if (this.biometric.url!= null && this.deleting ==false) { 
                this.mode="U"
            } else if (this.biometric.url!= null && this.deleting ==true) { 
                this.mode="D"
            }


        }
    }
</script>

