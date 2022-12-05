<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>          
                <v-row>
                    <v-text-field :readonly="mode=='D'" v-model.number="new_elaboration.diners" :label="$t('Set the number of diners')" :placeholder="$t('Set the number of diners')" :rules="RulesInteger(5,true)" counter="200"/>
                    <v-text-field :readonly="mode=='D'" class="ml-5" v-model="new_elaboration.final_amount" :label="$t('Set your final amount')" :placeholder="$t('Set your final amount')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                </v-row>      
                <v-card class="mt-4">
                    <v-tabs background-color="primary" dark  v-model="tab" >
                        <v-tab key="ingredients">{{ $t('Ingredients') }}</v-tab>
                        <v-tab key="containers">{{ $t('Containers') }}</v-tab>
                        <v-tab key="steps">{{ $t('Steps') }}</v-tab>
                        <v-tab key="wording">{{ $t('Wording') }}</v-tab>
                        <v-tab key="experiences">{{ $t('Experiences') }}</v-tab>
                        <v-tabs-slider color="yellow"></v-tabs-slider>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                        <v-tab-item key="ingredients">      
                            <v-card outlined>
                                <v-data-table dense :headers="products_in_headers" :items="new_elaboration.elaborations_products_in" sort-by="final_grams" :sort-desc="['final_grams']" class="elevation-1" hide-default-footer disable-pagination :key="'T'+key" :height="450" fixed-header>
                                    <template v-slot:[`item.products`]="{ item }"><div v-html="products_html_fullname(item.products,4)"></div></template>
                                    <template v-slot:[`item.amount`]="{ item }">{{ fraction(item.amount).toFraction(true)}}</template>
                                    <template v-slot:[`item.measures_types`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('measures_types', item.measures_types,'localname')"></div></template> 
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-icon v-if="['C','U'].includes(mode)" small class="mr-2" @click="editProductIn(item)">mdi-pencil</v-icon>
                                        <v-icon v-if="['C','U'].includes(mode)" small @click="deleteProductIn(item)">mdi-delete</v-icon>
                                    </template>
                                    <template v-slot:[`body.append`]="{headers}" v-if="new_elaboration.elaborations_products_in.length>0">
                                        <tr style="background-color: WhiteSmoke">
                                            <td v-for="(header,i) in headers" :key="i">
                                                <div v-if="header.value=='products'">{{ $t("Total {0} products):").format(new_elaboration.elaborations_products_in.length) }}</div>
                                                <div v-if="header.value == 'amount'" class="d-flex justify-end" v-html="listobjects_sum(new_elaboration.elaborations_products_in,'amount')"></div>
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
                        <v-tab-item key="wording">      
                            <v-card outlined>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="experiences">      
                            <v-card outlined>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-form>
            <v-card-actions>                
                <v-btn color="error" :disabled="!new_elaboration.url" @click="createElaboratedProduct()" >{{ $t("Create an elaborated product") }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!new_elaboration.url" v-if="['C','U'].includes(mode)" @click="addProductIn()" >{{ $t("Add an ingredient") }}</v-btn>
                <v-btn color="primary" :disabled="!new_elaboration.url" v-if="['C','U'].includes(mode)" @click="addContainer()" >{{ $t("Add a container") }}</v-btn>
                <v-btn color="primary" :disabled="!new_elaboration.url" v-if="['C','U'].includes(mode)" @click="addElaborationStep()" >{{ $t("Add a step") }}</v-btn>
                <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn> 
                <v-btn color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>
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
    import TableElaborationsContainers from './TableElaborationsContainers.vue'
    import TableElaborationsSteps from './TableElaborationsSteps.vue'
    import {empty_elaborations_products_in} from '../empty_objects.js'
    export default {
        components: {
            ElaborationProductsInCRUD,
            TableElaborationsContainers,
            TableElaborationsSteps,
        },
        props: {
            
            elaboration: { 
                required: true
            },
            mode: {
                required: true,
            }
        },
        data(){ 
            return{
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
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new elaboration')
                if (this.mode=="R") return this.$t('View this elaboration')
                if (this.mode=="U") return this.$t('Update this elaboration')
                if (this.mode=="D") return this.$t('Delete this elaboration')
            },
            acceptDialog(cruded=true){             
                if( this.$refs.form.validate()==false) return   

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/elaborations/`, this.new_elaboration,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        if (cruded==true) this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_elaboration.url, this.new_elaboration,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        if (cruded==true) this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this elaboration?"))
                    if(r == true) {
                        axios.delete(this.new_elaboration.url, this.myheaders())
                        .then((response) => {
                            console.log(response.data)
                        if (cruded==true) this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
            async addElaborationStep(){
                if (this.tab!=2){
                    this.tab=2
                    await new Promise(resolve => setTimeout(resolve, 1000));//Waits a second to mount table_links after tab change
                }
                this.$refs.table_elaborations_steps.addElaborationStep()

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
                this.dialog_products_in_crud=false  
                return axios.get(`${this.$store.state.apiroot}/api/elaborations_containers/?elaboration=${this.new_elaboration.url}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.new_elaboration.elaborations_containers=response.data
                    this.key=this.key+1
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_TableElaborationsSteps_cruded(new_elaborations_steps){
                console.log("on_Table_cruded")
                console.log(new_elaborations_steps)
                this.new_elaboration.elaborations_steps=new_elaborations_steps
                this.acceptDialog(false)
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
            // Guess crud mode
            this.new_elaboration=Object.assign({},this.elaboration)
        }
    }
</script>

