<template>
    <div>
        <v-row>
            <v-autocomplete :readonly="readonly" :items="$store.state.temperatures_types" v-model="new_value.temperatures_types" :label="$t('Temperature types')" item-text="localname" item-value="url" :rules="RulesSelection(false)" @change="refresh" chips></v-autocomplete>
            <v-text-field v-if="new_value.temperatures_types && show_text_field()" :readonly="readonly" v-model="new_value.temperatures_values" class="ml-4" :label="$t('Set temperature in ºC')" :placeholder="$t('Set temperature in ºC')" :rules="RulesInteger(5,true)" counter="5" @change="refresh"/>
            <v-select v-if="new_value.temperatures_types && !show_text_field()" :readonly="readonly" :items="lmh_items" v-model="new_value.temperatures_values" :label="$t('Select a temperature mode')" :rules="RulesSelection(true)" @change="refresh"></v-select>
        </v-row>
    </div>
</template>
<script>
    export default {    
        props: {
            value: {
                required: true,
                type: Object,
            },
            readonly: {
                required: false,
                default: false,
            },
        },
        data: function(){
            return {
                new_value:this.empty_value(),
                lmh_items:[
                    {text:this.$t("Low heat"),value:-1},
                    {text:this.$t("Medium heat"),value:-2},
                    {text:this.$t("High heat"),value:-3},
                ]
            }
        },
        methods: {
            empty_value(){
                return {
                    "temperatures_types": null,
                    "temperatures_values": null,
                }
            },
            show_text_field(){
                if (this.id_from_hyperlinked_url(this.new_value.temperatures_types)==1) return true
                return false
            },
            refresh(){
                if (this.new_value.temperatures_types==null) this.new_value.temperatures_values=null
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
