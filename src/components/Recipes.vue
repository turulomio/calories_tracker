<template>
    <div class="ma-4">
        <h1>{{ $t(`Recipes`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
          <v-text-field class="ml-10 mr-10 mb-5" :disabled="loading" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')" v-on:keyup.enter="on_search_change()"></v-text-field>
    
        <v-data-table dense :headers="recipes_headers" :items="recipes" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
            <template v-slot:[`item.last`]="{ item }">{{localtime(item.last)}}</template>      
            <template v-slot:[`item.food_types`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('food_types', item.food_types,'localname')"></div></template> 
            <template v-slot:[`item.guests`]="{ item }"><v-icon small v-if="item.guests" >mdi-check-outline</v-icon></template>   
            <template v-slot:[`item.soon`]="{ item }"><v-icon small v-if="item.soon" >mdi-check-outline</v-icon></template>    
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-1" @click="viewRecipe(item)">mdi-eye</v-icon>
                <v-icon small class="mr-1" @click="editRecipe(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteRecipe(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>


        <!-- DIALOG RECIPES CRUD -->
        <v-dialog v-model="dialog_recipes_crud" width="45%" persistent>
            <v-card class="pa-4">
                <RecipesCRUD  :recipe="recipe" :mode="recipe_mode" :key="key" @cruded="on_RecipesCRUD_cruded()"></RecipesCRUD>
            </v-card>
        </v-dialog>

        <!-- DIALOG RECIPES VIEW -->
        <v-dialog v-model="dialog_recipes_view" width="100%">
            <v-card class="pa-4">
                <RecipesView  :recipe="recipe" :key="key" @cruded="on_RecipesView_cruded()"></RecipesView>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_recipes} from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import RecipesCRUD from './RecipesCRUD.vue'
    import RecipesView from './RecipesView.vue'
    export default {
        components: {
            MyMenuInline,
            RecipesCRUD,
            RecipesView,
        },
        data(){
            return {
                recipes:[],
                recipes_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},    
                    { text: this.$t('Food type'), sortable: true, value: 'food_types', width: "15%"},
                    { text: this.$t('Valoration'), sortable: true, value: 'valoration', width: "7%"},
                    { text: this.$t('Guests'), sortable: true, value: 'guests', width: "5%"},
                    { text: this.$t('Soon'), sortable: true, value: 'soon', width: "5%"},
                    { text: this.$t('Last'), sortable: true, value: 'last', width: "10%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width: "8%"},
                ],


                loading:false,
                key:0,
                search: "",

                // RECIPE VIEW
                dialog_recipes_view:false,

                //CRUD RECIPES
                recipe:null,
                recipe_mode:null,
                dialog_recipes_crud:false,
            }
        },     
        methods:{
            empty_recipes,

            menuinline_items(){
                let r= [
                    {
                        subheader: this.$t("Recipes options"),
                        children: [
                            {
                                name: this.$t("Add a new recipe"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.recipe_mode="C"
                                    this_.recipe=this_.empty_recipes()
                                    this_.key=this_.key+1
                                    this_.dialog_recipes_crud=true
                                },
                            },
                        ]
                    },
                ]

                return r
            },
            on_RecipesCRUD_cruded(){
                this.dialog_recipes_crud=false
                this.update_recipes()
            },
            on_RecipesView_cruded(){
                this.update_recipes()
                console.log("RECIPES CRUDED")
            },
            editRecipe(item){
                this.recipe=item
                this.recipe_mode="U"
                this.key=this.key+1

                this.dialog_recipes_crud=true
            },
            deleteRecipe(item){
                this.recipe=item
                this.recipe_mode="D"
                this.key=this.key+1

                this.dialog_recipes_crud=true
            },
            viewRecipe(item){            
                var recipe_full_url=item.url.replace("/recipes/","/recipes_full/")
                console.log(item.url)
                axios.get(recipe_full_url, this.myheaders())
                .then((response) => {
                    this.recipe=response.data
                    this.recipe.url_full=recipe_full_url
                    this.recipe.url=item.url
                    console.log(this.recipe)
                    this.key=this.key+1

                    this.dialog_recipes_view=true
                }, (error) => {
                    this.parseResponseError(error)
                })
            },

            on_search_change(){
                //Pressing enter
                this.update_recipes()
            },
            update_recipes(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/recipes/?search=${this.search}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.recipes=response.data
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });
            },

        },
    }
</script>