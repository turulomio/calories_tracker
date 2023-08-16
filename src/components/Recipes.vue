<template>
    <div class="ma-4">
        <h1>{{ $t(`Recipes`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
        <v-card width="50%" class="mx-auto my-5" flat >
            <v-row class="mx-5 mb-5">
                <v-text-field clearable ref="search" :disabled="loading" class="mb-3"  v-model="search" prepend-icon="mdi-magnify" :label="$t('Add a string to filter table')" single-line hide-details :placeholder="$t('Add a string to filter table')" v-on:keyup.enter="on_search_change()"></v-text-field>
            </v-row>
        </v-card>
        <v-data-table density="compact" :headers="recipes_headers" :items="paginated_recipes.results" class="elevation-1 cursorpointer" :server-items-length="paginated_recipes.count" :options.sync="options"  @update:page="update_recipes" :loading="loading" item-value="content_url" @click:row="viewRecipe">
            <template #item.photo="{item}"><v-img  v-if="item.raw.thumbnail" :src="item.raw.thumbnail" style="width: 50px; height: 50px" @click.stop="toggleFullscreen(item.raw)" /></template>
            <template #item.name="{item}"><div v-html="item.raw.name"></div></template>      
            <template #item.last="{item}">{{localtime(item.raw.last)}}</template>      
            <template #item.recipes_categories="{item}">{{show_categories(item.raw)}}</template>      
            <template #item.food_types="{item}"><div v-html="store().food_types.get(item.raw.food_types).localname"></div></template> 
            <template #item.guests="{item}"><v-icon small v-if="item.raw.guests" >mdi-check-outline</v-icon></template>   
            <template #item.soon="{item}"><v-icon small v-if="item.raw.soon" >mdi-check-outline</v-icon></template>    
            <template #item.actions="{item}">
                <v-icon small class="mr-1" @click.stop="addMainPhoto(item.raw)">mdi-link-variant</v-icon>
                <v-icon small class="mr-1" @click.stop="searchGoogle(item.raw)">mdi-search-web</v-icon>
                <v-icon small class="mr-1" @click.stop="editRecipe(item.raw)">mdi-pencil</v-icon>
                <v-icon small @click.stop="deleteRecipe(item.raw)">mdi-delete</v-icon>
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
    import imgNoImage from "@/assets/no_image.jpg"
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
                                code: function(){
                                    this.recipe_mode="C"
                                    this.recipe=this.empty_recipes()
                                    this.recipe.food_types=this.store().getters.getObjectPropertyById("food_types",19,"url")//Homemade food
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
                                    this.options.multiSort=false
                                    this.options.sortBy=["last"]
                                    this.options.sortDesc=[true]
                                    this.update_recipes(this.options)
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("To elaborate soon"),
                                icon: "mdi-clock-outline",
                                code: function(){
                                    this.search=":SOON"
                                    this.options.multiSort=false
                                    this.options.sortBy=["last"]
                                    this.options.sortDesc=[true]
                                    this.update_recipes(this.options)
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("Evaluated"),
                                icon: "mdi-star-outline",
                                code: function(){
                                    this.search=":VALORATION"
                                    this.options.multiSort=true
                                    this.options.sortBy=["valoration","last"]
                                    this.options.sortDesc=[true,true]
                                    this.update_recipes(this.options)
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("Last edited"),
                                icon: "mdi-note-edit-outline",
                                code: function(){
                                    this.search=":LAST"
                                    this.options.multiSort=false
                                    this.options.sortBy=["last"]
                                    this.options.sortDesc=[true]
                                    this.update_recipes(this.options)
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("With elaborations"),
                                icon: "mdi-cog-outline",
                                code: function(){
                                    this.search=":WITH_ELABORATIONS"
                                    this.options.multiSort=false
                                    this.options.sortBy=["last"]
                                    this.options.sortDesc=[true]
                                    this.update_recipes(this.options)
                                    this.key=this.key+1
                                }.bind(this),
                            },
                            {
                                name: this.$t("Without main photo"),
                                icon: "mdi-image-off-outline",
                                code: function(){
                                    this.search=":WITHOUT_MAINPHOTO"
                                    this.options.multiSort=false
                                    this.options.sortBy=["last"]
                                    this.options.sortDesc=[true]
                                    this.update_recipes(this.options)
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
                    this.recipe=object.item.raw
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
                        r.thumbnail=imgNoImage
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
                    var categorie=this.store().recipes_categories.get(o)
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