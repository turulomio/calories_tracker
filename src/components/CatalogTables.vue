<template>
    <div class="ma-4">
        <h1>{{ $t(`Catalog tables`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
        <v-select :items="tables" v-model="table" :label="$t('Select a catalog table')" @change="on_table_change()"></v-select>

  
        <v-data-table dense :headers="catalog_table_headers" :items="catalog_table" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
            <template v-slot:[`item.last`]="{ item }">{{localtime(item.last)}}</template>      
            <template v-slot:[`item.food_types`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('food_types', item.food_types,'localname')"></div></template> 
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-1" @click="viewItem(item)">mdi-eye</v-icon>
                <v-icon small class="mr-1" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>


        <!-- DIALOG RECIPES LINKS TYPES CRUD -->
        <v-dialog v-model="dialog_recipes_links_types" width="45%" persistent>
            <v-card class="pa-4">
                <NameCRUD  :item="register" :mode="register_mode" apiname="recipes_links_types" :key="key" @cruded="on_CRUD_cruded()"></NameCRUD>
            </v-card>
        </v-dialog>
        <!-- DIALOG STIR TYPES CRUD -->
        <v-dialog v-model="dialog_stir_types" width="45%" persistent>
            <v-card class="pa-4">
                <NameCRUD  :item="register" :mode="register_mode" apiname="stir_types" :key="key" @cruded="on_CRUD_cruded()"></NameCRUD>
            </v-card>
        </v-dialog>
        <!-- DIALOG TEMPERATURES TYPES CRUD -->
        <v-dialog v-model="dialog_temperatures_types" width="45%" persistent>
            <v-card class="pa-4">
                <NameCRUD  :item="register" :mode="register_mode" apiname="temperatures_types" :key="key" @cruded="on_CRUD_cruded()"></NameCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_recipes_links_types,empty_temperatures_types,empty_stir_types} from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import NameCRUD from './NameCrud.vue'
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
                    {text:this.$t("Recipes links types"), value:"recipes_links_types"},
                    {text:this.$t("Stir types"), value:"stir_types"},
                    {text:this.$t("Temperatures types"), value:"temperatures_types"},
                ],
                table: "recipes_links_types",


                catalog_table_headers:[],
                catalog_table:[],
                register:null,
                register_mode: null,

                //CRUD 
                dialog_recipes_links_types:false,
                dialog_stir_types:false,
                dialog_temperatures_types:false,
            }
        },     
        computed:{
        },
        methods:{
            empty_recipes_links_types,
            empty_stir_types,
            empty_temperatures_types,

            menuinline_items(){
                let r= [
                    {
                        subheader: this.$t("Recipes options"),
                        children: [
                            {
                                name: this.$t("Add a new register"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    if (this_.table=="recipes_links_types"){
                                        this_.register=this_.empty_recipes_links_types()
                                        this_.dialog_recipes_links_types=true
                                    } else if (this_.table=="stir_types"){
                                        this_.register=this_.empty_stir_types()
                                        this_.dialog_stir_types=true
                                    } else if (this_.table=="temperatures_types"){
                                        this_.register=this_.empty_temperatures_types()
                                        this_.dialog_temperatures_types=true
                                    }
                                    this_.register_mode="C"
                                    this_.key=this_.key+1
                                },
                            },
                        ]
                    },
                ]

                return r
            },
            on_CRUD_cruded(){
                if (this.table=="recipes_links_types"){
                    this.dialog_recipes_links_types=false
                } else if (this.table=="stir_types"){
                    this.dialog_stir_types=false
                } else if (this.table=="temperatures_types"){
                    this.dialog_temperatures_types=false
                }
                this.on_table_change()
            },
            editItem(item){
                this.recipe=item
                this.recipe_mode="U"
                this.key=this.key+1

                this.dialog_recipes_crud=true
            },
            deleteItem(item){
                this.recipe=item
                this.recipe_mode="D"
                this.key=this.key+1

                this.dialog_recipes_crud=true
            },
            viewItem(item){
                this.recipe=item
                this.recipe_mode="R"
                this.key=this.key+1

                this.dialog_recipes_crud=true
            },
            on_table_change(){
                if (this.table=="recipes_links_types" || this.table=="stir_types" || this.table=="temperatures_types"){
                    this.catalog_table_headers= [
                        { text: this.$t('Name'), sortable: true, value: 'name'},
                        { text: this.$t('Actions'), value: 'actions', sortable: false, width: "10%"},
                    ]
                }
                this.key=this.key+1

                this.loading=true

                axios.get(`${this.$store.state.apiroot}/api/${this.table}/`, this.myheaders())
                .then((response) => {
                    this.catalog_table=response.data
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            }
        },
        created(){
            this.on_table_change()
        }
    }
</script>