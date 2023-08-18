<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>          
                <v-text-field :readonly="(mode=='D' || new_elaboration.automatic )" v-model.number="new_elaboration.diners" :label="$t('Set the number of diners')" :placeholder="$t('Set the number of diners')" :rules="RulesInteger(5,true)" counter="200"/>
                <v-checkbox readonly v-model="new_elaboration.automatic" :label="$t('Is an automatic elaboration?')"></v-checkbox>
                <v-textarea :readonly="mode=='D'" v-model="new_elaboration.automatic_adaptation_step" :label="$t('Add your comment for this automatic elaboration')" :placeholder="$t('Add your comment for this automatic elaboration')" :rules="RulesString(2000,false)" counter="2000"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
            </v-card-actions>
        </v-card>
  
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        components: {
        },
        props: {
            
            elaboration: { 
                required: true
            },
            mode: {
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_elaboration: null,
                tab: 2,


                key:0,

            }
        },
        methods: {
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new elaboration')
                if (this.mode=="R") return this.$t('View this elaboration')
                if (this.mode=="U") return this.$t('Update this elaboration')
                if (this.mode=="D") return this.$t('Delete this elaboration')
            },
            acceptDialog(cruded=true){                    
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }

                if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/elaborations/`, this.new_elaboration,  this.myheaders())
                    .then(() => {
                        if (cruded==true) this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_elaboration.url, this.new_elaboration,  this.myheaders())
                    .then(() => {
                        if (cruded==true) this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this elaboration?"))
                    if(r == true) {
                        axios.delete(this.new_elaboration.url, this.myheaders())
                        .then(() => {
                        if (cruded==true) this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
        },
        created(){
            // Guess crud mode
            this.new_elaboration=Object.assign({},this.elaboration)
        }
    }
</script>

