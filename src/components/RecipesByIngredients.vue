<template>
    <div>
        <h1>{{ $t("Search recipes by its ingredients") }}</h1>
        <v-card>
            <AutocompleteProducts :items="getArrayFromMap(store().products)" multiple v-model="selected_products" />
            <v-card-actions>
                <v-spacer></v-spacer>
            <v-btn color="primary" @click="on_accept">{{ $t("Accept") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>  
</template>
<script>
    import AutocompleteProducts from './AutocompleteProducts.vue'
    export default {
        components:{
                AutocompleteProducts
        },
        data () {
            return {
                selected_products:null,
            }  
        },
        methods: {      
            on_accept(){
                var recipes_search=`:INGREDIENTS ${this.selected_products.toString()}`
                this.$emit("selected",recipes_search)

            }  
        },
    }
</script>
