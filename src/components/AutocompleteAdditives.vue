<template>
    <v-autocomplete :readonly="readonly" :items="new_additives" v-model="new_value" multiple :label="mylabel" :return-object="returnObject" item-value="url" :rules="RulesSelection(true)">
        <template v-slot:item="{ props, item }">
            <v-list-item  v-bind="props" :title="item.raw.fullname">
                <!-- <v-list-item-content> -->
                    <!-- <span v-html="additives_html_fullname(item.raw)"></span> -->
                <!-- </v-list-item-content> -->
            </v-list-item>
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.fullname">
                <!-- <v-list-item-content v-bind="props"> -->
                    <!-- <span v-html="additives_html_fullname(item.raw)"></span> -->
                <!-- </v-list-item-content> -->
            </v-list-item>
        </template> 
    </v-autocomplete>
</template>

<script>

import { useStore } from '@/store.js'
import {RulesSelection} from 'vuetify_rules'
import {additives_html_fullname} from '@/functions.js'
export default {
    name: "AutocompleteAdditives",
    props:{
        modelValue: { 
            required: true,
        },
        returnObject:{
            type: Boolean,
            required:false,
            default:false,
        },
        readonly: {
            type: Boolean,
            required: false,
            default: false
        },
        additives: {
            type: Array,
            required:false,
            default: new Array(),
        }
    },
    emits: ['update:modelValue'],
    computed:{
        mylabel(){
            if ('label' in this.$attrs) return this.$attrs.label
            return this.$t('Select additives')
        }
    },
    data(){ 
        return {
            new_value:null,
            new_additives: null,
        }
    },
    watch:{
        value(newValue){
            this.new_value=newValue
        },
        new_value(newValue){
            this.$emit('update:modelValue', newValue)
        },
    },
    methods:{
        useStore,
        additives_html_fullname,
        RulesSelection,
    },
    created(){
        this.new_value=this.modelValue
        if (this.additives.length==0){//Default value
            this.new_additives=this.getArrayFromMap(this.useStore().additives)
        } else {
            this.new_additives=this.additives
        }
    }
}
</script>