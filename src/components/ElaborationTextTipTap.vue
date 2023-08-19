<template>
    <div>
    <div class="d-flex" >

        <v-card width="20%" 
       style="max-height: 300px"
       class="overflow-y-auto">
            <v-list >
                {{ $t("Ingredients") }}
                    <v-list-item v-for="(item, i) in elaboration.elaborations_products_in" :key="i" @click="on_ingredient_click(item)" prepend-icon="mdi-eye"  :title="item.fullname">
                    </v-list-item>
                {{ $t("Containers") }}

                    <v-list-item v-for="(item, i) in elaboration.elaborations_containers" :key="i" @click="on_container_click(item)" prepend-icon="mdi-eye" :title="item.name" >
                        
                    </v-list-item>
            </v-list>
        </v-card>
        <v-card width="80%" >

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
    <v-btn @click="print" >
      Print
    </v-btn>
  </div>
            <editor-content id="editor" ref="me" :editor="editor" ></editor-content>
        </v-card>
    </div>
        <p> HTMLCODE {{ html_code }}</p>
    </div>
</template>
<script>
    import axios from 'axios'
    import { Editor, EditorContent,VueRenderer } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Color from "@tiptap/extension-color";
    import TextStyle from "@tiptap/extension-text-style";
    import Mention from '@tiptap/extension-mention'
    import tippy from 'tippy.js'

    import MentionList from './MentionList.vue'
    export default {
        components: {
            EditorContent,
        },
        props: {
            elaboration: { 
                required: true
            },
        },
        watch: {
            editor(value){
                console.log(value.options.content)
            }
        },
        data(){ 
            return{
                editor:null,
                key:0,
                html_code:"",

            }
        },
        methods: {
            on_btn_save_click(a,b,c){ 
                // console.log(a,b,c)
                var elaboration_text={
                    elaborations: this.elaboration.url,
                    text: this.editor.getHTML()
                }
                // console.log(elaboration_text)
                if (this.elaboration.elaborations_texts==null){
                    axios.post(`${this.store().apiroot}/api/elaborations_texts/`, elaboration_text,  this.myheaders())
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
            on_ingredient_click(item){
                // console.dir(this.editor.chain().focus())
                this.editor.chain().focus().setBold().setColor("green").insertContent(item.fullname+", ").unsetColor().unsetBold().run()
            },
            on_container_click(item){
                this.editor.chain().focus().setBold().setColor("brown").insertContent(item.name+" ").unsetColor().unsetBold().run()
            },
            post_process(){

            },
            async print () {
              await this.$htmlToPaper("editor");
            },
            suggestion(){
              return {
                items: ({ query }) => {
                  console.log(this.elaboration.elaborations_products_in)
                  return this.elaboration.elaborations_products_in.filter(item => item.fullname.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
                },

                render: () => {
                  let component
                  let popup

                  return {
                    onStart: props => {
                      console.log("onStart")
                      component = new VueRenderer(MentionList, {
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
                      console.log("onUpdate")
                      component.updateProps(props)

                      if (!props.clientRect) {
                        return
                      }

                      popup[0].setProps({
                        getReferenceClientRect: props.clientRect,
                      })
                    },

                    onKeyDown(props) {
                      console.log("onkeydown")
                      if (props.event.key === 'Escape') {
                        popup[0].hide()

                        return true
                      }

                      return component.ref?.onKeyDown(props)
                    },

                    onExit() {
                      console.log("onExit2")
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
                        class: 'mention',
                      },
                      suggestion:this.suggestion(),

                    renderLabel({ options, node }) {
                      console.log(options,node)

                      return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
  }
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
