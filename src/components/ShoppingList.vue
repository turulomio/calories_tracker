<template>
    <div>    
        <h1>{{ $t("Shopping list") }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-autocomplete :items="elaborations" v-model="elaborations_selected" item-text="fullname" item-value="url" :label="$t('Select a product')" multiple chips />
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Get shopping list") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        data(){ 
            return{
                form_valid:false,
                elaborations:[],
                elaborations_selected:[]
            }
        },
        methods: {
            acceptDialog(){             
                if( this.$refs.form.validate()==false) return
                axios.post(`${this.store().apiroot}/shopping_list/`, {elaborations: this.elaborations_selected}, this.myheaders())
                .then((response) => {
                    var link = window.document.createElement('a')
                    link.href = `data:${response.data.data.mime};base64,${response.data.data.data}`
                    link.download = response.data.data.filename
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        created(){
            axios.get(`${this.store().apiroot}/api/elaborations/`, this.myheaders())
            .then((response) => {
                this.elaborations=response.data
            }, (error) => {
                this.parseResponseError(error)
            })
        }
    }
</script>

