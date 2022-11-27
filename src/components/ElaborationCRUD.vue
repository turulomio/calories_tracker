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
                    <v-data-table dense :headers="products_in_headers" :items="new_elaboration.elaborations_products_in" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :key="'T'+key" :height="250" fixed-header>
                        <template v-slot:[`item.products`]="{ item }">
                            <div v-html="products_html_fullname(item.products,4)"></div>
                        </template>
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
                <p></p>
                <v-card class="mt-4">
                    <v-data-table dense :headers="steps_headers" :items="new_elaboration.elaborations_steps" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :key="'T'+key" :height="250" fixed-header>
                        <template v-slot:[`item.steps`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('steps', item.steps,'localname')"></div></template> 
                        <template v-slot:[`item.products_in_step`]="{ item }"><div v-html="list_of_products_in_step(item)"></div></template> 

                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon v-if="['C','U'].includes(mode)" small class="mr-2" @click="editElaborationStep(item)">mdi-pencil</v-icon>
                            <v-icon v-if="['C','U'].includes(mode)" small @click="deleteElaborationStep(item)">mdi-delete</v-icon>
                        </template>
                        <template v-slot:[`body.append`]="{headers}" v-if="new_elaboration.elaborations_steps.length>0">
                            <tr style="background-color: WhiteSmoke">
                                <td v-for="(header,i) in headers" :key="i">
                                    <div v-if="header.value=='products'">{{ $t("Total {0} products):").format(new_elaboration.elaborations_products_in.length) }}</div>
                                    <div v-if="header.value == 'amount'" class="d-flex justify-end" v-html="listobjects_sum(new_elaboration.elaborations_products_in,'amount')"></div>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="['C','U'].includes(mode)" @click="addProductIn()" >{{ $t("Add a product") }}</v-btn>
                <v-btn color="primary" v-if="['C','U'].includes(mode)" @click="addElaborationStep()" >{{ $t("Add a step") }}</v-btn>
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


        <!-- STEPCRUD DIALOG -->
        <v-dialog v-model="dialog_elaboration_step_crud" width="100%">
            <v-card class="pa-3">
                <ElaborationStepCRUD :elaboration_step="elaboration_step" :elaboration="new_elaboration" :mode="elaboration_step_mode" :key="key"  @cruded="on_ElaborationsStep_cruded"></ElaborationStepCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import ElaborationProductsInCRUD from './ElaborationProductsInCRUD.vue'
    import ElaborationStepCRUD from './ElaborationStepCRUD.vue'
    import {empty_elaborations_products_in,empty_elaborations_steps} from '../empty_objects.js'
    export default {
        components: {
            ElaborationProductsInCRUD,
            ElaborationStepCRUD,

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

                loading_products: false,


                products_in_headers: [
                    { text: this.$t('Product'), sortable: true, value: 'products'},
                    { text: this.$t('Amount'), value: 'amount', align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],

                steps_headers: [
                    { text: this.$t('Order'), sortable: false, value: 'order'},
                    { text: this.$t('Step'), sortable: false, value: 'steps'},
                    { text: this.$t('Duration'), sortable: false, value: 'duration', align:'right'},
                    { text: this.$t('Temperature'), value: 'temperature', sortable: false, width:"8%"},
                    { text: this.$t('Stir'), value: 'stir', sortable: false, width:"8%"},
                    { text: this.$t('Products in step'), sortable: false, value: 'products_in_step'},
                    { text: this.$t('Comment'), sortable: false, value: 'comment', width:"15%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],

                key:0,
                product_in:null,
                product_in_mode:null,
                dialog_products_in_crud:false,

                // Elaboration step
                elaboration_step:null,
                elaboration_step_mode:null,
                dialog_elaboration_step_crud:false,
            }
        },
        methods: {
            empty_elaborations_products_in,
            empty_elaborations_steps,
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
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return   

                console.log(this.new_elaboration)

                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/elaborations/`, this.new_elaboration,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_elaboration.url, this.new_elaboration,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this elaboration register?"))
                    if(r == true) {
                        axios.delete(this.new_elaboration.url, this.myheaders())
                        .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
            addProductIn(){
                this.product_in=this.empty_elaborations_products_in()
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
            on_ElaborationProductsInCRUD_cruded(mode,item,olditem){
                this.dialog_products_in_crud=false  
                if (mode=="C"){
                    this.new_elaboration.elaborations_products_in.push(item)
                } else if (mode=="U"){
                    let index = this.new_elaboration.elaborations_products_in.indexOf(olditem)
                    this.new_elaboration.elaborations_products_in[index].products_in=item.products_in
                    this.new_elaboration.elaborations_products_in[index].amount=item.amount
                    
                } else if (mode=="D"){
                    let index = this.new_elaboration.elaborations_products_in.indexOf(olditem)
                    this.new_elaboration.elaborations_products_in.splice(index,1)
                }
                this.key=this.key+1
            },
            addElaborationStep(){
                this.elaboration_step=this.empty_elaborations_steps()
                this.elaboration_step_mode='C'
                this.key=this.key+1
                this.dialog_elaboration_step_crud=true

            },
            editElaborationStep(item){
                this.elaboration_step=item
                this.elaboration_step_mode='U'
                this.key=this.key+1
                this.dialog_elaboration_step_crud=true

            },
            deleteElaborationStep(item){
                this.elaboration_step=item
                this.elaboration_step_mode='D'
                this.key=this.key+1
                this.dialog_elaboration_step_crud=true

            },
            on_ElaborationsStep_cruded(mode,item,olditem){
                if (mode=="C"){
                    this.new_elaboration.elaborations_steps.push(item)
                } else if (mode=="U"){
                    let index = this.new_elaboration.elaborations_steps.indexOf(olditem)
                    this.new_elaboration.elaborations_steps[index]=item
                    
                } else if (mode=="D"){
                    let index = this.new_elaboration.elaborations_steps.indexOf(olditem)
                    this.new_elaboration.elaborations_steps.splice(index,1)
                }
                this.key=this.key+1
                this.dialog_elaboration_step_crud=false  
            },
            list_of_products_in_step(item){
                var r=""
                item.products_in_step.forEach(o=>{

                    this.new_elaboration.elaborations_products_in.forEach(p=> {
                        if (p.url==o){
                            r=r+this.$store.getters.getObjectPropertyByUrl('products', p.products,'name')
                        }

                    })
                })
                return r
            }
        },
        created(){
            // Guess crud mode
            this.new_elaboration=Object.assign({},this.elaboration)
        }
    }
</script>

