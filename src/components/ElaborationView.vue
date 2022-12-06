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
                        <v-tab key="containers"><v-icon left>mdi-apple</v-icon>{{ $t('Containers') }}<v-badge v-if="new_elaboration.elaborations_containers.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_containers.length"/></v-tab>
                        <v-tab key="steps"><v-icon left>mdi-apple</v-icon>{{ $t('Steps') }}<v-badge v-if="new_elaboration.elaborations_steps.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_steps.length"/></v-tab>
                        <v-tab key="experiences"><v-icon left>mdi-apple</v-icon>{{ $t('Experiences') }}<v-badge v-if="new_elaboration.elaborations_experiences.length>0" color="error" class="ml-2" :content="new_elaboration.elaborations_experiences.length"/></v-tab>
                        <v-tabs-slider color="yellow"></v-tabs-slider>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                        <v-tab-item key="ingredients">      
                            <v-card outlined>
                                <v-data-table dense :headers="products_in_headers" :items="new_elaboration.elaborations_products_in" sort-by="final_grams" :sort-desc="['final_grams']" class="elevation-1" hide-default-footer disable-pagination :key="'T'+key" height="vh" fixed-header>
                                    <template v-slot:[`item.products`]="{ item }"><div v-html="products_html_fullname(item.products,4)"></div></template>
                                    <template v-slot:[`item.amount`]="{ item }">{{ fraction(item.amount).toFraction(true)}}</template>
                                    <template v-slot:[`item.measures_types`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('measures_types', item.measures_types,'localname')"></div></template> 
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-icon v-if="['C','U'].includes(product_in_mode)" small class="mr-2" @click="editProductIn(item)">mdi-pencil</v-icon>
                                        <v-icon v-if="['C','U'].includes(product_in_mode)" small @click="deleteProductIn(item)">mdi-delete</v-icon>
                                    </template>
                                    <template v-slot:[`body.append`]="{headers}" v-if="new_elaboration.elaborations_products_in.length>0">
                                        <tr style="background-color: WhiteSmoke">
                                            <td v-for="(header,i) in headers" :key="i">
                                                <div v-if="header.value=='products'">{{ $t("Total {0} products):").format(new_elaboration.elaborations_products_in.length) }}</div>
                                                <div v-if="header.value == 'final_grams'" class="d-flex justify-end" v-html="listobjects_sum(new_elaboration.elaborations_products_in,'final_grams')"></div>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
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
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!new_elaboration.url" @click="addProductIn()" >{{ $t("Add an ingredient") }}</v-btn>
                <v-btn color="primary" :disabled="!new_elaboration.url" @click="addContainer()" >{{ $t("Add a container") }}</v-btn>
                <v-btn color="primary" :disabled="!new_elaboration.url" @click="addElaborationStep()" >{{ $t("Add a step") }}</v-btn>
                <v-btn color="primary" :disabled="!new_elaboration.url" @click="addExperience()" >{{ $t("Add a experience") }}</v-btn>
            </v-card-actions>
        </v-card>

        <!-- DIALOG PRODUCTS_IN CRUD -->
        <v-dialog v-model="dialog_products_in_crud" width="45%">
            <v-card class="pa-4">
                <ElaborationProductsInCRUD :product_in="product_in" :mode="product_in_mode" :key="'B'+key" @cruded="on_ElaborationProductsInCRUD_cruded"></ElaborationProductsInCRUD>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
    import axios from 'axios'
    import fraction from 'fraction.js'
    import ElaborationProductsInCRUD from './ElaborationProductsInCRUD.vue'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import TableElaborationsContainers from './TableElaborationsContainers.vue'
    import TableElaborationsSteps from './TableElaborationsSteps.vue'
    import {empty_elaborations_products_in} from '../empty_objects.js'
    import TableElaborationsExperiences from './TableElaborationsExperiences.vue'
    export default {
        components: {
            ElaborationProductsInCRUD,
            MyMenuInline,
            TableElaborationsContainers,
            TableElaborationsSteps,
            TableElaborationsExperiences
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
                                    console.log(this_)
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

                loading_products: false,


                products_in_headers: [
                    { text: this.$t('Product'), sortable: true, value: 'products'},
                    { text: this.$t('Measure type'), value: 'measures_types', width:"20%"},
                    { text: this.$t('Amount'), value: 'amount', align:'right', width:"10%"},
                    { text: this.$t('Final grams'), value: 'final_grams', align:'right', width:"10%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],


                key:0,
                product_in:null,
                product_in_mode:null,
                dialog_products_in_crud:false,
            }
        },
        methods: {
            fraction,
            empty_elaborations_products_in,
            async addElaborationStep(){
                if (this.tab!=2){
                    this.tab=2
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_steps.addElaborationStep()

            },
            async addExperience(){
                if (this.tab!=3){
                    this.tab=3
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_experiences.addItem()

            },
            addProductIn(){
                this.tab=0
                this.product_in=this.empty_elaborations_products_in()
                this.product_in.measures_types=this.hyperlinked_url("measures_types",1)
                this.product_in.elaborations=this.new_elaboration.url
                this.product_in_mode='C'
                this.key=this.key+1
                this.dialog_products_in_crud=true

            },
            editProductIn(item){
                this.product_in=item
                this.product_in_mode='U'
                this.key=this.key+1
                this.dialog_products_in_crud=true

            },
            deleteProductIn(item){
                this.product_in=item
                this.product_in_mode='D'
                this.key=this.key+1
                this.dialog_products_in_crud=true

            },
            on_ElaborationProductsInCRUD_cruded(){
                this.dialog_products_in_crud=false  
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
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_TableElaborationsSteps_cruded(new_elaborations_steps){
                console.log("on_Table_cruded")
                console.log(new_elaborations_steps)
                this.new_elaboration.elaborations_steps=new_elaborations_steps
                axios.put(this.new_elaboration.url, this.new_elaboration,  this.myheaders())
                .then((response) => {
                    console.log(response.data)
                }, (error) => {
                    this.parseResponseError(error)
                })
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
            async addContainer(){                                    
                console.log(this.$refs)
                this.tab=1
                await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                this.$refs.table_elaborations_containers.on_new_click()
            },
        },
        created(){
            this.new_elaboration=Object.assign({},this.elaboration)
        }
    }
</script>

