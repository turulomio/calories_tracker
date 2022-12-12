<template>
    <div>    
        <h1>{{ $t("Calculate final amount from full pot") }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :items="$store.state.pots" v-model="pot" item-text="name" item-value="url" :label="$t('Select a pot')" return-object></v-autocomplete>
                <v-text-field v-model.number="weight_with_pot" :label="$t('Weight of the full pot')" :placeholder="$t('Weight of the full pot')" :rules="RulesFloatGZ(10,true,2)" counter="10"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Accept") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    export default {
        data(){ 
            return{
                form_valid:false,
                pot:null,
                weight_with_pot:0,
            }
        },
        methods: {
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return
                console.log(this.pot)
                this.$emit("calculated", this.weight_with_pot-this.pot.weight)
            },
        },
    }
</script>

