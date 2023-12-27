<template>
    <div class="ma-4">
        <h1 class="mb-4">{{ $t(`Curiosities`) }}</h1>


  <div v-for="(item,index) in curiosities" :key="index" >
      <table class="my-4">
          <tr>
              <td ><v-img :width="50" src="@/assets/curiosity.png" height="40px" contain ></v-img></td>
              <td>
                  <tr><td  class="font-weight-bold">{{item.question}}</td></tr>
                  <tr><td>{{item.answer}}</td></tr>
              </td>
          </tr>
      </table><v-divider></v-divider>
    {{ item.mensaje }}
  </div>
    </div>
</template>

<script>
    import axios from 'axios'
import { useStore } from '@/store.js'
    export default {
        data(){
            return {
                curiosities:[],
            }
        },        
        methods:{
        useStore,
            update(){
                axios.get(`${this.useStore().apiroot}/curiosities/`, this.myheaders())
                .then((response) => {
                    this.curiosities=response.data
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
        },
        mounted(){
            this.update()
        }
    }
</script>