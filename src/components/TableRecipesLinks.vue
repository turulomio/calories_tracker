<template>
    <div>
        <div class="d-flex justify-end"><v-btn color="primary" dark ><v-icon small>mdi-plus</v-icon>{{$t("New recipe link")}}</v-btn></div>
           
        <v-data-table dense :headers="table_headers" :items="recipe.recipes_links" class="elevation-1" disable-pagination  hide-default-footer sort-by="date" fixed-header :height="$attrs.height" ref="table_recipes_links">
             <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editDPS(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteDPS(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- DPSCRUD DIALOG -->
        <v-dialog v-model="recipes_links_crud_dialog" width="35%">
            <v-card class="pa-3">
                <RecipesLinksCRUD :recipes_links="recipes_links" :mode="recipes_links_crud_mode" :key="key"  @cruded="on_RecipesLinksCRUD_cruded()"></RecipesLinksCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import RecipesLinksCRUD from './RecipesLinksCRUD.vue'
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
                    { text: this.$t('Description'), value: 'description', sortable: true, width:"25%"},
                    { text: this.$t('Type'), value: 'type', sortable: false, width:"25%"},
                    { text: this.$t('Link'), value: 'link', sortable: true, align:"right" , width:"25%"},
                    { text: this.$t('Mime'), value: 'mime', sortable: false , width:"25%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width: "10%"},
                ],
                items:[],
                key: 0,

                recipes_links:null,
            }
        },
        methods: {
            editDPS(item){
                this.recipes_links=item
                this.recipes_links_crud_mode="U"
                this.key=this.key+1
                this.recipes_links_crud_dialog=true
            },
            deleteDPS(item){
                this.recipes_links=item
                this.recipes_links_crud_mode="D"
                this.key=this.key+1
                this.recipes_links_crud_dialog=true
            },
            gotoLastRow(){
                this.$vuetify.goTo(10000, { container:  this.$refs.table_recipes_links.$el.childNodes[0] }) 
            },
            on_RecipesLinksCRUD_cruded(){
                this.$emit("cruded")
                this.recipes_links_crud_dialog=false
            },
        },
        created(){
        }
    }
</script>