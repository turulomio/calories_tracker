<template>
    <div>    
        <h1>{{ title() }}</h1>              
        <div class="d-flex flex-row">
        <v-card class="pa-6 mt-4" style="overflow-y: scroll" :height="600" min-width="50%" >
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <v-text-field id="SystemProductsCRUD_Name" :readonly="mode=='D' || mode=='R'" v-model="new_system_product.name" :label="$t('Set system product name')" :placeholder="$t('Set system product name')" :rules="RulesString(200)" counter="200"/>
                <!-- <v-autocomplete v-model="new_system_product.system_companies" :items="getArrayFromMap(useStore().system_companies)" :label="$t('Select a system company')" item-title="name" item-value="url" :rules="RulesSelection(true)"/> -->
                <AutoCompleteApiIdName id="SystemProductsCRUD_SystemCompanies" v-model="new_system_product.system_companies" :url="`${this.useStore().apiroot}/api/system_companies/`" :label="$t('Select a system company')" />
                <v-autocomplete id="SystemProductsCRUD_FoodTypes" :readonly="mode=='D' || mode=='R'" :items="getArrayFromMap(useStore().food_types)" v-model="new_system_product.food_types" :label="$t('Select system product food type')" item-title="localname" item-value="url" :rules="RulesSelection(true)"></v-autocomplete>
                <AutocompleteAdditives id="SystemProductsCRUD_Additives" :readonly="mode=='D' || mode=='R'" :additives="getArrayFromMap(useStore().additives)" v-model="new_system_product.additives" />

                <v-text-field id="SystemProductsCRUD_Amount" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.amount" :label="$t('Set system product amount (gr)')" :placeholder="$t('Set system product amount (gr)')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Density" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.density" :label="$t(`Set product density (gr/ml). Empty if you don't know`)" :placeholder="$t('Set product density(g/ml)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Calories" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.calories" :label="$t('Set system product calories (gr)')" :placeholder="$t('Set system product calories (gr)')" :rules="RulesFloatGEZ(10,true,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Fat" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.fat" :label="$t('Set system product fat (gr)')" :placeholder="$t('Set system product fat (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_SaturatedFat" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.saturated_fat" :label="$t('Set system product saturated_fat (gr)')" :placeholder="$t('Set system product saturated_fat (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Protein" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.protein" :label="$t('Set system product protein (gr)')" :placeholder="$t('Set system product protein (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Carbohydrate" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.carbohydrate" :label="$t('Set system product carbohydrate (gr)')" :placeholder="$t('Set system product carbohydrate (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Sugars" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.sugars" :label="$t('Set system product sugars (gr)')" :placeholder="$t('Set system product sugars (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Salt" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.salt" :label="$t('Set system product salt (gr)')" :placeholder="$t('Set system product salt (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Sodium" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.sodium" :label="$t('Set system product sodium (mg)')" :placeholder="$t('Set system product sodium (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Cholesterol" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.cholesterol" :label="$t('Set system product cholesterol (gr)')" :placeholder="$t('Set system product cholesterol (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Potassium" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.potassium" :label="$t('Set system product potassium (mg)')" :placeholder="$t('Set system product potassium (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Fiber" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.fiber" :label="$t('Set system product fiber (gr)')" :placeholder="$t('Set system product fiber (gr)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Ferrum" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.ferrum" :label="$t('Set system product ferrum (mg)')" :placeholder="$t('Set system product ferrum (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Magnesium" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.magnesium" :label="$t('Set system product magnesium (mg)')" :placeholder="$t('Set system product magnesium (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Phosphor" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.phosphor" :label="$t('Set system product phosphor (mg)')" :placeholder="$t('Set system product phosphor (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-text-field id="SystemProductsCRUD_Calcium" :readonly="mode=='D' || mode=='R'" v-model.number="new_system_product.calcium" :label="$t('Set system product calcium (mg)')" :placeholder="$t('Set system product calcium (mg)')" :rules="RulesFloatGEZ(10,false,3)" counter="10"/>
                <v-checkbox id="SystemProductsCRUD_GlutenFree" v-model="new_system_product.glutenfree" :label="$t('Is gluten free?')"></v-checkbox>
                <AutocompleteProducts :readonly="mode=='D' || mode=='R'" :products="getArrayFromMap(useStore().products)" v-model="new_system_product.products"/>
                <v-text-field :readonly="mode=='D' || mode=='R'" v-model="new_system_product.version_description" :label="$t('Set system product version description')" :placeholder="$t('Set system product version description')" :rules="RulesString(200,false)" counter="200"/>
                <v-checkbox id="SystemProductsCRUD_Obsolete" v-model="new_system_product.obsolete" :label="$t('Is obsolete?')"></v-checkbox>
                <v-card class="mt-4">
                    <v-data-table density="compact" :headers="formats_headers" :items="new_system_product.formats" :sort-by="[{key:'formats',order:'asc'}]" class="elevation-1" :items-per-page="10000" :key="'T'+key" :height="250">
                        <template #item.formats="{item}"><div v-html="useStore().formats.get( item.formats).name"></div></template> 
                        <template #item.actions="{item}">
                            <v-icon small class="mr-2" @click="editFormat(item)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteFormat(item)">mdi-delete</v-icon>
                        </template>
                        <template #bottom></template>
                    </v-data-table>
                </v-card>
            </v-form>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn id="SystemProductsCRUD_cmdFormat" color="primary" v-if="['C','U'].includes(mode)" @click="addFormat()" >{{ $t("Add a format") }}</v-btn>
                <v-btn id="SystemProductsCRUD_cmd" color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
                <v-btn id="SystemProductsCRUD_cmdCancel" color="error" @click="$emit('cruded')" >{{ $t("Cancel") }}</v-btn>
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
    import AutoCompleteApiIdName from './AutoCompleteApiIdName.vue'
    import AutocompleteProducts from './AutocompleteProducts.vue'
    import FormatsCRUD from './FormatsCRUD.vue'
    import { empty_formats } from '../empty_objects.js'
    import { RulesString,RulesSelection,RulesFloatGEZ } from 'vuetify_rules'
    import { useStore } from '@/store.js'
    export default {
        components: {
            AutoCompleteApiIdName,
            AutocompleteAdditives,
            AutocompleteProducts,
            FormatsCRUD,
        },
        props: {
            
            system_product: { 
                required: true
            },
            mode: { 
                required: true
            },
            info:{//Used to show info 
                required:false,
                default:""
            },
        },
        data(){ 
            return{
                form_valid:false,
                new_system_product: null,
                key:0,
                
                formats_headers: [
                    { title: this.$t('Format'), sortable: true, key: 'formats'},
                    { title: this.$t('Amount'), key: 'amount', align:'right'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width:"8%"},
                ],

                //Formats crud
                format:null,
                format_mode:false,
                dialog_formats_crud:false,
            }
        },
        methods: {
        useStore,
            empty_formats,
            RulesString,
            RulesSelection,
            RulesFloatGEZ,
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new system product')
                if (this.mode=="R") return this.$t('View this system product')
                if (this.mode=="U") return this.$t('Update this system product')
                if (this.mode=="D") return this.$t('Delete this system product')
            },
            acceptDialog(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/system_products/`, this.new_system_product,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(this.new_system_product.url, this.new_system_product,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="D"){             
                    var r = confirm(this.$t("Do you want to delete this system product?"))
                    if(r == true) {
                        axios.delete(this.new_system_product.url, this.myheaders())
                        .then(() => {
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
                    this.new_system_product.formats.push(item)
                } else if (mode=="U"){
                    let index = this.new_system_product.formats.indexOf(olditem)
                    this.new_system_product.formats[index].formats=item.formats
                    this.new_system_product.formats[index].amount=item.amount
                    
                } else if (mode=="D"){
                    let index = this.new_system_product.formats.indexOf(olditem)
                    this.new_system_product.formats.splice(index,1)
                }
                this.key=this.key+1
            }
        },
        created(){
            // Guess crud mode
            this.new_system_product=Object.assign({},this.system_product)
        }
    }
</script>

