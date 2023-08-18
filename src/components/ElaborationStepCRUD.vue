<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(store().steps)" v-model="new_elaborations_step.steps" item-title="localname" item-value="url" :label="$t('Select a step')" :rules="RulesSelection(true)"></v-autocomplete>
                <v-text-field :readonly="mode=='D'" v-model="new_elaborations_step.duration" :label="$t('Set step duration')" :placeholder="$t('Set step duration')" :rules="RulesString(10,true)" counter="10"/>
                <WidgetTemperatures v-if="step.can_temperatures" :readonly="mode=='D'" v-model="widget_temperatures"/>
                <WidgetStir v-if="step.can_stir" :readonly="mode=='D'" v-model="widget_stir"/>
                <v-autocomplete v-if="step.can_products_in_step" :items="elaboration.elaborations_products_in" v-model="new_elaborations_step.products_in_step" :label="$t('Products in step')" item-title="fullname" item-value="url" multiple :rules="RulesSelection(step.man_products_in_step)" chips ></v-autocomplete>
                <v-autocomplete  v-if="step.can_container" :readonly="mode=='D'" :items="elaboration.elaborations_containers" v-model="new_elaborations_step.container" item-title="name" item-value="url" :label="$t('Select a container')" :rules="RulesSelection(step.man_container)"></v-autocomplete>
                <v-autocomplete  v-if="step.can_container_to" :readonly="mode=='D'" :items="elaboration.elaborations_containers" v-model="new_elaborations_step.container_to" item-title="name" item-value="url" :label="$t('Select a container where to pour')" :rules="RulesSelection(step.man_container_to)"></v-autocomplete>
                <v-textarea :readonly="mode=='D'" v-model="new_elaborations_step.comment" :label="$t('Set a comment')" :placeholder="$t('Set a comment')" :rules="RulesString(200,false)" counter="200"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import WidgetTemperatures from './WidgetTemperatures.vue'
    import WidgetStir from './WidgetStir.vue'
    export default {
        components: {
            WidgetTemperatures,
            WidgetStir,
        },
        props: {
            elaboration: {
                required: true,
            },
            elaborations_step: { 
                required: true
            },
            mode: { // C D U
                required: true,
            }
        },
        data(){ 
            return{
                form_valid:false,
                new_elaborations_step: null,
                widget_temperatures:null,
                widget_stir:null,
            }
        },        
        computed:{
            step: function(){
                return this.store().steps.get(this.new_elaborations_step.steps)
            }
        },
        methods: {
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
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }
                this.new_elaborations_step.temperatures_types=this.widget_temperatures.temperatures_types
                this.new_elaborations_step.temperatures_values=this.widget_temperatures.temperatures_values
                this.new_elaborations_step.stir_types=this.widget_stir.stir_types
                this.new_elaborations_step.stir_values=this.widget_stir.stir_values
                this.$emit("cruded",this.mode,this.new_elaborations_step,this.elaborations_step)
            },
        },
        created(){
            this.new_elaborations_step=Object.assign({},this.elaborations_step)
            if (this.new_elaborations_step.steps == null){
                this.new_elaborations_step.steps=this.store().getters.getObjectPropertyById("steps",6,"url")
            }
            console.log(this.new_elaborations_steps)
            this.widget_temperatures={
                temperatures_types:this.new_elaborations_step.temperatures_types,
                temperatures_values:this.new_elaborations_step.temperatures_values
            }
            this.widget_stir={
                stir_types:this.new_elaborations_step.stir_types,
                stir_values:this.new_elaborations_step.stir_values
            }
        }
    }
</script>

