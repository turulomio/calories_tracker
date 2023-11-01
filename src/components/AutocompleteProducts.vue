<template>
    <v-autocomplete :readonly="readonly" :items="new_products" v-model="new_value" :label="mylabel"  item-title="fullname" :return-object="returnObject" :item-value="(multiple)? 'id': 'url'" :multiple="multiple">
      <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" title=""><div v-html="products_html_fullname(item.raw,2)"></div></v-list-item>
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" title=""><div v-html="products_html_fullname(item.raw,2)"></div></v-list-item>
        </template> 
    </v-autocomplete>
</template>

<script>

export default {
    name: "AutocompleteProducts",
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
        products: {
            type: Array,
            required:false,
            default: new Array(),
        },

        multiple: { //Used to select several products, returns a list of ids
            type: Boolean,
            required: false,
            default: false
        },
    },
    emits: ['update:modelValue'],
    computed:{
        mylabel(){
            if ('label' in this.$attrs) return this.$attrs.label
            return this.$t('Select a product')
        }
    },
    data(){ 
        return {
            new_value:null,
            new_products: null,
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
    },
    created(){
        this.new_value=this.modelValue
        if (this.products.length==0){//Default value
            this.new_products=this.getArrayFromMap(this.store().products)
        } else {
            this.new_products=this.products
        }
    }
}
</script>