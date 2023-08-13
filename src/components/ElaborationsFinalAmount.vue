<template>
    <div>    
        <h1>{{ $t("Calculate final amount from full pot") }}</h1>    
        
        
        <v-tabs  background-color="primary" dark v-model="tab" >
            <v-tab key="frompot">{{ $t('From full container') }}</v-tab>
            <v-tab key="fromingredients">{{ $t('Ingredients sum') }}</v-tab>
            <v-tab key="fromyourweight">{{ $t('Your weight') }}</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="ma-5">
            <v-window-item key="frompot" >
                <v-card>
                    <v-form ref="form" v-model="form_valid" lazy-validation>
                        <v-autocomplete :items="store().pots" v-model="pot" item-text="name" item-value="url" :label="$t('Select a pot')" return-object :rules="RulesSelection(true)">
                            <template v-slot:item="{item}" ><div v-html="pots_html(item)"></div></template>
                        </v-autocomplete>
                        <v-text-field v-model.number="weight_with_pot" :label="$t('Weight of the full pot')" :placeholder="$t('Weight of the full pot')" :rules="RulesFloatGZ(10,true,2)" counter="10"/>
                    </v-form>
                </v-card>
            </v-window-item>
            <v-window-item key="ingredients_sum" >
                <v-card>
                    <v-text-field v-model.number="final_amount" readonly :label="$t('Sum of ingredients')"  counter="10"/>
                </v-card>
            </v-window-item>
            <v-window-item key="fromyourweight" >
                <v-card>
                    <v-text-field v-model.number="your_weight" :label="$t('Your weight')" :placeholder="$t('Your weight')" :rules="RulesFloatGZ(10,true,2)" counter="10"/>
                </v-card>
            </v-window-item>
        </v-window> 

        <v-card class="pa-8 mt-2" flat>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()">{{ $t("Set final amount to {0}g").format(final_amount) }}</v-btn>
                <v-btn color="primary" @click="setNull()">{{ $t("Unset final amount") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from "axios"
    export default {
        props: {
            elaboration: { 
                required: true
            },
        },
        data(){ 
            return{
                form_valid:false,
                pot:null,
                weight_with_pot:0,
                your_weight:0,
                tab:2,
            }
        },
        computed: {
            final_amount(){
                if (this.tab==0 && this.pot){ //From full pot
                    return this.weight_with_pot-this.pot.weight
                } else if (this.tab==1){ //Ingredients sum
                    return this.my_round(this.listobjects_sum(this.new_elaboration.elaborations_products_in,'final_grams'),0)
                } else if (this.tab==2){ //Your weight
                    return this.your_weight
                }
                return 0
            }
        },
        methods: {
            pots_html(item){
                var r=`<img src="${item.thumbnail}" height="150" contain />${item.fullname}`
                return r
            },
            acceptDialog(){
                // if( this.$refs.form.validate()==false) return
                this.new_elaboration.final_amount=this.final_amount

                axios.put(this.new_elaboration.url, this.new_elaboration,  this.myheaders())
                .then(() => {
                    this.$emit("cruded")
                    console.log("CRUDED")
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            setNull(){
                console.log(this.pot)
                this.new_elaboration.final_amount=null
                axios.put(this.new_elaboration.url, this.new_elaboration,  this.myheaders())
                .then(() => {
                    this.$emit("cruded")
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        created(){
            this.new_elaboration=Object.assign({},this.elaboration)
            console.log(this.new_elaboration)
            this.your_weight=this.new_elaboration.final_amount
        }
    }
</script>

