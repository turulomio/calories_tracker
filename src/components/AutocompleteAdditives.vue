<template>
    <v-autocomplete :readonly="readonly" :items="new_additives" v-model="new_value" multiple :label="mylabel" item-title="fullname" :return-object="returnObject" item-value="url" :rules="RulesSelection(true)">
      <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props"><div v-html="additives_html_fullname(item.raw)"></div></v-list-item>
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props"><div v-html="additives_html_fullname(item.raw)"></div></v-list-item>
        </template> 
    </v-autocomplete>
</template>

<script>

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
        // on_custom_filter(a,b,c){
        //     if(this.new_value.length<1) {
        //         return
        //     } 
        //     console.log(a,b,c)
        // },
        // on_update_modelValue(){
        //     console.log("AOHOARA")
        //     if(this.new_value.length<1) {
        //         this.additives_filtered=[]
        //     } else {
        //         this.additives_filtered=this.new_additives.filter(o => o.includes(this.new_value))
        //     }
        //     console.log(this.additives_filtered.length)
        //     // this.$emit("update:modelValue", this.new_value)
        // },
    },
    created(){
        this.new_value=this.modelValue
        if (this.additives.length==0){//Default value
            this.new_additives=this.getArrayFromMap(this.store().additives)
        } else {
            this.new_additives=this.additives
        }
    }
}
</script>