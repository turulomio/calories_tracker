<template>
    <div>    
        <h1 @click="showinfo=!showinfo" v-show="showinfo">{{ title() }}</h1>        
        <div class="d-flex flex-row">
        <v-card class="pa-6 mt-4" style="overflow-y: scroll" min-width="50%">
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <v-text-field data-test="ProductsCRUD_Name" :readonly="mode=='D' || mode=='R'" v-model="newproduct.name" :label="$t('Set product name')" :placeholder="$t('Set product name')" :rules="RulesString(200)" counter="200"/>
                <v-autocomplete data-test="ProductsCRUD_Companies" v-model="newproduct.companies" :items="getArrayFromMap(useStore().companies)" :label="$t('Select a company')" item-title="name" item-value="url" :rules="RulesSelection(false)"/>
                <v-autocomplete data-test="ProductsCRUD_FoodTypes" :readonly="mode=='D' || mode=='R'" :items="getArrayFromMap(useStore().food_types)" v-model="newproduct.food_types" :label="$t('Select product food type')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <AutocompleteAdditives data-test="ProductsCRUD_Additives" :readonly="mode=='D' || mode=='R'" :additives="getArrayFromMap(useStore().additives)" v-model="newproduct.additives" />
                <v-text-field data-test="ProductsCRUD_Amount" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.amount" :label="$t('Set product amount (gr)')" :placeholder="$t('Set product amount (gr)')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Calories" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.calories" :label="$t('Set product calories (gr)')" :placeholder="$t('Set product calories (gr)')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Density" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.density" :label="$t(`Set product density (gr/ml). Empty if you don't know`)" :placeholder="$t('Set product density(gr/ml)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Fat" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.fat" :label="$t('Set product fat (gr)')" :placeholder="$t('Set product fat (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_SaturatedFat" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.saturated_fat" :label="$t('Set product saturated_fat (gr)')" :placeholder="$t('Set product saturated_fat (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Protein" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.protein" :label="$t('Set product protein (gr)')" :placeholder="$t('Set product protein (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Carbohydrate" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.carbohydrate" :label="$t('Set product carbohydrate (gr)')" :placeholder="$t('Set product carbohydrate (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Sugars" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.sugars" :label="$t('Set product sugars (gr)')" :placeholder="$t('Set product sugars (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Cholesterol" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.cholesterol" :label="$t('Set product cholesterol (gr)')" :placeholder="$t('Set product cholesterol (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Salt" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.salt" :label="$t('Set product salt (gr)')" :placeholder="$t('Set product salt (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Sodium" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.sodium" :label="$t('Set product sodium (mg)')" :placeholder="$t('Set product sodium (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Potassium" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.potassium" :label="$t('Set product potassium (mg)')" :placeholder="$t('Set product potassium (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Fiber" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.fiber" :label="$t('Set product fiber (gr)')" :placeholder="$t('Set product fiber (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Ferrum" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.ferrum" :label="$t('Set product ferrum (mg)')" :placeholder="$t('Set product ferrum (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Magnesium" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.magnesium" :label="$t('Set product magnesium (mg)')" :placeholder="$t('Set product magnesium (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Phosphor" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.phosphor" :label="$t('Set product phosphor (mg)')" :placeholder="$t('Set product phosphor (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field data-test="ProductsCRUD_Calcium" :readonly="mode=='D' || mode=='R'" v-model.number="newproduct.calcium" :label="$t('Set product calcium (mg)')" :placeholder="$t('Set product calcium (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-checkbox data-test="ProductsCRUD_GlutenFree" v-model="newproduct.glutenfree" :label="$t('Is gluten free?')"></v-checkbox>
                <v-text-field :readonly="mode=='D' || mode=='R'" v-model="newproduct.openfoodfacts_id" :label="$t('Set Open Facts Food Id')" :placeholder="$t('Set Open Facts Food Id')" :rules="RulesString(14,false)" counter="14"/>

                <AutocompleteProducts :readonly="mode=='D' || mode=='R'" :products="getArrayFromMap(useStore().products)" v-model="newproduct.products"/>
                <v-text-field :readonly="mode=='D' || mode=='R'" v-model="newproduct.version_description" :label="$t('Set product version description')" :placeholder="$t('Set product version description')" :rules="RulesString(200,false)" counter="200"/>
                <v-checkbox data-test="ProductsCRUD_Obsolete" v-model="newproduct.obsolete" :label="$t('Is obsolete?')"></v-checkbox>
                <v-card class="mt-4">
                    <v-data-table density="compact" :headers="formats_headers" :items="newproduct.formats" :sort-by="[{key:'formats',order:'asc'}]"  class="elevation-1" :items-per-page="10000" :key="'T'+key" :height="250">
                        <template #item.formats="{item}"><div v-html="useStore().formats.get(item.formats).name"></div></template> 
                        <template #item.actions="{item}">
                            <v-icon small class="mr-2" @click="editFormat(item)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteFormat(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-form>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="ProductsCRUD_ButtonFormat" color="primary" v-if="['C','U'].includes(mode)" @click="addFormat()" >{{ $t("Add a format") }}</v-btn>
                <v-btn data-test="ProductsCRUD_ButtonAdd" color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
                <v-btn data-test="ProductsCRUD_ButtonClose" color="error" @click="$emit('cruded')" >{{ $t("Close") }}</v-btn>
            </v-card-actions>
        </v-card>
   
            <p class="ma-5" v-html="info"></p>

        </div>

        <!-- DIALOG FORMATS CRUD -->
        <v-dialog v-model="dialog_formats_crud" width="45%">
            <v-card class="pa-4">
                <FormatsCRUD :format="format" :mode="format_mode" :key="'B'+key" @cruded="on_FormatsCRUD_cruded"></FormatsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import AutocompleteAdditives from './AutocompleteAdditives.vue'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import FormatsCRUD from './FormatsCRUD.vue'
    import { empty_formats } from '../empty_objects.js'
    import { additives_html_fullname} from '../functions.js'
    import {RulesSelection,RulesFloatGEZ,RulesString, RulesInteger} from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        components: {
            AutocompleteAdditives,
            AutocompleteProducts,
            FormatsCRUD,
        },
        props: {
            
            product: { 
                required: true
            },
            mode: { 
                required: true
            },
            info:{//Used to show info 
                required:false,
                default:""
            },

            showinfo:{
                required: false,
                default:true
            }            
        },
        data(){ 
            return{
                form_valid:false,
                newproduct: null,
                key:0,

                
                formats_headers: [
                    { title: this.$t('Format'), sortable: true, key: 'formats'},
                    { title: this.$t('Amount'), key: 'amount', align:'right'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width:"8%"},
                ],

                //Formats crud
                format:this.empty_formats(),
                format_mode:false,
                dialog_formats_crud:false,
            }
        },
        methods: {
        useStore,
            RulesSelection,RulesFloatGEZ,RulesString,
            empty_formats,
            additives_html_fullname,
            RulesInteger,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new product')
                if (this.mode=="R") return this.$t('View this product')
                if (this.mode=="U") return this.$t('Update this product')
                if (this.mode=="D") return this.$t('Delete this product')
            },
            acceptDialog(){             
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/products/`, this.newproduct,  this.myheaders())
                    .then((response) => {
                        this.useStore().products.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.newproduct.url, this.newproduct,  this.myheaders())
                    .then((response) => {
                        this.useStore().products.set(response.data.url,response.data)
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this product?"))
                    if(r == true) {
                        axios.delete(this.newproduct.url, this.myheaders())
                        .then(() => {
                            this.useStore().products.delete(this.newproduct.url)
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
                    this.newproduct.formats.splice(index,1)
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

