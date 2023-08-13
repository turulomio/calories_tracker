<template>
    <div class="ma-4">
        <h1>{{ $t(`Recipes`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
        <v-card width="50%" class="mx-auto my-5" flat >
            <v-row class="mx-5 mb-5">
                <v-text-field ref="search" :disabled="loading" class="mb-3"  v-model="search" prepend-icon="mdi-magnify" :label="$t('Add a string to filter table')" single-line hide-details :placeholder="$t('Add a string to filter table')" v-on:keyup.enter="on_search_change()"></v-text-field>
                <v-icon dense class="ml-3" small @click="on_search_clean">mdi-backspace</v-icon>
            </v-row>
        </v-card>
        <v-data-table dense :headers="recipes_headers" :items="paginated_recipes.results" class="elevation-1 cursorpointer" :server-items-length="paginated_recipes.count" :options.sync="options"  @update:page="update_recipes" :loading="loading" item-key="content_url" @click:row="viewRecipe">
            <template v-slot:[`item.photo`]="{ item}"><v-img  v-if="item.thumbnail" :src="item.thumbnail" style="width: 50px; height: 50px" @click.stop="toggleFullscreen(item)" /></template>
            <template v-slot:[`item.name`]="{ item }"><div v-html="item.name"></div></template>      
            <template v-slot:[`item.last`]="{ item }">{{localtime(item.last)}}</template>      
            <template v-slot:[`item.recipes_categories`]="{ item }">{{show_categories(item)}}</template>      
            <template v-slot:[`item.food_types`]="{ item }"><div v-html="store().getters.getObjectPropertyByUrl('food_types', item.food_types,'localname')"></div></template> 
            <template v-slot:[`item.guests`]="{ item }"><v-icon small v-if="item.guests" >mdi-check-outline</v-icon></template>   
            <template v-slot:[`item.soon`]="{ item }"><v-icon small v-if="item.soon" >mdi-check-outline</v-icon></template>    
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-1" @click.stop="addMainPhoto(item)">mdi-link-variant</v-icon>
                <v-icon small class="mr-1" @click.stop="searchGoogle(item)">mdi-search-web</v-icon>
                <v-icon small class="mr-1" @click.stop="editRecipe(item)">mdi-pencil</v-icon>
                <v-icon small @click.stop="deleteRecipe(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>


        <!-- DIALOG RECIPES CRUD -->
        <v-dialog v-model="dialog_recipes_crud" width="45%">
            <v-card class="pa-4">
                <RecipesCRUD  :recipe="recipe" :mode="recipe_mode" :key="key" @cruded="on_RecipesCRUD_cruded"></RecipesCRUD>
            </v-card>
        </v-dialog>

        <!-- DIALOG RECIPES VIEW -->
        <v-dialog v-model="dialog_recipes_view" width="100%"  @click:outside="update_recipes(options)">
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

    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_recipes,empty_recipes_links} from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import RecipesCRUD from './RecipesCRUD.vue'
    import RecipesView from './RecipesView.vue'
    import RecipesLinksCRUD from './RecipesLinksCRUD.vue'
    import ShoppingList from './ShoppingList.vue'
    export default {
        components: {
            MyMenuInline,
            RecipesCRUD,
            RecipesView,
            RecipesLinksCRUD,
            ShoppingList,
        },
        watch: {
            options(newValue) {
                this.update_recipes(newValue)
            }
        },
        data(){
            return {
                paginated_recipes:{},
                recipes_headers: [
                    { text: this.$t('Photo'), sortable: false, value: 'photo', width:"5%"},    
                    { text: this.$t('Name'), sortable: true, value: 'name'},    
                    { text: this.$t('Food type'), sortable: true, value: 'food_types', width: "15%"},
                    { text: this.$t('Categories'), sortable: true, value: 'recipes_categories', width: "15%"},
                    { text: this.$t('Valoration'), sortable: true, value: 'valoration', width: "7%"},
                    { text: this.$t('Guests'), sortable: true, value: 'guests', width: "5%"},
                    { text: this.$t('Soon'), sortable: true, value: 'soon', width: "5%"},
                    { text: this.$t('Last'), sortable: true, value: 'last', width: "10%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width: "8%"},
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
                options: this.empty_options(),
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
                                    this_.recipe.food_types=this_.store().getters.getObjectPropertyById("food_types",19,"url")//Homemade food
                                    this_.key=this_.key+1
                                    this_.dialog_recipes_crud=true
                                },
                            },

                        ]
                    },
                    {
                        subheader: this.$t("Recipes queries"),
                        children: [
                            {
                                name: this.$t("Guests recipes"),
                                icon: "mdi-account-group",
                                code: function(this_){
                                    this_.search=":GUESTS"
                                    this_.options.multiSort=false
                                    this_.options.sortBy=["last"]
                                    this_.options.sortDesc=[true]
                                    this_.update_recipes(this_.options)
                                    this_.key=this_.key+1
                                },
                            },
                            {
                                name: this.$t("To elaborate soon"),
                                icon: "mdi-clock-outline",
                                code: function(this_){
                                    this_.search=":SOON"
                                    this_.options.multiSort=false
                                    this_.options.sortBy=["last"]
                                    this_.options.sortDesc=[true]
                                    this_.update_recipes(this_.options)
                                    this_.key=this_.key+1
                                },
                            },
                            {
                                name: this.$t("Evaluated"),
                                icon: "mdi-star-outline",
                                code: function(this_){
                                    this_.search=":VALORATION"
                                    this_.options.multiSort=true
                                    this_.options.sortBy=["valoration","last"]
                                    this_.options.sortDesc=[true,true]
                                    this_.update_recipes(this_.options)
                                    this_.key=this_.key+1
                                },
                            },
                            {
                                name: this.$t("Last edited"),
                                icon: "mdi-note-edit-outline",
                                code: function(this_){
                                    this_.search=":LAST"
                                    this_.options.multiSort=false
                                    this_.options.sortBy=["last"]
                                    this_.options.sortDesc=[true]
                                    this_.update_recipes(this_.options)
                                    this_.key=this_.key+1
                                },
                            },
                            {
                                name: this.$t("With elaborations"),
                                icon: "mdi-cog-outline",
                                code: function(this_){
                                    this_.search=":WITH_ELABORATIONS"
                                    this_.options.multiSort=false
                                    this_.options.sortBy=["last"]
                                    this_.options.sortDesc=[true]
                                    this_.update_recipes(this_.options)
                                    this_.key=this_.key+1
                                },
                            },
                            {
                                name: this.$t("Without main photo"),
                                icon: "mdi-image-off-outline",
                                code: function(this_){
                                    this_.search=":WITHOUT_MAINPHOTO"
                                    this_.options.multiSort=false
                                    this_.options.sortBy=["last"]
                                    this_.options.sortDesc=[true]
                                    this_.update_recipes(this_.options)
                                    this_.key=this_.key+1
                                },
                            },
                        ]
                    },
                    {
                        subheader: this.$t("Other options"),
                        children: [
                            {
                                name: this.$t("Shopping list"),
                                icon: "mdi-cart",
                                code: function(this_){
                                    this_.dialog_shopping_list=true
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
                this.update_recipes(this.options)
            },
            on_RecipesView_cruded(){
                this.update_recipes(this.options)
            },
            on_search_clean(){
                this.search=""
                this.$refs.search.focus()
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
                    this.recipe=item
                    this.key=this.key+1

                    this.dialog_recipes_view=true     
                // var recipe_full_url=item.url.replace("/recipes/","/recipes_full/")
                // axios.get(item.url, this.myheaders())
                // .then((response) => {
                //     this.recipe=response.data
                //     this.recipe.url_full=recipe_full_url
                //     this.recipe.url=item.url
                //     this.key=this.key+1

                //     this.dialog_recipes_view=true
                // }, (error) => {
                //     this.parseResponseError(error)
                // })
            },

            on_search_change(){
                //Pressing enter
                this.options.multiSort=false
                this.options.sortBy=["last"]
                this.options.sortDesc=[true]
                this.update_recipes(this.options)
            },
            update_recipes(options){                
                this.loading=true
                let headers={...this.myheaders(),params: options}
                axios.get(`${this.store().apiroot}/api/recipes/?search=${this.search}`, headers)
                .then((response) => {
                    response.data.results.forEach(r=>{
                        r.thumbnail=require("@/assets/no_image.jpg")
                        r.content_url=null //Needed to select only one rl
                        r.recipes_links.forEach(rl=>{
                            if (rl.files && this.id_from_hyperlinked_url(rl.type)==7){//MAIN IMAGE
                                axios.get(`${rl.files.url_thumbnail}`, this.myheaders())
                                .then((responsethumbnail) => {
                                    r.thumbnail=responsethumbnail.data
                                    r.content_url=rl.files.url_content
                                }, (error) => {
                                    this.parseResponseError(error)
                                });
                            }
                        })
                    })
                    this.paginated_recipes=response.data
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });
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
                    var categorie=this.store().getters.getObjectByUrl("recipes_categories",o)
                        r=r+ categorie.localname + ", "
                })
                return r.slice(0,-2)
            },
            addMainPhoto(item){
                this.recipes_links=this.empty_recipes_links()
                this.recipes_links.recipes=item.url
                this.recipes_links.type=this.store().getters.getObjectPropertyById("recipes_links_types", 7,"url"), // Main page
                this.recipes_links.description=this.$t("Main photo")
                this.key=this.key+1
                this.dialog_main_photo=true

            },
            on_RecipesLinksCRUD_cruded(){
                this.dialog_main_photo=false
                this.update_recipes(this.options)

            },
            searchGoogle(item){

                window.open(`https://www.google.com/search?q=${encodeURIComponent(item.name)}`)
            },
            empty_options(){
                return {
                    groupBy: [],
                    groupDesc: [],
                    itemsPerPage: 10,
                    multiSort: false,
                    mustSort:true,
                    page:1,
                    sortBy: ["last"],
                    sortDesc: [true],

                }
            },
        },
        mounted(){
        }
    }
</script>