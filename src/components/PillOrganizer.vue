<template>
    <div class="ma-4">
        <h1>{{ $t(`Pill organizer`) }}
            <MyMenuInline :items="menuinline_items()"></MyMenuInline>
        </h1>

        <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense hide-details />
        <v-calendar v-model="calendar" :events="data" :view-mode="type" :weekdays="weekday" @click="on_calendar_click" />

        <!-- DIALOG COMPANIES CRUD -->
        <v-dialog v-model="dialog_pill_events_crud" width="45%">
            <v-card class="pa-4">
                <PillEventsCRUD :pill_event="pill_event" :mode="pill_event_mode" :key="'B'+key" @cruded="on_PillEventsCRUD_cruded()"></PillEventsCRUD>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    import {my_round} from 'vuetify_rules'
    import { empty_pill_event_each_day } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import PillEventsCRUD from './PillEventsCRUD.vue'
    import { useStore } from '@/store.js'
    export default {
        components: {
            MyMenuInline,
            PillEventsCRUD,
        },
        data(){
            return {
                pill_events:[],
                data:[],
                key:0,
                search:"",
                type: 'month',
                types: ['month', 'week', 'day'],
                calendar: [new Date()],
                weekday:[0, 1, 2, 3, 4, 5, 6],

                //CRUD COMPANY
                pill_event:null,
                pill_event_mode_mode:null,
                dialog_pill_events_crud:false,
            }
        },        
        methods:{
            empty_pill_event_each_day,
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
                                    this.pill_event_mode="EACH_DAY"
                                    this.pill_event=this.empty_pill_event_each_day()
                                    this.key=this.key+1
                                    this.dialog_pill_events_crud=true
                                }.bind(this),
                            },
                        ]
                    },
                ]
            },
            on_calendar_click(event, ho){
                console.log(event)
                console.log(ho)
            },
            on_PillEventsCRUD_cruded(){
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
                    this.data=[]
                    this.pill_events.forEach(o=>{
                        this.data.push(this.pill_event_to_data(o))
                    })
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            pill_event_to_data(pill_event){
                let start=new Date(pill_event.dt)
                let color="grey" //Red: missing //Green taken //Gray not yet
                if (pill_event.dt_intake!=null){
                    color="green"
                } else if (new Date()> start){
                    color="red"
                }
                return {
                    
                    title: pill_event.pillname,
                    start: start,
                    end: new Date(start.setTime(start.getTime() + (1 * 60 * 60 * 1000))), // Add 1 hour in milliseconds
                    color: color,
                    allDay: false,
                }

            },
        },
        created(){
            this.update_pill_events()
        }
    }
</script>