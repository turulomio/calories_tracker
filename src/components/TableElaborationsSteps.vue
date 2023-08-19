<template>
    <div>    
        <v-data-table  density="compact" :headers="steps_headers()" :items="new_elaborations_steps" class="elevation-1" :items-per-page="10000" :key="'T'+key" height="50vh" fixed-header>
            <template #item.steps="{item}"><div v-html="store().steps.get(item.raw.steps).localname"></div></template> 
            <template #item.products_in_step="{item}"><div v-html="show_products_in_step(item.raw)"></div></template> 
            <template #item.temperature="{item}"><div v-html="show_temperature(item.raw)"></div></template> 
            <template #item.stir="{item}"><div v-html="show_stir(item.raw)"></div></template> 
            <template #item.container="{item}"><div v-html="show_container_name(item.raw.container)"></div></template> 
            <template #item.container_to="{item}">{{ show_container_name(item.raw.container_to) }}</template> 
            <template #item.actions="{item}">                     
                <v-icon :disabled="(item.index==0 || can_crud==false)" small class="mr-2" @click="setOneUp(item.raw)">mdi-arrow-up-bold</v-icon>
                <v-icon :disabled="(item.index==new_elaborations_steps.length-1 || can_crud==false)" small class="mr-2" @click="setOneDown(item.raw)">mdi-arrow-down-bold</v-icon>
                <v-icon small :disabled="can_crud==false" class="mr-2" @click="editElaborationStep(item.raw)">mdi-pencil</v-icon>
                <v-icon small :disabled="can_crud==false" @click="deleteElaborationStep(item.raw)">mdi-delete</v-icon>
            </template>
            
            <template #bottom ></template>  

        </v-data-table>  
        <p class="my-2 bold d-flex justify-center">{{ $t("Elaboration time: [0]").format(elaboration.final_duration)}}</p>
        <p v-if="unused_ingredients()" class="my-2 boldred d-flex justify-center">{{ $t("Products unused : [0]").format(unused_ingredients())}}</p>
        <!-- STEPCRUD DIALOG -->
        <v-dialog v-model="dialog_elaborations_step_crud" width="100%">
            <v-card class="pa-3">
                <ElaborationStepCRUD :elaborations_step="elaborations_step" :elaboration="elaboration" :mode="elaborations_step_mode" :key="key"  @cruded="on_ElaborationsStep_cruded"></ElaborationStepCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
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

                key:0,
                // Elaboration step
                new_elaborations_steps:[],
                elaborations_step:null,
                elaborations_step_mode:null,
                dialog_elaborations_step_crud:false,

                can_crud: true,

            }
        },
        methods: {
            empty_elaborations_steps,

            steps_headers(){
                var r= [
                    { title: this.$t('Order'), sortable: false, key: 'order'},
                    { title: this.$t('Id'), sortable: false, key: 'id'},
                    { title: this.$t('Step'), sortable: false, key: 'steps'},
                    { title: this.$t('Duration'), sortable: false, key: 'duration', align:'right'},
                    { title: this.$t('Temperature'), key: 'temperature', sortable: false, width:"8%"},
                    { title: this.$t('Stir'), key: 'stir', sortable: false, width:"8%"},
                    { title: this.$t('Products in step'), sortable: false, key: 'products_in_step'},
                    { title: this.$t('Container'), sortable: false, key: 'container'},
                    { title: this.$t('Container to'), sortable: false, key: 'container_to'},
                    { title: this.$t('Comment'), sortable: false, key: 'comment', width:"15%"},
                ]
                if (this.elaboration.automatic==false){
                    r.push({ title: this.$t('Actions'), key: 'actions', sortable: false, width:"8%"})
                }
                return r
            },
            addElaborationStep(){
                if (this.can_crud==false){
                    alert("I can add a step yet")
                    return
                }
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
            async on_ElaborationsStep_cruded(mode,item,olditem){
                this.can_crud=false
                if (mode=="C"){
                    console.log("Adding item")
                    this.new_elaborations_steps.push(item)
                } else if (mode=="U"){
                    let index = this.new_elaborations_steps.indexOf(olditem)
                     console.log(`Updating item with index ${index}`)
                    if (index>-1){
                        this.new_elaborations_steps[index]=item
                    } else {
                        alert("Updating item wasn't found")
                        return
                    }
                    
                } else if (mode=="D"){
                    let index = this.new_elaborations_steps.indexOf(olditem)
                     console.log(`Deleting item with index ${index}`)
                    if (index>-1){
                        this.new_elaborations_steps.splice(index,1)
                    } else {
                        alert("Deleting item wasn't found")
                        return
                    }
                }
                this.dialog_elaborations_step_crud=false 
                this.update_steps()                

            },
            async setOneUp(item){

                this.can_crud=false
                let index = this.new_elaborations_steps.indexOf(item)
                console.log(`Pressing up on item with index ${index}`)
                this.new_elaborations_steps[index]=this.new_elaborations_steps[index-1]
                this.new_elaborations_steps[index-1]=item
                this.update_steps()

            },
            async setOneDown(item){
                this.can_crud=false
                let index = this.new_elaborations_steps.indexOf(item)
                console.log(`Pressing down on item with index ${index}`)
                this.new_elaborations_steps[index]=this.new_elaborations_steps[index+1]
                this.new_elaborations_steps[index+1]=item
                this.update_steps()


            },
            show_products_in_step(item){
                var r=""
                item.products_in_step.forEach(o=>{

                    this.elaboration.elaborations_products_in.forEach(p=> {
                        if (p.url==o){
                            r=r+ p.fullname+", "
                        }

                    })
                })
                return r.slice(0,-2)
            },
            unused_ingredients(){
                var r=""
                //Load all ingredientes urls in elaboration
                var unused_urls=[]
                this.elaboration.elaborations_products_in.forEach(element => {
                    unused_urls.push(element.url)  
                })

                this.new_elaborations_steps.forEach(s=>{

                    s.products_in_step.forEach(ps=> {
                        let index = unused_urls.indexOf(ps)
                        if (index>=0) {
                            unused_urls.splice(index,1)
                        }

                    })
                })
                unused_urls.forEach(o=>{
                    this.elaboration.elaborations_products_in.forEach(p=> {
                        if (p.url==o){
                            r=r+ p.fullname+", "
                        }

                    })
                })
                return r.slice(0,-2)
            },
            show_temperature(item){
                if (item.temperatures_types ==null) return ""
                let tt=this.id_from_hyperlinked_url(item.temperatures_types)

                if(tt==1){//ºC
                    return this.$t("[0]ºC").format(item.temperatures_values)
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
                    return this.$t("Robot velocity: [0]").format(item.stir_values)
                } else if (st==3){//Stir each minutoes
                    return this.$t("Every [0] minutes").format(item.stir_values)
                } else {
                    return this.store().stir_types.get( item.stir_types).localname
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
            update_steps(){ 
                // Hago esta función que creo que los errores de desorden se generan con peticiones recurrentes sin haber finalizado la anterior
                // AL final se arreglo devolviendo la lista y ordenando desde backend. Me volví loco.
                // Creo que si no viene ordenado el sort lo oculta, pero luego se machaca. Hay que ordenar de backend
                // HE QUITADO EL SORTED TAMBIEN PORQUE ME CAMBIABA DESDE CREATED

                // PARECE QUE AL FINAL ES EL SERIALIZER DE FULLRECIPE NO ORDENA BIEN TUVE QUE PONER UN METODO TO_REPRESENTATION EN ELABORATIONSERIALIZER

                var r=[]
                for (var i = 0; i < this.new_elaborations_steps.length; i++) {
                    this.new_elaborations_steps[i].order=i+1
                    r.push(this.new_elaborations_steps[i].id)
                }
                // this.log_ids(this.new_elaborations_steps,"antes")
                // this.log_order(this.new_elaborations_steps,"order antes")
                
                axios.post(`${this.elaboration.url}update_steps/`, {"steps":this.new_elaborations_steps}, this.myheaders())
                .then((response) => {

                    // this.log_ids(response.data.data,"db")
                    // this.log_order(response.data.data,"dborder")


                    this.new_elaborations_steps=response.data.data
                    // this.log_ids(this.new_elaborations_steps,"new_ela_ste")
                    this.$emit("cruded",this.new_elaborations_steps)
                    this.can_crud=true
                    this.key=this.key+1
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            log_ids(arr,title){
                    var r=[]
                    for (var i = 0; i < arr.length; i++) {
                        r.push(arr[i].id)
                    }
                    console.log(`${title}: ${r}`)

            },
            log_order(arr,title){
                    var r=[]
                    for (var i = 0; i < arr.length; i++) {
                        r.push(arr[i].order)
                    }
                    console.log(`${title}: ${r}`)

            }
        },
        created(){
            this.new_elaborations_steps=Object.assign([],this.elaboration.elaborations_steps) //IS [] an array not a {}
            // this.log_ids(this.new_elaborations_steps,"created")
            // this.log_order(this.new_elaborations_steps,"ordercreated")
        }
    }
</script>

