<!--
    Returns a js object with base64 image, mame and jsimage

    Can set RulesString to component to set required

    This is VUE-3 version
-->

<template>

    <div>
        <v-container class="d-flex">
            <v-row class="flex-nowrap"  align-self="center">
                <v-col align-self="center"><v-text-field :readonly="text_readonly"  @paste="pasteFunction" v-model="text" outlined prepend-icon="mdi-image" append-outer-icon="mdi-backspace"  @click:append-outer="on_text_backspace"  autofocus :placeholder="$t('Press Ctrl-V to paste an image')" :label="$t('Press Ctrl-V to paste an image')" :rules="$attrs.rules"></v-text-field></v-col>
                <v-col class="flex-grow-0" >
                    <v-card outlined >
                        <v-img  contain  :width="height" :height="height" :src="new_image.jsimage"></v-img>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>

</template>

<script>
    export default {
        data () {
            return {
                new_image:this.empty_image(),
                text:"",
                text_readonly:false,
            }
        },
        props: {
            modelValue:{ //Can be an object (empty_image) or null
                required: true,
                default:null,
            },
            height: { // Persons merge
                required: false,
                default: 200,
            },
        },
        methods:{
            empty_image(){
                return {
                    image: null,
                    mime:null,
                    jsimage:null, //String with mime
                }
            },
            on_text_backspace(){
                this.text=""
                this.text_readonly=false
                this.new_image=this.empty_image()
            },
            async pasteFunction(pasteEvent, callback){

                if(pasteEvent.clipboardData == false){
                    if(typeof(callback) == "function"){
                        callback(undefined);
                    }
                }

                var items = pasteEvent.clipboardData.items

                if(items == undefined){
                    if(typeof(callback) == "function"){
                        callback(undefined)
                    }
                }
                for (var i = 0; i < items.length; i++) {
                    
                    if (items[i].type.indexOf("image") == -1) continue
                    var blob = items[i].getAsFile()
                    this.new_image= await this.addImage(blob)
                    this.text=this.$t("[Image pasted]")
                    this.text_readonly=true
                    this.$emit('update:modelValue',this.new_image)
                }
            },
            addImage(file){
                return new Promise((resolve, reject) => {
                    var reader = new FileReader();

                    reader.onload = function() {
                        const result=reader.result
                        var r={
                            jsimage: result,
                            image: result.split(",")[1],
                            mime: result.split(";base64,")[0].split(":")[1],
                        }
                        return resolve(r)

                    }
                    reader.onerror=function(error){
                        return reject(error)
                    }

                    reader.readAsDataURL(file)
                })

            },
        },
        created(){
            if (this.modelValue==null){
                this.new_image=this.empty_image()
            } else {
                this.new_image=this.modelValue
            }
        }
    }
</script>
