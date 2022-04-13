<template>
    <div>
        <h1>{{ $t(`Companies`) }}</h1>
        

        <v-data-table dense :headers="companies_headers" :items="companies" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
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
                <v-icon small class="mr-2" @click="editCompany(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteCompany(item)">mdi-delete</v-icon>
            </template>                  
            <template v-slot:[`body.append`]="{headers}">
                <tr style="background-color: WhiteSmoke">
                    <td v-for="(header,i) in headers" :key="'Foot'+i">
                        <div v-if="header.value == 'localname'">
                            Total
                        </div>
                        <div v-if="header.value == 'balance_user'" align="right" v-html="localcurrency_html(listobjects_sum(accounts_items,'balance_user'))">
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_companies } from '../empty_objects.js'
    export default {
        name: 'About',
        data(){
            return {
                companies:[],
                companies_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Last edition'), value: 'last', align:'right', width:"12%"},
                    { text: this.$t('System companies'), value: 'system_companies',width:"8%"},
                    { text: this.$t('Obsolete'), value: 'obsolete' , width:"8%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],
                loading:false,
                key:0,
            }
        },        methods:{
            empty_companies,
            on_CompaniesCRUD_cruded(){
                this.dialog_biometrics_crud=false
                this.update_companies()
            },
            update_companies(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/companies/`, this.myheaders())
                .then((response) => {
                    this.companies=response.data
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

            },
        },
        created(){
            this.update_companies()
        }
    }
</script>