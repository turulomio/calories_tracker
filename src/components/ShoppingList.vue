<template>
    <div>    
        <h1>{{ $t("Shopping list") }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :items="elaborations" v-model="elaborations_selected" item-title="fullname" item-value="url" :label="$t('Select your elaborations')" multiple chips />
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog" :loading="creating" :disabled="creating || elaborations_selected.length==0">{{ $t("Get shopping list") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from '@/store.js'
    import pdfMake from "pdfmake/build/pdfmake";
    import pdfFonts from "pdfmake/build/vfs_fonts";
    pdfMake.addVirtualFileSystem(pdfFonts);

    export default {
        data(){ 
            return{
                form_valid:false,
                elaborations:[],
                elaborations_selected:[],
                creating:false, 
            }
        },
        methods: {
            useStore,
            async acceptDialog(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                axios.post(`${this.useStore().apiroot}/shopping_list/`, {elaborations: this.elaborations_selected}, this.myheaders())
                .then((response) => {

                    console.log(response.data)

                    var shopping_list=[]
                    response.data.shopping_list.forEach(o => {
                        shopping_list.push(`${o.product_fullname} (${o.grams})`)
                        
                    });


                    this.creating=true
                    const docDefinition = {
                        info: {
                            title: this.$t("Shopping list"),
                            author: `Calories Tracker v${this.useStore().version}`,
                            subject: this.$t("Calories Tracker shopping list"),
                            keywords: 'shopping list',
                        },
                        content: [    
                            { text: 'Shopping list', style: 'header1', alignment:'center' },
                            { text: 'Recipes', style: 'header2', alignment:'center' },
                            { ul: response.data.recipes},
                            { text: 'Shopping list', style: 'header2', alignment:'center' },
                            { ul: shopping_list},
                        ],
                        styles: {
                            header1: { fontSize: 16, bold: true , margin: [0, 6, 0, 6]},
                            header2: { fontSize: 14, bold: true , margin: [6, 4, 0, 4]},
                            body: { fontSize: 11 ,margin:[0,2,0,2], alignment:"justify"},
                        },

                        footer: function(currentPage, pageCount) {
                            return (currentPage>2)? { text: currentPage.toString() + this.$t(' of ') + pageCount, alignment: 'center' }:""
                        }.bind(this)
                    };
                    console.log("PDFMAKE", docDefinition)

                    var filename="Shopping List.pdf"
                    pdfMake.createPdf(docDefinition,{tagged:true}).download(filename);
                    this.creating=false

                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        created(){
            axios.get(`${this.useStore().apiroot}/api/elaborations/`, this.myheaders())
            .then((response) => {
                this.elaborations=response.data
            }, (error) => {
                this.parseResponseError(error)
            })
        }
    }
</script>

