<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-6 mt-4" style="overflow-y: scroll" :height="600" >
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <v-text-field :readonly="mode=='D'" v-model="newproduct.name" :label="$t('Set product name')" :placeholder="$t('Set product name')" :rules="RulesString(200)" counter="200"/>
                <AutoCompleteApiIdName v-model="newproduct.system_products" :url="`${this.$store.state.apiroot}/api/system_products/`" :label="$t('Select a system product')"></AutoCompleteApiIdName>
                <AutoCompleteApiIdName v-model="newproduct.companies" :url="`${this.$store.state.apiroot}/api/companies/`" :label="$t('Select a company')"></AutoCompleteApiIdName>
                <v-autocomplete :readonly="mode=='D'" :items="$store.state.food_types" v-model="newproduct.food_types" :label="$t('Select product food type')" item-text="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <v-autocomplete :readonly="mode=='D'" :items="$store.state.additives" v-model="newproduct.additives" multiple :label="$t('Select product additives')" item-text="fullname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>

                <v-text-field :readonly="mode=='D'" v-model="newproduct.amount" type="number" :label="$t('Set product amount (gr)')" :placeholder="$t('Set product amount (gr)')" :rules="RulesFloat(10,true)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.fat" type="number" :label="$t('Set product fat (gr)')" :placeholder="$t('Set product fat (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.protein" type="number" :label="$t('Set product protein (gr)')" :placeholder="$t('Set product protein (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.carbohydrate" type="number" :label="$t('Set product carbohydrate (gr)')" :placeholder="$t('Set product carbohydrate (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.calories" type="number" :label="$t('Set product calories (gr)')" :placeholder="$t('Set product calories (gr)')" :rules="RulesFloat(10,true)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.salt" type="number" :label="$t('Set product salt (gr)')" :placeholder="$t('Set product salt (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.cholesterol" type="number" :label="$t('Set product cholesterol (gr)')" :placeholder="$t('Set product cholesterol (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.sodium" type="number" :label="$t('Set product sodium (gr)')" :placeholder="$t('Set product sodium (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.potassium" type="number" :label="$t('Set product potassium (gr)')" :placeholder="$t('Set product potassium (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.fiber" type="number" :label="$t('Set product fiber (gr)')" :placeholder="$t('Set product fiber (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.sugars" type="number" :label="$t('Set product sugars (gr)')" :placeholder="$t('Set product sugars (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.saturated_fat" type="number" :label="$t('Set product saturated_fat (gr)')" :placeholder="$t('Set product saturated_fat (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.ferrum" type="number" :label="$t('Set product ferrum (gr)')" :placeholder="$t('Set product ferrum (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.magnesium" type="number" :label="$t('Set product magnesium (gr)')" :placeholder="$t('Set product magnesium (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.phosphor" type="number" :label="$t('Set product phosphor (gr)')" :placeholder="$t('Set product phosphor (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.calcium" type="number" :label="$t('Set product calcium (gr)')" :placeholder="$t('Set product calcium (gr)')" :rules="RulesFloat(10,false)" counter="10"/>
                <v-checkbox v-model="newproduct.glutenfree" :label="$t('Is gluten free?')"></v-checkbox>

                <AutoCompleteApiIdName v-model="newproduct.version_parent" :url="`${this.$store.state.apiroot}/api/products/`" :label="$t('Select parent product')"></AutoCompleteApiIdName>
                <v-text-field :readonly="mode=='D'" v-model="newproduct.version_description" :label="$t('Set product version description')" :placeholder="$t('Set product version description')" :rules="RulesString(200,false)" counter="200"/>
                <v-checkbox v-model="newproduct.obsolete" :label="$t('Is obsolete?')"></v-checkbox>
                <v-card class="mt-4">
                    <v-data-table dense :headers="formats_headers" :items="newproduct.formats" sort-by="formats" class="elevation-1" hide-default-footer disable-pagination :key="'T'+key" :height="250">
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="editFormat(item)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteFormat(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-form>
        </v-card>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="addFormat()" >{{ $t("Add a format") }}</v-btn>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn> 
                <v-btn color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>

            </v-card-actions>



        <!-- DIALOG FORMATS CRUD -->
        <v-dialog v-model="dialog_formats_crud" width="45%">
            <v-card class="pa-4">
                <FormatsCRUD :format="format" :mode="format.mode" :key="'B'+key" @cruded="on_FormatsCRUD_cruded"></FormatsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import AutoCompleteApiIdName from './AutoCompleteApiIdName.vue'
    import FormatsCRUD from './FormatsCRUD.vue'
    import { empty_formats } from '../empty_objects.js'
    export default {
        components: {
            AutoCompleteApiIdName,
            FormatsCRUD,
        },
        props: {
            // An account object
            product: { // An account transfer object
                required: true
            },
            mode: { 
                required: true
            },
        },
        data(){ 
            return{
                form_valid:false,
                newproduct: null,
                key:0,
                
                formats_headers: [
                    { text: this.$t('Format'), sortable: true, value: 'formats'},
                    { text: this.$t('Amount'), value: 'amount', align:'right'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],

                //Formats crud
                format:null,
                format_mode:false,
                dialog_formats_crud:false,
            }
        },
        methods: {
            empty_formats,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new product')
                if (this.mode=="U") return this.$t('Update this product')
                if (this.mode=="D") return this.$t('Delete this product')
            },
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return   
                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/products/`, this.newproduct,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newproduct.url, this.newproduct,  this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this product?"))
                    if(r == true) {
                        axios.delete(this.newproduct.url, this.myheaders())
                        .then((response) => {
                            console.log(response.data)
                            this.$emit("cruded")
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                    }
                }
            },
            addFormat(){
                this.format=this.empty_formats()
                this.format_mode="C"
                this.key=this.key+1

                this.dialog_formats_crud=true
            },
            editFormat(item){
                this.format=item
                this.format_mode="U"
                this.key=this.key+1

                this.dialog_formats_crud=true
            },
            deleteFormat(item){
                this.format=item
                this.format_mode="D"
                this.key=this.key+1

                this.dialog_formats_crud=true
            },
            on_FormatsCRUD_cruded(mode,item,olditem){
                this.dialog_formats_crud=false  
                if (mode=="C"){
                    this.newproduct.formats.push(item)
                } else if (mode=="U"){
                    let index = this.newproduct.formats.indexOf(olditem)
                    this.newproduct.formats[index].formats=item.formats
                    this.newproduct.formats[index].amount=item.amount
                    
                } else if (mode=="D"){
                    let index = this.newproduct.formats.indexOf(olditem)
                    delete this.newproduct.formats[index]
                }
                this.key=this.key+1
            }
        },
        created(){
            // Guess crud mode
            this.newproduct=Object.assign({},this.product)
        }
    }
</script>

