<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field data-test="RecipesCRUD_Name" :readonly="mode=='D'" v-model="new_recipe.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200,true)" counter="200" autofocus/>
                <v-autocomplete data-test="RecipesCRUD_FoodTypes" :readonly="mode=='D'" :items="getArrayFromMap(useStore().food_types)" v-model="new_recipe.food_types" :label="$t('Select product food type')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete data-test="RecipesCRUD_RecipesCategories" :readonly="mode=='D'" :items="getArrayFromMap(useStore().recipes_categories)" v-model="new_recipe.recipes_categories" multiple chips :label="$t('Select recipe categories')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field  data-test="RecipesCRUD_Valoration" :readonly="mode=='D'" v-model.number="new_recipe.valoration" :label="$t('Set your valoration')" :placeholder="$t('Set your valoration')" :rules="RulesInteger(10,false)" counter="200"/>
                <v-checkbox data-test="RecipesCRUD_Guests" density="compact" :readonly="mode=='D'" v-model="new_recipe.guests" :label="$t('Is a recipe for guests?')"></v-checkbox>                
                <v-checkbox data-test="RecipesCRUD_Soon" density="compact" :readonly="mode=='D'" v-model="new_recipe.soon" :label="$t('Do you want to make it soon?')"></v-checkbox>                     
                <v-checkbox data-test="RecipesCRUD_Obsolete" density="compact" :readonly="mode=='D'" v-model="new_recipe.obsolete" :label="$t('Is obsolete?')"></v-checkbox>    
                <v-textarea data-test="RecipesCRUD_Comment" density="compact" :readonly="mode=='D'" v-model="new_recipe.comment" :label="$t('Set your comment')" :placeholder="$t('Set your comment')" :rules="RulesString(2000,false)" counter="2000"/>
        
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="RecipesCRUD_Button" color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
            </v-card-actions>
        </v-card>

    </div>
</template>
<script>
    import axios from 'axios'
    import {RulesSelection,RulesString,RulesInteger} from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        components: {
        },
        props: {
            
            recipe: { 
                required: true
            },
            mode: {
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_recipe: null,

                loading_products: false,

                key:0,
            }
        },
        methods: {
        useStore,
            RulesInteger,RulesSelection,RulesString,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new recipe')
                if (this.mode=="R") return this.$t('View this recipe')
                if (this.mode=="U") return this.$t('Update this recipe')
                if (this.mode=="D") return this.$t('Delete this recipe')
            },
            acceptDialog(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }

                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/recipes/`, this.new_recipe,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_recipe.url, this.new_recipe,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this recipe?"))
                    if(r == true) {
                        axios.delete(this.new_recipe.url, this.myheaders())
                        .then(() => {
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
        },
        created(){
            this.new_recipe=Object.assign({},this.recipe)
        }
    }
</script>

