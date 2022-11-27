<template>
    <div>
        <h1>{{ recipe.name }}
            <MyMenuInline :items="items"  :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :key="key"></DisplayValues>

        <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
            <v-tab key="documentation">{{ $t('Documentation') }}</v-tab>
            <v-tab key="elaborations">{{ $t('Elaborations') }}</v-tab>
            <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs>
        <v-tabs-items>
            <v-tab-item key="documentation">      
                <div>
                </div>
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
    export default {
        components:{
            DisplayValues,
            MyMenuInline,
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
                    {title:this.$t('Id'), value: this.recipe.id},
                    {title:this.$t('Food type'), value: this.$store.getters.getObjectPropertyByUrl("food_types", this.recipe.food_types,"localname")},
                ]
            },
            
        },
        created(){
        }
    }
</script>
