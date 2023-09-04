<template>
    <div>
    <div class="d-flex" >

    <v-card width="100%" height="500">

  <div v-if="editor">
    <v-btn @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      bold
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      italic
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      strike
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
      code
    </v-btn>
    <v-btn @click="editor.chain().focus().unsetAllMarks().run()">
      clear marks
    </v-btn>
    <v-btn @click="editor.chain().focus().clearNodes().run()">
      clear nodes
    </v-btn>
    <v-btn @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
      paragraph
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
      h1
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
      h2
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
      h3
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
      h4
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
      h5
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
      h6
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
      bullet list
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
      ordered list
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
      code block
    </v-btn>
    <v-btn @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
      blockquote
    </v-btn>
    <v-btn @click="editor.chain().focus().setHorizontalRule().run()">
      horizontal rule
    </v-btn>
    <v-btn @click="editor.chain().focus().setHardBreak().run()">
      hard break
    </v-btn>
    <v-btn @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
      undo
    </v-btn>
    <v-btn @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
      redo
    </v-btn>
    <v-btn @click="on_btn_save_click" >
      save
    </v-btn>
    <v-btn @click="on_btn_html_code" >
      {{$t("HTML code")}}
    </v-btn>
  </div>
            <editor-content id="editor" ref="me" :editor="editor" ></editor-content>
        </v-card>
    </div>
        <p v-if="show_html_code"> HTMLCODE {{ html_code }}</p>
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
                    axios.post(`${this.store().apiroot}/api/elaborations_texts/`, elaboration_text,  this.myheaders())
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
            }
        },
        created(){
            if (this.elaboration.elaborations_texts){
                this.text=this.elaboration.elaborations_texts.text
            }



            this.editor = new Editor({
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
    background-color: rgb(135, 185, 231);
  }

ol > li {
    list-style-type: decimal-leading-zero;
  margin-left: 50px;
  padding-left: 20px;
}

  .mention_ingredients {
    color: #320b70;
    background-color: #857d92;
    border-radius: 0.3rem;
    padding: 0.1rem 0.3rem;
  }
</style>
