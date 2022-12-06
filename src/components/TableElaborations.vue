<template>
    <div>
        <v-data-table dense :headers="table_headers" :items="recipe.elaborations" class="elevation-1" disable-pagination  hide-default-footer sort-by="date" fixed-header :height="$attrs.height" ref="table_elaborations">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="viewItem(item)">mdi-eye</v-icon>
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- ItemCRUD DIALOG -->
        <v-dialog v-model="elaboration_crud_dialog" width="100%">
            <v-card class="pa-3">
                <ElaborationCRUD :elaboration="elaboration" :mode="elaboration_crud_mode" :key="key"  @cruded="on_ElaborationsCRUD_cruded()"></ElaborationCRUD>
            </v-card>
        </v-dialog> 
        <!-- Item VIEW DIALOG -->
        <v-dialog v-model="elaboration_view_dialog" width="100%">
            <v-card class="pa-3">
                <ElaborationView :elaboration="elaboration" :key="key"  @cruded="on_ElaborationsView_cruded()"></ElaborationView>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import {empty_elaborations} from '../empty_objects.js'
    import ElaborationCRUD from './ElaborationCRUD.vue'
    import ElaborationView from './ElaborationView.vue'
    export default {
        components:{
            ElaborationCRUD,
            ElaborationView,
        },
        props: {
            recipe: { //Global recipe seriealizer
                required: true
            },
        },
        data: function(){
            return {
                elaboration_crud_dialog:false,
                elaboration_crud_mode:null,
                elaboration_view_dialog:false,

                table_headers: [
                    { text: this.$t('Diners'), value: 'diners', sortable: true},
                    { text: this.$t('Final amount'), value: 'final_amount', sortable: false, width:"10%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width: "7%"},
                ],
                items:[],
                key: 0,

                elaboration:null,
            }
        },
        methods: {
            empty_elaborations,
            on_new_click(){
                this.elaboration=this.empty_elaborations()
                this.elaboration.recipes=this.recipe.url
                this.elaboration_crud_mode="C"
                this.key=this.key+1
                this.elaboration_crud_dialog=true
            },
            editItem(item){
                this.elaboration=item
                this.elaboration_crud_mode="U"
                this.key=this.key+1
                this.elaboration_crud_dialog=true
            },
            deleteItem(item){
                this.elaboration=item
                this.elaboration_crud_mode="D"
                this.key=this.key+1
                this.elaboration_crud_dialog=true
            },
            viewItem(item){
                this.elaboration=item
                this.key=this.key+1
                this.elaboration_view_dialog=true
            },
            gotoLastRow(){
                this.$vuetify.goTo(10000, { container:  this.$refs.table_elaborations.$el.childNodes[0] }) 
            },
            on_ElaborationsCRUD_cruded(){
                this.elaboration_crud_dialog=false
                this.key=this.key+1
                this.$emit("cruded")
            },
            on_ElaborationsView_cruded(){
                this.key=this.key+1
                this.$emit("cruded")
            },
        },
    }
</script>