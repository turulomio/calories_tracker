<template>
    <div class="ma-4">
        <h1>{{ $t(`Pill organizer`) }}
            <MyMenuInline :items="menuinline_items()"></MyMenuInline>
        </h1>

        <!-- <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense hide-details /> -->
    

        <!-- <div  v-for="(item, index) in todays_items" :key="index" :style="{ color: event_color(item)}">
            <div :color="item.color"> {{ item }}
                <v-btn v-show="!item.is_taken" color="grey" @click="event_intake(item)" >{{ $t("Intake") }}</v-btn>
                <v-btn v-show="!item.is_taken" color="black" @click="event_delete(item)" >{{ $t("Delete") }}</v-btn>
            </div>
        </div> -->
        <!-- <v-calendar v-model="calendar" :first-day-of-week="1" :interval-duration="120" :events="data" :view-mode="type" :weekdays="weekday" @click="on_calendar_click" /> -->
        
        <div>
            <CalendarView class="theme-default " :startingDayOfWeek="1" displayPeriodUom="month"  monthNameFormat="long" weekday-name-format="long" :items="data" show-times 
				:time-format-options="{ hour: 'numeric', minute: '2-digit' }" :disable-future="false" @click-item="on_calendar_click">
                <template #header="{ headerProps }">
				<CalendarViewHeader
					:header-props
					@input="setShowDate"
				/>
			</template>
            </CalendarView>
        </div>

        <!-- CONTEXTUAL MENU -->
        <v-menu v-model="contextual_menu" :position-x="menuX" :position-y="menuY" absolute offset>
            <v-list>
                <v-list-item @click="event_intake" :title="$t('Intake')" prepend-icon="mdi-pill" />
                <v-list-item @click="event_update" :title="$t('Update')" prepend-icon="mdi-pencil" />
                <v-list-item @click="event_delete" :title="$t('Intake')" prepend-icon="mdi-delete" />
            </v-list>
        </v-menu>

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
    import {my_round, localtime} from 'vuetify_rules'
    import { empty_pill_event_each_day, empty_pill_event_each_n_hours, empty_pill_event } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import PillEventsCRUD from './PillEventsCRUD.vue'
    import { useStore } from '@/store.js'
	import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
    import "vue-simple-calendar/dist/vue-simple-calendar.css"
	import "vue-simple-calendar/dist/css/default.css"
	// import "vue-simple-calendar/dist/css/holidays-us.css"
 
    export default {
        components: {
            MyMenuInline,
            PillEventsCRUD,
            CalendarView,
            CalendarViewHeader

        },
        data(){
            return {
                pill_events:[],
                data:[],
                key:0,
                showDate: new Date() ,
                // search:"",
                // type: 'month',
                // types: ['month', 'week', 'day'],
                weekday:[0, 1, 2, 3, 4, 5, 6],

                //CRUD COMPANY
                pill_event:null,
                pill_event_mode_mode:null,
                dialog_pill_events_crud:false,

                // CONTEXTUAL MENU
                item_selected:null, // item selected when popup context menu
                contextual_menu:false,
                menuX:0,
                menuY:0,

            }
        },
        computed: {
            todays_items(){
                const today = new Date();
                const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

                return this.pill_events.filter(item => {
                    // Assuming your date property is named 'dt'

                    return new Date(item.dt) >= startOfToday && new Date(item.dt) < endOfToday;
                });
            }
        },
        methods:{
            empty_pill_event,
            empty_pill_event_each_day,
            empty_pill_event_each_n_hours,
            localtime,
            my_round,
            useStore,
			setShowDate(d) {
				this.showDate = d;
			},
            showContextMenu(item,event){
                this.menuX=event.clientX
                this.menuY=event.clientY
                this.item_selected=item
                this.contextual_menu=true
                console.log(this.menuX,this.menuY)
            },
            menuinline_items(){
                return [
                    {
                        subheader: this.$t("Pill events options"),
                        children: [
                            {
                                name: this.$t("Add a pill event"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.pill_event_mode="C"
                                    this.pill_event=this.empty_pill_event()
                                    this.key=this.key+1
                                    this.dialog_pill_events_crud=true
                                }.bind(this),
                            },
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
                            {
                                name: this.$t("Add a pill event every n hours"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.pill_event_mode="N_HOURS"
                                    this.pill_event=this.empty_pill_event_each_n_hours()
                                    this.key=this.key+1
                                    this.dialog_pill_events_crud=true
                                }.bind(this),
                            },
                        ]
                    },
                ]
            },

            event_color(item){
                if (item.is_taken) return "green"
                if (item.dt>new Date()) return "grey"
                return "red"
            },
            event_intake(){
                // item must be converted to pill_event
                this.pill_event=this.pill_events.find(element => element.url === this.item_selected.url);
                console.log(this.pill_event.url, this.item_selected.url)
                this.pill_event.dt_intake=new Date()

                axios.put(this.pill_event.url, this.pill_event,  this.myheaders())
                    .then(() => {
                        this.update_pill_events()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
            },
            event_update(){

                this.pill_event_mode="U"
                this.pill_event=this.pill_events.find(element => element.url === this.item_selected.url);
                this.key=this.key+1
                this.dialog_pill_events_crud=true
            },
            event_delete(){
                this.pill_event=this.pill_events.find(element => element.url === this.item_selected.url);
                console.log (this.pill_event,this.item_selected)
                axios.delete(this.pill_event.url, this.myheaders())
                    .then(() => {
                        this.update_pill_events()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
            },
            on_calendar_click(item, event){
                this.showContextMenu(item,event)
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
                axios.get(`${this.useStore().apiroot}/api/pill_events/?year=2025&month=4`, this.myheaders())
                .then((response) => {
                    this.pill_events=response.data
                    this.data=[]
                    this.pill_events.forEach(o=>{
                        this.data.push(this.pill_event_to_data(o))
                    })
                    console.log(this.data)
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
                    id: pill_event.url,
                    url: pill_event.url,
                    title: pill_event.pillname,
                    startDate: start,
                    endDate: new Date(start.setTime(start.getTime() + (1 * 60 * 60 * 1000))), // Add 1 hour in milliseconds
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

<style>

.cv-week {
display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    flex-flow: row nowrap;
    min-height: 10em;
    border-width: 0;
    position: relative;
    width: 100%;
    overflow-y: auto;
    -ms-overflow-style: none;
}
</style>