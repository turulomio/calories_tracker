/* 
    This Component needs to use hyperlinked drf models
    Must be defined as `${this.useStore().apiroot}/api/id/` for
    This path can get search=name, url with returnobject=false or {url:} with returnobject with try
*/


<template>
    <div>
        <v-autocomplete
            v-if="returnobject==false"
            v-model="new_value"
            :items="entries"
            :loading="loading"
            @update:search="on_update_search"
            item-title="name"
            item-value="url"
            no-data-text="You must select a item"
            outlined
            persistent-hint
            :label="label"
            placeholder="Start typing to Search"
            prepend-icon="mdi-database-search"
            :multiple="multiple"
            :chips="multiple"
        ></v-autocomplete>
        <v-autocomplete
            v-if="returnobject==true"
            v-model="new_value"
            :items="entries"
            :loading="loading"
            @update:search="on_update_search"
            item-title="name"
            return-object
            no-data-text="You must select a item"
            outlined
            persistent-hint
            :label="label"
            placeholder="Start typing to Search"
            prepend-icon="mdi-database-search"
            :multiple="multiple"
            :chips="multiple"
        ></v-autocomplete>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from '@/store.js'
    export default {    
        props: {
            modelValue: {
                required: true
            },
            url:{
                required: true
            },
            label:{
                default: "Select an item"
            },
            minchars:{
                type: Number,
                default: 2
            },
            returnobject:{
                type: Boolean,
                required: false,
                default: false,
            },
            paginated:{ // If paginated result.data.results
                type: Boolean,
                required: false,
                default: false,
            },
            multiple:{ // If paginated result.data.results
                type: Boolean,
                required: false,
                default: false,
            },
        },
        data(){ 
            return{
                entries: [],
                loading: false,
                new_value: null
            }
        },
        watch: {
            new_value (newValue) {
                this.$emit('update:modelValue', newValue)
            },
        },
        methods: {
            useStore,
            on_update_search(search) {
                // Items have already been loaded
                if (search==null || search==""|| search.length<this.minchars) return

                // Items have already been requested
                if (this.loading) return

                this.loading = true

                axios.get(`${this.url}?search=${search}`, this.myheaders())
                .then((response) => {
                    if (this.paginated){
                        this.entries=response.data.results
                    } else {
                        this.entries=response.data
                    }
                    this.loading = false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        mounted(){
            if (this.new_value){ // Can be url or none
                this.loading=true
                axios.get(this.new_value, this.myheaders())
                .then((response) => {
                    if (this.returnobject){
                        this.entries=[response.data]
                        this.new_value=response.data

                    } else {
                        this.entries=[response.data]
                        this.new_value=response.data.url
                    }
                    this.new_value=this.modelValue

    
                    this.loading=false
               }, (error) => {
                    this.parseResponseError(error)
                });

            }
        }
    }
</script>
