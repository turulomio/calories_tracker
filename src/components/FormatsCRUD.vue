<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="deleting" :items="$store.state.formats" v-model="newformat.formats" :label="$t('Select format food type')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="deleting" v-model="newformat.amount" type="number" :label="$t('Set format amount (gr)')" :placeholder="$t('Set format amount (gr)')" :rules="RulesFloat(10,true)" counter="10"/>
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
    export default {
        props: {
            // An account object
            format: { // An account transfer object
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
                newformat: null,
                mode: "", // CRUD mode
            }
        },
        methods: {
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new format')
                if (this.mode=="U") return this.$t('Update this format')
                if (this.mode=="D") return this.$t('Delete this format')
            },
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return   
                console.log(this.mode)
                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/formats/`, this.newformat,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newformat.url, this.newformat,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this format?"))
                    if(r == true) {
                        axios.delete(this.newformat.url, this.myheaders())
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
            // Guess crud mode
            this.newformat=Object.assign({},this.format)
            if ( this.format.url==null){ 
                this.mode="C"
            } else if (this.format.url!= null && this.deleting ==false) { 
                this.mode="U"
            } else if (this.format.url!= null && this.deleting ==true) { 
                this.mode="D"
            }


        }
    }
</script>

