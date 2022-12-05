<template>
    <div>    
        <v-data-table dense :headers="steps_headers" :items="new_elaborations_steps" sort-by="order" class="elevation-1" hide-default-footer disable-pagination :key="'T'+key" :height="450" fixed-header>
            <template v-slot:[`item.steps`]="{ item }"><div v-html="$store.getters.getObjectPropertyByUrl('steps', item.steps,'localname')"></div></template> 
            <template v-slot:[`item.products_in_step`]="{ item }"><div v-html="show_products_in_step(item)"></div></template> 
            <template v-slot:[`item.temperature`]="{ item }"><div v-html="show_temperature(item)"></div></template> 
            <template v-slot:[`item.stir`]="{ item }"><div v-html="show_stir(item)"></div></template> 
            <template v-slot:[`item.container`]="{ item }"><div v-html="show_container_name(item.container)"></div></template> 
            <template v-slot:[`item.container_to`]="{ item }">{{ show_container_name(item.container_to) }}</template> 

            <template v-slot:[`item.actions`]="{ item,index }">                     
                <v-icon :disabled="index==0" small class="mr-2" @click="setOneUp(item)">mdi-arrow-up-bold</v-icon>
                <v-icon :disabled="index==new_elaborations_steps.length-1" small class="mr-2" @click="setOneDown(item)">mdi-arrow-down-bold</v-icon>
                <v-icon small class="mr-2" @click="editElaborationStep(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteElaborationStep(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>  
        <!-- STEPCRUD DIALOG -->
        <v-dialog v-model="dialog_elaborations_step_crud" width="100%">
            <v-card class="pa-3">
                <ElaborationStepCRUD :elaborations_step="elaborations_step" :elaboration="elaboration" :mode="elaborations_step_mode" :key="key"  @cruded="on_ElaborationsStep_cruded"></ElaborationStepCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
     import ElaborationStepCRUD from './ElaborationStepCRUD.vue'
    import {empty_elaborations_steps} from '../empty_objects.js'
    export default {
        components: {
            ElaborationStepCRUD,
        },
        props: {
            elaboration: { 
                required: true
            },
        },
        data(){ 
            return{
                form_valid:false,
                steps_headers: [
                    { text: this.$t('Order'), sortable: false, value: 'order'},
                    { text: this.$t('Step'), sortable: false, value: 'steps'},
                    { text: this.$t('Duration'), sortable: false, value: 'duration', align:'right'},
                    { text: this.$t('Temperature'), value: 'temperature', sortable: false, width:"8%"},
                    { text: this.$t('Stir'), value: 'stir', sortable: false, width:"8%"},
                    { text: this.$t('Products in step'), sortable: false, value: 'products_in_step'},
                    { text: this.$t('Container'), sortable: false, value: 'container'},
                    { text: this.$t('Container to'), sortable: false, value: 'container_to'},
                    { text: this.$t('Comment'), sortable: false, value: 'comment', width:"15%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],

                key:0,
                // Elaboration step
                new_elaborations_steps:[],
                elaborations_step:null,
                elaborations_step_mode:null,
                dialog_elaborations_step_crud:false,
            }
        },
        methods: {
            empty_elaborations_steps,
            addElaborationStep(){
                this.elaborations_step=this.empty_elaborations_steps()
                this.elaborations_step.elaborations=this.elaboration.url
                this.elaborations_step_mode='C'
                this.key=this.key+1
                this.dialog_elaborations_step_crud=true

            },
            editElaborationStep(item){
                this.elaborations_step=item
                this.elaborations_step_mode='U'
                this.key=this.key+1
                this.dialog_elaborations_step_crud=true

            },
            deleteElaborationStep(item){
                this.elaborations_step=item
                this.elaborations_step_mode='D'
                this.key=this.key+1
                this.dialog_elaborations_step_crud=true

            },
            on_ElaborationsStep_cruded(mode,item,olditem){
                console.log(item)
                if (mode=="C"){
                    this.new_elaborations_steps.push(item)
                } else if (mode=="U"){
                    let index = this.new_elaborations_steps.indexOf(olditem)
                    this.new_elaborations_steps[index]=item
                    
                } else if (mode=="D"){
                    let index = this.new_elaborations_steps.indexOf(olditem)
                    this.new_elaborations_steps.splice(index,1)
                }
                this.reorder_steps()
                this.key=this.key+1
                this.dialog_elaborations_step_crud=false 
                console.log("ANTES")
                console.log(typeof(this.new_elaborations_steps))
                console.log(this.new_elaborations_steps)
                this.$emit("cruded",this.new_elaborations_steps)
            },
            setOneUp(item){
                let index = this.new_elaborations_steps.indexOf(item)
                this.new_elaborations_steps[index]=this.new_elaborations_steps[index-1]
                this.new_elaborations_steps[index-1]=item
                this.reorder_steps()
                this.key=this.key+1
            },
            setOneDown(item){
                let index = this.new_elaborations_steps.indexOf(item)
                this.new_elaborations_steps[index]=this.new_elaborations_steps[index+1]
                this.new_elaborations_steps[index+1]=item
                this.reorder_steps()
                this.key=this.key+1

            },
            show_products_in_step(item){
                var r=""
                item.products_in_step.forEach(o=>{

                    this.elaboration.elaborations_products_in.forEach(p=> {
                        if (p.url==o){
                            r=r+this.$store.getters.getObjectPropertyByUrl('products', p.products,'fullname')+", "
                        }

                    })
                })
                return r.slice(0,-2)
            },
            show_temperature(item){
                if (item.temperatures_types ==null) return ""
                let tt=this.id_from_hyperlinked_url(item.temperatures_types)

                if(tt==1){//ºC
                    return this.$t("{0}ºC").format(item.temperatures_values)
                } else if (tt==2){//Low Medium High
                    if (item.temperatures_values==-1){
                        return this.$t("Low heat")
                    } else if (item.temperatures_values==-2){
                        return this.$t("Medium heat")
                    } else if (item.temperatures_values==-3){
                        return this.$t("High heat")
                    }
                }
            },
            show_stir(item){
                if (item.stir_types ==null) return ""
                let st=this.id_from_hyperlinked_url(item.stir_types)
                if(st==1){// Robot speed
                    return this.$t("Robot velocity: {0}").format(item.stir_values)
                } else if (st==3){//Stir each minutoes
                    return this.$t("Every {0} minutes").format(item.stir_values)
                } else {
                    return this.$store.getters.getObjectPropertyByUrl("stir_types", item.stir_types, "localname")
                }
            },

            show_container_name(item){
                var r=""
                this.elaboration.elaborations_containers.forEach(o => {
                    if (o.url==item) {
                        r=o.name
                    }
                });
                return r
            },
            reorder_steps(){
                for (var i = 0; i < this.new_elaborations_steps.length; i++) {
                    this.new_elaborations_steps[i].order=i+1
                }
            },

        },
        created(){
            // Guess crud mode
            this.new_elaborations_steps=Object.assign([],this.elaboration.elaborations_steps) //IS [] an array not a {}
            typeof(this.new_elaborations_steps)
        }
    }
</script>

