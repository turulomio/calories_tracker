<template>
    <div class="ma-4">
        <h1>{{ $t(`Companies`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <v-tabs  background-color="primary" dark v-model="tab" >
            <v-tab key="companies">{{ $t('Companies') }}</v-tab>
            <v-tab key="system_companies">{{ $t('System companies') }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="ma-5">
            <v-tab-item key="companies" >
                <v-data-table dense :headers="companies_headers" :items="$store.state.companies" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
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
                <v-data-table dense :headers="system_companies_headers" :items="system_companies" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
                    <template v-slot:[`item.last`]="{ item }">
                        {{localtime(item.last)}}
                    </template>             
                    <template v-slot:[`item.obsolete`]="{ item }">
                            <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
                    </template>
                </v-data-table>
            </v-tab-item>
        </v-tabs-items>




        <!-- DIALOG COMPANIES CRUD -->
        <v-dialog v-model="dialog_companies_crud" width="45%">
            <v-card class="pa-4">
                <CompaniesCRUD :company="company" :deleting="company_deleting" :key="'B'+key" @cruded="on_CompaniesCRUD_cruded()"></CompaniesCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_companies } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import CompaniesCRUD from './CompaniesCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            CompaniesCRUD,
        },
        data(){
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Company options"),
                        children: [
                            {
                                name: this.$t("Add company"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.company_deleting=false
                                    this_.company=this_.empty_companies()
                                    this_.key=this_.key+1
                                    this_.dialog_companies_crud=true
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

                //CRUD COMPANY
                company:null,
                company_deleting:null,
                dialog_companies_crud:false,
            }
        },        
        methods:{
            empty_companies,
            on_CompaniesCRUD_cruded(){
                this.dialog_companies_crud=false
                this.$store.dispatch("getCompanies")
            },
            update_system_companies(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/system_companies/`, this.myheaders())
                .then((response) => {
                    this.system_companies=response.data
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

            },
            editCompany(item){
                this.company=item
                this.company_deleting=false
                this.key=this.key+1

                this.dialog_companies_crud=true
            },
            deleteCompany(item){
                this.company=item
                this.company_deleting=true
                this.key=this.key+1

                this.dialog_companies_crud=true
            },
        },
        created(){
            this.update_system_companies()
        }
    }
</script>