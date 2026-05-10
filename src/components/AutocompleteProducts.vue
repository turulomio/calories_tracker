<template>
    <v-autocomplete
      v-bind="$attrs"
      :rules="rules"
      :readonly="readonly"
      :items="computedProducts"
      v-model="proxyValue"
      :label="mylabel"
      item-title="fullname"
      :return-object="returnObject"
      :item-value="(multiple)? 'id': 'url'"
      :multiple="multiple"
    >
      <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" title=""><div v-html="products_html_fullname(item,2)"></div></v-list-item>
        </template>         
        <template v-slot:selection="{ props, item }">
            <v-list-item v-bind="props" title=""><div v-html="products_html_fullname(item,2)"></div></v-list-item>
        </template> 
    </v-autocomplete>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { useStore } from '@/store.js'
import { getArrayFromMap, products_html_fullname } from '@/functions.js'

const props = defineProps({
    modelValue: { required: true },
    returnObject: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    products: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const store = useStore()

const proxyValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const computedProducts = computed(() => {
    if (!props.products || props.products.length === 0) {
        return getArrayFromMap(store.products)
    }
    return props.products
})

const mylabel = computed(() => {
    if (attrs.label) return attrs.label
    return 'Select a product'
})
</script>