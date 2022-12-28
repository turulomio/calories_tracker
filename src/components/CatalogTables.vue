<template>
    <div class="ma-4">
        <h1>{{ $t(`Catalog tables`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
        <v-select :items="tables" v-model="table" :label="$t('Select a catalog table')" return-object @change="on_table_change()"/>

  
        <v-data-table dense :headers="catalog_table_headers" :items="catalog_table" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" height="70vh">
            <template v-slot:[`item.can_products_in_step`]="{ item }"><v-icon small v-if="item.can_products_in_step" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.can_container`]="{ item }"><v-icon small v-if="item.can_container" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.can_container_to`]="{ item }"><v-icon small v-if="item.can_container_to" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.can_temperatures`]="{ item }"><v-icon small v-if="item.can_temperatures" >mdi-check-outline</v-icon></template>
            <template v-slot:[`item.can_stir`]="{ item }"><v-icon small v-if="item.can_stir" >mdi-check-outline</v-icon></template>   

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

        <!-- DIALOG STEPS CRUD -->
        <v-dialog v-model="dialog_steps" width="45%" persistent>
            <v-card class="pa-4">
                <StepsCRUD  :item="register" :mode="register_mode" :key="key" @cruded="on_CRUD_cruded()" />
            </v-card>
        </v-dialog>

        <!-- DIALOG STEPS COMBINATIONS -->
        <v-dialog v-model="dialog_steps_combinations" width="100%">
            <v-card class="pa-4">
                <StepsCombinations :step="register" :key="key" />
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {    empty_recipes_links_types,
                empty_temperatures_types,
                empty_stir_types,
                empty_recipes_categories,
                empty_steps,
                empty_measures_types,
    } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import NameCRUD from './NameCrud.vue'
    import StepsCRUD from './StepsCRUD.vue'
    import StepsCombinations from './StepsCombinations.vue'
    export default {
        components: {
            MyMenuInline,
            NameCRUD,
            StepsCRUD,
            StepsCombinations
        },
        data(){
            return {
                loading:false,
                key:0,
            
                tables:[
                    {text:this.$t("Recipes categories"), value:"recipes_categories", dialog: "dialog_recipes_categories", empty:"empty_recipes_categories", dispatch:"getRecipesCategories"},
                    {text:this.$t("Recipes links types"), value:"recipes_links_types", dialog: "dialog_recipes_links_types", empty:"empty_recipes_links_types", dispatch:"getRecipesLinksTypes"},
                    {text:this.$t("Stir types"), value:"stir_types", dialog: "dialog_stir_types", empty:"empty_stir_types", dispatch:"getStirTypes"},
                    {text:this.$t("Temperatures types"), value:"temperatures_types", dialog: "dialog_temperatures_types", empty:"empty_temperatures_types", dispatch:"getTemperaturesTypes"},
                    {text:this.$t("Measures types"), value:"measures_types", dialog: "dialog_measures_types", empty:"empty_measures_types", dispatch:"getMeasuresTypes"},
                    {text:this.$t("Steps"), value:"steps", dialog: "dialog_steps", empty:"empty_steps", dispatch:"getSteps"},
                ],
                table: null,
                catalog_table_headers:[],
                catalog_table:[],
                register:null,
                register_mode: null,

                //CRUD 
                dialog_recipes_categories:false,
                dialog_recipes_links_types:false,
                dialog_steps:false,
                dialog_steps_combinations:false,
                dialog_stir_types:false,
                dialog_temperatures_types:false,
                dialog_measures_types:false,
            }
        },
        methods:{
            empty_recipes_links_types,
            empty_stir_types,
            empty_temperatures_types,
            empty_recipes_categories,
            empty_measures_types,
            empty_steps,

            menuinline_items(){
                let r= [
                    {
                        subheader: this.$t("Recipes options"),
                        children: [
                            {
                                name: this.$t("Add a new register"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.register=this[this_.table.empty]
                                    this_.$data[this_.table.dialog]=true
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
                this.$data[this.table.dialog]=false  //Invoca una variable de data por su nombrre
                this.on_table_change()
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
                if (this.table.value=="steps"){
                    this.key=this.key+1
                    this.dialog_steps_combinations=true
                } else {
                    this.register_mode="R"
                    this.key=this.key+1
                    this.$data[this.table.dialog]=true  //Invoca una variable de data por su nombrre
                }
            },
            on_table_change(){
                if (    this.table.value=="recipes_links_types" || 
                        this.table.value=="stir_types" || 
                        this.table.value=="temperatures_types" || 
                        this.table.value=="recipes_categories" || 
                        this.table.value=="measures_types"
                ){
                    this.catalog_table_headers= [
                        { text: this.$t('Id'), sortable: true, value: 'id', width:"10%"},
                        { text: this.$t('Name'), sortable: true, value: 'name'},
                        { text: this.$t('Local name'), sortable: true, value: 'localname'},
                        { text: this.$t('Actions'), value: 'actions', sortable: false, width: "10%"},
                    ]
                }
                else if ( this.table.value=="steps"){
                    this.catalog_table_headers= [
                        { text: this.$t('Id'), sortable: true, value: 'id', width:"10%"},
                        { text: this.$t('Name'), sortable: true, value: 'name'},
                        { text: this.$t('Local name'), sortable: true, value: 'localname'},
                        { text: this.$t('Ingredients'), sortable: true, value: 'can_products_in_step'},
                        { text: this.$t('Container'), sortable: true, value: 'can_container'},
                        { text: this.$t('Container to'), sortable: true, value: 'can_container_to'},
                        { text: this.$t('Temperatures'), sortable: true, value: 'can_temperatures'},
                        { text: this.$t('Stir'), sortable: true, value: 'can_stir'},
                        { text: this.$t('Actions'), value: 'actions', sortable: false, width: "10%"},
                    ]

                }
                this.key=this.key+1

                this.loading=true
                this.$store.dispatch(this.table.dispatch)
                .then(()=>{
                    this.catalog_table=this.$store.state[this.table.value]
                    this.loading=false
                })
            },
        },
        created(){
            this.table=this.tables[0]
            this.on_table_change()
        }
    }
</script>