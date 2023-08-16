<template>
    <div>
        <v-data-table density="compact" :headers="table_headers()" :items="elaboration.elaborations_containers" class="elevation-1" :items-per-page="10000"  sort-by="date" fixed-header height="50vh" ref="table_elaborations_containers">
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editItem(item.raw)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item.raw)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- ItemCRUD DIALOG -->
        <v-dialog v-model="dialog" width="100%" persistent>
            <v-card class="pa-3">
                <NameCrud :item="item" :mode="mode" apiname="elaborations_containers" :key="key"  @cruded="on_NameCrud_cruded()"></NameCrud>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import {empty_elaborations_containers} from '../empty_objects.js'
    import NameCrud from './NameCrud.vue'
    export default {
        components:{
            NameCrud
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
                    { text: this.$t('Name'), value: 'name', sortable: true},
                ]
                if (this.elaboration.automatic==false){
                    r.push({ text: this.$t('Actions'), value: 'actions', sortable: false, width: "10%"})
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
            on_NameCrud_cruded(){
                this.key=this.key+1
                this.dialog=false
                this.$emit("cruded")
            },
        },
    }
</script>