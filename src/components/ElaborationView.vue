<template>
    <div>    
        <h1>{{ $t("Elaboration for {0} diners").format(elaboration.diners) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>           
        <p class="my-2 bold d-flex justify-center">{{$t("Final amount: {0} g").format(elaboration.final_amount)}}</p>
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>          
                <v-card class="mt-4">
                    <v-tabs background-color="primary" dark  v-model="tab" >
                        <v-tab key="ingredients"><v-icon left>mdi-apple</v-icon>{{ $t('Ingredients') }}<v-badge v-if="new_elaboration.elaborations_products_in.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_products_in.length"/></v-tab>
                        <v-tab key="nutritional"><v-icon left>mdi-apple</v-icon>{{ $t('Nutritional information') }}<v-badge v-if="new_elaboration.elaborations_products_in.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_products_in.length"/></v-tab>
                        <v-tab key="containers"><v-icon left>mdi-apple</v-icon>{{ $t('Containers') }}<v-badge v-if="new_elaboration.elaborations_containers.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_containers.length"/></v-tab>
                        <v-tab key="steps"><v-icon left>mdi-apple</v-icon>{{ $t('Steps') }}<v-badge v-if="new_elaboration.elaborations_steps.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_steps.length"/></v-tab>
                        <v-tab key="experiences"><v-icon left>mdi-apple</v-icon>{{ $t('Experiences') }}<v-badge v-if="new_elaboration.elaborations_experiences.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_experiences.length"/></v-tab>
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
                        <v-tab-item key="experiences">      
                            <v-card outlined>
                                <TableElaborationsExperiences ref="table_elaborations_experiences" :elaboration="new_elaboration" :key="key" @cruded="on_TableElaborationsExperiences_cruded"></TableElaborationsExperiences>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-form>
            <v-card-actions>                
                <v-btn color="error" :disabled="!new_elaboration.url" @click="createElaboratedProduct()" >{{ $t("Create an elaborated product") }}</v-btn>
                <v-btn color="error" :disabled="!new_elaboration.url" @click="generate_pdf()" >{{ $t("Generate PDF") }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!new_elaboration.url" @click="addIngredient()" >{{ $t("Add an ingredient") }}</v-btn>
                <v-btn color="primary" :disabled="!new_elaboration.url" @click="addContainer()" >{{ $t("Add a container") }}</v-btn>
                <v-btn color="primary" :disabled="!new_elaboration.url" @click="addElaborationStep()" >{{ $t("Add a step") }}</v-btn>
                <v-btn color="primary" :disabled="!new_elaboration.url" @click="addExperience()" >{{ $t("Add a experience") }}</v-btn>
            </v-card-actions>
        </v-card>
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
    export default {
        components: {
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
                            {
                                name: this.$t("Show nutritional information"),
                                icon: "mdi-information",
                                code: function(this_){
                                    console.log(this_)
                                },
                            },
                        ]
                    },
                ],
                form_valid:false,
                new_elaboration: null,
                tab: 2,

                key:0,
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
                return axios.get(`${this.$store.state.apiroot}/api/elaborationsproductsinthrough/?elaboration=${this.new_elaboration.url}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.new_elaboration.elaborations_products_in=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_TableElaborationsContainers_cruded(){
                return axios.get(`${this.$store.state.apiroot}/api/elaborations_containers/?elaboration=${this.new_elaboration.url}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.new_elaboration.elaborations_containers=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_TableElaborationsExperiences_cruded(){
                return axios.get(`${this.$store.state.apiroot}/api/elaborations_experiences/?elaboration=${this.new_elaboration.url}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.new_elaboration.elaborations_experiences=response.data
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_TableElaborationsSteps_cruded(){
                return axios.get(`${this.$store.state.apiroot}/api/elaborations_steps/?elaboration=${this.new_elaboration.url}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.new_elaboration.elaborations_steps=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            createElaboratedProduct(){
                return axios.post(`${this.new_elaboration.url}create_elaborated_product/`, {}, this.myheaders())
                .then((response) => {
                    Promise.all([
                        this.$store.dispatch("getProducts"),
                        this.$store.dispatch("getElaboratedProducts")
                        ])
                        .then(() => {
                            alert(this.$t("Elaborated product created correctly. Now you can use it to track calories in your meals"))
                            console.log(response.data)
                        });
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            generate_pdf(){
                axios.post(`${this.new_elaboration.url}generate_pdf/`, {}, this.myheaders())
                .then((response) => {
                    console.log(response.data)
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
        },
        created(){
            this.new_elaboration=Object.assign({},this.elaboration)
        }
    }
</script>

