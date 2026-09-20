<template>
    <div>    
        <h1>{{ title() }}</h1>           
        <v-card class="pa-8 mt-4">
            <v-form ref="form" v-model="form_valid" lazy-validation>                
                <MyDateTimePicker :readonly="mode=='D'" v-model="new_recipes_links.datetime" :label="$t('Set date and time')"></MyDateTimePicker>
                <v-text-field :readonly="mode=='D'" v-model="new_recipes_links.description" :label="$t('Set description')" :placeholder="$t('Set description')" :rules="RulesString(200,true)" counter="200"/>
                <v-autocomplete :readonly="mode=='D'" :items="getArrayFromMap(store.recipes_links_types)" v-model="new_recipes_links.type" :label="$t('Select type')" item-title="localname" item-value="url" :rules="RulesSelection(true)" />
                <v-text-field  v-if="show_link" :readonly="mode=='D'" v-model="new_recipes_links.link" :label="$t('Set an Internet link')" :placeholder="$t('Set an Internet link')" :rules="RulesString(2000,false)" counter="2000" autofocus/>
                <v-file-input v-if="show_fileinput" show-size v-model="document" :label="$t('Select a document')" @change="on_fileinput_change" />
                <PasteImage v-if="show_paste" v-model="pasted_image" :rules="RulesSelection(true)" :key="key"/>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="['C','U','D'].includes(mode)" @click="acceptDialog()">{{ button() }}</v-btn> 
                <v-btn color="error" @click="emit('cruded')" >{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import PasteImage from './PasteImage.vue'
import MyDateTimePicker from './reusing/MyDateTimePicker.vue'
import { RulesSelection, RulesString } from 'vuetify_rules'
import { id_from_hyperlinked_url, getArrayFromMap, myheaders, parseResponseError } from '@/functions'
import { useStore } from '@/store.js'

const { t } = useI18n()
const store = useStore()

const props = defineProps({
    recipes_links: {
        type: Object,
        required: true,
    },
    mode: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['cruded'])

const form = ref(null)
const form_valid = ref(false)
const new_recipes_links = ref(Object.assign({}, props.recipes_links))
const key = ref(0)
const document = ref(null)
const pasted_image = ref(null)
const show_fileinput = ref(false)
const show_link = ref(false)
const show_paste = ref(false)

function button(){
    if (props.mode === 'C') return t('Add')
    if (props.mode === 'U') return t('Update')
    if (props.mode === 'D') return t('Delete')
}

function title(){
    if (props.mode === 'C') return t('Add a new recipe link')
    if (props.mode === 'R') return t('View this recipe link')
    if (props.mode === 'U') return t('Update this recipe link')
    if (props.mode === 'D') return t('Delete this recipe link')
}

function readDocument(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function() {
            const result = reader.result
            const r = {
                jsdoc: result,
                doc: result.split(',')[1],
                mime: result.split(';base64,')[0].split(':')[1],
            }
            return resolve(r)
        }
        reader.onerror = function(error){
            return reject(error)
        }
        reader.readAsDataURL(file)
    })
}

function on_fileinput_change(){
    const id = id_from_hyperlinked_url(new_recipes_links.value.type)
    if ([2, 7].includes(id)){
        if (document.value){
            show_paste.value = false
        } else {
            show_paste.value = true
        }
    }
}

function reload_ui(){
    const id = id_from_hyperlinked_url(new_recipes_links.value.type)
    show_fileinput.value = false
    show_link.value = false
    show_paste.value = false
    if ([2, 7].includes(id)){ // Images
        show_fileinput.value = true
        show_paste.value = true
    } else if ([4, 5, 6].includes(id)) { // Documentos con contenido
        show_fileinput.value = true
    } else { // Documentos con enlace
        show_link.value = true
    }
    if (props.mode === 'D') show_paste.value = false
    if (new_recipes_links.value.type && store.recipes_links_types.has(new_recipes_links.value.type)) {
        new_recipes_links.value.description = store.recipes_links_types.get(new_recipes_links.value.type).localname
    }
    key.value = key.value + 1
}

watch(() => new_recipes_links.value?.type, () => {
    reload_ui()
})

async function acceptDialog(){       
    if (form_valid.value !== true) {
        form.value.validate()
        return
    }

    if (document.value){
        const readed = await readDocument(document.value)
        new_recipes_links.value.mime = readed.mime
        new_recipes_links.value.content = readed.doc
    }
    if (pasted_image.value){
        new_recipes_links.value.mime = pasted_image.value.mime
        new_recipes_links.value.content = pasted_image.value.image
    }

    if (props.mode === 'C'){
        axios.post(`${store.apiroot}/api/recipes_links/`, new_recipes_links.value, myheaders())
        .then(() => {
            emit('cruded')
        }, (error) => {
            parseResponseError(error)
        })
    }
    if (props.mode === 'U'){
        axios.put(new_recipes_links.value.url, new_recipes_links.value, myheaders())
        .then(() => {
            emit('cruded')
        }, (error) => {
            parseResponseError(error)
        })
    }
    if (props.mode === 'D'){             
        const r = confirm(t('Do you want to delete this recipe link?'))
        if (r == true) {
            axios.delete(new_recipes_links.value.url, myheaders())
            .then(() => {
                emit('cruded')
            }, (error) => {
                parseResponseError(error)
            })
        }
    }
}

reload_ui()
</script>
