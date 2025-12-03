<template>
    <div class="ma-4">
        <h1>{{ $t(`Pill organizer`) }}
            <MyMenuInline :items="menuinline_items()"></MyMenuInline>
        </h1>      

      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn class="mr-4" color="grey-darken-2" variant="outlined" @click="setToday">Today</v-btn>
          <v-btn color="grey-darken-2" size="small" variant="text" icon @click="prev">
            <v-icon size="small">
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn color="grey-darken-2" size="small" variant="text" icon @click="next">
            <v-icon size="small">
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ $t("Selected day") }}: {{ focus   }}
          </v-toolbar-title>
        </v-toolbar>
      </v-sheet>
            <v-calendar ref="calendar" v-model="focus" :events="data" :locale="$i18n.locale" :weekdays="[1,2,3,4,5,6,0]" @change="update_pill_events" :event-color="getEventColor" event-overlap-mode="stack" :event-overlap-threshold="30" 
            @click:date="on_click_date" 
            @mousedown:event="onDrag"
            @mouseup:day="onDrop"
          />
        

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
                focus: "",

                //CRUD COMPANY
                pill_event:null,
                pill_event_mode_mode:null,
                dialog_pill_events_crud:false,

                // CONTEXTUAL MENU
                data_selected:null, // item selected when popup context menu
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
            setToday () {
                this.focus = new Date().toISOString().slice(0,10)
            },
            prev () {
                this.$refs.calendar.prev()
            },
            next () {
                this.$refs.calendar.next()
            },
            onDrag(event, item){
                this.data_selected = item.event
                this.pill_event = this.data_selected
                console.log("DRAGGED", this.data_selected?.url)

                // Add listeners to change cursor during drag
                document.addEventListener('mousemove', this.handleDragMove);
                document.addEventListener('mouseup', this.handleDragEnd, { once: true }); // Clean up when mouse is released

            },
            onDrop(event, date) {
                if (!this.data_selected){
                    return
                }

                // Esta grabado data_selected

                var olddate
                if (event.ctrlKey){ //Copy
                    console.log("COPY", date.date, this.data_selected?.url)
                    olddate=new Date(this.data_selected.start)
                    this.new_pill_event=this.empty_pill_event()
                    this.new_pill_event.dt=new Date(date.year,date.month-1,date.day,olddate.getHours(), olddate.getMinutes(), olddate.getSeconds(), olddate.getMilliseconds())
                    this.new_pill_event.pillname=this.pill_event.pillname
                    axios.post(`${this.useStore().apiroot}/api/pill_events/`, this.new_pill_event,  this.myheaders())
                        .then(() => {
                            this.update_pill_events()
                        }, (error) => {
                            this.parseResponseError(error)
                        })

                } else if (event.shiftKey) { //Move
                    console.log("MOVE", date.date, this.data_selected?.url)
                    olddate=new Date(this.data_selected.start)
                    this.pill_event.dt=new Date(date.year,date.month-1,date.day,olddate.getHours(), olddate.getMinutes(), olddate.getSeconds(), olddate.getMilliseconds())
                    axios.put(this.pill_event.url, this.pill_event,  this.myheaders())
                        .then(() => {
                            this.update_pill_events()
                        }, (error) => {
                            this.parseResponseError(error)
                        })
                } else {
                    console.log("MENU", date.date, this.data_selected?.url)
                    this.menuX=event.clientX
                    this.menuY=event.clientY
                    this.menuitem_intake=(this.data_selected.is_taken)? this.$t("Undo Take pill") : this.$t("Take pill") 
                    this.menuitem_highlight=(this.data_selected.highlight_late)? this.$t("Undo highlight") : this.$t("Highlight was taken late") 
                    this.contextual_menu=true
                }
            },
            handleDragMove(e) {
                if (e.ctrlKey) {
                    document.body.style.cursor = 'copy';
                } else if (e.shiftKey) {
                    document.body.style.cursor = 'move';
                } else {
                    document.body.style.cursor = 'grabbing';
                }
            },
            handleDragEnd() {
                // Reset cursor and remove listeners
                document.body.style.cursor = 'default';
                document.removeEventListener('mousemove', this.handleDragMove);
                // The 'mouseup' listener is already removed due to { once: true }
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
                this.pill_event=this.pill_events.find(element => element.url === this.data_selected.url);
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
                this.pill_event=this.pill_events.find(element => element.url === this.data_selected.url);
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
                this.pill_event=this.pill_events.find(element => element.url === this.data_selected.url);
                this.key=this.key+1
                this.dialog_pill_events_crud=true
            },
            event_delete(){
                this.pill_event=this.pill_events.find(element => element.url === this.data_selected.url);
                axios.delete(this.pill_event.url, this.myheaders())
                    .then(() => {
                        this.update_pill_events()
                    }, (error) => {
                        this.parseResponseError(error)
                    })
            },
            on_click_date(event_click, object){
                this.pill_event_mode="C"
                this.pill_event=this.empty_pill_event()
                this.pill_event.dt=new Date(object.year, object.month-1, object.day, 0,0,0)
                this.key=this.key+1
                this.dialog_pill_events_crud=true
            },
            on_PillEventsCRUD_cruded(){
                this.dialog_pill_events_crud=false
                this.update_pill_events()
            },
            update_pill_events(){
                var focusDate=new Date(this.focus)
                axios.get(`${this.useStore().apiroot}/api/pill_events/?year=${focusDate.getFullYear()}&month=${focusDate.getMonth()+1}`, this.myheaders())
                .then((response) => {
                    this.pill_events=response.data
                    this.data=[]
                    this.pill_events.forEach(o=>{
                        this.data.push(this.pill_event_to_data(o))
                    })
                    this.pill_event=null
                    this.data_selected=null
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

                return { ...pill_event,
                    name: pillname,
                    color: color,
                    start: localtime(startDate.toISOString()),
                    end: null, // Add 1 hour in milliseconds
                    timed: 0,
                    tooltip: tooltip,
                }

            },     
            getEventColor (event) {
                return event.color
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
            this.setToday()
            this.update_pill_events()
        },
    }
</script>
