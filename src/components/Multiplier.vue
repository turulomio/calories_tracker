<template>
    <div> 
        <v-select :readonly="readonly" :items="items" v-model="newvalue" :label="$t('Select a multiplier')"></v-select>
    </div>
</template>
<script>
    export default {    
        props: {
            modelValue: {
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
                    { title: "x1", value:1},
                    { title: "x2", value:2},
                    { title: "x3", value:3},
                    { title: "x4", value:4},
                    { title: "x5", value:5},
                    { title: "x6", value:6},
                    { title: "x7", value:7},
                    { title: "x8", value:8},
                    { title: "x9", value:9},
                    { title: "x10", value:10},
                    { title: "x11", value:11},
                    { title: "x12", value:12},
                    { title: "x13", value:13},
                    { title: "x14", value:14},
                    { title: "x15", value:15},
                    { title: "x16", value:16},
                    { title: "x17", value:17},
                    { title: "x18", value:18},
                    { title: "x19", value:19},
                    { title: "x20", value:20},
                ],
                newvalue: null,
            }
        },
        watch:{
            newvalue(new_val){
                this.$emit('update:modelValue', new_val)

            }
        },
        methods: {
        },
        mounted(){
            this.newvalue=this.modelValue
        }
    }
</script>
