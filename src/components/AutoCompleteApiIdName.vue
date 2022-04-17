<template>
    <div>
        <v-autocomplete
            v-if="returnobject==false"
            v-model="localValue"
            :items="entries"
            :loading="isLoading"
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
            :loading="isLoading"
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
                // Must be defined as `${this.$store.state.apiroot}/api/find/`
                // This path can get search=name, and id=id
                required: true
            },
            id:{
                default: "id"
            },
            name:{
                default: "name"
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
                isLoading: false,
                search: null,
                localValue: null
            }
        },
        watch: {
            search (val) {
                // Items have already been loaded
                if (this.search ==null || this.search==""|| this.search.length<this.minchars) return

                // Items have already been requested
                if (this.isLoading) return

                this.isLoading = true

                axios.get(`${this.url}?search=${val}`, this.myheaders())
                .then((response) => {
                    this.entries=response.data
                    this.isLoading = false
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
                    axios.get(`${this.url}/${force}/`, this.myheaders())
                    .then((response) => {
                        console.log(response.data)
                        this.entries=response.data
                        this.localValue=response.data.id
                        this.isLoading = false
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
