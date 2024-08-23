<template>
    <div class="ma-4">
        <h1>{{ $t(`Open Food Facts search`) }}
        </h1>
        <v-card width="50%" class="d-flex flex-row mx-auto my-5" flat >
                <v-text-field clearable density="default" :disabled="loading" class="mb-3"  v-model="search" prepend-icon="mdi-magnify" :label="$t('Search in Open Food Facts api')" single-line hide-details :placeholder="$t('Add a string to filter table')" @keyup.enter="on_search_change()" fixed-header height="60vh"/>

                <v-btn class="ml-8" color="primary" @click="on_search_change">{{ $t("Search")}}</v-btn>
        </v-card>
        <v-data-table :headers="off_headers" :items="off_items" class="elevation-1 cursorpointer" :items-per-page="100000" :loading="loading" :key="key"  >
            <template #item.last_updated_t="{item}">
                {{ localtime(new Date(item.last_updated_t*1000).toISOString()) }}
            </template>
            <template #item.actions="{item}">
                <v-icon small class="mr-1" @click.stop="showOffPage(item)">mdi-search-web</v-icon>
            </template>
        </v-data-table>
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
                    { title: this.$t('Date and time'), sortable: false, key: 'last_updated_t', width:"8%"},   
                    { title: this.$t('Name'), sortable: false, key: 'product_name', width:"40%"},    
                    { title: this.$t('Brand'), sortable: true, key: 'brands'},    
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width: "8%"},
                ],
                off_items:[],
                search:"mortadela hacendado",


                loading:false,
                key:0,
            }
        },
        methods:{
        useStore,
            localtime,
            async on_search_change(){
                const apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl';
                try {
                    const response = await axios.get(apiUrl, {
                    params: {
                        search_terms: this.search,
                        search_simple: 1,
                        action: 'process',
                        json: 1
                    }
                    });
                    this.off_items = response.data.products;
                    console.log(this.off_items)
                    console.log
                } catch (error) {
                    this.error = 'Error fetching data';
                    console.error('API Error:', error);
                } finally {
                    this.loading = false;
                }
            },
            showOffPage(item){
                console.log(item)
            },
        },
        mounted(){
        }
    }
</script>