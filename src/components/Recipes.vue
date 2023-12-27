<template>
    <div class="ma-4">
        <h1>{{ $t(`Recipes`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
        <v-card width="50%" class="mx-auto my-5" flat >
                <v-text-field clearable density="default" :disabled="loading" class="mb-3"  v-model="search" prepend-icon="mdi-magnify" :label="$t('Add a string to filter table')" single-line hide-details :placeholder="$t('Add a string to filter table')" @keyup.enter="on_search_change()" />
        </v-card>
        <v-data-table-server ref="table" :headers="recipes_headers" :items="items" class="elevation-1 cursorpointer" :items-length="itemsLength" :search="search" v-model:items-per-page="itemsPerPage" v-model:page="page" v-model:sort-by="sortBy" :loading="loading" item-value="content_url" @click:row="viewRecipe" :key="key+1" >
            <template #item.photo="{item}"><v-img  v-if="item.thumbnail" :src="item.thumbnail" style="width: 50px; height: 50px" @click.stop="toggleFullscreen(item)" /></template>
            <template #item.name="{item}"><div v-html="item.name"></div></template>      
            <template #item.last="{item}">{{localtime(item.last)}}</template>      
            <template #item.recipes_categories="{item}">{{show_categories(item)}}</template>      
            <template #item.food_types="{item}"><div v-html="useStore().food_types.get(item.food_types).localname"></div></template> 
            <template #item.guests="{item}"><v-icon small v-if="item.guests" >mdi-check-outline</v-icon></template>   
            <template #item.soon="{item}"><v-icon small v-if="item.soon" >mdi-check-outline</v-icon></template>    
            <template #item.actions="{item}">
                <v-icon small class="mr-1" @click.stop="addMainPhoto(item)">mdi-link-variant</v-icon>
                <v-icon small class="mr-1" @click.stop="searchGoogle(item)">mdi-search-web</v-icon>
                <v-icon small class="mr-1" @click.stop="editRecipe(item)">mdi-pencil</v-icon>
                <v-icon small @click.stop="deleteRecipe(item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>


        <!-- DIALOG RECIPES CRUD -->
        <v-dialog v-model="dialog_recipes_crud" width="45%">
            <v-card class="pa-4">
                <RecipesCRUD  :recipe="recipe" :mode="recipe_mode" :key="key" @cruded="on_RecipesCRUD_cruded"></RecipesCRUD>
            </v-card>
        </v-dialog>

        <!-- DIALOG RECIPES VIEW -->
        <v-dialog v-model="dialog_recipes_view" width="100%"  @click:outside="update_recipes">
            <v-card class="pa-4">
                <RecipesView  :recipe="recipe" :key="key"></RecipesView>
            </v-card>
        </v-dialog>

        <!-- DIALOG SHOW IMAGE VIEW -->
        <v-dialog v-model="dialog_main_image_view" width="60%">
            <v-card class="pa-4">
                <v-img :loading="loading_image" :src="selected_image" height="600" contain/>
            </v-card>
        </v-dialog>


        <!-- DIALOG MAIN PHOTO -->
        <v-dialog v-model="dialog_main_photo" width="60%" persistent>
            <v-card class="pa-4">
                <RecipesLinksCRUD :recipes_links="recipes_links" mode="C" :key="key"  @cruded="on_RecipesLinksCRUD_cruded"></RecipesLinksCRUD>
            </v-card>
        </v-dialog>

        <!-- DIALOG SHOPPING LIST -->
        <v-dialog v-model="dialog_shopping_list" width="60%">
            <v-card class="pa-4">
                <ShoppingList :key="key"/>
            </v-card>
        </v-dialog>

        <!-- DIALOG SEARCH BY INGREDIENTS -->
        <v-dialog v-model="dialog_recipes_by_ingredients" width="60%">
            <v-card class="pa-4">
                <RecipesByIngredients :key="key" @selected="on_RecipesByIngredients_selected"/>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_recipes,empty_recipes_links} from '../empty_objects.js'
    import {localtime} from 'vuetify_rules'
    import imgNoImage from "@/assets/no_image.jpg"
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import RecipesCRUD from './RecipesCRUD.vue'
    import RecipesView from './RecipesView.vue'
    import RecipesLinksCRUD from './RecipesLinksCRUD.vue'
    import ShoppingList from './ShoppingList.vue'
    import RecipesByIngredients from './RecipesByIngredients.vue'
    import { id_from_hyperlinked_url, hyperlinked_url } from '@/functions'
    import { useStore } from '@/store.js'
    export default {
        components: {
            MyMenuInline,
            RecipesCRUD,
            RecipesView,
            RecipesLinksCRUD,
            ShoppingList,
            RecipesByIngredients
        },
        watch: {
            itemsPerPage(){
                this.update_recipes()
            },
            page(){
                this.update_recipes()
            },
            sortBy(){
                this.update_recipes()
            },
        },
        data(){
            return {
                //Pagination
                multiSort:true,
                items:[],
                totalPages:1,
                itemsPerPage:10,
                page:1,
                sortBy:[{key:"last",order:"desc"}],
                itemsLength:0,
                
                
                recipes_headers: [
                    { title: this.$t('Photo'), sortable: false, key: 'photo', width:"5%"},    
                    { title: this.$t('Name'), sortable: true, key: 'name'},    
                    { title: this.$t('Food type'), sortable: true, key: 'food_types', width: "15%"},
                    { title: this.$t('Categories'), sortable: true, key: 'recipes_categories', width: "15%"},
                    { title: this.$t('Valoration'), sortable: true, key: 'valoration', width: "7%"},
                    { title: this.$t('Guests'), sortable: true, key: 'guests', width: "5%"},
                    { title: this.$t('Soon'), sortable: true, key: 'soon', width: "5%"},
                    { title: this.$t('Last'), sortable: true, key: 'last', width: "10%"},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width: "8%"},
                ],


                loading:false,
                key:0,
                search: ":LAST",

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
                loading_image:false,

                //DIALOG SHOPPING LIST
                dialog_shopping_list:false,

                //DIALOG RECIPES BY INGREDIENTS
                dialog_recipes_by_ingredients: false,
            }
        },
        methods:{
        useStore,
            id_from_hyperlinked_url,
            hyperlinked_url,
            empty_recipes,
            empty_recipes_links,
            localtime,
            menuinline_items(){
                let r= [
                    {
                        subheader: this.$t("Recipes options"),
                        children: [
                            {
                                name: this.$t("Add a new recipe"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.recipe_mode="C"
                                    this.recipe=this.empty_recipes()
                                    this.recipe.food_types=this.hyperlinked_url("food_types",19)//Homemade food
                                    this.key=this.key+1
                                    this.dialog_recipes_crud=true
                                }.bind(this),
                            },

                        ]
                    },
                    {
                        subheader: this.$t("Recipes queries"),
                        children: [
                            {
                                name: this.$t("Guests recipes"),
                                icon: "mdi-account-group",
                                code: function(){
                                    this.search=":GUESTS"
                                    this.multiSort=false
                                    this.sortBy=[{key:"last", order:"desc"}]
                                    this.update_recipes()
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("To elaborate soon"),
                                icon: "mdi-clock-outline",
                                code: function(){
                                    this.search=":SOON"
                                    this.multiSort=false
                                    this.sortBy=[{key:"last", order:"desc"}]
                                    this.update_recipes()
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("Evaluated"),
                                icon: "mdi-star-outline",
                                code: function(){
                                    this.search=":VALORATION"
                                    this.multiSort=true
                                    this.sortBy=[{key:"valoration", order:"desc"},{key:"last", order:"desc"}]
                                    this.update_recipes()
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("Last edited"),
                                icon: "mdi-note-edit-outline",
                                code: function(){
                                    this.search=":LAST"
                                    this.multiSort=false
                                    this.sortBy=[{key:"last", order:"desc"}]
                                    this.update_recipes()
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("With elaborations"),
                                icon: "mdi-cog-outline",
                                code: function(){
                                    this.search=":WITH_ELABORATIONS"
                                    this.multiSort=false
                                    this.sortBy=[{key:"last", order:"desc"}]
                                    this.update_recipes()
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("Without main photo"),
                                icon: "mdi-image-off-outline",
                                code: function(){
                                    this.search=":WITHOUT_MAINPHOTO"
                                    this.multiSort=false
                                    this.sortBy=[{key:"last", order:"desc"}]
                                    this.update_recipes()
                                    this.key=this.key+1
                                }.bind(this),
                            },
                        ]
                    },
                    {
                        subheader: this.$t("Other options"),
                        children: [
                            {
                                name: this.$t("Shopping list"),
                                icon: "mdi-cart",
                                code: function(){
                                    this.dialog_shopping_list=true
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("Search recipes by ingredients"),
                                icon: "mdi-magnify",
                                code: function(){
                                    this.dialog_recipes_by_ingredients=true
                                    this.key=this.key+1
                                }.bind(this),
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
            viewRecipe(event,object){       
                    this.recipe=object.item
                    this.key=this.key+1

                    this.dialog_recipes_view=true
            },

            on_search_change(){
                 this.update_recipes()
            },
            update_recipes(){
                this.loading=true
                let headers={...this.myheaders(),params: {
                        search:this.search,
                        page:this.page,
                        itemsPerPage:this.itemsPerPage,
                        sortBy:this.sortBy,
                        multiSort:this.multiSort,
                }}
                axios.get(`${this.useStore().apiroot}/api/recipes/`, headers)
                .then((response) => {
                    console.log(response.data)
                    this.items=response.data.results
                    this.itemsLength=response.data.count
                    this.totalPages=response.data.total_pages
                    this.items.forEach(r=>{
                        r.thumbnail=imgNoImage
                        r.content_url=null //Needed to select only one rl
                    })
                    this.update_images()
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_images(){
                var promises=[]
                this.items.forEach(recipe=>{
                    recipe.recipes_links.forEach(rl=>{
                        if (rl.files && this.id_from_hyperlinked_url(rl.type)==7){//MAIN IMAGE
                            promises.push(axios.get(`${rl.files.url_thumbnail}`, this.myheaders())                    
                            .then((responsethumbnail) => {
                                    recipe.thumbnail=responsethumbnail.data
                                    recipe.content_url=rl.files.url_content
                                }, (error) => {
                                    this.parseResponseError(error)
                                })
                            )
                        }
                    })
                })
            },
            toggleFullscreen(item){
                if (item.content_url==null) return
                this.key=this.key+1
                this.dialog_main_image_view=true
                axios.get(item.content_url, this.myheaders())
                .then((response) => {
                    this.selected_image=response.data
                }, (error) => {
                    this.parseResponseError(error)
                });

            },            
            show_categories(item){
                var r=""
                item.recipes_categories.forEach(o=>{
                    var categorie=this.useStore().recipes_categories.get(o)
                        r=r+ categorie.localname + ", "
                })
                return r.slice(0,-2)
            },
            addMainPhoto(item){
                this.recipes_links=this.empty_recipes_links()
                this.recipes_links.recipes=item.url
                this.recipes_links.type=this.hyperlinked_url("recipes_links_types", 7), // Main page
                this.recipes_links.description=this.$t("Main photo")
                this.key=this.key+1
                this.dialog_main_photo=true

            },
            on_RecipesLinksCRUD_cruded(){
                this.dialog_main_photo=false
                this.update_recipes()

            },
            on_RecipesByIngredients_selected(s){
                this.search=s
                this.dialog_recipes_by_ingredients=false
                this.update_recipes()
            },
            searchGoogle(item){
                window.open(`https://www.google.com/search?q=${encodeURIComponent(item.name)}`)
            },
        },
        mounted(){
            this.update_recipes()
        }
    }
</script>