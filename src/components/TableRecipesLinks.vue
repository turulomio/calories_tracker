<template>
    <div>
        <div class="d-flex justify-end"><v-btn color="primary" dark @click="on_new_click()"><v-icon small>mdi-plus</v-icon>{{$t("New recipe link")}}</v-btn></div>
           
        <v-data-table dense :headers="table_headers" :items="recipe.recipes_links" class="elevation-1" disable-pagination  hide-default-footer sort-by="date" fixed-header :height="$attrs.height" ref="table_recipes_links">
            <template v-slot:[`item.type`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('recipes_links_types', item.type,'localname')"></div></template> 
            <template v-slot:[`item.link`]="{ item }"><div @click="on_link_click(item)">{{item.link}}</div></template> 
            
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon v-if="item.content" small class="mr-2" @click="downloadItem(item)">mdi-download</v-icon>
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- ItemCRUD DIALOG -->
        <v-dialog v-model="recipes_links_crud_dialog" width="35%">
            <v-card class="pa-3">
                <RecipesLinksCRUD :recipes_links="recipes_links" :mode="recipes_links_crud_mode" :key="key"  @cruded="on_RecipesLinksCRUD_cruded()"></RecipesLinksCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import RecipesLinksCRUD from './RecipesLinksCRUD.vue'
    import {empty_recipes_links} from '../empty_objects.js'
    export default {
        components:{
            RecipesLinksCRUD,
        },
        props: {
            recipe: { //Global recipe seriealizer
                required: true
            },
        },
        data: function(){
            return {
                recipes_links_crud_dialog:false,
                recipes_links_crud_mode:null,

                table_headers: [
                    { text: this.$t('Description'), value: 'description', sortable: true},
                    { text: this.$t('Type'), value: 'type', sortable: false, width:"10%"},
                    { text: this.$t('Link'), value: 'link', sortable: true, width:"40%"},
                    { text: this.$t('Mime'), value: 'mime', sortable: false , width:"15%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width: "7%"},
                ],
                items:[],
                key: 0,

                recipes_links:null,
            }
        },
        methods: {
            empty_recipes_links,
            on_link_click(item){
                window.open(item.link, '_blank').focus()
            },

            on_new_click(){
                this.recipes_links=this.empty_recipes_links()
                this.recipes_links.recipes=this.recipe.url
                this.recipes_links.type=this.$store.getters.getObjectPropertyById("recipes_links_types", 3,"url"), // Web page link
                console.log(this.recipes_links)
                this.recipes_links_crud_mode="C"
                this.key=this.key+1
                this.recipes_links_crud_dialog=true
            },
            editItem(item){
                this.recipes_links=item
                this.recipes_links_crud_mode="U"
                this.key=this.key+1
                this.recipes_links_crud_dialog=true
            },
            deleteItem(item){
                this.recipes_links=item
                this.recipes_links_crud_mode="D"
                this.key=this.key+1
                this.recipes_links_crud_dialog=true
            },
            gotoLastRow(){
                this.$vuetify.goTo(10000, { container:  this.$refs.table_recipes_links.$el.childNodes[0] }) 
            },
            on_RecipesLinksCRUD_cruded(){
                this.key=this.key+1
                this.recipes_links_crud_dialog=false
                console.log("CRUDED TABLE RECIPESLINKS")
                this.$emit("cruded")
            },

            downloadItem(item){
                const linkSource = `data:${item.mime};base64,${item.content}`
                const downloadLink = document.createElement("a")
                downloadLink.href = linkSource
                downloadLink.download = `CT.RL.${this.recipe.name.slice(0,30)}.${item.id}`
                downloadLink.click()
            },
        },
        created(){
        }
    }
</script>