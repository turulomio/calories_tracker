<template>
    <div>    
        <h1>{{ new_elaboration.fullname }}
            <MyMenuInline :items="menuinline_items()"></MyMenuInline>
            <br>
            <v-btn class="" :color="(new_elaboration.final_amount)? '': 'primary'" :disabled="elaboration.automatic" @click="setFinalAmount()" >{{ (new_elaboration.final_amount==null) ? $t("Final amount wasn't set") : $t("Final amount: [0] g").format(new_elaboration.final_amount)}}</v-btn>

    </h1>           
        <v-alert v-if="elaboration.automatic" type="error" density="compact" text><div v-html="automatic_adaptation_text()"></div></v-alert>
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>          
                <v-card class="mt-4">
                    <v-tabs bg-color="primary" dark  v-model="tab" >
                        <v-tab key="ingredients"><v-icon left>mdi-apple</v-icon>{{ $t('Ingredients') }}<v-badge v-if="new_elaboration.elaborations_products_in.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_products_in.length" inline /></v-tab>
                        <v-tab key="containers"><v-icon left>mdi-apple</v-icon>{{ $t('Containers') }}<v-badge v-if="new_elaboration.elaborations_containers.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_containers.length" inline /></v-tab>
                        <v-tab key="tiptap"><v-icon left>mdi-apple</v-icon>{{ $t('Recipe') }}<v-badge v-if="new_elaboration.text?.length>0" color="error" class="ml-2" content="1" inline /></v-tab>
                        <v-tab key="experiences"  v-if="!elaboration.automatic"><v-icon left>mdi-apple</v-icon>{{ $t('Experiences') }}<v-badge v-if="new_elaboration.elaborations_experiences.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_experiences.length" inline /></v-tab>
                    </v-tabs>
                    <v-window v-model="tab">
                        <v-window-item key="ingredients">      
                            <v-card outlined>
                                <TableElaborationsIngredients ref="table_elaborations_ingredients" :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsIngredients_cruded()"></TableElaborationsIngredients>

                            </v-card>
                        </v-window-item>
                        <v-window-item key="containers">      
                            <v-card outlined>         
                                <TableElaborationsContainers ref="table_elaborations_containers" :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsContainers_cruded()"></TableElaborationsContainers>
                            </v-card>
                        </v-window-item>
                        <v-window-item key="tiptap">      
                            <v-card outlined>         
                                <ElaborationTextTipTap ref="tiptap" :readonly="elaboration.automatic" :elaboration="new_elaboration" :key="key" @cruded="on_ElaborationText_cruded" />
                            </v-card>
                        </v-window-item>
                        <v-window-item key="experiences" v-if="!elaboration.automatic">      
                            <v-card outlined>
                                <TableElaborationsExperiences ref="table_elaborations_experiences" :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsExperiences_cruded"></TableElaborationsExperiences>
                            </v-card>
                        </v-window-item>
                    </v-window>
                </v-card>
            </v-form>
            <v-card-actions>             
                <v-btn color="primary" @click="showNI()" >{{ $t("Nutritional information") }}</v-btn>   
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="elaboration.automatic" @click="addIngredient()" >{{ $t("Add an ingredient") }}</v-btn>
                <v-btn color="primary" :disabled="elaboration.automatic" @click="addContainer()" >{{ $t("Add a container") }}</v-btn>
                <v-btn color="primary" :disabled="elaboration.automatic" @click="addExperience()" >{{ $t("Add a experience") }}</v-btn>
                <v-btn color="primary" @click="on_close" >{{ $t("Close") }}</v-btn>
            </v-card-actions>
        </v-card>

        <!-- Final amount DIALOG -->
        <v-dialog v-model="dialog_finalamount" width="70%">
            <v-card class="pa-3">
                <ElaborationsFinalAmount :elaboration="new_elaboration" :key="key"  @cruded="on_ElaborationsFinalAmount_cruded"/>
            </v-card>
        </v-dialog>
        <!-- NI Dialog -->
        <v-dialog v-model="dialog_ni" width="100%">
            <v-card class="pa-3">     
                <h1 class="mb-5">{{ new_elaboration.fullname}}</h1>
                <TableElaborationsIngredientsNI :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsIngredientsNI_cruded()" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import fraction from 'fraction.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import TableElaborationsContainers from './TableElaborationsContainers.vue'
    import {empty_elaborations_products_in} from '../empty_objects.js'
    import TableElaborationsExperiences from './TableElaborationsExperiences.vue'
    import TableElaborationsIngredients from './TableElaborationsIngredients.vue'
    import TableElaborationsIngredientsNI from './TableElaborationsIngredientsNI.vue'
    import ElaborationsFinalAmount from './ElaborationsFinalAmount.vue'
    import ElaborationTextTipTap from './ElaborationTextTipTap.vue'
    import {elaboration_nutritional_information_string, pdfmake_array_to_two_columns_table} from '../functions.js'
    import { NutritionalElement } from '@/types'
    import { useStore } from '@/store.js'
    import pdfMake from "pdfmake/build/pdfmake";
    import pdfFonts from "pdfmake/build/vfs_fonts";
    import htmlToPdfmake from 'html-to-pdfmake'
    import { f } from 'vuetify_rules'
    pdfMake.addVirtualFileSystem(pdfFonts);
    export default {
        components: {
            ElaborationsFinalAmount,
            TableElaborationsIngredients,
            MyMenuInline,
            TableElaborationsContainers,
            TableElaborationsExperiences,
            TableElaborationsIngredientsNI,
            ElaborationTextTipTap,
        },
        props: {
            
            elaboration: { 
                required: true
            },
        },
        data(){ 
            return{
                form_valid:false,
                new_elaboration: null,
                tab: 2,

                key:0,
                // FinalamountFromFullPot
                dialog_finalamount:false,
                // NI dialog
                dialog_ni:false,
            }
        },
        methods: {
            fraction,
        useStore,
            f,
            empty_elaborations_products_in,
            elaboration_nutritional_information_string,
            pdfmake_array_to_two_columns_table,
            menuinline_items(){
                var r=[
                    {
                        subheader: this.$t("Recipe options"),
                        children: [
                            {
                                name: this.$t("Generate PDF"),
                                icon: "mdi-file-pdf-box",
                                code: function(){                
                                    this.generate_pdf()
                                }.bind(this),
                            },
                            {
                                name: this.$t("Create an elaborated product"),
                                icon: "mdi-file-pdf-box",
                                code: function(){                
                                    this.createElaboratedProduct()
                                }.bind(this),
                            },
                        ]
                    },
                ]

                if (this.elaboration.automatic) r[0].children.pop()
                return r

            },

            async addIngredient(){
                if (this.tab!=0){
                    this.tab=0
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_ingredients.addProductIn()

            },
            async addContainer(){
                if (this.tab!=1){
                    this.tab=1
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_containers.on_new_click()
            },
            async addExperience(){
                if (this.tab!=3){
                    this.tab=3
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_experiences.addItem()

            },
            on_TableElaborationsIngredients_cruded(){
                this.update_elaboration()
            },
            on_TableElaborationsContainers_cruded(){
                this.update_elaboration()
            },
            on_TableElaborationsExperiences_cruded(){
                this.update_elaboration()
            },
            on_close(){
                this.$emit("clickoutside")
            },
            update_elaboration(){
                return axios.get(this.new_elaboration.url, this.myheaders())
                .then((response) => {
                    this.new_elaboration=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            createElaboratedProduct(){
                if (this.new_elaboration.final_amount==null){
                    alert(this.$t("You need to set final amount"))
                    return
                }
                return axios.post(`${this.new_elaboration.url}create_elaborated_product/`, {}, this.myheaders())
                .then((response) => {
                    this.useStore().elaborated_products.set(response.data.elaborated_product.url,response.data.elaborated_product)
                    this.useStore().products.set(response.data.product.url,response.data.product)
                    alert(this.$t("Elaborated product created correctly. Now you can use it to track calories in your meals"))
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            generate_pdf(){

                this.creating=true
                var ingredients=[]
                this.new_elaboration.elaborations_products_in.forEach(o=>{
                    ingredients.push(o.fullname)
                })
                var containers=[]
                this.new_elaboration.elaborations_containers.forEach(o=>{
                    containers.push(o.name)
                })


                var ni=[]
                ni.push(`${this.$t("Calories")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Calories)}`)
                ni.push(`${this.$t("Fat")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Fat)}`)
                ni.push(`${this.$t("Protein")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Protein)}`)
                ni.push(`${this.$t("Carbohydrates")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Carbohydrate)}`)
                ni.push(`${this.$t("Salt")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Salt)}`)
                ni.push(`${this.$t("Fiber")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Fiber)}`)
                ni.push(`${this.$t("Sugars")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Sugars)}`)
                ni.push(`${this.$t("Saturated fat")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.SaturatedFat)}`)
                ni.push(`${this.$t("Cholesterol")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Cholesterol)}`)
                ni.push(`${this.$t("Sodium")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Sodium)}`)
                ni.push(`${this.$t("Potassium")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Potassium)}`)
                ni.push(`${this.$t("Magnessium")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Magnesium)}`)
                ni.push(`${this.$t("Phosphor")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Phosphor)}`)
                ni.push(`${this.$t("Calcium")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Calcium)}`)


                var options = {
    year: 'numeric',    // Año numérico (2024)
    month: 'long',      // Mes largo (enero, febrero, etc.)
    day: 'numeric',     // Día numérico (1, 2, etc.)
    hour: 'numeric',    // Hora numérica (0-23)
    minute: 'numeric',  // Minutos numéricos (0-59)
    second: 'numeric',  // Segundos numéricos (0-59)
    hour12: false       // Formato de 24 horas (usar true para formato de 12 horas)
};

// Obtener la fecha y hora localizadas
                var longdt= new Date().toLocaleString( localStorage.locale, options);

                const docDefinition = {
                    info: {
                        title: this.$t("Recipe") + this.new_elaboration.fullname,
                        author: `Calories Tracker v${this.useStore().version}`,
                        subject: this.$t("Calories Tracker recipe"),
                        keywords: 'recipe',
                    },
                    content: [           
                        { text: this.new_elaboration.fullname, style: 'header1', alignment:'center' },
                        { text: this.$t("Recipe total amount") + ` : ${NutritionalElement.Amount.amount(this.new_elaboration.final_amount)}`, style: "subtitle", alignment:"center"},
                        { text: longdt, style: "littlesubtitle", alignment:"center"},
                        { text: (this.new_elaboration.automatic && this.new_elaboration.automatic_adaptation_step!="")? this.$t("<p class='p_print'>This is an automatic recipe with this comment: '[0]'</p>").format(this.new_elaboration.automatic_adaptation_step) : "", style:"body"},

                        { text: this.$t('Ingredients'), style: 'header2', alignment:'center' },
                        { table: { widths: ['50%', '50%'], body: pdfmake_array_to_two_columns_table(ingredients, "mention_ingredients")}}, 
                        { text: this.$t('Containers'), style: 'header2', alignment:'center' },
                        { ul : containers, style: "mention_containers"},
                        { text: this.$t('Recipe'), style: 'header2', alignment:'center' },
                        htmlToPdfmake(this.$refs.tiptap.editor.getHTML()),
                        { text: this.$t("Nutritional information for each 100 g"), style: 'header2', alignment:'center' },
                        { table: { widths: ['50%', '50%'], body: pdfmake_array_to_two_columns_table(ni, "tablecell")}, alignment:'center', margin:[150,0, 150,0]},
                    ],
                    footer: function(currentPage, pageCount) {
                        return [
                            {
                                text: f(this.$t(`Calories Tracker v[0]. Page [1] of [2]`), [this.useStore().version,currentPage,pageCount]),
                                alignment: 'right',
                                color: 'grey',
                                style: 'littlesubtitle',
                                margin: [0, 0, 40, 0]
                            }
                        ];
                     }.bind(this),
                    styles: {
                        header1: { fontSize: 16, bold: true , margin: [0, 6, 0, 6]},
                        header2: { fontSize: 13, bold: true , margin: [6, 4, 0, 4]},
                        subtitle: { fontSize: 8 , margin: [0, 2, 0, 2]},
                        littlesubtitle: { fontSize: 6 },
                        body: { fontSize: 10, margin:[0,2,0,2], alignment:"justify"},
                        tablecell: { fontSize: 8, alignment:"justify"},
                        mention_ingredients: { fontSize: 10, background: "#f7dbbb", color:"#3f310a", bold:true},
                        mention_containers: { fontSize: 10, background: "#a5c4e4" , color: "#0e0e8b", bold:true},
                    },
                };
                console.log("PDFMAKE", docDefinition)

                var filename=`${this.new_elaboration.fullname}.pdf`
                pdfMake.createPdf(docDefinition,{tagged:true}).download(filename);
                this.creating=false
            },
            showNI(){
                this.key=this.key+1
                this.dialog_ni=true
            },
            automatic_adaptation_text(){
                let text=(this.elaboration.automatic_adaptation_step) ? this.elaboration.automatic_adaptation_step : ""
                return this.$t("This is an automatic elaboration.") + "<p></p>" + text
            },
            setFinalAmount(){
                this.dialog_finalamount=true
                this.key=this.key+1
            },
            on_ElaborationsFinalAmount_cruded(){
                this.dialog_finalamount=false
                this.update_elaboration()
            },

            async on_ElaborationText_cruded(){
                await this.$emit("cruded")
            },
        },
        created(){
            this.new_elaboration=Object.assign({},this.elaboration)
        }
    }
</script>

