<template>
    <div>
        <v-data-table density="compact" :headers="table_headers()" :items="elaboration.elaborations_experiences" class="elevation-1" :items-per-page="10000"  :sort-by="[{key:'date',order:'asc'}]"  fixed-header height="50vh" ref="table_elaborations_experiences">
            <template #item.datetime="{item}">{{localtime(item.datetime)}}</template>      
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            <template #bottom></template>
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
    import {localtime} from 'vuetify_rules'
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

                items:[],
                key: 0,

                item:null,
            }
        },
        methods: {
            empty_elaborations_experiences,
            localtime,
            table_headers(){
                var r=[
                    { title: this.$t('Date and time'), key: 'datetime', sortable: true,width:"10%"},
                    { title: this.$t('Experience'), key: 'experience', sortable: true},
                ]
                if (this.elaboration.automatic==false){
                    r.push({ title: this.$t('Actions'), key: 'actions', sortable: false, width: "7%"})
                }
                return r
            },
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