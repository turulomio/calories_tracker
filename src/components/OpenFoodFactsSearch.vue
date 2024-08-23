<template>
    <div class="ma-4">
        <h1>{{ $t(`Open Food Facts search`) }}
        </h1>
        <v-card width="50%" class="mx-auto my-5" flat >
                <v-text-field clearable density="default" :disabled="loading" class="mb-3"  v-model="search" prepend-icon="mdi-magnify" :label="$t('Search in Open Food Facts api')" single-line hide-details :placeholder="$t('Add a string to filter table')" @keyup.enter="on_search_change()" />
        </v-card>
        <v-data-table-server ref="table" :headers="recipes_headers" :items="items" class="elevation-1 cursorpointer" :items-length="itemsLength" :search="search" v-model:items-per-page="itemsPerPage" v-model:page="page" v-model:sort-by="sortBy" :loading="loading" item-value="content_url" @click:row="viewRecipe" :key="key+1" >
            <template #item.photo="{item}"><v-img  v-if="item.thumbnail" :src="item.thumbnail" style="width: 50px; height: 50px" @click.stop="toggleFullscreen(item)" /></template>
            <template #item.name="{item}"><div :data-test="`Recipes_Table_Row${item.id}`" v-html="item.name"></div></template>      
            <template #item.last="{item}">{{localtime(item.last)}}</template>      
            <template #item.recipes_categories="{item}">{{show_categories(item)}}</template>      
            <template #item.food_types="{item}"><div v-html="useStore().food_types.get(item.food_types).localname"></div></template> 
            <template #item.guests="{item}"><v-icon small v-if="item.guests" >mdi-check-outline</v-icon></template>   
            <template #item.soon="{item}"><v-icon small v-if="item.soon" >mdi-check-outline</v-icon></template>    
            <template #item.actions="{item}">
                <v-icon :data-test="`Recipes_Table_ButtonRecipeLink${item.id}`" small class="mr-1" @click.stop="addMainPhoto(item)">mdi-link-variant</v-icon>
                <v-icon small class="mr-1" @click.stop="searchGoogle(item)">mdi-search-web</v-icon>
                <v-icon small class="mr-1" @click.stop="editRecipe(item)">mdi-pencil</v-icon>
                <v-icon small @click.stop="deleteRecipe(item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>
    </div>
</template>

<script>
    import axios from 'axios'
    import {localtime} from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        components: {
        },
        data(){
            return {                
                off_headers: [
                    { title: this.$t('Date and time'), sortable: false, key: 'datetime', width:"8%"},   
                    { title: this.$t('Name'), sortable: false, key: 'name', width:"40%"},    
                    { title: this.$t('Brand'), sortable: true, key: 'brand'},    
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width: "8%"},
                ],


                loading:false,
                key:0,
            }
        },
        methods:{
        useStore,
            localtime,
            on_search_change(){
                 this.update_recipes()
            },
        },
        mounted(){
        }
    }
</script>