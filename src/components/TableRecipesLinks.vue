<template>
    <div>
        <v-data-table density="compact" :headers="table_headers" :items="recipe.recipes_links" class="elevation-1" disable-pagination  hide-default-footer sort-by="date" fixed-header :height="$attrs.height" ref="table_recipes_links">
            <template v-slot:[`item.photo`]="{ item}"><v-img  v-if="item.thumbnail" :src="item.thumbnail" style="width: 50px; height: 50px"/></template>
            <template v-slot:[`item.type`]="{ item }"><div v-html="store().getters.getObjectPropertyByUrl('recipes_links_types', item.type,'localname')"></div></template> 
            <template v-slot:[`item.link`]="{ item }"><div @click="on_link_click(item)">{{item.link}}</div></template> 
            <template v-slot:[`item.mime`]="{ item }">{{ show_mime(item)}}</template> 
            <template v-slot:[`item.size`]="{ item }">{{ show_size(item)}}</template> 
            
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon v-if="item.files" small class="mr-2" @click="downloadItem(item)">mdi-download</v-icon>
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- ItemCRUD DIALOG -->
        <v-dialog v-model="recipes_links_crud_dialog" width="70%">
            <v-card class="pa-3">
                <RecipesLinksCRUD :recipes_links="recipes_links" :mode="recipes_links_crud_mode" :key="key"  @cruded="on_RecipesLinksCRUD_cruded()"></RecipesLinksCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
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
                    { text: this.$t('Photo'), value: 'photo', sortable: true,width:"7%"},
                    { text: this.$t('Description'), value: 'description', sortable: true},
                    { text: this.$t('Type'), value: 'type', sortable: false, width:"10%"},
                    { text: this.$t('Link'), value: 'link', sortable: true, width:"40%"},
                    { text: this.$t('Mime'), value: 'mime', sortable: false , width:"15%"},
                    { text: this.$t('Size'), value: 'size', sortable: false , width:"15%"},
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

            on_new_click(type=3){
                this.recipes_links=this.empty_recipes_links()
                this.recipes_links.recipes=this.recipe.url
                this.recipes_links.type=this.store().getters.getObjectPropertyById("recipes_links_types", type,"url"), // Web page link
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
                this.$emit("cruded")
            },

            downloadItem(item){
                axios.get(item.files.url_content, this.myheaders())
                .then((response) => {
                    const downloadLink = document.createElement("a")
                    downloadLink.href = response.data
                    downloadLink.download = `CT.RL.${this.recipe.name.slice(0,30)}.${item.id}${item.files.extension}`
                    downloadLink.click()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            show_mime(item){
                if (item.files){
                    return item.files.mime
                }
                return ""

            },
            show_size(item){
                if (item.files){
                    return item.files.humansize
                }
                return ""

            }
        },
    }
</script>