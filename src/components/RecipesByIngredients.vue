<template>
    <div>
        <h1>{{ $t("Search recipes by its ingredients") }}</h1>
        <v-form ref="form" @submit.prevent="on_accept">
            <v-card>
                <v-switch
                    data-test="RecipesByIngredients_AllOrAny"
                    v-model="all_products"
                    :label="checkbox_label"
                    color="primary"
                    inset
                    class="ml-4"
                ></v-switch>

                <AutocompleteProducts 
                    class="mx-5" 
                    multiple 
                    v-model="selected_products" 
                    :rules="rules"
                />

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" type="submit">{{ t("Accept") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </div>  
</template>
<script setup>
import { ref, computed } from 'vue'
import AutocompleteProducts from './AutocompleteProducts.vue'
import { useStore } from '@/store.js'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore()

const emit = defineEmits(['selected'])

const form = ref(null)
const selected_products = ref([])
const all_products = ref(true)

const rules = [
    v => (v.length > 0) || t('Select at least one ingredient')
]

const checkbox_label = computed(() => {
    return all_products.value
        ? t("Recipe with all selected ingredients")
        : t("Recipe with any selected ingredients")
})

const on_accept = async () => {
    const { valid } = await form.value.validate()
    
    if (valid) {
        const str_ids = selected_products.value.length > 0 ? selected_products.value.toString() : ''
        const key = all_products.value ? ":INGREDIENTSALL" : ":INGREDIENTSANY"

        emit('selected', `${key} ${str_ids}`)
    }
}
</script>
