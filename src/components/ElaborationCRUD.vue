<template>
    <div>    
        <h1>{{ title() }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>          
                <v-row>
                    <v-text-field :readonly="mode=='D'" v-model.number="new_elaboration.diners" :label="$t('Set the number of diners')" :placeholder="$t('Set the number of diners')" :rules="RulesInteger(5,true)" counter="200"/>
                    <v-text-field :readonly="mode=='D'" class="ml-5" v-model="new_elaboration.final_amount" :label="$t('Set your final amount')" :placeholder="$t('Set your final amount')" :rules="RulesFloatGZ(10,true,3)" counter="10"/>
                    <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn> 

                </v-row>      
            </v-form>
        </v-card>

    </div>
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    export default {
        components: {
            MyMenuInline,
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
                menuinline_items: [
                    {
                        subheader: this.$t("Recipe options"),
                        children: [
                            {
                                name: this.$t("Generate PDF"),
                                icon: "mdi-file-pdf-box",
                                code: function(this_){
                                    console.log(this_)
                                },
                            },
                            {
                                name: this.$t("Show nutritional information"),
                                icon: "mdi-information",
                                code: function(this_){
                                    console.log(this_)
                                },
                            },
                        ]
                    },
                ],
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
                if( this.$refs.form.validate()==false) return   

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/elaborations/`, this.new_elaboration,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        if (cruded==true) this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_elaboration.url, this.new_elaboration,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        if (cruded==true) this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this elaboration?"))
                    if(r == true) {
                        axios.delete(this.new_elaboration.url, this.myheaders())
                        .then((response) => {
                            console.log(response.data)
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

