<template>
    <div>
        <h1>{{ $t("Merge recipes in '{name}'",  { "name": main_recipe.name}) }} {{ main_recipe.name }}</h1>
        <v-card>
            <AutoCompleteApiIdName data-test="RecipesMerge_Autocomplete" v-model="recipes" :url="`${useStore().apiroot}/api/recipes/`" :label="$t('Select recipes to merge')" paginated multiple />
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="RecipesMerge_Button" color="primary" @click="on_accept">{{ $t("Accept") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>  
</template>
<script>
    import AutoCompleteApiIdName from './AutoCompleteApiIdName.vue'
    import { useStore } from '@/store.js'
    import axios from 'axios'
    import {myheaders} from '@/functions'
    export default {
        props: {
            main_recipe: { //recipe object
                required: true,
            },
        },
        components:{
            AutoCompleteApiIdName
        },
        data () {
            return {
                recipes:[],
            }  
        },
        methods: {    
            useStore,  
            myheaders,
            on_accept(){              
                axios.post(`${this.main_recipe.url}merge/`, {recipes:this.recipes}, this.myheaders())
                .then(() => {
                    this.$emit("merged")
               }, (error) => {
                    this.parseResponseError(error)
                });

            }  
        },
    }
</script>
