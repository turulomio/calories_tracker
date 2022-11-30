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

        <!-- DIALOG RECIPES CATEGORIES CRUD -->
        <v-dialog v-model="dialog_recipes_categories" width="45%" persistent>
            <v-card class="pa-4">
                <NameCRUD  :item="register" :mode="register_mode" apiname="recipes_categories" :key="key" @cruded="on_CRUD_cruded()"></NameCRUD>
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
        <!-- DIALOG MEASURES TYPES CRUD -->
        <v-dialog v-model="dialog_measures_types" width="45%" persistent>
            <v-card class="pa-4">
                <NameCRUD  :item="register" :mode="register_mode" apiname="measures_types" :key="key" @cruded="on_CRUD_cruded()"></NameCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { empty_recipes_links_types,empty_temperatures_types,empty_stir_types,empty_recipes_categories,empty_measures_types} from '../empty_objects.js'
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
                    {text:this.$t("Recipes categories"), value:"recipes_categories"},
                    {text:this.$t("Recipes links types"), value:"recipes_links_types"},
                    {text:this.$t("Stir types"), value:"stir_types"},
                    {text:this.$t("Temperatures types"), value:"temperatures_types"},
                    {text:this.$t("Measures types"), value:"measures_types"},
                ],
                table: "recipes_categories",


                catalog_table_headers:[],
                catalog_table:[],
                register:null,
                register_mode: null,

                //CRUD 
                dialog_recipes_categories:false,
                dialog_recipes_links_types:false,
                dialog_stir_types:false,
                dialog_temperatures_types:false,
                dialog_measures_types:false,
            }
        },     
        computed:{
        },
        methods:{
            empty_recipes_links_types,
            empty_stir_types,
            empty_temperatures_types,
            empty_recipes_categories,
            empty_measures_types,

            menuinline_items(){
                let r= [
                    {
                        subheader: this.$t("Recipes options"),
                        children: [
                            {
                                name: this.$t("Add a new register"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    if (this_.table=="recipes_categories"){
                                        this_.register=this_.empty_recipes_categories()
                                        this_.dialog_recipes_categories=true
                                    } else if (this_.table=="recipes_links_types"){
                                        this_.register=this_.empty_recipes_links_types()
                                        this_.dialog_recipes_categories=true
                                    } else if (this_.table=="stir_types"){
                                        this_.register=this_.empty_stir_types()
                                        this_.dialog_stir_types=true
                                    } else if (this_.table=="temperatures_types"){
                                        this_.register=this_.empty_temperatures_types()
                                        this_.dialog_temperatures_types=true
                                    } else if (this_.table=="measures_types"){
                                        this_.register=this_.empty_measures_types()
                                        this_.dialog_measures_types=true
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
                if (this.table=="recipes_categories"){
                    this.dialog_recipes_categories=false
                } else if (this.table=="recipes_links_types"){
                    this.dialog_recipes_links_types=false
                } else if (this.table=="stir_types"){
                    this.dialog_stir_types=false
                } else if (this.table=="temperatures_types"){
                    this.dialog_temperatures_types=false
                } else if (this.table=="measures_types"){
                    this.dialog_measures_types=false
                }
                this.on_table_change()
            },
            editItem(item){
                this.register=item
                this.register_mode="U"
                this.key=this.key+1

                if (this.table=="recipes_categories"){
                    this.dialog_recipes_categories=true
                } else if (this.table=="recipes_links_types"){
                    this.dialog_recipes_links_types=true
                } else if (this.table=="stir_types"){
                    this.dialog_stir_types=true
                } else if (this.table=="temperatures_types"){
                    this.dialog_temperatures_types=true
                } else if (this.table=="measures_types"){
                    this.dialog_measures_types=true
                }
            },
            deleteItem(item){
                this.register=item
                this.register_mode="D"
                this.key=this.key+1

                if (this.table=="recipes_categories"){
                    this.dialog_recipes_categories=true
                } else if (this.table=="recipes_links_types"){
                    this.dialog_recipes_links_types=true
                } else if (this.table=="stir_types"){
                    this.dialog_stir_types=true
                } else if (this.table=="temperatures_types"){
                    this.dialog_temperatures_types=true
                } else if (this.table=="measures_types"){
                    this.dialog_measures_types=true
                }
            },
            viewItem(item){
                this.register=item
                this.register_mode="R"
                this.key=this.key+1

                if (this.table=="recipes_categories"){
                    this.dialog_recipes_categories=true
                } else if (this.table=="recipes_links_types"){
                    this.dialog_recipes_links_types=true
                } else if (this.table=="stir_types"){
                    this.dialog_stir_types=true
                } else if (this.table=="temperatures_types"){
                    this.dialog_temperatures_types=true
                } else if (this.table=="measures_types"){
                    this.dialog_measures_types=true
                }
            },
            on_table_change(){
                if (this.table=="recipes_links_types" || this.table=="stir_types" || this.table=="temperatures_types" || this.table=="recipes_categories" || this.table=="measures_types"){
                    this.catalog_table_headers= [
                        { text: this.$t('Id'), sortable: true, value: 'id', width:"10%"},
                        { text: this.$t('Name'), sortable: true, value: 'name'},
                        { text: this.$t('Actions'), value: 'actions', sortable: false, width: "10%"},
                    ]
                }
                this.key=this.key+1

                this.loading=true

                if (this.table=="recipes_categories"){
                    this.$store.dispatch("getRecipesCategories")
                    .then(()=>{
                        this.catalog_table=this.$store.state[this.table]
                        this.loading=false
                    })
                } else if (this.table=="recipes_links_types"){
                    this.$store.dispatch("getRecipesLinksTypes")
                    .then(()=>{
                        this.catalog_table=this.$store.state[this.table]
                        this.loading=false
                    })
                } else if (this.table=="stir_types"){
                    this.$store.dispatch("getStirTypes")
                    .then(()=>{
                        this.catalog_table=this.$store.state[this.table]
                        this.loading=false
                    })
                } else if (this.table=="temperatures_types"){
                    this.$store.dispatch("getTemperatureTypes")
                    .then(()=>{
                        this.catalog_table=this.$store.state[this.table]
                        this.loading=false
                    })
                } else if (this.table=="measures_types"){
                    this.$store.dispatch("getMeasuresTypes")
                    .then(()=>{
                        this.catalog_table=this.$store.state[this.table]
                        this.loading=false
                    })
                }
            }
        },
        created(){
            this.on_table_change()
        }
    }
</script>