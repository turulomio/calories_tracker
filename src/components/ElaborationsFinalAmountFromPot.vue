<template>
    <div>    
        <h1>{{ $t("Calculate final amount from full pot") }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :items="$store.state.pots" v-model="pot" item-text="name" item-value="url" :label="$t('Select a pot')" return-object :rules="RulesSelection(true)">
                    <template v-slot:item="{item}" ><div v-html="pots_html(item)"></div></template>
                </v-autocomplete>
                <v-text-field v-model.number="weight_with_pot" :label="$t('Weight of the full pot')" :placeholder="$t('Weight of the full pot')" :rules="RulesFloatGZ(10,true,2)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Accept") }}</v-btn>
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
            }
        },
        methods: {
            pots_html(item){
                var r=`<img src="${item.thumbnail}" height="150" contain />${item.fullname}`
                return r
            },
            acceptDialog(){
                if( this.$refs.form.validate()==false) return
                this.new_elaboration.final_amount=this.weight_with_pot-this.pot.weight
                axios.put(this.new_elaboration.url, this.new_elaboration,  this.myheaders())
                .then(() => {
                    this.$emit("cruded")
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
        }
    }
</script>

