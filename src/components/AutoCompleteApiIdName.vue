/* 
    This Component needs to use hyperlinked drf models
    Must be defined as `${this.$store.state.apiroot}/api/id/` for
    This path can get search=name, url with returnobject=false or {url:} with returnobject with try
*/


<template>
    <div>
        <v-autocomplete
            v-if="returnobject==false"
            v-model="localValue"
            :items="entries"
            :loading="loading"
            :search-input.sync="search"
            item-text="name"
            item-value="url"
            no-data-text="You must select a item"
            outlined
            persistent-hint
            :label="label"
            placeholder="Start typing to Search"
            prepend-icon="mdi-database-search"
        ></v-autocomplete>
        <v-autocomplete
            v-if="returnobject==true"
            v-model="localValue"
            :items="entries"
            :loading="loading"
            :search-input.sync="search"
            item-text="name"
            return-object
            no-data-text="You must select a item"
            outlined
            persistent-hint
            :label="label"
            placeholder="Start typing to Search"
            prepend-icon="mdi-database-search"
        ></v-autocomplete>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {    
        props: {
            value: {
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
            }
        },
        data(){ 
            return{
                descriptionLimit: 60,
                entries: [],
                loading: false,
                search: null,
                localValue: null
            }
        },
        watch: {
            search (val) {
                // Items have already been loaded
                if (this.search ==null || this.search==""|| this.search.length<this.minchars) return

                // Items have already been requested
                if (this.loading) return

                this.loading = true

                axios.get(`${this.url}?search=${val}`, this.myheaders())
                .then((response) => {
                    this.entries=response.data
                    this.loading = false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            localValue (newValue) {
                this.$emit('input', newValue)
            },
            value (newValue) {
                this.localValue = newValue
                if (this.returnobject){
                    console.log(newValue)
                } else {
                   console.log(`value changed to ${newValue}`)
                }
            },
        },
        methods: {
            forceValue(force){       
                if (force!=null){
                    axios.get(force, this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        if (this.returnobject){
                            this.entries=[response.data]
                            this.localValue=response.data

                        } else {
                            this.entries=[response.data]
                            this.localValue=response.data.url
                        }
                        this.loading = false
                    }, (error) => {
                        console.log(error)
                    })
                }
            },
        },
        mounted(){
            this.forceValue(this.value)
        }
    }
</script>
