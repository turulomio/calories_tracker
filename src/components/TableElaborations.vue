<template>
    <div>
        <v-data-table density="compact" :headers="table_headers" :items="recipe.elaborations" class="elevation-1" :items-per-page="10000"  :sort-by="[{key:'diners',order:'asc'}]"  fixed-header :height="$attrs.height" ref="table_elaborations" @click:row="viewItem" style="cursor: pointer">
            <template #item.automatic="{item}"><v-icon small v-if="item.automatic" >mdi-check-outline</v-icon></template>

            <template #item.actions="{item}">
                <v-icon small v-if="!item.automatic" class="mr-2" @click.stop="editItem(item)">mdi-pencil</v-icon>     
                <v-icon v-if="!item.automatic" small class="mr-2" @click.stop="createAutomaticElaboration(item)">mdi-file-cog-outline</v-icon>
                <v-icon small class="mr-2" :color="(item.automatic) ? 'black': 'red'" @click.stop="deleteItem(item)">mdi-delete</v-icon> 
                
            </template>
            <template #bottom></template>
        </v-data-table>   
        <!-- ItemCRUD DIALOG -->
        <v-dialog v-model="elaboration_crud_dialog" width="50%">
            <v-card class="pa-3">
                <ElaborationCRUD :elaboration="elaboration" :mode="elaboration_crud_mode" :key="key"  @cruded="on_ElaborationsCRUD_cruded()"></ElaborationCRUD>
            </v-card>
        </v-dialog> 
        <!-- Item VIEW DIALOG -->
        <v-dialog v-model="elaboration_view_dialog" width="100%" persistent >
            <v-card class="pa-3">
                <ElaborationView :elaboration="elaboration" :key="key"  @clickoutside="on_ElaborationsView_clickoutside"></ElaborationView>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
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
                    { title: this.$t('Diners'), key: 'diners', sortable: true, width:"7%"},
                    { title: this.$t('Automatic'), key: 'automatic', sortable: false, width:"10%"},
                    { title: this.$t('Automatic adaptation text'), key: 'automatic_adaptation_step', sortable: false},
                    { title: this.$t('Actions'), key: 'actions', sortable: false, width: "10%"},
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
            viewItem(event,object){
                this.elaboration=object.item
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
            async on_ElaborationsView_clickoutside(){
                this.elaboration_crud_dialog=false
                await this.$emit("cruded")
            },
            createAutomaticElaboration(item){
                var diners=prompt(
                    this.$t("Automatic elaborations are generated with the information added in the parent elaboration. You can create and delete them as many times you wish without losing information.")+ "\n\n"+    
                    this.$t("You can add your experiences in the parent elaboration. ") +"\n\n" +
                    this.$t("If you need to add a comment for automatic elaborations you can write them in the main elaboration") +"\n\n"+
                   this.$t("You are going to generate an automatic elaboration. How many diners do you want?"), item.diners*2)

                if (diners){
                    axios.post(`${item.url}create_automatic_elaboration/`, {diners: diners, automatic_adaptation_step: item.automatic_adaptation_step},  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
    }
</script>