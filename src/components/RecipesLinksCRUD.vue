<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <v-text-field :readonly="mode=='D'" v-model="new_recipes_links.description" :label="$t('Set description')" :placeholder="$t('Set description')" :rules="RulesString(200,true)" counter="200"/>
                <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(store().recipes_links_types)" v-model="new_recipes_links.type" :label="$t('Select type')" item-title="localname" item-value="url" :rules="RulesSelection(true)" />
                <v-text-field  v-if="show_link" :readonly="mode=='D'" v-model="new_recipes_links.link" :label="$t('Set an Internet link')" :placeholder="$t('Set an Internet link')" :rules="RulesString(2000,false)" counter="2000" autofocus/>
                <v-file-input v-if="show_fileinput" show-size v-model="document" :label="$t('Select a document')" @change="on_fileinput_change" />
                <PasteImage v-if="show_paste" v-model="pasted_image" :rules="RulesSelection(true)" :key="key"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
                <v-btn color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>

    </div>
</template>
<script>
    import axios from 'axios'
    import PasteImage from './PasteImage.vue'
    import {RulesSelection,RulesString,RulesInteger} from 'vuetify_rules'
    export default {
        components: {
            PasteImage,
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

                pasted_image:null,
                show_fileinput:false,
                show_link:false,
                show_paste:false,
            }
        },
        watch: {
            "new_recipes_links.type": function(){
                this.reload_ui()
            }

            // pasted_image(){
            //     var id=this.id_from_hyperlinked_url(this.new_recipes_links.type)
            //     if([2,7].includes(id)){
            //         if (this.pasted_image.image==null){
            //             this.show_fileinput=false
            //         } else {
            //             this.show_fileinput=true
            //         }

            //     }
            // },
        },
        methods: {
            RulesInteger,RulesSelection,RulesString,
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
            on_fileinput_change(){
                var id=this.id_from_hyperlinked_url(this.new_recipes_links.type)
                if([2,7].includes(id)){
                    if (this.document){
                        this.show_paste=false
                    } else {
                        this.show_paste=true
                    }

                }
            },
            reload_ui(){
                var id=this.id_from_hyperlinked_url(this.new_recipes_links.type)
                this.show_fileinput=false
                this.show_link=false
                this.show_paste=false
                if ([2,7].includes(id)){ //Images
                    this.show_fileinput=true
                    this.show_paste=true
                } else if ([4,5,6].includes(id)) { //Documentos con contenido
                    this.show_fileinput=true
                } else { //Documentos con enlace
                    this.show_link=true
                }
                if (this.mode=="D") this.show_paste=false
                this.new_recipes_links.description=this.store().recipes_links_types.get(this.new_recipes_links.type).localname
                this.key=this.key+1
            },
            async acceptDialog(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }


                if (this.document){
                    var readed= await this.readDocument(this.document)
                    this.new_recipes_links.mime=readed.mime
                    this.new_recipes_links.content=readed.doc
                }
                if (this.pasted_image){
                    this.new_recipes_links.mime=this.pasted_image.mime
                    this.new_recipes_links.content=this.pasted_image.image
                }

                if (this.mode=="C"){
                    axios.post(`${this.store().apiroot}/api/recipes_links/`, this.new_recipes_links,  this.myheaders())
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
            this.reload_ui()
        }
    }
</script>

