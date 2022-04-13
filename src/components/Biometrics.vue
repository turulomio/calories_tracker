<template>
    <div class="paragraph">
        <h1>{{ $t(`Biometrics`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :key="key" :minimized_items="6"></DisplayValues>

        <BiometricsTable :items="biometrics" :key="keytable"></BiometricsTable>
        <!-- DIALOG PERSONCRUD -->
        <v-dialog v-model="dialog_biometrics_crud" width="45%">
            <v-card class="pa-4">
                <BiometricsCRUD :biometric="biometric" :deleting="biometric_deleting" :key="key+1000" @cruded="on_BiometricsCRUD_cruded()"></BiometricsCRUD>
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
    import BiometricsTable from './BiometricsTable.vue'
    export default {
        components: {
            MyMenuInline,
            DisplayValues,
            BiometricsCRUD,
            BiometricsTable
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
                key:0,
                key_table:0,
                biometric_last:null,

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
                axios.get(`${this.$store.state.apiroot}/api/biometrics/`, this.myheaders())
                .then((response) => {
                    this.biometrics=response.data
                    if (this.biometrics.length>0) this.biometric_last=this.biometrics[this.biometrics.length - 1]
               }, (error) => {
                    this.parseResponseError(error)
                });

            }

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
