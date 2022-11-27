<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field :readonly="mode=='D'" v-model="new_recipes_links.description" :label="$t('Set description')" :placeholder="$t('Set description')" :rules="RulesString(200,true)" counter="200"/>
                <v-autocomplete :readonly="mode=='D'" :items="$store.state.recipes_links_types" v-model="new_recipes_links.type" :label="$t('Select type')" item-text="localname" item-value="url" :rules="RulesSelection(true)" @change="on_type_change()"></v-autocomplete>
                <v-text-field  v-if="!type_with_content" :readonly="mode=='D'" v-model="new_recipes_links.link" :label="$t('Set an Internet link')" :placeholder="$t('Set an Internet link')" :rules="RulesString(2000,false)" counter="2000"/>
                <v-file-input v-if="type_with_content" show-size v-model="document" :label="$t('Select a document')"></v-file-input>           
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
                new_recipes_links: null,

                loading_products: false,

                key:0,
                document:null,

                type_with_content:false,
            }
        },
        methods: {
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new recipe link')
                if (this.mode=="R") return this.$t('View this recipe link')
                if (this.mode=="U") return this.$t('Update this recipe link')
                if (this.mode=="D") return this.$t('Delete this recipe link')
            },
            readDocument(file){
                return new Promise((resolve, reject) => {
                    var reader = new FileReader();
                    reader.onload = function() {
                        const result=reader.result
                        var r={
                            jsdoc: result,
                            doc: result.split(",")[1],
                            mime: result.split(";base64,")[0].split(":")[1],
                        }
                        return resolve(r)
                    }
                    reader.onerror=function(error){
                        return reject(error)
                    }
                    reader.readAsDataURL(file)
                })
            },
            on_type_change(){
                var id=this.id_from_hyperlinked_url(this.new_recipes_links.type)
                if ([6,2,4,5].includes(id)){
                    this.type_with_content=true
                } else {
                    this.type_with_content=false
                }
            },
            async acceptDialog(){             
                if( this.$refs.form.validate()==false) return


                if (this.document){
                    var readed= await this.readDocument(this.document)
                    this.new_recipes_links.mime=readed.mime
                    this.new_recipes_links.content=readed.doc
                }

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/recipes_links/`, this.new_recipes_links,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_recipes_links.url, this.new_recipes_links,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this recipe link?"))
                    if(r == true) {
                        axios.delete(this.new_recipes_links.url, this.myheaders())
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
            this.new_recipes_links=Object.assign({},this.recipes_links)
        }
    }
</script>

