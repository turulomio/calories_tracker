<template>
    <div class="ma-5">
        <h1>{{ $t(`Biometrics`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :key="key" :minimized_items="6"></DisplayValues>

        <v-tabs  background-color="primary" dark v-model="tab" >
            <v-tab key="height">{{ $t('Height chart') }}</v-tab>
            <v-tab key="weight">{{ $t('Weight chart') }}</v-tab>
            <v-tab key="registers">{{ $t('Registers') }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="ma-5">
            <v-tab-item key="height" >
                <ChartHeight v-if="!loading" :data="chart_height_data"></ChartHeight>
            </v-tab-item>
            <v-tab-item key="weight" >  
                <ChartWeight  v-if="!loading" :data="chart_weight_data"></ChartWeight>
            </v-tab-item>
            <v-tab-item key="registers" >  
                <v-card v-if="!loading">

                    <v-data-table dense :headers="biometrics_headers" :items="biometrics" sort-by="datetime" :sort-desc="['datetime']" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
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
                            <v-icon small class="mr-2" @click="editBiometric(item)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteBiometric(item)">mdi-delete</v-icon>
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
                </v-card>
            </v-tab-item>
        </v-tabs-items> 




        <!-- DIALOG PERSONCRUD -->
        <v-dialog v-model="dialog_biometrics_crud" width="45%">
            <v-card class="pa-4">
                <BiometricsCRUD :biometric="biometric" :deleting="biometric_deleting" :key="'B'+key" @cruded="on_BiometricsCRUD_cruded()"></BiometricsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import {empty_biometrics} from '../empty_objects.js'
    import DisplayValues from './DisplayValues.vue'
    import MyMenuInline from './MyMenuInline.vue'
    import BiometricsCRUD from './BiometricsCRUD.vue'
    import ChartHeight from './ChartHeight.vue'
    import ChartWeight from './ChartHeight.vue'
    export default {
        components: {
            MyMenuInline,
            DisplayValues,
            BiometricsCRUD,
            ChartHeight,
            ChartWeight,
        },
        data(){
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Biometric options"),
                        children: [
                            {
                                name: this.$t("Add biometrics"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.biometric_deleting=false
                                    this_.biometric=this_.empty_biometrics()
                                    this_.biometric.height=this_.biometric_last.height
                                    this_.biometric.weight=this_.biometric_last.weight
                                    this_.biometric.weight_wishes=this_.biometric_last.weight_wishes
                                    this_.biometric.activities=this_.biometric_last.activities
                                    this_.key=this_.key+1
                                    this_.dialog_biometrics_crud=true
                                },
                            },
                        ]
                    },
                ],
                biometrics:[],
                biometrics_headers: [
                    { text: this.$t('Date and time'), sortable: true, value: 'datetime', width:"12%"},
                    { text: this.$t('Height'), value: 'height', align:'right', width:"8%"},
                    { text: this.$t('Weight'), value: 'weight', align:'right' , width:"8%"},
                    { text: this.$t('Activity'), value: 'activities'},
                    { text: this.$t('Weight wish'), value: 'weight_wishes'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"5%"},
                ],
                loading:false,
                key:0,
                tab:1,
                biometric_last:null,

                // Charts
                chart_height_data: [],
                chart_weight_data: [],

                // Biometrics CRUD
                biometric:false,
                biometric_deleting:false,
                dialog_biometrics_crud:false,
            }
        },
        methods:{
            empty_biometrics,
            displayvalues(){
                var r=[]
                if (this.biometrics.length>0){
                    r.push({title:this.$t('Date and time'), value: this.localtime(this.biometric_last.datetime)})
                    r.push({title:this.$t('Weight'), value: this.biometric_last.weight})
                    r.push({title:this.$t('Height'), value: this.biometric_last.height})
                    r.push({title:this.$t('Weight wish'), value: this.$store.getters.getObjectPropertyByUrl("weight_wishes",this.biometric_last.weight_wishes,"localname")})
                    r.push({title:this.$t('Activity'), value: this.$store.getters.getObjectPropertyByUrl("activities",this.biometric_last.activities,"localname")})

                }
                return r
            },
            on_BiometricsCRUD_cruded(){
                this.dialog_biometrics_crud=false
                this.update_biometrics()
            },
            update_biometrics(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/biometrics/`, this.myheaders())
                .then((response) => {
                    this.biometrics=response.data
                    if (this.biometrics.length>0) this.biometric_last=this.biometrics[this.biometrics.length - 1]
                    this.chart_height_data=[]
                    this.chart_weight_data=[]
                    this.biometrics.forEach(o => { 
                        this.chart_height_data.push([o.datetime,o.height])
                        this.chart_weight_data.push([o.datetime,o.weight])
                    })
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

            },
            editBiometric(item){
                this.biometric=item
                this.biometric_deleting=false
                this.key=this.key+1

                this.dialog_biometrics_crud=true
            },
            deleteBiometric(item){
                this.biometric=item
                this.biometric_deleting=true
                this.key=this.key+1

                this.dialog_biometrics_crud=true
            },

        },
        mounted(){
            this.update_biometrics()
        }
    }
</script>
<style>
h2 {
    text-align: center;
    font-weight: normal;
}

paragraph{
    text-align:justify;
    padding: 30px;
}
</style>
