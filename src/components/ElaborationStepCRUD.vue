<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="mode=='D'" :items="$store.state.steps" v-model="new_elaboration_step.steps" item-text="localname" item-value="url" :label="$t('Select a step')"></v-autocomplete>
                <v-text-field :readonly="mode=='D'" v-model="new_elaboration_step.duration" :label="$t('Set step duration')" :placeholder="$t('Set step duration')" :rules="RulesString(10,true)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model.number="new_elaboration_step.temperature" :label="$t('Set temperature')" :placeholder="$t('Set temperature')" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model.number="new_elaboration_step.stir" :label="$t('Set stir')" :placeholder="$t('Set stir')" :rules="RulesInteger(10,false)" counter="10"/>
                <v-text-field :readonly="mode=='D'" v-model="new_elaboration_step.comment" :label="$t('Set a comment')" :placeholder="$t('Set a comment')" :rules="RulesString(200,false)" counter="200"/>
                <v-autocomplete :items="elaboration.elaborations_products_in" v-model="new_elaboration_step.products_in_step" :label="$t('Products in step')" :item-text="get_item_products_step" item-value="url" multiple :rules="RulesSelection(true)" chips ></v-autocomplete>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    export default {
        components: {
        },
        props: {
            elaboration: {
                required: true,
            },
            elaboration_step: { 
                required: true
            },
            mode: { // C D U
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_elaboration_step: null,
            }
        },
        methods: {
            get_item_products_step(item){
                return `${this.$store.getters.getObjectPropertyByUrl('products', item.products,'fullname')} (${item.amount } g)`
            },
            button(){
                if (this.mode=="C") return this.$t('Add')
                if (this.mode=="U") return this.$t('Update')
                if (this.mode=="D") return this.$t('Delete')
            },
            title(){
                if (this.mode=="C") return this.$t('Add a new elaboration step')
                if (this.mode=="U") return this.$t('Update this elaboration step')
                if (this.mode=="D") return this.$t('Delete this elaboration step')
            },
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return
                this.$emit("cruded",this.mode,this.new_elaboration_step,this.elaboration_step)
            },
        },
        created(){
            this.new_elaboration_step=Object.assign({},this.elaboration_step)
        }
    }
</script>

