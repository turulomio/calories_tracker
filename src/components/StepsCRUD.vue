<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field :readonly="mode=='D'" v-model="new_item.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200)" counter="200"/>
                <v-checkbox v-model="new_item.can_products_in_step" :label="$t('Can have ingredients?')" />
                <v-checkbox v-model="new_item.can_container" :label="$t('Can have container?')" />
                <v-checkbox v-model="new_item.can_container_to" :label="$t('Can have container to pour?')" />
                <v-checkbox v-model="new_item.can_temperatures" :label="$t('Can have temperatures?')" />
                <v-checkbox v-model="new_item.can_stir" :label="$t('Can have stir?')" />
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn> 
                <v-btn color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>

    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        props: {
            
            item: { 
                required: true
            },
            mode: {
                required: true,
            },
        },
        data(){ 
            return{
                form_valid:false,
                new_item: null,
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
                if (this.mode=="C") return this.$t('Add a new step')
                if (this.mode=="R") return this.$t('View this step')
                if (this.mode=="U") return this.$t('Update this step')
                if (this.mode=="D") return this.$t('Delete this step')
            },
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/steps/`, this.new_item,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_item.url, this.new_item,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this step?"))
                    if(r == true) {
                        axios.delete(this.new_item.url, this.myheaders())
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
            this.new_item=Object.assign({},this.item)
        }
    }
</script>

