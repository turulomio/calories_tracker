<template>
    <div v-if="thumbnailSrc" class="d-inline-block">
        <v-img :src="thumbnailSrc" :width="size" :height="size" cover class="mini-image-thumbnail rounded elevation-1" @click.stop="openFullscreen">
            <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate size="16" width="2" color="primary" />
                </div>
            </template>
        </v-img>

        <v-dialog v-model="dialog" width="auto" max-width="95vw" max-height="95vh">
            <v-card class="pa-2 text-center position-relative bg-surface rounded-lg" flat>
                <v-btn icon="mdi-close" size="small" variant="text" color="grey-darken-1" class="position-absolute" style="top: 8px; right: 8px; z-index: 10;" @click="dialog = false" />
                <div class="d-flex align-center justify-center" style="min-width: 250px; min-height: 250px;">
                    <v-progress-circular v-if="loading" indeterminate color="primary" size="48" />
                    <v-img v-else-if="fullImage" :src="fullImage" max-height="85vh" max-width="90vw" class="mx-auto rounded" contain @click="dialog = false" />
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { myheaders, parseResponseError } from '@/functions'

const props = defineProps({
    thumbnail: {
        type: String,
        default: null,
    },
    src: {
        type: String,
        default: null,
    },
    contentUrl: {
        type: String,
        default: null,
    },
    urlContent: {
        type: String,
        default: null,
    },
    size: {
        type: [Number, String],
        default: 50,
    },
})

const dialog = ref(false)
const loading = ref(false)
const fullImage = ref(null)

const thumbnailSrc = computed(() => props.thumbnail || props.src)
const targetContentUrl = computed(() => props.contentUrl || props.urlContent)

function openFullscreen() {
    dialog.value = true
    if (targetContentUrl.value) {
        if (!fullImage.value) {
            loading.value = true
            axios.get(targetContentUrl.value, myheaders())
                .then((response) => {
                    fullImage.value = response.data
                })
                .catch((error) => {
                    parseResponseError(error)
                    fullImage.value = thumbnailSrc.value
                })
                .finally(() => {
                    loading.value = false
                })
        }
    } else {
        fullImage.value = thumbnailSrc.value
    }
}
</script>

<style scoped>
.mini-image-thumbnail {
    cursor: pointer;
    transition: transform 0.15s ease-in-out, opacity 0.15s ease-in-out;
}
.mini-image-thumbnail:hover {
    transform: scale(1.06);
    opacity: 0.9;
}
</style>
