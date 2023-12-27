<template>
    <div class="ma-4">
        <h1>{{ $t(`Catalog tables`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
        <v-select class="mt-4" density="compact" :items="tables" v-model="table" :label="$t('Select a catalog table')" return-object />

  
        <v-data-table density="compact" :headers="catalog_table_headers" :items="catalog_table" :sort-by="[{key:'',order:'asc'}]"  class="elevation-1" :items-per-page="10000" :loading="loading" :key="'T'+key" height="70vh">
            <template #item.actions="{item}">
                <v-icon small class="mr-1" @click="viewItem(item)">mdi-eye</v-icon>
                <v-icon small class="mr-1" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            <template #bottom ></template>  
        </v-data-table>


        <!-- DIALOG RECIPES LINKS TYPES CRUD -->
        <v-dialog v-model="dialog_recipes_links_types" width="45%" persistent>
            <v-card class="pa-4">
                <NameCRUD  :item="register" :mode="register_mode" apiname="recipes_links_types" :key="key" @cruded="on_CRUD_cruded()"></NameCRUD>
            </v-card>
        </v-dialog>

        <!-- DIALOG RECIPES CATEGORIES CRUD -->
        <v-dialog v-model="dialog_recipes_categories" width="45%" persistent>
            <v-card class="pa-4">
                <NameCRUD  :item="register" :mode="register_mode" apiname="recipes_categories" :key="key" @cruded="on_CRUD_cruded()"></NameCRUD>
            </v-card>
        </v-dialog>
        
        <!-- DIALOG MEASURES TYPES CRUD -->
        <v-dialog v-model="dialog_measures_types" width="45%" persistent>
            <v-card class="pa-4">
                <NameCRUD  :item="register" :mode="register_mode" apiname="measures_types" :key="key" @cruded="on_CRUD_cruded()"></NameCRUD>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import {    empty_recipes_links_types,
                empty_recipes_categories,
                empty_measures_types,
    } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import NameCRUD from './NameCrud.vue'
import { useStore } from '@/store.js'
    export default {
        components: {
            MyMenuInline,
            NameCRUD,
        },
        data(){
            return {
                loading:false,
                key:0,
            
                tables:[
                    {title:this.$t("Recipes categories"), value:"recipes_categories", dialog: "dialog_recipes_categories", empty:"empty_recipes_categories"},
                    {title:this.$t("Recipes links types"), value:"recipes_links_types", dialog: "dialog_recipes_links_types", empty:"empty_recipes_links_types"},
                    {title:this.$t("Measures types"), value:"measures_types", dialog: "dialog_measures_types", empty:"empty_measures_types"},
                ],
                table: null,
                catalog_table_headers:[],
                catalog_table:[],
                register:null,
                register_mode: null,

                //CRUD 
                dialog_recipes_categories:false,
                dialog_recipes_links_types:false,
                dialog_measures_types:false,
            }
        },
        watch: {
            table(){
                this.update_table()
            }
        },
        methods:{
            empty_recipes_links_types,
            empty_recipes_categories,
            empty_measures_types,
        useStore,

            menuinline_items(){
                let r= [
                    {
                        subheader: this.$t("Recipes options"),
                        children: [
                            {
                                name: this.$t("Add a new register"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.register=this[this.table.empty]
                                    this.$data[this.table.dialog]=true
                                    this.register_mode="C"
                                    this.key=this.key+1
                                }.bind(this),
                            },
                        ]
                    },
                ]

                return r
            },
            on_CRUD_cruded(){
                this.$data[this.table.dialog]=false  //Invoca una variable de data por su nombrre
                this.update_table()
            },
            editItem(item){
                this.register=item
                this.register_mode="U"
                this.key=this.key+1
                this.$data[this.table.dialog]=true  //Invoca una variable de data por su nombrre
            },
            deleteItem(item){
                this.register=item
                this.register_mode="D"
                this.key=this.key+1
                this.$data[this.table.dialog]=true  //Invoca una variable de data por su nombrre
            },
            viewItem(item){
                this.register=item
                this.register_mode="R"
                this.key=this.key+1
                this.$data[this.table.dialog]=true  //Invoca una variable de data por su nombrre

            },
            update_table(){
                if (    this.table.value=="recipes_links_types" || 
                        this.table.value=="recipes_categories" || 
                        this.table.value=="measures_types"
                ){
                    this.catalog_table_headers= [
                        { title: this.$t('Id'), sortable: true, key: 'id', width:"10%"},
                        { title: this.$t('Name'), sortable: true, key: 'name'},
                        { title: this.$t('Local name'), sortable: true, key: 'localname'},
                        { title: this.$t('Actions'), key: 'actions', sortable: false, width: "10%"},
                    ]
                }
                this.loading=true
                this.catalog_table=this.getArrayFromMap(this.useStore()[this.table.value])
                this.loading=false
                this.key=this.key+1

            },
        },
        created(){
            this.table=this.tables[0]
            this.update_table()
        }
    }
</script>