<template>
    <div>    
        <h1>{{ $t("Elaboration for {0} diners").format(new_elaboration.diners) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
            <br>
            <v-btn class="" :color="(new_elaboration.final_amount)? '': 'primary'" :disabled="elaboration.automatic" @click="setFinalAmount()" >{{ (new_elaboration.final_amount==null) ? $t("Final amount wasn't set") : $t("Final amount: {0} g").format(new_elaboration.final_amount)}}</v-btn>

    </h1>           
        <v-alert v-if="elaboration.automatic" type="error" dense text><div v-html="automatic_adaptation_text()"></div></v-alert>
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>          
                <v-card class="mt-4">
                    <v-tabs background-color="primary" dark  v-model="tab" >
                        <v-tab key="ingredients"><v-icon left>mdi-apple</v-icon>{{ $t('Ingredients') }}<v-badge v-if="new_elaboration.elaborations_products_in.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_products_in.length"/></v-tab>
                        <v-tab key="nutritional"><v-icon left>mdi-apple</v-icon>{{ $t('Nutritional information') }}<v-badge v-if="new_elaboration.elaborations_products_in.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_products_in.length"/></v-tab>
                        <v-tab key="containers"><v-icon left>mdi-apple</v-icon>{{ $t('Containers') }}<v-badge v-if="new_elaboration.elaborations_containers.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_containers.length"/></v-tab>
                        <v-tab key="steps"><v-icon left>mdi-apple</v-icon>{{ $t('Steps') }}<v-badge v-if="new_elaboration.elaborations_steps.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_steps.length"/></v-tab>
                        <v-tab key="experiences"  v-if="!elaboration.automatic"><v-icon left>mdi-apple</v-icon>{{ $t('Experiences') }}<v-badge v-if="new_elaboration.elaborations_experiences.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_experiences.length"/></v-tab>
                        <v-tabs-slider color="yellow"></v-tabs-slider>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                        <v-tab-item key="ingredients">      
                            <v-card outlined>
                                <TableElaborationsIngredients ref="table_elaborations_ingredients" :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsIngredients_cruded()"></TableElaborationsIngredients>

                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="nutritional">      
                            <v-card outlined>
                                <TableElaborationsIngredientsNI :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsIngredientsNI_cruded()"></TableElaborationsIngredientsNI>

                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="containers">      
                            <v-card outlined>         
                                <TableElaborationsContainers ref="table_elaborations_containers" :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsContainers_cruded()"></TableElaborationsContainers>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="steps">  
                            <v-card outlined>
                                <TableElaborationsSteps ref="table_elaborations_steps" :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsSteps_cruded"></TableElaborationsSteps>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="experiences" v-if="!elaboration.automatic">      
                            <v-card outlined>
                                <TableElaborationsExperiences ref="table_elaborations_experiences" :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsExperiences_cruded"></TableElaborationsExperiences>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-form>
            <v-card-actions>                
                <v-btn color="error" :disabled="new_elaboration.final_amount==null" @click="createElaboratedProduct()" >{{ $t("Create an elaborated product") }}</v-btn>
                <v-btn color="error" @click="generate_pdf()" >{{ $t("Generate PDF") }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="elaboration.automatic" @click="addIngredient()" >{{ $t("Add an ingredient") }}</v-btn>
                <v-btn color="primary" :disabled="elaboration.automatic" @click="addContainer()" >{{ $t("Add a container") }}</v-btn>
                <v-btn color="primary" :disabled="elaboration.automatic" @click="addElaborationStep()" >{{ $t("Add a step") }}</v-btn>
                <v-btn color="primary" :disabled="elaboration.automatic" @click="addExperience()" >{{ $t("Add a experience") }}</v-btn>
            </v-card-actions>
        </v-card>

        <!-- Final amount DIALOG -->
        <v-dialog v-model="dialog_finalamount" width="70%">
            <v-card class="pa-3">
                <ElaborationsFinalAmountFromPot :elaboration="new_elaboration" :key="key"  @cruded="on_ElaborationsFinalAmountFromPot_cruded"/>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import fraction from 'fraction.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import TableElaborationsContainers from './TableElaborationsContainers.vue'
    import TableElaborationsSteps from './TableElaborationsSteps.vue'
    import {empty_elaborations_products_in} from '../empty_objects.js'
    import TableElaborationsExperiences from './TableElaborationsExperiences.vue'
    import TableElaborationsIngredients from './TableElaborationsIngredients.vue'
    import TableElaborationsIngredientsNI from './TableElaborationsIngredientsNI.vue'
    import ElaborationsFinalAmountFromPot from './ElaborationsFinalAmountFromPot.vue'
    export default {
        components: {
            ElaborationsFinalAmountFromPot,
            TableElaborationsIngredients,
            MyMenuInline,
            TableElaborationsContainers,
            TableElaborationsSteps,
            TableElaborationsExperiences,
            TableElaborationsIngredientsNI,
        },
        props: {
            
            elaboration: { 
                required: true
            },
        },
        data(){ 
            return{
                menuinline_items: [
                    {
                        subheader: this.$t("Recipe options"),
                        children: [
                            {
                                name: this.$t("Generate PDF"),
                                icon: "mdi-file-pdf-box",
                                code: function(this_){                
                                    this_.generate_pdf()
                                },
                            },
                        ]
                    },
                ],
                form_valid:false,
                new_elaboration: null,
                tab: 3,

                key:0,
                // FinalamountFromFullPot
                dialog_finalamount:false,
            }
        },
        methods: {
            fraction,
            empty_elaborations_products_in,
            async addIngredient(){
                if (this.tab!=0){
                    this.tab=0
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_ingredients.addProductIn()

            },
            async addContainer(){
                if (this.tab!=2){
                    this.tab=2
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_containers.on_new_click()
            },
            async addElaborationStep(){
                if (this.tab!=3){
                    this.tab=3
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_steps.addElaborationStep()

            },
            async addExperience(){
                if (this.tab!=4){
                    this.tab=4
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
            update_elaboration(){
                return axios.get(this.new_elaboration.url, this.myheaders())
                .then((response) => {
                    this.new_elaboration=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_TableElaborationsSteps_cruded(){
                this.update_elaboration()
            },
            createElaboratedProduct(){
                return axios.post(`${this.new_elaboration.url}create_elaborated_product/`, {}, this.myheaders())
                .then(() => {
                    Promise.all([
                        this.$store.dispatch("getProducts"),
                        this.$store.dispatch("getElaboratedProducts")
                        ])
                        .then(() => {
                            alert(this.$t("Elaborated product created correctly. Now you can use it to track calories in your meals"))
                        });
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
            automatic_adaptation_text(){
                let text=(this.elaboration.automatic_adaptation_step) ? this.elaboration.automatic_adaptation_step : ""
                return this.$t("This is an automatic elaboration.") + "<p></p>" + text
            },
            setFinalAmount(){
                this.dialog_finalamount=true
                this.key=this.key+1
            },
            on_ElaborationsFinalAmountFromPot_cruded(){
                this.dialog_finalamount=false
                this.update_elaboration()
            },
        },
        created(){
            this.new_elaboration=Object.assign({},this.elaboration)
        }
    }
</script>

