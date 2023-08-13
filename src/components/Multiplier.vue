<template>
    <div> 
        <v-select :readonly="readonly" :items="items" v-model="newvalue" :label="$t('Select a multiplier')" @change="on_change()"></v-select>
    </div>
</template>
<script>
    export default {    
        props: {
            value: {
                required: true,
            },
            readonly: {
                required: false,
                default: false,
            },
        },
        data: function(){
            return {
                items:[
                    { text: "x1", value:1},
                    { text: "x2", value:2},
                    { text: "x3", value:3},
                    { text: "x4", value:4},
                    { text: "x5", value:5},
                    { text: "x6", value:6},
                    { text: "x7", value:7},
                    { text: "x8", value:8},
                    { text: "x9", value:9},
                    { text: "x10", value:10},
                ],
                newvalue: null,
            }
        },

        methods: {
            on_change(){
                this.$emit('input',this.newvalue)
            }

        },
        mounted(){
            this.newvalue=this.value
        }
    }
</script>
