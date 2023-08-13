<template>
    <div>
    <!-- <div class="d-flex" >

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
                        
                            <v-list-item-title >{{ item.fullname }}</v-list-item-title>
                        
                    </v-list-item>
                </v-list-item-group>
                <v-subheader>{{ $t("Containers") }}</v-subheader>

                <v-list-item-group  color="primary" >
                    <v-list-item v-for="(item, i) in elaboration.elaborations_containers" :key="i" @click="on_container_click(item)" >
                        <v-list-item-icon>
                            <v-icon >mdi-eye</v-icon>
                        </v-list-item-icon>
                        
                            <v-list-item-title >{{ item.name }}</v-list-item-title>
                        
                    </v-list-item>
                </v-list-item-group>
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
            <editor-content id="editor" ref="me" :editor="editor" :key="key"  >
            </editor-content>
        </v-card>
    </div>
        <p> HTMLCODE {{ html_code }}</p> -->
    </div>
</template>
<script>
//     import axios from 'axios'
// import { Editor, EditorContent } from '@tiptap/vue-2'
// import StarterKit from '@tiptap/starter-kit'
// import Color from "@tiptap/extension-color";
// import TextStyle from "@tiptap/extension-text-style";
//     export default {
//         components: {
//             EditorContent,
//         },
//         props: {
//             elaboration: { 
//                 required: true
//             },
//         },
//         watch: {
//             editor(value){
//                 console.log(value.options.content)
//             }
//         },
//         data(){ 
//             return{
//                 editor:null,
//                 key:0,
//                 html_code:"",

//             }
//         },
//         methods: {
//             on_btn_save_click(a,b,c){ 
//                 console.log(a,b,c)
//                 var elaboration_text={
//                     elaborations: this.elaboration.url,
//                     text: this.editor.getHTML()
//                 }
//                 console.log(elaboration_text)
//                 if (this.elaboration.elaborations_texts==null){
//                     axios.post(`${this.store().apiroot}/api/elaborations_texts/`, elaboration_text,  this.myheaders())
//                     .then(() => {
//                         // this.$emit("cruded")
//                     }, (error) => {
//                         this.parseResponseError(error)
//                     })
//                 } else {
//                     axios.put(this.elaboration.elaborations_texts.url, elaboration_text,  this.myheaders())
//                     .then(() => {
//                     }, (error) => {
//                         this.parseResponseError(error)
//                     })
//                 }
//             },
//             on_ingredient_click(item){
//                 console.dir(this.editor.chain().focus())
//                 this.editor.chain().focus().setBold().setColor("green").insertContent(item.fullname+", ").unsetColor().unsetBold().run()
//             },
//             on_container_click(item){
//                 this.editor.chain().focus().setBold().setColor("brown").insertContent(item.name+" ").unsetColor().unsetBold().run()
//             },
//             post_process(){

//             },
//             async print () {
//               await this.$htmlToPaper("editor");
//             },
//         },
//         created(){
//             if (this.elaboration.elaborations_texts){
//                 this.text=this.elaboration.elaborations_texts.text
//             }

//             this.editor = new Editor({
//                 content: this.text,
//                 extensions: [
//                     StarterKit, Color,TextStyle
//                 ],
//                 onUpdate: ({ editor }) => {
//                     this.html_code=editor.getHTML()
//                 },
//             })
//         },
//         beforeDestroy() {
//             this.editor.destroy()
//         },
//     }
</script>
