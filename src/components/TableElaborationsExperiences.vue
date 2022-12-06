<template>
    <div>
        <v-data-table dense :headers="table_headers" :items="elaboration.elaborations_experiences" class="elevation-1" disable-pagination  hide-default-footer sort-by="date" fixed-header :height="$attrs.height" ref="table_elaborations_experiences">
            <template v-slot:[`item.datetime`]="{ item }">{{localtime(item.datetime)}}</template>      
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>   
        <!-- ItemCRUD DIALOG -->
        <v-dialog v-model="dialog" width="60%" >
            <v-card class="pa-3">
                <ElaborationsExperiencesCRUD :experience="item" :mode="mode" :key="key"  @cruded="on_ElaborationsExperiencesCRUD_cruded()"></ElaborationsExperiencesCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import {empty_elaborations_experiences} from '../empty_objects.js'
    import ElaborationsExperiencesCRUD from './ElaborationsExperiencesCRUD.vue'
    export default {
        components:{
            ElaborationsExperiencesCRUD
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

                table_headers: [
                    { text: this.$t('Date and time'), value: 'datetime', sortable: true,width:"10%"},
                    { text: this.$t('Experience'), value: 'experience', sortable: true},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width: "7%"},
                ],
                items:[],
                key: 0,

                item:null,
            }
        },
        methods: {
            empty_elaborations_experiences,
            addItem(){
                this.item=this.empty_elaborations_experiences()
                this.item.elaborations=this.elaboration.url
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
                this.$vuetify.goTo(10000, { container:  this.$refs.table_elaborations_experiences.$el.childNodes[0] }) 
            },
            on_ElaborationsExperiencesCRUD_cruded(){
                this.key=this.key+1
                this.dialog=false
                this.$emit("cruded")
            },
        },
    }
</script>