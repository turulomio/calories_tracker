<template>
    <div>
        <h1>{{ f($t("Merge recipes in '[0]'"), [main_recipe.name]) }}</h1>
        <v-card>
            <AutoCompleteApiIdName data-test="RecipesMerge_Autocomplete" v-model="recipes" :url="`${useStore().apiroot}/api/recipes/`" :label="$t('Select recipes to merge')" paginated multiple />
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="RecipesMerge_Button" color="primary" @click="on_accept">{{ $t("Accept") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>  
</template>
<script setup>
    import { ref, getCurrentInstance } from 'vue'
    import AutoCompleteApiIdName from './AutoCompleteApiIdName.vue'
    import { useStore } from '@/store.js'
    import axios from 'axios'
    import { myheaders, newParseResponseError } from '@/functions'
    import { f } from 'vuetify_rules'
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n()

    const props = defineProps({
        main_recipe: { //recipe object
            required: true,
        },
    })

    const emit = defineEmits(['merged'])

    const recipes = ref([])
    const { proxy } = getCurrentInstance()

    function on_accept(){              
        axios.post(`${props.main_recipe.url}merge/`, {recipes: recipes.value}, myheaders())
        .then(() => {
            emit("merged")
        }, (error) => {
            newParseResponseError(error, t, useStore)
        });
    }  
</script>
