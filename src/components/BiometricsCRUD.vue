<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDateTimePicker :readonly="deleting" v-model="newbiometric.datetime" :label="$t('Set transfer date and time')"></MyDateTimePicker>
                <v-autocomplete :readonly="deleting" :items="$store.state.activities" v-model="newbiometric.activities" :label="$t('Select your activity level')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete :readonly="deleting" :items="$store.state.weight_wishes" v-model="newbiometric.weight_wishes" :label="$t('Select your weight wish')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="deleting" v-model="newbiometric.height" type="number" :label="$t('Set your height')" :placeholder="$t('Set your height')" :rules="RulesInteger(10,true)" counter="10"/>
                <v-text-field :readonly="deleting" v-model="newbiometric.weight" type="number" :label="$t('Set your weight')" :placeholder="$t('Set your weight')" :rules="RulesInteger(10,true)" counter="10"/>
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
    import MyDateTimePicker from './MyDateTimePicker.vue'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            // An account object
            biometric: { // An account transfer object
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
                if( this.$refs.form.validate()==false) return   

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/biometrics/`, this.newbiometric,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newbiometric.url, this.newbiometric,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this biometric register?"))
                    if(r == true) {
                        axios.delete(this.newbiometric.url, this.myheaders())
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

