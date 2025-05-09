<template>
    <div class="ma-4">
        <h1>{{ $t(`Pill organizer`) }}
            <MyMenuInline :items="menuinline_items()"></MyMenuInline>
        </h1>      
        <div>
            <CalendarView class="theme-default " :startingDayOfWeek="1" displayPeriodUom="month"  monthNameFormat="long" weekday-name-format="long" :items="data" show-times :time-format-options="{ hour: 'numeric', minute: '2-digit' }" :disable-future="false" @click-item="on_click_item" :show-date="showDate" :disable-past="false" :enable-date-selection="true" @click-date="on_click_date" :enable-drag-drop="true" @drop-on-date="onDrop" :selection-start="selectionStart" :selection-end="selectionEnd" @date-selection-start="setSelection" @date-selection="setSelection" @date-selection-finish="finishSelection">
                <template #header="{ headerProps }">
                    <CalendarViewHeader :header-props="headerProps" @input="setShowDate" />
                </template>
            </CalendarView>
        </div>

        <!-- CONTEXTUAL MENU -->
        <v-menu v-model="contextual_menu" location-strategy="connected" :target="[menuX, menuY]" >
            <v-list>
                <v-list-item @click="event_intake" :title="menuitem_intake" prepend-icon="mdi-pill" />
                <v-list-item @click="event_highlight" :title="menuitem_highlight" prepend-icon="mdi-marker" />
                <v-list-item @click="event_update" :title="$t('Update')" prepend-icon="mdi-pencil" />
                <v-list-item @click="event_delete" :title="$t('Delete')" prepend-icon="mdi-delete" />
            </v-list>
        </v-menu>

        <!-- DIALOG PILL EVENTS CRUD -->
        <v-dialog v-model="dialog_pill_events_crud" width="45%">
            <v-card class="pa-4">
                <PillEventsCRUD :pill_event="pill_event" :mode="pill_event_mode" :key="'B'+key" @cruded="on_PillEventsCRUD_cruded"></PillEventsCRUD>
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
		    	selectionStart: null,
			    selectionEnd: null,

                //CRUD COMPANY
                pill_event:null,
                pill_event_mode_mode:null,
                dialog_pill_events_crud:false,

                // CONTEXTUAL MENU
                item_selected:null, // item selected when popup context menu
                contextual_menu:false,
                menuX:0,
                menuY:0,

                menuitem_intake:"",
                menuitem_highlight:"",

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
            onDrop(item, date, event) {
                this.item_selected=item
                this.pill_event=this.pill_events.find(element => element.url === this.item_selected.url);
                var olddate=new Date(this.pill_event.dt)
                if (event.ctrlKey){ //Copy
                    this.new_pill_event=this.empty_pill_event()
                    this.new_pill_event.dt=new Date(date.getFullYear(),date.getMonth(),date.getDate(),olddate.getHours(), olddate.getMinutes(), olddate.getSeconds(), olddate.getMilliseconds())
                    this.new_pill_event.pillname=this.pill_event.pillname
                    axios.post(`${this.useStore().apiroot}/api/pill_events/`, this.new_pill_event,  this.myheaders())
                        .then(() => {
                            this.update_pill_events()
                        }, (error) => {
                            this.parseResponseError(error)
                        })

                } else { //Move
                    this.pill_event.dt=new Date(date.getFullYear(),date.getMonth(),date.getDate(),olddate.getHours(), olddate.getMinutes(), olddate.getSeconds(), olddate.getMilliseconds())
                    axios.put(this.pill_event.url, this.pill_event,  this.myheaders())
                        .then(() => {
                            this.update_pill_events()
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                }
                this.update_pill_events()
            },
			setShowDate(d) {
				this.showDate = d;
                this.update_pill_events()
			},

            setSelection(dateRange) {
                this.selectionEnd = dateRange[1]
                this.selectionStart = dateRange[0]
            },
            finishSelection(dateRange) {
                this.setSelection(dateRange)
                this.message = `You selected: ${this.selectionStart.toLocaleDateString()} -${this.selectionEnd.toLocaleDateString()}`
            },
            showContextMenu(item,event){
                this.menuX=event.clientX
                this.menuY=event.clientY
                this.item_selected=item
                this.pill_event=this.pill_events.find(element => element.url === this.item_selected.url);
                this.menuitem_intake=(this.pill_event.is_taken)? this.$t("Undo Take pill") : this.$t("Take pill") 
                this.menuitem_highlight=(this.pill_event.highlight_late)? this.$t("Undo highlight") : this.$t("Highlight was taken late") 
                this.contextual_menu=true
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
                                    this.on_click_date()
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
            event_intake(){
                // item must be converted to pill_event
                this.pill_event=this.pill_events.find(element => element.url === this.item_selected.url);
                if (this.pill_event.dt_intake){
                    this.pill_event.dt_intake=null
                } else {
                    this.pill_event.dt_intake=new Date()
                }

                axios.put(this.pill_event.url, this.pill_event,  this.myheaders())
                    .then(() => {
                        this.update_pill_events()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
            },
            event_highlight(){
                // item must be converted to pill_event
                this.pill_event=this.pill_events.find(element => element.url === this.item_selected.url);
                if (this.pill_event.dt_intake == null) {
                    alert(this.$t("You can't highlight a pill event if pill hasn't been taken"))
                    return
                }

                this.pill_event.highlight_late=!this.pill_event.highlight_late

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
                axios.delete(this.pill_event.url, this.myheaders())
                    .then(() => {
                        this.update_pill_events()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
            },
            on_click_date(date){
		    	this.selectionStart = null
			    this.selectionEnd = null
                this.pill_event_mode="C"
                this.pill_event=this.empty_pill_event()
                this.pill_event.dt=date
                this.key=this.key+1
                this.dialog_pill_events_crud=true
            },
            on_click_item(item, event){
                this.showContextMenu(item,event)
            },
            on_PillEventsCRUD_cruded(){
                this.dialog_pill_events_crud=false
                this.update_pill_events()
            },
            update_pill_events(){          
                axios.get(`${this.useStore().apiroot}/api/pill_events/?year=${this.showDate.getFullYear()}&month=${this.showDate.getMonth()+1}`, this.myheaders())
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
                let dt=new Date(pill_event.dt)
                let dt_intake = (pill_event.dt_intake==null) ? null : new Date(pill_event.dt_intake)
                let color="grey" //Red: missing //Green taken //Gray not yet
                if (pill_event.highlight_late && pill_event.dt_intake!=null){
                    color="blue"
                } else if (pill_event.dt_intake!=null){
                    color="green"
                } else if (new Date()> dt){
                    color="red"
                }

                // If has been taken and highlight_late is true
                let startDate
                let pillname
                let tooltip
                if (pill_event.highlight_late && pill_event.dt_intake!=null){
                    startDate=dt
                    pillname=this.$t(`[0] (Taken late)`).format(pill_event.pillname)
                    tooltip=this.$t(`It was taken at [0] ([1] after)`).format(localtime(dt_intake.toISOString()), this.diferenciaEnHumano(dt,dt_intake))
                } else {
                    startDate=dt
                    pillname=pill_event.pillname
                    tooltip= this.$t("Pill taken on time")
                }

                return {
                    id: pill_event.url,
                    url: pill_event.url,
                    title: pillname,
                    startDate: localtime(startDate.toISOString()),
                    endDate: null, // Add 1 hour in milliseconds
                    style: `color: ${color};`,
                    tooltip: tooltip,
                }

            },
            diferenciaEnHumano(fecha1, fecha2) {
                const diferenciaMs = Math.abs(fecha2.getTime() - fecha1.getTime());
                const segundos = Math.floor(diferenciaMs / 1000);
                const minutos = Math.floor(segundos / 60);
                const horas = Math.floor(minutos / 60);
                const dias = Math.floor(horas / 24);
                const meses = Math.floor(dias / 30.44); // Aproximación
                const anos = Math.floor(meses / 12);

                if (anos > 0) {
                    return `${anos} año${anos > 1 ? 's' : ''}`;
                } else if (meses > 0) {
                    return `${meses} mes${meses > 1 ? 'es' : ''}`;
                } else if (dias > 0) {
                    return `${dias} día${dias > 1 ? 's' : ''}`;
                } else if (horas > 0) {
                    return `${horas} hora${horas > 1 ? 's' : ''}`;
                } else if (minutos > 0) {
                    return `${minutos} minuto${minutos > 1 ? 's' : ''}`;
                } else {
                    return `${segundos} segundo${segundos !== 1 ? 's' : ''}`;
                }

            },
        },
        created(){
            this.update_pill_events()
        },
    }
</script>

<style>
/* Set due to min-height was too small */
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