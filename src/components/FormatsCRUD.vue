<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete data-test="FormatsCRUD_format" :readonly="mode=='D'" :items="getArrayFromMap(useStore().formats)" v-model="newformat.formats" :label="$t('Select a format')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field data-test="FormatsCRUD_amount" :readonly="mode=='D'" v-model.number="newformat.amount" :label="$t('Set format amount (gr)')" :placeholder="$t('Set format amount (gr)')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="FormatsCRUD_cmd" color="primary" @click="acceptDialog()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import {RulesSelection,RulesFloatGEZ} from 'vuetify_rules'
import { useStore } from '@/store.js'
    export default {
        props: {
            
            format: { 
                required: true
            },
            mode: {
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                newformat: null,
            }
        },
        methods: {
            RulesSelection,
            RulesFloatGEZ,
        useStore,
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
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                this.$emit("cruded",this.mode,this.newformat,this.format)
            }
        },
        created(){
            this.newformat=Object.assign({},this.format)
        }
    }
</script>

