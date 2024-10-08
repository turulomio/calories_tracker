<template>
    <div>
        <h1>{{ recipe.name }}
            <MyMenuInline :items="items" ></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :minimized_items="5" :key="key"></DisplayValues>

        <v-tabs  bg-color="primary" dark  v-model="tab" >
            <v-tab key="documentation">{{ $t('Documentation') }}<v-badge color="error" class="ml-2" inline :content="new_recipe.recipes_links.length.toString()"/></v-tab>
            <v-tab key="elaborations">{{ $t('Elaborations') }}<v-badge color="error" class="ml-2" inline :content="new_recipe.elaborations.length.toString()"/></v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item key="documentation">      
                <v-card outlined>
                    <TableRecipesLinks ref="table_links" :recipe="new_recipe" :key="key" @cruded="on_TableRecipesLinks_cruded()"></TableRecipesLinks>
                </v-card>
            </v-window-item>
            <v-window-item key="elaborations">  
                <v-card outlined>
                    <TableElaborations ref="table_elaborations" :recipe="new_recipe" :key="key" @cruded="on_TableElaborations_cruded()"></TableElaborations>
                </v-card>
            </v-window-item>
        </v-window>
        <!-- DIALOG RECIPES MERGE -->
        <v-dialog v-model="dialog_recipes_merge" width="60%">
            <v-card class="pa-4">
                <RecipesMerge :main_recipe="new_recipe" :key="key" @merged="on_RecipesMerge_merged"/>
            </v-card>
        </v-dialog>
    </div>  
</template>
<script>
    import axios from 'axios'
    import {localtime} from 'vuetify_rules'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import DisplayValues from './reusing/DisplayValues.vue'
    import RecipesMerge from './RecipesMerge.vue'
    import TableRecipesLinks from './TableRecipesLinks.vue'
    import TableElaborations from './TableElaborations.vue'
    import { useStore } from '@/store.js'
    export default {
        components:{
            DisplayValues,
            MyMenuInline,
            RecipesMerge,
            TableRecipesLinks,
            TableElaborations
        },
        props: {
            recipe: { //Is a item of RecipesFullViewSet
                required: true
            },
        },
        data () {
            return {
                tab:1,
                key:0,
                loading:true,
                items: [
                    {
                        subheader:this.$t('Recipe options'),
                        children: [
                            {
                                name:this.$t('New recipe link'),
                                code: async function(){
                                    if (this.tab!=0){
                                        this.tab=0
                                        await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                                    }
                                    this.$refs.table_links.on_new_click()
                                }.bind(this),
                                icon: "mdi-pencil",
                            },
                            {
                                name:this.$t('New recipe main photo'),
                                code: async function(){
                                    if (this.tab!=0){
                                        this.tab=0
                                        await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                                    }
                                    this.$refs.table_links.on_new_click(7)
                                }.bind(this),
                                icon: "mdi-pencil",
                            },
                            {
                                name:this.$t('New elaboration'),
                                code: function(){
                                    this.tab=1
                                    this.$refs.table_elaborations.on_new_click()
                                }.bind(this),
                                icon: "mdi-pencil",
                            },
                        ]
                    },
                    {
                        subheader:this.$t('Recipe utils'),
                        children: [
                            {
                                name:this.$t('Merge recipes in this one'),
                                code: function(){
                                    this.dialog_recipes_merge=true
                                }.bind(this),
                                icon: "mdi-merge",
                            },
                        ]
                    },
                ],
                dialog_recipes_merge:false,
            }  
        },
        watch:{
        },
        methods: { 
        useStore,
            localtime,       
            displayvalues(){
                return [
                    {title:this.$t('Created'), value: this.localtime(this.new_recipe.datetime)},
                    {title:this.$t('Last update'), value: this.localtime(this.new_recipe.last)},
                    {title:this.$t('Valoration'), value: this.new_recipe.valoration},
                    {title:this.$t('Is a recipe for guests?'), value: this.new_recipe.guests},
                    {title:this.$t('Do you want to make it soon?'), value: this.new_recipe.soon},
                    {title:this.$t('Id'), value: this.new_recipe.id},
                    {title:this.$t('Food type'), value: this.useStore().food_types.get(this.new_recipe.food_types).localname},

                ]
            },
            async on_TableRecipesLinks_cruded(){
                await this.update_recipe()
            },
            async on_TableElaborations_cruded(){
                await this.update_recipe()
            },
            async on_RecipesMerge_merged(){
                this.dialog_recipes_merge=false
                await this.update_recipe()
            },


            update_recipe(){
                axios.get(this.recipe.url, this.myheaders())
                .then((response) => {
                    this.new_recipe=response.data
                    this.update_thumbnails()
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_thumbnails(){            
                this.new_recipe.recipes_links.forEach(r=>{
                    r.thumbnail=null
                    if (r.files){// THERE IS A FILES
                        axios.get(r.files.url_thumbnail, this.myheaders())
                        .then((responsethumbnail) => {
                            r.thumbnail=responsethumbnail.data
                        }, (error) => {
                            this.parseResponseError(error)
                        });
                    }
                })
            },
        },
        created(){
            this.new_recipe=Object.assign({},this.recipe)
            this.update_thumbnails()
        }
    }
</script>
