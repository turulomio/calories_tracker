<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field data-test="PillEventsCRUD_Name" :readonly="mode=='D'" v-model="new_pe.pillname" :label="$t('Set your pill name')" :placeholder="$t('Set your pill name')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <MyDateTimePicker data-test="PillEventsCRUD_DtFrom" v-model="new_pe.dt_from" />
                <v-text-field data-test="PillEventsCRUD_Days" :readonly="mode=='D'" v-model.number="new_pe.days" :label="$t('Set the number of days to take the pill')" :placeholder="$t('Set the number of days to take the pill')" :rules="RulesInteger(200,true)" counter="200" autofocus/>
        
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="PillEventsCRUD_Button" color="primary" v-if="mode!='R'" @click="acceptDialog()">{{ button() }}</v-btn> 
            </v-card-actions>
        </v-card>

    </div>
</template>
<script>
    import axios from 'axios'
    import MyDateTimePicker from './reusing/MyDateTimePicker.vue';
    import {RulesSelection,RulesString,RulesInteger} from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            
            pill_event: { 
                required: true
            },
            mode: { // CAN BE CRUD    EACH_DAY  EACH_HOUR
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_pe: null,

                loading_products: false,

                key:0,
            }
        },
        methods: {
        useStore,
            RulesInteger,RulesSelection,RulesString,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
                if (this.mode=="EACH_DAY") return this.$t('Set each day')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new pill_event')
                if (this.mode=="R") return this.$t('View this pill_event')
                if (this.mode=="U") return this.$t('Update this pill_event')
                if (this.mode=="D") return this.$t('Delete this pill_event')
                if (this.mode=="EACH_DAY") return this.$t('Set each day')
            },
            acceptDialog(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }

                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/pill_events/`, this.new_pe,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_pe.url, this.new_pe,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this pill_event?"))
                    if(r == true) {
                        axios.delete(this.new_pe.url, this.myheaders())
                        .then(() => {
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
                if (this.mode=="EACH_DAY"){
                    axios.post(`${this.useStore().apiroot}/api/pill_events/set_each_day/`, this.new_pe,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        created(){
            this.new_pe=Object.assign({},this.pill_event)
            //Visibility
            if (this.mode=="EACH_DAY"){
                console.log("EACH_DAY")
            }




        }
    }
</script>

