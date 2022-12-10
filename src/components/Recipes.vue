<template>
    <div class="ma-4">
        <h1>{{ $t(`Recipes`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
        <v-text-field class="mx-10 mb-5" :disabled="loading" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')" v-on:keyup.enter="on_search_change()"></v-text-field>
    
        <p class="ml-10">{{ $t("{0} recipes found").format(recipes.length)}}</p>
        <v-data-table dense :headers="recipes_headers" :items="recipes" :sort-by="table_sort_by" :sort-desc="table_sort_desc" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" height="70vh"  fixed-header item-key="content">
            <template v-slot:[`item.photo`]="{ item}"><v-img  v-if="item.main_image_thumbnail" :src="item.content" style="width: 50px; height: 50px" @click="toggleFullscreen(item)"/></template>
            <template v-slot:[`item.name`]="{ item }"><div v-html="item.name" @click="searchGoogle(item)"></div></template>      
            <template v-slot:[`item.last`]="{ item }">{{localtime(item.last)}}</template>      
            <template v-slot:[`item.categories`]="{ item }">{{show_categories(item)}}</template>      
            <template v-slot:[`item.food_types`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('food_types', item.food_types,'localname')"></div></template> 
            <template v-slot:[`item.guests`]="{ item }"><v-icon small v-if="item.guests" >mdi-check-outline</v-icon></template>   
            <template v-slot:[`item.soon`]="{ item }"><v-icon small v-if="item.soon" >mdi-check-outline</v-icon></template>    
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-1" @click="addMainPhoto(item)">mdi-link-variant</v-icon>
                <v-icon small class="mr-1" @click="viewRecipe(item)">mdi-eye</v-icon>
                <v-icon small class="mr-1" @click="editRecipe(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteRecipe(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>


        <!-- DIALOG RECIPES CRUD -->
        <v-dialog v-model="dialog_recipes_crud" width="45%" persistent>
            <v-card class="pa-4">
                <RecipesCRUD  :recipe="recipe" :mode="recipe_mode" :key="key" @cruded="on_RecipesCRUD_cruded"></RecipesCRUD>
            </v-card>
        </v-dialog>

        <!-- DIALOG RECIPES VIEW -->
        <v-dialog v-model="dialog_recipes_view" width="100%">
            <v-card class="pa-4">
                <RecipesView  :recipe="recipe" :key="key" @cruded="on_RecipesView_cruded()"></RecipesView>
            </v-card>
        </v-dialog>
        <!-- DIALOG SHO IMAGE VIEW -->
        <v-dialog v-model="dialog_main_image_view" width="60%">
            <v-card class="pa-4">
                <v-img :src="selected_image" height="700" contain/>
            </v-card>
        </v-dialog>


        <!-- DIALOG MAIN PHOTO -->
        <v-dialog v-model="dialog_main_photo" width="60%" persistent>
            <v-card class="pa-4">
                <RecipesLinksCRUD :recipes_links="recipes_links" mode="C" :key="key"  @cruded="on_RecipesLinksCRUD_cruded()"></RecipesLinksCRUD>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_recipes,empty_recipes_links} from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import RecipesCRUD from './RecipesCRUD.vue'
    import RecipesView from './RecipesView.vue'
    import RecipesLinksCRUD from './RecipesLinksCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            RecipesCRUD,
            RecipesView,
            RecipesLinksCRUD,
        },
        data(){
            return {
                recipes:[],
                recipes_headers: [
                    { text: this.$t('Photo'), sortable: true, value: 'photo', width:"5%"},    
                    { text: this.$t('Name'), sortable: true, value: 'name'},    
                    { text: this.$t('Food type'), sortable: true, value: 'food_types', width: "15%"},
                    { text: this.$t('Categories'), sortable: true, value: 'categories', width: "15%"},
                    { text: this.$t('Valoration'), sortable: true, value: 'valoration', width: "7%"},
                    { text: this.$t('Guests'), sortable: true, value: 'guests', width: "5%"},
                    { text: this.$t('Soon'), sortable: true, value: 'soon', width: "5%"},
                    { text: this.$t('Last'), sortable: true, value: 'last', width: "10%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width: "8%"},
                ],


                loading:false,
                key:0,
                search: ":LAST:5",
                table_sort_by:"name",
                table_sort_desc:"",

                // RECIPE VIEW
                dialog_recipes_view:false,

                //CRUD RECIPES
                recipe:null,
                recipe_mode:null,
                dialog_recipes_crud:false,

                // VIEW IMAGE
                dialog_main_image_view: false,
                selected_image:null,

                //DIALOG MAIN PHOTO
                dialog_main_photo: false,
                recipes_links: null,
            }
        },     
        methods:{
            empty_recipes,
            empty_recipes_links,

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
                            {
                                name: this.$t("Show guests recipes"),
                                icon: "mdi-account-group",
                                code: function(this_){
                                    this_.search=":GUESTS"
                                    this_.on_search_change()
                                    this_.key=this_.key+1
                                },
                            },
                            {
                                name: this.$t("Show recipes to elaborate soon"),
                                icon: "mdi-account-group",
                                code: function(this_){
                                    this_.search=":SOON"
                                    this_.on_search_change()
                                    this_.key=this_.key+1
                                },
                            },
                            {
                                name: this.$t("Show evaluated recipes"),
                                icon: "mdi-account-group",
                                code: function(this_){
                                    this_.search=":VALORATION"
                                    this_.on_search_change()
                                    this_.key=this_.key+1
                                },
                            },
                            {
                                name: this.$t("Show last edited recipes"),
                                icon: "mdi-account-group",
                                code: function(this_){
                                    this_.search=":LAST:50"
                                    this_.on_search_change()
                                    this_.key=this_.key+1
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

                if (this.search==":SOON" || this.search.startsWith(":LAST")){
                    this.table_sort_by="last"
                    this.table_sort_desc=["last"]
                } else if (this.search==":GUESTS" || this.search==":VALORATION"){
                    this.table_sort_by="valoration"
                    this.table_sort_desc=["valoration"]
                } else{
                    this.table_sort_by="name"
                    this.table_sort_desc=[]

                }
                

                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/recipes/?search=${this.search}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.recipes=response.data
                    this.recipes.forEach(r=>{
                        r.content
                        axios.get(r.main_image_content, this.myheaders())
                        .then((response) => {
                            r.content=response.data
                            this.key=this.key+1
                        }, (error) => {
                            this.parseResponseError(error)
                        });
                    })
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            toggleFullscreen(item){
                this.selected_image=item.main_image
                this.dialog_main_image_view=true

            },            
            show_categories(item){
                var r=""
                item.recipes_categories.forEach(o=>{
                    var categorie=this.$store.getters.getObjectByUrl("recipes_categories",o)
                        r=r+ categorie.localname + ", "
                })
                return r.slice(0,-2)
            },
            addMainPhoto(item){
                this.recipes_links=this.empty_recipes_links()
                this.recipes_links.recipes=item.url
                this.recipes_links.type=this.$store.getters.getObjectPropertyById("recipes_links_types", 7,"url"), // Main page
                this.recipes_links.description=this.$t("Main photo")
                this.key=this.key+1
                this.dialog_main_photo=true

            },
            on_RecipesLinksCRUD_cruded(){
                this.dialog_main_photo=false
                this.update_recipes()

            },
            searchGoogle(item){

                window.open(`https://www.google.com/search?q=${encodeURIComponent(item.name)}`)
            },
            async get_url(url){
                console.log(url)
                if(!url) return ""

                let r
                await axios.get(url, this.myheaders())
                .then((response) => {
                    r=response.data
               }, (error) => {
                    this.parseResponseError(error)
                });
                return r
            }

        },
        mounted(){
            this.update_recipes()
            console.log(this.get_url("http://localhost:8011/api/files/3129/content/"))
        }
    }
</script>