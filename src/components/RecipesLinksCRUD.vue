<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field :readonly="mode=='D'" v-model="new_recipe.name" :label="$t('Set name')" :placeholder="$t('Set name')" :rules="RulesString(200)" counter="200"/>
                <v-autocomplete :readonly="mode=='D'" :items="$store.state.food_types" v-model="new_recipe.food_types" :label="$t('Select product food type')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-textarea :readonly="mode=='D'" v-model="new_recipe.comment" :label="$t('Set your comment')" :placeholder="$t('Set your comment')" :rules="RulesString(2000,false)" counter="2000"/>
                <v-checkbox v-model="new_recipe.obsolete" :label="$t('Is obsolete?')"></v-checkbox>                
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn> 
                <v-btn color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>

    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        components: {
        },
        props: {
            
            recipes_links: { 
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
                if( this.$refs.form.validate()==false) return

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/recipes/`, this.new_recipe,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_recipe.url, this.new_recipe,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this recipe?"))
                    if(r == true) {
                        axios.delete(this.new_recipe.url, this.myheaders())
                        .then((response) => {
                            console.log(response.data)
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

