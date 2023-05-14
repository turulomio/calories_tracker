<template>
    <div>
        <h1>{{ recipe.name }}
            <MyMenuInline :items="items"  :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :minimized_items="5" :key="key"></DisplayValues>

        <v-tabs  background-color="primary" dark  v-model="tab" >
            <v-tab key="documentation">{{ $t('Documentation') }}<v-badge color="error" class="ml-2" inline :content="new_recipe.recipes_links.length.toString()"/></v-tab>
            <v-tab key="elaborations">{{ $t('Elaborations') }}<v-badge color="error" class="ml-2" inline :content="new_recipe.elaborations.length.toString()"/></v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="documentation">      
                <v-card outlined>
                    <TableRecipesLinks ref="table_links" :recipe="new_recipe" :key="key" @cruded="on_TableRecipesLinks_cruded()"></TableRecipesLinks>
                </v-card>
            </v-tab-item>
            <v-tab-item key="elaborations">  
                <v-card outlined>
                    <TableElaborations ref="table_elaborations" :recipe="new_recipe" :key="key" @cruded="on_TableElaborations_cruded()"></TableElaborations>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>  
</template>
<script>
    import axios from 'axios'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import DisplayValues from './reusing/DisplayValues.vue'
    import TableRecipesLinks from './TableRecipesLinks.vue'
    import TableElaborations from './TableElaborations.vue'
    export default {
        components:{
            DisplayValues,
            MyMenuInline,
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
                                code: async function(this_){
                                    if (this_.tab!=0){
                                        this_.tab=0
                                        await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                                    }
                                    this_.$refs.table_links.on_new_click()
                                },
                                icon: "mdi-pencil",
                            },
                            {
                                name:this.$t('New recipe main photo'),
                                code: async function(this_){
                                    if (this_.tab!=0){
                                        this_.tab=0
                                        await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                                    }
                                    this_.$refs.table_links.on_new_click(7)
                                },
                                icon: "mdi-pencil",
                            },
                            {
                                name:this.$t('New elaboration'),
                                code: function(this_){
                                    this_.tab=1
                                    this_.$refs.table_elaborations.on_new_click()
                                },
                                icon: "mdi-pencil",
                            },
                        ]
                    },
                ],
            }  
        },
        watch:{
        },
        methods: {        
            displayvalues(){
                return [
                    {title:this.$t('Created'), value: this.localtime(this.new_recipe.datetime)},
                    {title:this.$t('Last update'), value: this.localtime(this.new_recipe.last)},
                    {title:this.$t('Valoration'), value: this.new_recipe.valoration},
                    {title:this.$t('Is a recipe for guests?'), value: this.new_recipe.guests},
                    {title:this.$t('Do you want to make it soon?'), value: this.new_recipe.soon},
                    {title:this.$t('Id'), value: this.new_recipe.id},
                    {title:this.$t('Food type'), value: this.$store.getters.getObjectPropertyByUrl("food_types", this.new_recipe.food_types,"localname")},

                ]
            },
            on_TableRecipesLinks_cruded(){
                this.update_recipe()
            },
            on_TableElaborations_cruded(){
                return axios.get(`${this.$store.state.apiroot}/api/elaborations/?recipes=${this.new_recipe.url}`, this.myheaders())
                .then((response) => {
                    this.new_recipe.elaborations=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
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
