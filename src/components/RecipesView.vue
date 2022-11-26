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
    import axios from 'axios'
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
                        subheader:this.$t('Investment orders'),
                        children: [
                            {
                                name:this.$t('Change active status'),
                                code: function(this_){
                                    this_.investment.active=!this_.investment.active
                                    axios.put(this_.investment.url, this_.investment,  this_.myheaders())
                                    .then(() => {
                                        this_.$emit("cruded")
                                    }, (error) => {
                                        this_.parseResponseError(error)
                                    })
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
