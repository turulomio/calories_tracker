<template>
    <div class="ma-4">
        <h1>{{ $t(`Formats`) }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <v-tabs  background-color="primary" dark v-model="tab" >
            <v-tab key="formats">{{ $t('Formats') }}</v-tab>
            <v-tab key="system_formats">{{ $t('System formats') }}</v-tab>
        </v-tabs>
        <v-data-table dense :headers="formats_headers" :items="formats" sort-by="name" class="elevation-1" hide-default-footer disable-pagination :loading="loading" :key="'T'+key" :height="500">
            <template v-slot:[`item.last`]="{ item }">
                {{localtime(item.last)}}
            </template>   
            <template v-slot:[`item.system_formats`]="{ item }">
                <v-icon small v-if="item.system_formats" >mdi-check-outline</v-icon>
            </template>               
            <template v-slot:[`item.obsolete`]="{ item }">
                    <v-icon small v-if="item.obsolete" >mdi-check-outline</v-icon>           
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon v-if="item.is_editable" small class="mr-2" @click="editFormat(item)">mdi-pencil</v-icon>
                <v-icon v-if="item.is_deletable" small @click="deleteFormat(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>



        <!-- DIALOG FORMATS CRUD -->
        <v-dialog v-model="dialog_formats_crud" width="45%">
            <v-card class="pa-4">
                <FormatsCRUD :format="format" :deleting="format_deleting" :key="'B'+key" @cruded="on_FormatsCRUD_cruded()"></FormatsCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { empty_formats } from '../empty_objects.js'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import FormatsCRUD from './FormatsCRUD.vue'
    export default {
        components: {
            MyMenuInline,
            FormatsCRUD,
        },
        data(){
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Format options"),
                        children: [
                            {
                                name: this.$t("Add format"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.format_deleting=false
                                    this_.format=this_.empty_formats()
                                    this_.key=this_.key+1
                                    this_.dialog_formats_crud=true
                                },
                            },
                        ]
                    },
                ],
                formats:[],
                formats_headers: [
                    { text: this.$t('Name'), sortable: true, value: 'name'},
                    { text: this.$t('Amount'), value: 'last', align:'right', width:"12%"},
                    { text: this.$t('Actions'), value: 'actions', sortable: false, width:"8%"},
                ],
                loading:false,
                key:0,

                //CRUD COMPANY
                format:null,
                format_deleting:null,
                dialog_formats_crud:false,
            }
        },        
        methods:{
            empty_formats,
            on_FormatsCRUD_cruded(){
                this.dialog_formats_crud=false
                this.update_formats()
            },
            update_formats(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/formats/?product=${this.product}`, this.myheaders())
                .then((response) => {
                    this.formats=response.data
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

            },
            editFormat(item){
                this.format=item
                this.format_deleting=false
                this.key=this.key+1

                this.dialog_formats_crud=true
            },
            deleteFormat(item){
                this.format=item
                this.format_deleting=true
                this.key=this.key+1

                this.dialog_formats_crud=true
            },
        },
        created(){
            this.update_formats()
        }
    }
</script>