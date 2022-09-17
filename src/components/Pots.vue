<template>
    <div class="ma-4">
        <h1>{{ $t(`Pots`) }}
            <MyMenuInline :items="menuinline_items()" :context="this"></MyMenuInline>
        </h1>
        <v-text-field class="ml-10 mr-10 mb-5" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')"  v-on:keyup.enter="on_search_change()"></v-text-field>
  
        <v-data-table dense :headers="pots_headers" :items="pots" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">   
          <template v-slot:[`item.name`]="{ item }"><v-icon small class="mr-2">mdi-pot</v-icon>{{ item.name }}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editPot(item)">mdi-pencil</v-icon>
                <v-icon small @click="deletePot(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>


        <!-- DIALOG COMPANIES CRUD -->
        <v-dialog v-model="dialog_pots_crud" width="45%">
            <v-card class="pa-4">
                <PotsCRUD :pot="pot" :mode="pot_mode" :key="'B'+key" @cruded="on_PotsCRUD_cruded()"></PotsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { empty_pots } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import PotsCRUD from './PotsCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            PotsCRUD,
        },
        data(){
            return {
                pots:[],
                pots_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Diameter (cm)'), value: 'diameter', align:'right', width:"12%"},
                    { text: this.$t('Weight (g)'), value: 'weight', align:'right', width:"12%"},
                    { text: this.$t('Actions'), value: 'actions', align: 'right', sortable: false, width:"12%"},
                ],
                loading:false,
                key:0,
                search:"",

                //CRUD COMPANY
                pot:null,
                pot_mode:null,
                dialog_pots_crud:false,
            }
        },        
        methods:{
            empty_pots,
            menuinline_items(){
                return [
                    {
                        subheader: this.$t("Pot options"),
                        children: [
                            {
                                name: this.$t("Add a pot"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.pot_mode="C"
                                    this_.pot=this_.empty_pots()
                                    this_.key=this_.key+1
                                    this_.dialog_pots_crud=true
                                },
                            },
                        ]
                    },
                ]
            },
            on_PotsCRUD_cruded(){
                this.dialog_pots_crud=false
                this.update_pots()
            },
            editPot(item){
                this.pot=item
                this.pot_mode="U"
                this.key=this.key+1

                this.dialog_pots_crud=true
            },
            deletePot(item){
                this.pot=item
                this.pot_mode="D"
                this.key=this.key+1

                this.dialog_pots_crud=true
            },
            on_search_change(){
                //Pressing enter
                this.update_pots() 
            },
            update_pots(){
                this.loading=true
                    return this.$store.dispatch("getPots")
                    .then(() => {             
                        this.pots=this.$store.state.pots.filter(o=> o.name.toLowerCase().includes(this.search.toLowerCase()))
                        this.key=this.key+1
                        this.loading=false
                    })
            },
        },
        created(){
            this.update_pots()
        }
    }
</script>