<template>
    <div>
        <mavon-editor v-model="text" language="en" :key="key" >
            <template slot="right-toolbar-after">
                <button
                    type="button"
                    @click="on_btn_save_click"
                    class="op-icon fa fa-mavon-align-left"
                    aria-hidden="true"
                    :title="$t('Save')"
                ></button>
            </template>
        </mavon-editor>
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
            }
        },
        methods: {
            on_btn_save_click(){ 
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
                        // this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            },
        },
        created(){
            if (this.elaboration.elaborations_texts){
                this.text=this.elaboration.elaborations_texts.text
            }
            console.log(this.elaboration)
            console.log(this.text)
        }
    }
</script>

