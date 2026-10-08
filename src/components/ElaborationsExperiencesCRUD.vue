<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-2">
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <MyDateTimePicker :readonly="mode=='D'" v-model="new_experience.datetime" :label="$t('Set date and time')"></MyDateTimePicker>
                <v-textarea :readonly="mode=='D'" v-model="new_experience.experience" :label="$t('Set your experience')" :placeholder="$t('Set your experience')" :rules="RulesString(2000,false)" counter="2000"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptDialog()">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { RulesString } from 'vuetify_rules'
import MyDateTimePicker from './reusing/MyDateTimePicker.vue'
import { myheaders, parseResponseError } from '@/functions'
import { useStore } from '@/store.js'

const { t } = useI18n()
const store = useStore()

const props = defineProps({
    experience: { 
        type: Object,
        required: true,
    },
    mode: { // C D U
        type: String,
        required: true,
    },
})

const emit = defineEmits(['cruded'])

const form = ref(null)
const form_valid = ref(false)
const new_experience = ref(Object.assign({}, props.experience))
if (props.mode == 'C' && !new_experience.value.experience) {
    new_experience.value.experience = t('Today I made this recipe')
}

function button(){
    if (props.mode == "C") return t('Add')
    if (props.mode == "U") return t('Update')
    if (props.mode == "D") return t('Delete')
}

function title(){
    if (props.mode == "C") return t('Add a new experience')
    if (props.mode == "U") return t('Update this experience')
    if (props.mode == "D") return t('Delete this experience')
}

function acceptDialog(){        
    if (form_valid.value != true) {
        form.value.validate()
        return
    }
    if (props.mode == "C"){
        axios.post(`${store.apiroot}/api/elaborations_experiences/`, new_experience.value, myheaders())
        .then(() => {
            emit("cruded")
        }, (error) => {
            parseResponseError(error)
        })
    }
    if (props.mode == "U"){
        axios.put(new_experience.value.url, new_experience.value, myheaders())
        .then(() => {
            emit("cruded")
        }, (error) => {
            parseResponseError(error)
        })
    }
    if (props.mode == "D"){             
        const r = confirm(t("Do you want to delete this experience?"))
        if (r == true) {
            axios.delete(new_experience.value.url, myheaders())
            .then(() => {
                emit("cruded")
            }, (error) => {
                parseResponseError(error)
            })
        }
    }
}
</script>


