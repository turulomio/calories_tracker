<template>
    <div>
        <v-row>
            <v-autocomplete :readonly="readonly" :items="getArrayFromMap(store().stir_types)" v-model="new_value.stir_types" :label="$t('Stir types')" item-title="localname" item-value="url" :rules="RulesSelection(false)" @change="refresh" chips></v-autocomplete>
            <v-text-field v-if="new_value.stir_types && id_from_hyperlinked_url(this.new_value.stir_types)==1" :readonly="readonly" v-model="new_value.stir_values" class="ml-4" :label="$t('Set robot stir velocity')" :placeholder="$t('Set robot stir velocity')" :rules="RulesInteger(5,true)" counter="5" @change="refresh"/>
            <v-text-field v-if="new_value.stir_types && id_from_hyperlinked_url(this.new_value.stir_types)==3" :readonly="readonly" v-model="new_value.stir_values" class="ml-4" :label="$t('Set stir interval in minutes')" :placeholder="$t('Set stir interval in minutes')" :rules="RulesInteger(5,true)" counter="5" @change="refresh"/>
        </v-row>
    </div>
</template>
<script>
    export default {    
        props: {
            value: {
                required: true
            },
            readonly: {
                required: false,
                default: false,
            },
        },
        data: function(){
            return {
                new_value:null,
            }
        },
        methods: {
            empty_value(){
                return {
                    "stir_types": null,
                    "stir_values": null,
                }
            },
            refresh(){
                if (this.new_value.stir_types==null){
                    this.new_value.stir_values=null
                } else if ([1,3].includes(this.id_from_hyperlinked_url(this.new_value.stir_types))==false){
                    this.new_value.stir_values=null
                }
                this.$emit('input', this.new_value)
            }
        },
        created(){
            if (this.value == null){
                this.new_value=this.empty_value()
            } else {
                 this.new_value=Object.assign({},this.value)
            }    
            this.refresh()
        },
    }
</script>
