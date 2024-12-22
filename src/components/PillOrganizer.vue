<template>
    <div class="ma-4">
        <h1>{{ $t(`Pill organizer`) }}
            <MyMenuInline :items="menuinline_items()"></MyMenuInline>
        </h1>

        <v-select
        v-model="type"
        :items="types"
        class="ma-2"
        label="View Mode"
        variant="outlined"
        dense
        hide-details
      ></v-select>
        <v-calendar
        v-model="calendar"
        :events="events"
        :view-mode="type"></v-calendar>


        <!-- DIALOG COMPANIES CRUD -->
        <v-dialog v-model="dialog_pill_events_crud" width="45%">
            <v-card class="pa-4">
                <PotsCRUD :pot="pot" :mode="pot_mode" :key="'B'+key" @cruded="on_PotsCRUD_cruded()"></PotsCRUD>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    import {my_round} from 'vuetify_rules'
    import { empty_pill_event } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import PotsCRUD from './PotsCRUD.vue'
    import { useStore } from '@/store.js'
    export default {
        components: {
            MyMenuInline,
            PotsCRUD,
        },
        data(){
            return {
                pill_events:[],
                key:0,
                search:"",
                type: 'month',
                types: ['month', 'week', 'day'],
                calendar:null,

                //CRUD COMPANY
                pot:null,
                pot_mode:null,
                dialog_pill_events_crud:false,
            }
        },        
        methods:{
            empty_pill_event,
            my_round,
        useStore,
            menuinline_items(){
                return [
                    {
                        subheader: this.$t("Pill events options"),
                        children: [
                            {
                                name: this.$t("Add a pill event every days"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.pot_mode="C"
                                    this.pot=this.empty_pill_event()
                                    this.key=this.key+1
                                    this.dialog_pill_events_crud=true
                                }.bind(this),
                            },
                        ]
                    },
                ]
            },
            on_PotsCRUD_cruded(){
                this.dialog_pill_events_crud=false
                this.update_pill_events()
            },
            editPot(item){
                this.pot=item
                this.pot_mode="U"
                this.key=this.key+1

                this.dialog_pill_events_crud=true
            },
            deletePot(item){
                this.pot=item
                this.pot_mode="D"
                this.key=this.key+1

                this.dialog_pill_events_crud=true
            },
            update_pill_events(){          
                axios.get(`${this.useStore().apiroot}/api/pill_events/`, this.myheaders())
                .then((response) => {
                    this.pill_events=response.data
                }, (error) => {
                    this.parseResponseError(error)
                });
            },    
        },
        created(){
            this.update_pill_events()
        }
    }
</script>