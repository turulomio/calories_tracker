import { defineStore } from 'pinia'
import axios from 'axios'
import { myheaders, capitalizeFirstLetter} from './my_commons.js'


export const useStore = defineStore('global', {
  state: () => {
    return { 
        token:null,
        logged:false,
        count:0,
        version: "0.0.1",
        versiondate: new Date(2023, 2, 5, 7, 5),
        apiroot: import.meta.env.VITE_DJANGO_MONEYMONEY_URL,
        publicPath: import.meta.env.VUE_APP_PUBLIC_PATH,
        catalog_manager: false,
        products: new Map(),
        profile: null,
    }
  },

  actions: {
    setToken(token){
      this.token=token
      if (this.token){
        this.logged=true
      } else {
        this.logged=false
      }
    },
    updateProducts() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/products/`, myheaders())
        .then((response)=>{
          this.products.clear()
          response.data.forEach(o=>{
            this.products.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} products in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },

    updateAll(){
      return Promise.all([
        this.updateProducts(),
      ])
    },
  }
})
