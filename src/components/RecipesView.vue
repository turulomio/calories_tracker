<template>
    <div>
        <h1>{{ recipe.name }}
            <MyMenuInline :items="items"  :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :key="key"></DisplayValues>

        <v-tabs  background-color="primary" dark  v-model="tab" >
            <v-tab key="documentation">{{ $t('Documentation') }}</v-tab>
            <v-tab key="elaborations">{{ $t('Elaborations') }}</v-tab>
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
                                    console.log(this_.$refs)
                                    this_.tab=0
                                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                                    this_.$refs.table_links.on_new_click()
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
                            {
                                name:this.$t('Generate PDF'),
                                code: function(this_){
                                    console.log(this_)
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
                    {title:this.$t('Valoration'), value: this.new_recipe.valoration},
                    {title:this.$t('Is a recipe for guests?'), value: this.new_recipe.guests},
                    {title:this.$t('Do you want to make it soon?'), value: this.new_recipe.soon},
                    {title:this.$t('Id'), value: this.new_recipe.id},
                    {title:this.$t('Food type'), value: this.$store.getters.getObjectPropertyByUrl("food_types", this.new_recipe.food_types,"localname")},

                ]
            },
            on_TableRecipesLinks_cruded(){
                return axios.get(`${this.$store.state.apiroot}/api/recipes_links/?recipes=${this.new_recipe.url}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.new_recipe.recipes_links=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_TableElaborations_cruded(){
                return axios.get(`${this.$store.state.apiroot}/api/elaborations/?recipes=${this.new_recipe.url}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.new_recipe.elaborations=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_recipe(){

                axios.get(this.recipe.url, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.new_recipe=response.data
                    this.key=this.key+1
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                });
            }
        },
        created(){
            this.new_recipe=Object.assign({},this.recipe)
        }
    }
</script>
