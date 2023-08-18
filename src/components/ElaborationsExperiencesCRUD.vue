<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDateTimePicker :readonly="mode=='D'" v-model="new_experience.datetime" :label="$t('Set date and time')"></MyDateTimePicker>
                <v-textarea :readonly="mode=='D'" v-model="new_experience.experience" :label="$t('Set your experience')" :placeholder="$t('Set your experience')" :rules="RulesString(2000,false)" counter="2000"/>
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
    import MyDateTimePicker from './reusing/MyDateTimePicker.vue'
    export default {
        components: {
            MyDateTimePicker,
        },
        props: {
            
            experience: { 
                required: true
            },
            mode: { // C D U
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_experience: null,

                products_formats:[],
                product_format:null,
                multiplier:1,
            }
        },
        methods: {
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new experience')
                if (this.mode=="U") return this.$t('Update this experience')
                if (this.mode=="D") return this.$t('Delete this experience')
            },
            acceptDialog(){        
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/elaborations_experiences/`, this.new_experience,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_experience.url, this.new_experience,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this experience?"))
                    if(r == true) {
                        axios.delete(this.new_experience.url, this.myheaders())
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
            this.new_experience=Object.assign({},this.experience)
        }
    }
</script>

