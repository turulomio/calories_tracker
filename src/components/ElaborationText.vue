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
                mode:"C",
            }
        },
        methods: {
            on_btn_save_click(){ 
                var elaboration_text={
                    elaboration: this.elaboration.url,
                    text: this.text
                }
                if (this.mode=="C"){
                    axios.post(`${this.$store.state.apiroot}/api/elaborations_texts/`, elaboration_text,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
                if (this.mode=="U"){
                    axios.put(`${this.$store.state.apiroot}/api/elaborations_texts/${this.elaboration.id}/`, elaboration_text,  this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    })
                }
            }
        },
        created(){
            this.mode="C"
            if (this.elaboration.text){
                this.text=this.elaboration.text
                this.mode="U"
            }
            console.log(this.text)
        }
    }
</script>

