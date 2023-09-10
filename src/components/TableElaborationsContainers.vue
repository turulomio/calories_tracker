<template>
    <div>
        <v-data-table density="compact" :headers="table_headers()" :items="elaboration.elaborations_containers" class="elevation-1" :items-per-page="10000" :sort-by="[{key:'date',order:'asc'}]" fixed-header height="50vh" ref="table_elaborations_containers">
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editItem(item.raw)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item.raw)">mdi-delete</v-icon>
            </template>
            <template #bottom></template>
        </v-data-table>   
        <!-- ItemCRUD DIALOG -->
        <v-dialog v-model="dialog" width="100%" persistent>
            <v-card class="pa-3">
                <ElaborationsContainersCRUD :container="item" :mode="mode" apiname="elaborations_containers" :key="key"  @cruded="on_ElaborationsContainersCRUD_cruded()"></ElaborationsContainersCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import {empty_elaborations_containers} from '../empty_objects.js'
    import ElaborationsContainersCRUD from './ElaborationsContainersCRUD.vue'
    export default {
        components:{
            ElaborationsContainersCRUD
        },
        props: {
            elaboration: { //Global recipe seriealizer
                required: true
            },
        },
        data: function(){
            return {
                dialog:false,
                mode:null,

                items:[],
                key: 0,

                item:null,
            }
        },
        methods: {
            empty_elaborations_containers,
            
            table_headers(){
                var r= [
                    { title: this.$t('Name'), key: 'name', sortable: true},
                ]
                if (this.elaboration.automatic==false){
                    r.push({ title: this.$t('Actions'), key: 'actions', sortable: false, width: "10%"})
                }
                return r
            },
            on_new_click(){
                this.item=this.empty_elaborations_containers()
                this.item.elaborations=this.elaboration.url
                console.log(this.item)
                this.mode="C"
                this.key=this.key+1
                this.dialog=true
            },
            editItem(item){
                this.item=item
                this.mode="U"
                this.key=this.key+1
                this.dialog=true
            },
            deleteItem(item){
                this.item=item
                this.mode="D"
                this.key=this.key+1
                this.dialog=true
            },
            gotoLastRow(){
                this.$vuetify.goTo(10000, { container:  this.$refs.table_elaborations_containers.$el.childNodes[0] }) 
            },
            on_ElaborationsContainersCRUD_cruded(){
                this.key=this.key+1
                this.dialog=false
                this.$emit("cruded")
            },
        },
    }
</script>