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
        apiroot: import.meta.env.VITE_DJANGO_CALORIES_TRACKER_URL,
        catalog_manager: false,
        activities: new Map(),
        additive_risks: new Map(),
        additives: new Map(),
        companies: new Map(),
        food_types: new Map(),
        formats: new Map(),
        pots: new Map(),
        products: new Map(),
        elaborated_products: new Map(),
        weight_wishes: new Map(),
        recipes_links_types: new Map(),
        stir_types: new Map(),
        temperatures_types: new Map(),
        steps: new Map(),
        recipes_categories: new Map(),
        measures_types: new Map(),
        settings: [],
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
    updateActivities() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/activities/`, myheaders())
        .then((response)=>{
          this.activities.clear()
          response.data.forEach(o=>{
            this.activities.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} activities in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateAdditiveRisks() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/additive_risks/`, myheaders())
        .then((response)=>{
          this.additive_risks.clear()
          response.data.forEach(o=>{
            this.additive_risks.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} additive_risks in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
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
        this.updateActivities(),
        this.updateAdditiveRisks(),
        this.updateProducts(),
      ])
    },
  }
})
