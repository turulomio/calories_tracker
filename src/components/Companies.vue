<template>
    <div class="ma-4">
        <h1>{{ $t(`Companies`) }}
            <MyMenuInline :items="menuinline_items()"></MyMenuInline>
        </h1>
        <v-text-field id="filter" class="ml-10 mr-10 mb-5" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')"  v-on:keyup.enter="on_search_change()"></v-text-field>
    
        <v-tabs bg-color="primary" v-model="tab" >
            <v-tab id="tabCompanies" key="companies">{{ $t('Companies') }}<v-badge inline v-if="companies.length>0" color="error" class="ml-2" :content="companies.length"/></v-tab>
            <v-tab id="tabSystemCompanies" key="system_companies">{{ $t('System companies') }}<v-badge inline v-if="system_companies.length>0" color="error" class="ml-2" :content="system_companies.length"/></v-tab>
        </v-tabs>
        <v-window v-model="tab" class="ma-5">
            <v-window-item key="companies" >
                <v-data-table density="compact" :headers="companies_headers" :items="companies" :sort-by="[{key:'name',order:'asc'}]"  class="elevation-1" :items-per-page="10000" :loading="loading" :key="'T'+key" >
                    <template #item.last="{item}">
                        {{localtime(item.last)}}

                    </template>
                    <template #item.system_companies="{item}">
                        <v-icon small v-if="item.system_companies" >mdi-check-outline</v-icon>
                    </template>               

                    <template #item.obsolete="{item}">
                            <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
                    </template>
                    <template #item.actions="{item}">
                        <v-icon v-if="item.is_editable" small class="mr-2" @click="editCompany(item)">mdi-pencil</v-icon>
                        <v-icon v-if="item.is_deletable" small @click="deleteCompany(item)">mdi-delete</v-icon>
                    </template>
                    <template #bottom ></template>  
                </v-data-table>
            </v-window-item>
            <v-window-item key="system_companies" >                 
                <v-data-table density="compact" :headers="system_companies_headers" :items="system_companies" :sort-by="[{key:'name',order:'asc'}]" class="elevation-1" :items-per-page="10000" :loading="loading" :key="'T'+key">
                    <template #item.last="{item}">
                        {{localtime(item.last)}}
                    </template>             
                    <template #item.obsolete="{item}">
                            <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
                    </template>
                    <template #item.actions="{item}">
                        <v-icon small @click="linkCompany(item)">mdi-link-variant</v-icon>
                        <v-icon class="mr-1" small @click="editSystemCompany(item)"  color="#AA0000" v-if="useStore().catalog_manager">mdi-pencil</v-icon>
                        <v-icon class="mr-1" small @click="deleteSystemCompany(item)" color="#AA0000" v-if="useStore().catalog_manager">mdi-delete</v-icon>
                    </template>
                    <template #bottom ></template>  
                </v-data-table>
            </v-window-item>
        </v-window>




        <!-- DIALOG COMPANIES CRUD -->
        <v-dialog v-model="dialog_companies_crud" width="45%">
            <v-card class="pa-4">
                <CompaniesCRUD :company="company" :mode="company_mode" :key="'B'+key" @cruded="on_CompaniesCRUD_cruded()"></CompaniesCRUD>
            </v-card>
        </v-dialog>
        <!-- DIALOG SYSTEM COMPANIES CRUD -->
        <v-dialog v-model="dialog_system_companies_crud" width="45%">
            <v-card class="pa-4">
                <SystemCompaniesCRUD :system_company="system_company" :mode="system_company_mode" :key="'C'+key" @cruded="on_SystemCompaniesCRUD_cruded()"></SystemCompaniesCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_companies,empty_system_companies } from '../empty_objects.js'
    import {localtime} from 'vuetify_rules'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import CompaniesCRUD from './CompaniesCRUD.vue'
    import SystemCompaniesCRUD from './SystemCompaniesCRUD.vue'
    import { useStore } from '@/store.js'
    import { myheaders, parseResponseError } from '@/functions'
    export default {
        components: {
            MyMenuInline,
            CompaniesCRUD,
            SystemCompaniesCRUD,
        },
        data(){
            return {
                companies:[],
                companies_headers: [
                    { title: this.$t('Name'), sortable: true, key: 'name'},
                    { title: this.$t('Last edition'), key: 'last', align:'right', width:"12%"},
                    { title: this.$t('System companies'), key: 'system_companies',width:"8%"},
                    { title: this.$t('Obsolete'), key: 'obsolete' , width:"8%"},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width:"8%"},
                ],
                system_companies:[],
                system_companies_headers: [
                    { title: this.$t('Name'), sortable: true, key: 'name'},
                    { title: this.$t('Last edition'), key: 'last', align:'right', width:"12%"},
                    { title: this.$t('Obsolete'), key: 'obsolete' , width:"8%"},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width:"8%"},
                ],
                loading:false,
                key:0,
                tab:0,
                search:"",

                //CRUD COMPANY
                company:null,
                company_mode:null,
                dialog_companies_crud:false,
                //CRUD SYSTEM COMPANY
                system_company:null,
                system_company_mode:null,
                dialog_system_companies_crud:false,
            }
        },        
        methods:{
            empty_companies,
            empty_system_companies,
            localtime,
            myheaders,
            parseResponseError,
            useStore,
            menuinline_items(){
                let r= [
                    {
                        subheader: this.$t("Company options"),
                        children: [
                            {
                                name: this.$t("Add a company"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.company_mode="C"
                                    this.company=this.empty_companies()
                                    this.key=this.key+1
                                    this.dialog_companies_crud=true
                                }.bind(this),
                            },
                        ]
                    },
                ]
                if (this.useStore().catalog_manager) r.push({
                        subheader: this.$t("System company options"),
                        children: [
                            {
                                name: this.$t("Add a system company"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.system_company_mode="C"
                                    this.system_company=this.empty_system_companies()
                                    this.key=this.key+1
                                    this.dialog_system_companies_crud=true
                                }.bind(this),
                            },
                        ]
                })
                return r
            },
            on_CompaniesCRUD_cruded(){
                this.dialog_companies_crud=false
                this.update_all()
            },
            on_SystemCompaniesCRUD_cruded(){
                this.dialog_system_companies_crud=false
                this.update_all()
            },
            editCompany(item){
                this.company=item
                this.company_mode="U"
                this.key=this.key+1

                this.dialog_companies_crud=true
            },
            deleteCompany(item){
                this.company=item
                this.company_mode="D"
                this.key=this.key+1

                this.dialog_companies_crud=true
            },
            editSystemCompany(item){
                this.system_company=item
                this.system_company_mode="U"
                this.key=this.key+1
                this.dialog_system_companies_crud=true
            },
            deleteSystemCompany(){
                alert(this.$t("System companies never should be deleted. You can set obsolete or rename to REUSABLE when needed."))
            },

            on_search_change(){
                //Pressing enter
                this.update_all(true) 
            },
            linkCompany(item){
                axios.post(`${item.url}create_company/`, {}, this.myheaders())
                .then((response) => {
                    this.useStore().companies.set(response.data.url,response.data)
                    this.update_all()
               }, (error) => {
                    this.parseResponseError(error)
                });
            },
            update_companies(){
                this.companies=this.getArrayFromMap(this.useStore().companies).filter(o=> o.name.toLowerCase().includes(this.search.toLowerCase())) 
            },
            update_system_companies(){
                return axios.get(`${this.useStore().apiroot}/api/system_companies/?search=${this.search}`, this.myheaders())
                .then((response) => {
                    this.system_companies=response.data
               }, (error) => {
                    this.parseResponseError(error)
                });

            },
            update_all(){
                // Refresh companies and system companies
                // dispatch true refreshes uses
                if (this.search==null) return
                this.loading=true
                Promise.all([this.update_companies(), this.update_system_companies()])
                .then( ()=> {
                    this.key=this.key+1
                    this.loading=false
                })
            },
        },
    }
</script>