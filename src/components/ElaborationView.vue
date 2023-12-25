<template>
    <div>    
        <h1>{{ new_elaboration.fullname }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
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
        <!--  NICE RECIPE DIALOG -->
        <v-dialog v-model="dialog_nice_recipe" width="70%">
            <v-card class="pa-3">       
                <v-card outlined v-if="new_elaboration.elaborations_texts" style="overflow: auto" >  
                    <div class="ma-3" id="nice" v-html="nice()" :key="keynice"></div>
                </v-card>
                <v-btn color="primary" @click="print" >{{ $t("Print") }}</v-btn>    
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
    import {elaboration_nutritional_information_string} from '../functions.js'
    import { NutritionalElement } from '@/types'
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
                keynice:0,
                // FinalamountFromFullPot
                dialog_finalamount:false,
                // Nice recipe dialog
                dialog_nice_recipe:false,
                // NI dialog
                dialog_ni:false,
            }
        },
        methods: {
            fraction,
            empty_elaborations_products_in,
            elaboration_nutritional_information_string,
            menuinline_items(){
                var r=[
                    {
                        subheader: this.$t("Recipe options"),
                        children: [
                            {
                                name: this.$t("Nice recipe"),
                                icon: "mdi-file-pdf-box",
                                code: function(){
                                    this.keynice=this.keynice+1
                                    this.dialog_nice_recipe=true
                                }.bind(this),
                            },
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
                    console.log(response.data)
                    this.store().elaborated_products.set(response.data.elaborated_product.url,response.data.elaborated_product)
                    this.store().products.set(response.data.product.url,response.data.product)
                    alert(this.$t("Elaborated product created correctly. Now you can use it to track calories in your meals"))
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            generate_pdf(){
                axios.post(`${this.new_elaboration.url}generate_pdf/`, {}, this.myheaders())
                .then((response) => {
                    var link = window.document.createElement('a')
                    link.href = `data:${response.data.data.mime};base64,${response.data.data.data}`
                    link.download = response.data.data.filename
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }, (error) => {
                    this.parseResponseError(error)
                });
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
                this.keynice=this.keynice+1
            },

            async print () {
                this.dialog_nice_recipe=false
                await this.$htmlToPaper("nice", {
                    name: '_blank',
                    specs: [
                        'fullscreen=yes',
                        'titlebar=no',
                        'scrollbars=yes'
                    ],
                    timeout: 1000, // default timeout before the print window appears
                    autoClose: true, // if false, the window will not close after printing
                    windowTitle: "", // override the window title
                });
            },


            nice(){
                var ingredients="<p><div class='column_wrapper'><ul>"
                this.new_elaboration.elaborations_products_in.forEach(o=>{
                    ingredients=ingredients+ `<li>${o.fullname}</li>`
                })
                ingredients=ingredients+"</ul></div>"
                var containers="<div class='column_wrapper'><ul>"
                this.new_elaboration.elaborations_containers.forEach(o=>{
                    containers=containers+ `<li>${o.name}</li>`
                })
                containers=containers+"</ul></div>"

                var automatic=""
                if (this.new_elaboration.automatic && this.new_elaboration.automatic_adaptation_step!=""){
                    automatic=this.$t("<p class='p_print'>This is an automatic recipe with this comment: '[0]'</p>").format(this.new_elaboration.automatic_adaptation_step)
                }

                var s=`
<h1 class="h1_print">${this.new_elaboration.fullname}</h1>
${automatic}
<h2 class="h2_print">${this.$t("Ingredients")} @</h2>
${ingredients}
<h2 class="h2_print">${this.$t("Containers")} #</h2>
${containers}   
<h2 class="h2_print">${this.$t("Recipe")}</h2>
${this.$refs.tiptap.editor.getHTML()}
<h2 class="h2_print">${this.$t("Nutritional information for each 100 g")}</h2>
<div class="column_wrapper">
    <ul>
        <li>${this.$t("Recipe total amount")}: ${NutritionalElement.Amount.amount(this.new_elaboration.final_amount)}</li>
        <li>${this.$t("Calories")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Calories)}</li>
        <li>${this.$t("Fat")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Fat)}</li>
        <li>${this.$t("Protein")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Protein)}</li>
        <li>${this.$t("Carbohydrates")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Carbohydrate)}</li>
        <li>${this.$t("Salt")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Salt)}</li>
        <li>${this.$t("Fiber")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Fiber)}</li>
        <li>${this.$t("Sugars")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Sugars)}</li>
        <li>${this.$t("Saturated fat")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.SaturatedFat)}</li>
        <li>${this.$t("Cholesterol")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Cholesterol)}</li>
        <li>${this.$t("Sodium")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Sodium)}</li>
        <li>${this.$t("Potassium")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Potassium)}</li>
        <li>${this.$t("Magnessium")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Magnesium)}</li>
        <li>${this.$t("Phosphor")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Phosphor)}</li>
        <li>${this.$t("Calcium")}: ${this.elaboration_nutritional_information_string( this.new_elaboration, NutritionalElement.Calcium)}</li>
    </ul
</div>
<style>
.h1_print{
    text-align: center;
    font-size: 14pt;
}
.h2_print{
    text-align: center;
    font-size: 13pt;
}

.column_wrapper {
    column-count: 2;
    font-size: 11pt;
}
.mention_containers{
    color: rgb(15, 15, 139);
    background-color: rgb(165, 197, 228);
  }

p {
    margin: 0 !important;
    padding: 2px !important;
}

ol > li {
    margin-left: 20px;
    font-size: 10pt;
  }
  
ul > li {
    margin-left: 20px;
    font-size: 10pt;
  }

  .mention_ingredients {
    color: #3f310b;
    background-color: #f7dbbc;
    border-radius: 0.3rem;
    padding: 0.1rem 0.3rem;
  }
</style>
`
                return s
            },
        },
        created(){
            this.new_elaboration=Object.assign({},this.elaboration)
        }
    }
</script>

