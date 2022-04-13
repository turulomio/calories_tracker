<template>
    <div>
        <v-data-table dense :headers="items_headers" :items="items" sort-by="datetime" class="elevation-1" hide-default-footer disable-pagination :key="key" >
            <template v-slot:[`item.datetime`]="{ item }">
                {{localtime(item.datetime)}}
            </template>             
            <template v-slot:[`item.activities`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('activities',item.activities,'localname')"></div>
            </template>         
            <template v-slot:[`item.weight_wishes`]="{ item }">
                <div v-html="$store.getters.getObjectPropertyByUrl('weight_wishes',item.weight_wishes,'localname')"></div>
            </template>     


            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>                  
            <template v-slot:[`body.append`]="{headers}">
                <tr style="background-color: WhiteSmoke">
                    <td v-for="(header,i) in headers" :key="i">
                        <div v-if="header.value == 'localname'">
                            Total
                        </div>
                        <div v-if="header.value == 'balance_user'" align="right" v-html="localcurrency_html(listobjects_sum(accounts_items,'balance_user'))">
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <!-- DIALOG BIOMETRICS CRUD -->
        <v-dialog v-model="dialog_biometrics_crud" width="45%">
            <v-card class="pa-4">
                <BiometricsCRUD :biometric="biometric" :deleting="biometric_deleting" :key="key" @cruded="on_BiometricsCRUD_cruded()"></BiometricsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>    
    import BiometricsCRUD from './BiometricsCRUD.vue'
    export default {
        components: {
            BiometricsCRUD
        },    
        props: {
            items: {
                required: true
            },
            showactions:{
                required:false,
                default: true,
            }
        },
        data(){
            return {
                items_headers: [
                    { text: this.$t('Date and time'), sortable: true, value: 'datetime'},
                    { text: this.$t('Height'), value: 'height', align:'right'},
                    { text: this.$t('Weight'), value: 'weight', align:'right' },
                    { text: this.$t('Activity'), value: 'activities'},
                    { text: this.$t('Weight wish'), value: 'weight_wishes'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false},
                ],
                key:0,

                // Biometrics CRUD
                biometric:false,
                biometric_deleting:false,
                dialog_biometrics_crud:false,

            }
        },
        methods:{
            on_BiometricsCRUD_cruded(){
                this.dialog_biometrics_crud=false
                this.update_biometrics()
            },
            editItem (item) {
                this.biometric=item
                this.biometric_deleting=false
                this.key=this.key+1
                this.dialog_biometrics_crud=true
            },
            deleteItem (item) {
                this.biometric=item
                this.biometric_deleting=true
                this.key=this.key+1
                this.dialog_biometrics_crud=true
            },

        },
    }
</script>
