import { defineStore } from 'pinia'
import axios from 'axios'
import { myheaders} from './functions.js'


export const useStore = defineStore('global', {
  state: () => {
    return { 
        token:null,
        logged:false,
        count:0,
        version: "1.0.0",
        versiondate: new Date(2023, 7, 6, 7, 5), //Month is one less
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
        recipes_categories: new Map(),
        measures_types: new Map(),
        settings: null,
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
    updateCatalogManager(){
      var start=new Date()
      return axios.get(`${this.apiroot}/catalog_manager/`, myheaders())
      .then((response) => {
          this.catalog_manager=response.data
          console.log(`Updated catalog manager in ${new Date()-start} ms`)
      }, (error) => {
          this.$app.parseResponseError(error)
      });
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
    updateAdditives() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/additives/`, myheaders())
        .then((response)=>{
          this.additives.clear()
          response.data.forEach(o=>{
            this.additives.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} additives in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateCompanies() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/companies/`, myheaders())
        .then((response)=>{
          this.companies.clear()
          response.data.forEach(o=>{
            this.companies.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} companies in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateFoodTypes() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/food_types/`, myheaders())
        .then((response)=>{
          this.food_types.clear()
          response.data.forEach(o=>{
            this.food_types.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} food_types in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateFormats() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/formats/`, myheaders())
        .then((response)=>{
          this.formats.clear()
          response.data.forEach(o=>{
            this.formats.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} formats in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updatePots() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/pots/`, myheaders())
        .then((response)=>{
          this.pots.clear()
          response.data.forEach(o=>{
            this.pots.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} pots in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateElaboratedProducts() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/elaborated_products/`, myheaders())
        .then((response)=>{
          this.elaborated_products.clear()
          response.data.forEach(o=>{
            this.elaborated_products.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} elaborated_products in ${new Date()-start} ms`)
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
    updateWeightWishes() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/weight_wishes/`, myheaders())
        .then((response)=>{
          this.weight_wishes.clear()
          response.data.forEach(o=>{
            this.weight_wishes.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} weight_wishes in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateRecipesLinksTypes() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/recipes_links_types/`, myheaders())
        .then((response)=>{
          this.recipes_links_types.clear()
          response.data.forEach(o=>{
            this.recipes_links_types.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} recipes_links_types in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateRecipesCategories() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/recipes_categories/`, myheaders())
        .then((response)=>{
          this.recipes_categories.clear()
          response.data.forEach(o=>{
            this.recipes_categories.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} recipes_categories in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateMeasuresTypes() {
        var start=new Date()
        return axios.get(`${this.apiroot}/api/measures_types/`, myheaders())
        .then((response)=>{
          this.measures_types.clear()
          response.data.forEach(o=>{
            this.measures_types.set(o.url, o)
          })  
          console.log(`Updated ${response.data.length} measures_types in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },
    updateSettings() {
        var start=new Date()
        return axios.get(`${this.apiroot}/settings/`, myheaders())
        .then((response)=>{
          this.settings=response.data
          console.log(`Updated settings in ${new Date()-start} ms`)
        }, (error) => {
          console.log(error)
      });
    },

    updateAll(){
      return Promise.all([
        this.updateActivities(),
        this.updateAdditiveRisks(),
        this.updateAdditives(),
        this.updateCatalogManager(),
        this.updateCompanies(),
        this.updateElaboratedProducts(),
        this.updateFoodTypes(),
        this.updateFormats(),
        this.updatePots(),
        this.updateProducts(),
        this.updateWeightWishes(),
        this.updateRecipesLinksTypes(),
        this.updateSettings(),
        this.updateRecipesCategories(),
        this.updateMeasuresTypes(),
      ])
    },
  }
})
