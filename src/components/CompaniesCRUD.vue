<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field :readonly="mode=='D'" v-model="newcompany.name" :label="$t('Set company name')" :placeholder="$t('Set company name')" :rules="RulesString(200)" counter="200"/>
                <v-checkbox v-model="newcompany.obsolete" :label="$t('Is obsolete?')"></v-checkbox>
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
    export default {
        props: {
            
            company: { 
                required: true
            },
            mode: {
                required: false,
            }
        },
        data(){ 
            return{
                form_valid:false,
                newcompany: null,
            }
        },
        methods: {
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new company')
                if (this.mode=="U") return this.$t('Update this company')
                if (this.mode=="D") return this.$t('Delete this company')
            },
            acceptDialog(){                    
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/companies/`, this.newcompany,  this.myheaders())
                    .then((response) => {
                        this.store().companies.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newcompany.url, this.newcompany,  this.myheaders())
                    .then((response) => {
                        this.store().companies.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this company?"))
                    if(r == true) {
                        axios.delete(this.newcompany.url, this.myheaders())
                        .then(() => {
                            this.store().companies.delete(this.newcompany.url)
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
        },
        created(){
            this.newcompany=Object.assign({},this.company)
        }
    }
</script>

