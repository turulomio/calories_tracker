<template>
    <div class="d-flex" >

        <v-card width="20%" 
       style="max-height: 300px"
       class="overflow-y-auto">
            <v-list >
                <v-subheader>{{ $t("Ingredients") }}</v-subheader>

                <v-list-item-group  color="primary" >
                    <v-list-item v-for="(item, i) in elaboration.elaborations_products_in" :key="i" @click="on_ingredient_click(item)" >
                        <v-list-item-icon>
                            <v-icon >mdi-eye</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title >{{ item.fullname }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-subheader>{{ $t("Containers") }}</v-subheader>

                <v-list-item-group  color="primary" >
                    <v-list-item v-for="(item, i) in elaboration.elaborations_containers" :key="i" @click="on_container_click(item)" >
                        <v-list-item-icon>
                            <v-icon >mdi-eye</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title >{{ item.name }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>
        <v-card width="80%" >
            <mavon-editor ref="me" v-model="text" language="en" :key="key" :toolbars="toolbars" >
                <template slot="left-toolbar-after">
                    <button
                        type="button"
                        @click="on_btn_save_click"
                        class="op-icon fa fa-mavon-floppy-o"
                        aria-hidden="true"
                        :title="$t('Save')"
                    ></button>
                    <button
                        type="button"
                        @click="on_btn_add_text('HOLA')"
                        class="mdi-eye"
                        aria-hidden="true"
                        :title="$t('Add text')"
                    ></button>
                </template>
            </mavon-editor>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        components: {
        },
        props: {
            elaboration: { 
                required: true
            },
        },
        watch: {
        },
        data(){ 
            return{
                text:"",
                key:0,

                toolbars: {
                    bold: true,
                    italic: true,
                    header: true,
                    underline: true,
                    strikethrough: true,
                    mark: true,
                    superscript: true,
                    subscript: true,
                    quote: true,
                    ol: true,
                    ul: true,
                    link: true,
                    imagelink: true,
                    code: true,
                    table: true,
                    fullscreen: true,
                    readmodel: true,
                    htmlcode: true,
                    help: true,
                    /* 1.3.5 */
                    undo: true,
                    redo: true,
                    trash: true,
                    save: false,
                    /* 1.4.2 */
                    navigation: true,
                    /* 2.1.8 */
                    alignleft: true,
                    aligncenter: true,
                    alignright: true,
                    /* 2.2.1 */
                    subfield: true,
                    preview: false
                },
            }
        },
        methods: {
            on_btn_save_click(a,b,c){ 
                console.log(a,b,c)
                var elaboration_text={
                    elaboration: this.elaboration.url,
                    text: this.text
                }
                console.log(elaboration_text)
                if (this.elaboration.elaborations_texts==null){
                    axios.post(`${this.$store.state.apiroot}/api/elaborations_texts/`, elaboration_text,  this.myheaders())
                    .then(() => {
                        // this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                } else {
                    axios.put(this.elaboration.elaborations_texts.url, elaboration_text,  this.myheaders())
                    .then(() => {
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
            on_btn_add_text(text){
                console.dir(this.$refs.me)
                let insert_text = {
                    prefix: "",
                    subfix: '',
                    str: text,
                };
                this.$refs.me.insertText(this.$refs.me.getTextareaDom(), insert_text)
                this.$refs.me.getTextareaDom().selectionStart=this.$refs.me.getTextareaDom().selectionEnd
            },
            on_ingredient_click(item){
                this.on_btn_add_text(item.fullname)
            },
            on_container_click(item){
                this.on_btn_add_text(item.name)
            },
        },
        created(){
            if (this.elaboration.elaborations_texts){
                this.text=this.elaboration.elaborations_texts.text
            }
            console.log(this.elaboration.elaborations_containers)
        }
    }
</script>
