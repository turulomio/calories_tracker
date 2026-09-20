<template>
    <div class="ma-4">
        <h1>{{ $t(`Pots`) }}
            <MyMenuInline :items="menuinline_items()"></MyMenuInline>
        </h1>
        <v-text-field class="ml-10 mr-10 mb-5" v-model="search" append-icon="mdi-magnify" :label="$t('Filter')" single-line hide-details :placeholder="$t('Add a string to filter table')"  v-on:keyup.enter="on_search_change()"></v-text-field>
  
        <v-data-table density="compact" :headers="pots_headers" :key="key" :items="pots" :sort-by="[{key:'name',order:'asc'}]" class="elevation-1" :items-per-page="10000" item-key="item_key">   
            <template #item.photo="{item}"><MiniImage v-if="item.thumbnail" :thumbnail="item.thumbnail" :content-url="item.photo ? item.photo.url_content : null" /></template>
            <template #item.name="{item}">{{ item.name }}</template>
            <template #item.volume="{item}">{{ round(item.volume,0) }}</template>
            <template #item.actions="{item}">
                <v-icon small class="mr-2" @click="editPot(item)">mdi-pencil</v-icon>
                <v-icon small @click="deletePot(item)">mdi-delete</v-icon>
            </template>
            <template #bottom ></template>  
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
    import axios from 'axios'
    import {round} from 'vuetify_rules'
    import { empty_pots } from '../empty_objects.js'
    import imgNoImage from "@/assets/no_image.jpg"
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import MiniImage from './MiniImage.vue'
    import PotsCRUD from './PotsCRUD.vue'
    import { useStore } from '@/store.js'
    export default {
        components: {
            MyMenuInline,
            MiniImage,
            PotsCRUD,
        },
        data(){
            return {
                pots:[],
                pots_headers: [
                    { title: this.$t('Photo'), sortable: true, key: 'photo'},
                    { title: this.$t('Name'), sortable: true, key: 'name'},
                    { title: this.$t('Diameter (cm)'), key: 'diameter', align:'right', width:"12%"},
                    { title: this.$t('Height (cm)'), key: 'height', align:'right', width:"12%"},
                    { title: this.$t('Weight (g)'), key: 'weight', align:'right', width:"12%"},
                    { title: this.$t('Volume (cm³)'), key: 'volume', align:'right', width:"12%"},
                    { title: this.$t('Actions'), key: 'actions', align: 'right', sortable: false, width:"12%"},
                ],
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
            round,
        useStore,
            menuinline_items(){
                return [
                    {
                        subheader: this.$t("Pot options"),
                        children: [
                            {
                                name: this.$t("Add a pot"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.pot_mode="C"
                                    this.pot=this.empty_pots()
                                    this.key=this.key+1
                                    this.dialog_pots_crud=true
                                }.bind(this),
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
                var r=[]
                this.getArrayFromMap(this.useStore().pots).forEach(p=>{
                    if (p.name.toLowerCase().includes(this.search.toLowerCase())){
                        p.thumbnail=imgNoImage
                        p.item_key=null//Used for table-item key
                        if (p.photo){
                            axios.get(`${p.photo.url_thumbnail}`, this.myheaders())
                            .then((responsethumbnail) => {
                                p.thumbnail=responsethumbnail.data
                                p.item_key=p.url
                        r.push(p)
                            }, (error) => {
                                this.parseResponseError(error)
                            });
                        } else {
                        r.push(p)

                        }
                    }
                })
                this.pots=r
                this.key=this.key+1
            },
        },
        created(){
            this.update_pots()
        }
    }
</script>