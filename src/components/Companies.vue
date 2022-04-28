<template>
    <div class="ma-4">
        <h1>{{ $t(`Companies`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <v-text-field class="ml-10 mr-10 mb-5" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')"></v-text-field>
    
        <v-tabs  background-color="primary" dark v-model="tab" >
            <v-tab key="companies">{{ $t('Companies') }}</v-tab>
            <v-tab key="system_companies">{{ $t('System companies') }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="ma-5">
            <v-tab-item key="companies" >
                <v-data-table dense :headers="companies_headers" :search="search" :items="$store.state.companies" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
                    <template v-slot:[`item.last`]="{ item }">
                        {{localtime(item.last)}}
                    </template>        
                    <template v-slot:[`item.system_companies`]="{ item }">
                        <v-icon small v-if="item.system_companies" >mdi-check-outline</v-icon>
                    </template>               
                    <template v-slot:[`item.obsolete`]="{ item }">
                            <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon v-if="item.is_editable" small class="mr-2" @click="editCompany(item)">mdi-pencil</v-icon>
                        <v-icon v-if="item.is_deletable" small @click="deleteCompany(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
            <v-tab-item key="system_companies" >                 
                <v-data-table dense :headers="system_companies_headers" :search="search" :items="system_companies" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
                    <template v-slot:[`item.last`]="{ item }">
                        {{localtime(item.last)}}
                    </template>             
                    <template v-slot:[`item.obsolete`]="{ item }">
                            <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small @click="linkCompany(item)">mdi-link-variant</v-icon>   
                        <v-icon class="mr-1" small @click="editSystemCompany(item)"  color="#AA0000" v-if="$store.state.catalog_manager">mdi-pencil</v-icon>
                        <v-icon class="mr-1" small @click="deleteSystemCompany(item)" color="#AA0000" v-if="$store.state.catalog_manager">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
        </v-tabs-items>




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
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import CompaniesCRUD from './CompaniesCRUD.vue'
    import SystemCompaniesCRUD from './SystemCompaniesCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            CompaniesCRUD,
            SystemCompaniesCRUD,
        },
        data(){
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Company options"),
                        children: [
                            {
                                name: this.$t("Add a company"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.company_mode="C"
                                    this_.company=this_.empty_companies()
                                    this_.key=this_.key+1
                                    this_.dialog_companies_crud=true
                                },
                            },
                        ]
                    },
                    {
                        subheader: this.$t("System company options"),
                        children: [
                            {
                                name: this.$t("Add a system company"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.system_company_mode="C"
                                    this_.system_company=this_.empty_system_companies()
                                    this_.key=this_.key+1
                                    this_.dialog_system_companies_crud=true
                                },
                            },
                        ]
                    },
                ],
                companies:[],
                companies_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Last edition'), value: 'last', align:'right', width:"12%"},
                    { text: this.$t('System companies'), value: 'system_companies',width:"8%"},
                    { text: this.$t('Obsolete'), value: 'obsolete' , width:"8%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],
                system_companies:[],
                system_companies_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Last edition'), value: 'last', align:'right', width:"12%"},
                    { text: this.$t('Obsolete'), value: 'obsolete' , width:"8%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
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
            on_CompaniesCRUD_cruded(){
                this.dialog_companies_crud=false
                this.$store.dispatch("getCompanies")
            },
            on_SystemCompaniesCRUD_cruded(){
                this.dialog_system_companies_crud=false
                this.update_system_companies().then(() => {
                    this.$store.dispatch("getCompanies")
                    this.key=this.key+1
                })
            },
            update_system_companies(){
                this.loading=true
                return axios.get(`${this.$store.state.apiroot}/api/system_companies/`, this.myheaders())
                .then((response) => {
                    this.system_companies=response.data
                    this.key=this.key+1
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

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
                alert(this.$t("System products never should be deleted. You can set obsolete or rename to Reusable when needed."))
            },
        },
        created(){
            this.update_system_companies()
        }
    }
</script>