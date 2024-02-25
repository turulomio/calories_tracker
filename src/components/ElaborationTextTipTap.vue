<template>
  <div>
    <div class="d-flex flex-column" >
      <div v-if="editor" class="d-flex flex-row">
        <v-tooltip :text="$t('Save')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-content-save" @click="on_btn_save_click"></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Update mentions')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-reload" @click="on_update_mentions" ></v-btn></template></v-tooltip>
        <v-divider vertical></v-divider>
        <v-tooltip :text="$t('Undo')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-undo" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()"></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Redo')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-redo" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()"></v-btn></template></v-tooltip>

        <v-divider vertical></v-divider>
        <v-tooltip :text="$t('Bold text')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-bold" @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()"></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Italic text')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-italic" @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()"></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Strike text')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-strikethrough" @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()"></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Toggle code')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-code-greater-than" @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()"></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Clear marks')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-clear" @click="editor.chain().focus().unsetAllMarks().run()" :disabled="!editor.can().chain().focus().unsetAllMarks().run()"></v-btn></template></v-tooltip>




        <v-divider vertical></v-divider>
        <v-tooltip :text="$t('Paragraph')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-paragraph" @click="editor.chain().focus().setParagraph().run()" ></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Header 1')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-header-1" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" ></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Header 2')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-header-2" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" ></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Header 3')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-header-3" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" ></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Bulleted list')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-list-bulleted" @click="editor.chain().focus().toggleBulletList().run()" ></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Ordered list')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-format-list-numbered" @click="editor.chain().focus().toggleOrderedList().run()" ></v-btn></template></v-tooltip>

        <v-btn @click="editor.chain().focus().clearNodes().run()">clear nodes</v-btn>
        <v-btn @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">code block  </v-btn>
        <v-btn @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">blockquote</v-btn>



        <v-tooltip :text="$t('Horizontal line')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-minus" @click="editor.chain().focus().setHorizontalRule().run()" ></v-btn></template></v-tooltip>
        <v-tooltip :text="$t('Hard break')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-keyboard-return" @click="editor.chain().focus().setHardBreak().run()" ></v-btn></template></v-tooltip>

        <v-divider vertical></v-divider>
        <v-tooltip :text="$t('HTML Code')" location="bottom"><template v-slot:activator="{ props }"><v-btn v-bind="props" variant="text" icon="mdi-language-html5" @click="on_btn_html_code" ></v-btn></template></v-tooltip>

      </div>
      <v-card  height="500" style="overflow: auto" class="d-flex flex-row">
        <editor-content id="editor" :locale="$i18n.locale" :lang="$i18n.locale" ref="me" :editor="editor" ></editor-content>
      </v-card>
    </div>    
        <p v-if="show_html_code"> HTMLCODE {{ html_code }}</p>    
    <p v-if="unused_ingredients()" class="my-2 boldred d-flex justify-center">{{ $t("Products unused : [0]").format(unused_ingredients())}}</p>

  </div>  
</template>
<script>
    import axios from 'axios'
    import { PluginKey } from "prosemirror-state";
    import { Editor, EditorContent,VueRenderer } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Color from "@tiptap/extension-color";
    import TextStyle from "@tiptap/extension-text-style";
    import Mention from '@tiptap/extension-mention'
    import tippy from 'tippy.js'
    import { id_from_hyperlinked_url } from '@/functions';
import { useStore } from '@/store.js'

    import MentionListIngredients from './MentionListIngredients.vue'
    import MentionListContainers from './MentionListContainers.vue'
    export default {
        components: {
            EditorContent,
        },
        props: {
            elaboration: { 
                required: true
            },
            readonly: {
              Type: Boolean,
              default:false,
            }
        },
        data(){ 
            return{
                editor:null,
                key:0,
                html_code:"",
                show_html_code:false,

            }
        },
        methods: {
        useStore,
            id_from_hyperlinked_url,
            get_id_label_from_span(span){
              var r={
                id: span.split('data-id="')[1].split('" data-label')[0],
                label: span.split('data-label="')[1].split('">')[0],
              }
              return r
            },
            on_update_mentions(){

                this.get_ingredients_spans().forEach(span=>{
                  var sspan=this.get_id_label_from_span(span)
                  this.elaboration.elaborations_products_in.forEach(pi=>{
                    if (pi.id.toString()==sspan.id){
                      this.editor.commands.setContent(this.editor.getHTML().replace(span,this.span_ingredient(pi.id,pi.fullname)))
                    }
                  })
                })
                this.get_containers_spans().forEach(span=>{
                  var sspan=this.get_id_label_from_span(span)
                  this.elaboration.elaborations_containers.forEach(ec=>{
                    if (ec.id.toString()==sspan.id){
                      this.editor.commands.setContent(this.editor.getHTML().replace(span,this.span_container(ec.id,ec.name)))
                    }
                  })
                })
            },
            get_ingredients_spans(){
              /*
                Returns a list of string with ingredients spans 
               */
              var r= this.editor.getHTML().match(/<span data-type="mention" class="mention_ingredients"(.*?)<\/span>/g)
              return r
            },
            get_containers_spans(){
              /*
                Returns a list of string with recipients spans 
               */
              var r= this.editor.getHTML().match(/<span data-type="MentionContainers" class="mention_containers"(.*?)<\/span>/g)
              return r
            },
            span_ingredient(id,label){
              /**
               * Returns a string with the span container
               */
              return `<span data-type="mention" class="mention_ingredients" data-id="${id}" data-label="${label}">@${label}</span>`
            },
            span_container(id,label){
              /**
               * Returns a string with the span container
               */
              return `<span data-type="MentionContainers" class="mention_containers" data-id="${id}" data-label="${label}">#${label}</span>`
            },

            unused_ingredients(){
                var r=""
                //Load all ingredientes urls in elaboration
                var unused_ids=[]
                this.elaboration.elaborations_products_in.forEach(element => {
                    unused_ids.push(this.id_from_hyperlinked_url(element.url).toString())  
                })

                //Load all used_ids
                var ingredients_spans=this.get_ingredients_spans()
                if (ingredients_spans!=null){
                    var used_ids=[]
                    ingredients_spans.forEach(span=>{
                    var sspan=this.get_id_label_from_span(span)
                    used_ids.push(sspan.id)
                    //substracion

                    unused_ids = unused_ids.filter((item) => !used_ids.includes(item))
                    console.log("USED",used_ids)
                  })
                } 

                console.log("UNUSED",unused_ids)


                //Generation of string
                unused_ids.forEach(o=>{
                    this.elaboration.elaborations_products_in.forEach(p=> {
                        if (this.id_from_hyperlinked_url(p.url).toString()==o){
                            r=r+ p.fullname+", "
                        }
                    })
                })
                return r.slice(0,-2)
            },
            on_btn_html_code(){
              this.html_code=this.editor.getHTML()
              this.show_html_code=!this.show_html_code
            },
            on_btn_save_click(){ 
                var elaboration_text={
                    elaborations: this.elaboration.url,
                    text: this.editor.getHTML()
                }

                if (this.elaboration.elaborations_texts==null){
                    axios.post(`${this.useStore().apiroot}/api/elaborations_texts/`, elaboration_text,  this.myheaders())
                    .then(() => {
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
            suggestion_ingredients(){
              return {
                char: "@",
                items: ({ query }) => {
                  return this.elaboration.elaborations_products_in.filter(item => item.fullname.toLowerCase().includes(query.toLowerCase())).slice(0, 100)
                },

                render: () => {
                  let component
                  let popup

                  return {
                    onStart: props => {
                      component = new VueRenderer(MentionListIngredients, {
                        props,
                        editor: props.editor,
                      })

                      if (!props.clientRect) {
                        return
                      }

                      popup = tippy('body', {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: component.element,
                        showOnCreate: true,
                        hideOnClick: true,
                        interactive: true,
                        trigger: 'manual',
                        placement: 'bottom-start',
                      })
                    },

                    onUpdate(props) {
                      component.updateProps(props)

                      if (!props.clientRect) {
                        return
                      }

                      popup[0].setProps({
                        getReferenceClientRect: props.clientRect,
                      })
                    },

                    onKeyDown(props) {
                      if (props.event.key === 'Escape') {
                        popup[0].hide()

                        return true
                      }

                      return component.ref?.onKeyDown(props)
                    },

                    onExit() {
                      popup[0].destroy()
                      component.destroy()
                    },
                  }
                },
              }
            },

            suggestion_containers(){
              return {
                char: "#",
                pluginKey: new PluginKey("suggestionContainers"),
                items: ({ query }) => {
                  return this.elaboration.elaborations_containers.filter(item => item.name.toLowerCase().includes(query.toLowerCase())).slice(0,100)
                },

                render: () => {
                  let component
                  let popup

                  return {
                    onStart: props => {
                      component = new VueRenderer(MentionListContainers, {
                        props,
                        editor: props.editor,
                      })

                      if (!props.clientRect) {
                        return
                      }

                      popup = tippy('body', {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: component.element,
                        showOnCreate: true,
                        hideOnClick: true,
                        interactive: true,
                        trigger: 'manual',
                        placement: 'bottom-start',
                      })
                    },

                    onUpdate(props) {
                      component.updateProps(props)

                      if (!props.clientRect) {
                        return
                      }

                      popup[0].setProps({
                        getReferenceClientRect: props.clientRect,
                      })
                    },

                    onKeyDown(props) {
                      if (props.event.key === 'Escape') {
                        popup[0].hide()

                        return true
                      }

                      return component.ref?.onKeyDown(props)
                    },

                    onExit() {
                      popup[0].destroy()
                      component.destroy()
                    },
                  }
                },
              }
            },
        },
        created(){
            if (this.elaboration.elaborations_texts){
                this.text=this.elaboration.elaborations_texts.text
            }



            this.editor = new Editor({
                editable: !this.readonly,
                content: this.text,
                extensions: [
                    StarterKit, 
                    Color,
                    TextStyle,
                    Mention.configure({
                      HTMLAttributes: {
                        class: 'mention_ingredients',
                      },
                      suggestion:this.suggestion_ingredients(),
                    }),
                    Mention.extend({name: 'MentionContainers',}).configure({
                      HTMLAttributes: {
                        class: 'mention_containers',
                      },
                      suggestion:this.suggestion_containers(),
                    }),
                ],
                
                onUpdate: ({ editor }) => {
                    this.html_code=editor.getHTML()
                },
            })
        },
        beforeDestroy() {
            this.editor.destroy()
        },
    }
</script>
<style>
  .mention_containers{
    color: rgb(15, 15, 139);
    background-color: rgb(165, 197, 228);
    border-radius: 0.3rem;
    padding: 0.1rem 0.3rem;

  }

  ol > li {
      list-style-type: decimal-leading-zero;
    margin-left: 50px;
    padding-left: 20px;
  }
  
  ul > li {
    list-style-type: disc;
    margin-left: 50px;
    padding-left: 20px;
  }

  .mention_ingredients {
    color: #3f310b;
    background-color: #f7dbbc;
    border-radius: 0.3rem;
    padding: 0.1rem 0.3rem;
  }
</style>
