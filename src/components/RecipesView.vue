<template>
    <div>
        <h1>{{ recipe.name }}
            <MyMenuInline :items="items"  :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :key="key"></DisplayValues>

        <v-tabs  background-color="primary" dark  >
            <v-tab key="documentation">{{ $t('Documentation') }}</v-tab>
            <v-tab key="elaborations">{{ $t('Elaborations') }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="documentation">      
                <v-card outlined>
                    <TableRecipesLinks :recipe="recipe" :key="key" @click="on_TableRecipesLinks_cruded()"></TableRecipesLinks>
                </v-card>
            </v-tab-item>
            <v-tab-item key="elaborations">          
                <div>
                </div>
            </v-tab-item>
        </v-tabs-items>
    </div>  
</template>
<script>
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import DisplayValues from './reusing/DisplayValues.vue'
    import TableRecipesLinks from './TableRecipesLinks.vue'
    export default {
        components:{
            DisplayValues,
            MyMenuInline,
            TableRecipesLinks,
        },
        props: {
            recipe: {
                required: true
            },
        },
        data () {
            return {
                tab:0,
                key:0,
                loading:true,
                items: [
                    {
                        subheader:this.$t('Recipe options'),
                        children: [
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
                    {title:this.$t('Valoration'), value: this.recipe.valoration},
                    {title:this.$t('Is a recipe for guests?'), value: this.recipe.guests},
                    {title:this.$t('Do you want to make it soon?'), value: this.recipe.soon},
                    {title:this.$t('Id'), value: this.recipe.id},
                    {title:this.$t('Food type'), value: this.$store.getters.getObjectPropertyByUrl("food_types", this.recipe.food_types,"localname")},

                ]
            },
            on_TableRecipesLinks_cruded(){
                this.$emit("cruded")
            },
        },
        created(){
        }
    }
</script>
