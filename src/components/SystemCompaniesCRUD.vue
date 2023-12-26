<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field :readonly="mode=='D'" v-model="new_system_company.name" :label="$t('Set company name')" :placeholder="$t('Set company name')" :rules="RulesString(200)" counter="200"/>
                <v-checkbox v-model="new_system_company.obsolete" :label="$t('Is obsolete?')"></v-checkbox>
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
    import {RulesString} from 'vuetify_rules'
    export default {
        props: {
            
            system_company: { 
                required: true
            },
            mode: {
                required: false,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_system_company: null,
            }
        },
        methods: {
            RulesString,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new system company')
                if (this.mode=="U") return this.$t('Update this system company')
                if (this.mode=="D") return this.$t('Delete this system company')
            },
            acceptDialog(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/system_companies/`, this.new_system_company,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_system_company.url, this.new_system_company,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this system company?"))
                    if(r == true) {
                        axios.delete(this.new_system_company.url, this.myheaders())
                        .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
        },
        created(){
            this.new_system_company=Object.assign({},this.system_company)
        }
    }
</script>

