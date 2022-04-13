<template>
    <div class="paragraph">
        <h1>{{ $t(`Biometrics`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <DisplayValues :items="displayvalues()" :key="key" :minimized_items="6"></DisplayValues>
    </div>
</template>

<script>
    import axios from 'axios'
    import DisplayValues from './DisplayValues.vue'
    import MyMenuInline from './MyMenuInline.vue'
    export default {
        components: {
            MyMenuInline,
            DisplayValues,
        },
        data(){
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Biometrics options"),
                        children: [
                            {
                                name: this.$t("Add biometrics"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.person_deleting=false
                                    this_.key_person_crud=this_.key_person_crud+1
                                    this_.dialog_person_crud=true
                                },
                            },
                        ]
                    },
                ],
                biometrics:[],
                key:0,
            }
        },
        methods:{
            displayvalues(){
                var r=[]
                if (this.biometrics.length>0){
                    let last=this.biometrics[this.biometrics.length - 1]
                    r.push({title:this.$t('Date and time'), value: this.localtime(last.datetime)})
                    r.push({title:this.$t('Weight'), value: last.weight})
                    r.push({title:this.$t('Height'), value: last.height})
                    r.push({title:this.$t('Weight wish'), value: this.$store.getters.getObjectPropertyByUrl("weight_wishes",last.weight_wishes,"localname")})
                    r.push({title:this.$t('Activity'), value: this.$store.getters.getObjectPropertyByUrl("activities",last.activities,"localname")})

                }
                return r
            },
            update_biometrics(){
                axios.get(`${this.$store.state.apiroot}/api/biometrics/`, this.myheaders())
                .then((response) => {
                    this.biometrics=response.data
                    console.log(this.biometrics)
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
