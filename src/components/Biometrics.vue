<template>
    <div class="ma-5">
        <h1>{{ $t(`Biometrics`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :key="key" :minimized_items="6" width="30%"></DisplayValues>

        <v-tabs  bg-color="primary" dark v-model="tab" >
            <v-tab key="height">{{ $t('Height chart') }}</v-tab>
            <v-tab key="weight">{{ $t('Weight chart') }}</v-tab>
            <v-tab key="registers">{{ $t('Registers') }}</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="ma-5">
            <v-window-item key="height" >
                <ChartHeight v-if="!loading" :data="chart_height_data"></ChartHeight>
            </v-window-item>
            <v-window-item key="weight" >  
                <ChartWeight  v-if="!loading" :data="chart_weight_data"></ChartWeight>
            </v-window-item>
            <v-window-item key="registers" >  
                <v-card >
                    <v-data-table-virtual density="compact" :headers="biometrics_headers" :items="biometrics" :sort-by="[{key:'datetime',order:'desc'}]"  class="elevation-1" :items-per-page="10000" :loading="loading" :key="'T'+key" :height="500">
                        <template #item.datetime="{item}">
                            {{localtime(item.raw.datetime)}}
                        </template>              
                        <template #item.activities="{item}">
                            <div v-html="store().activities.get(item.raw.activities).localname"></div>
                        </template>         
                        <template #item.weight_wishes="{item}">
                            <div v-html="store().weight_wishes.get(item.raw.weight_wishes).localname"></div>
                        </template>     


                        <template #item.actions="{item}">
                            <v-icon small class="mr-2" @click="editBiometric(item.raw)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteBiometric(item.raw)">mdi-delete</v-icon>
                        </template>
                        <template #bottom></template>
                    </v-data-table-virtual>
                </v-card>
            </v-window-item>
        </v-window> 




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
    import DisplayValues from './reusing/DisplayValues.vue'
    import MyMenuInline from './reusing/MyMenuInline.vue'
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
                                code: function(){
                                    this.biometric_deleting=false
                                    this.biometric=this.empty_biometrics()
                                    this.biometric.height=this.biometric_last?.height
                                    this.biometric.weight=this.biometric_last?.weight
                                    this.biometric.weight_wishes=this.biometric_last?.weight_wishes
                                    this.biometric.activities=this.biometric_last?.activities
                                    this.key=this.key+1
                                    this.dialog_biometrics_crud=true
                                }.bind(this),
                            },
                        ]
                    },
                ],
                biometrics:[],
                biometrics_headers: [
                    { title: this.$t('Date and time'), sortable: true, key: 'datetime', width:"12%"},
                    { title: this.$t('Height'), key: 'height', align:'right', width:"8%"},
                    { title: this.$t('Weight'), key: 'weight', align:'right' , width:"8%"},
                    { title: this.$t('Activity'), key: 'activities'},
                    { title: this.$t('Weight wish'), key: 'weight_wishes'},             
                    { title: this.$t('IMC status'), key: 'imc_comment'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width:"5%"},
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
                    r.push({title:this.$t('Weight wish'), value: this.store().weight_wishes.get(this.biometric_last.weight_wishes).localname})
                    r.push({title:this.$t('IMC status'), value: this.biometric_last.imc_comment})
                    r.push({title:this.$t('Activity'), value: this.store().activities.get(this.biometric_last.activities).localname})

                }
                return r
            },
            on_BiometricsCRUD_cruded(){
                this.dialog_biometrics_crud=false
                this.update_biometrics()
            },
            update_biometrics(){
                this.loading=true
                axios.get(`${this.store().apiroot}/api/biometrics/`, this.myheaders())
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
