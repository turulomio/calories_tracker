import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {sortObjectsArray, my_round} from './functions.js'
Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token:null,
        logged:false,
        version: "0.1.0",
        versiondate: new Date(2022, 1, 20, 20, 46),
        apiroot: process.env.VUE_APP_DJANGO_CALORIESTRACKER_URL,
        publicPath: process.env.VUE_APP_PUBLIC_PATH,
        settings:[],
        catalog_manager: false,
        activities: [],
        additive_risks: [],
        additives:[],
        companies: [],
        food_types:[],
        formats: [],
        products: [],
        elaborated_products: [],
        weight_wishes: [],
    },    
    getters:{
        getObjectByUrl:(state) => (catalog,url,default_=null) => {
            var r=state[catalog].find(o => o.url==url)
            if (r==null){
                return default_
            } else {
                return r
            }
        },
        getObjectById:(state) => (catalog,id,default_=null) => {
            var r=state[catalog].find(o => o.id==id)
            if (r==null){
                return default_
            } else {
                return r
            }
        },
        getObjectPropertyByUrl:(state,getters) => (catalog,url,property,default_=null) => {
            var r=getters.getObjectByUrl(catalog,url)
            if (r==null){
                return default_
            } else {
                return r[property]
            }
        },
        getObjectPropertyById:(state,getters) => (catalog,id,property,default_=null) => {
            var r=getters.getObjectById(catalog,id)
            if (r==null){
                return default_
            } else {
                return r[property]
            }
        },
        currency_generic_string:(state,getters) => (num, currency, locale, decimals=2)=>{
            if (num ==null){
                return `- - - ${getters.getCurrencyPropertyByCode(currency,"symbol_native")}`
            } else {
                return `${my_round(num,decimals).toLocaleString(locale, { minimumFractionDigits: decimals,  })} ${getters.getCurrencyPropertyByCode(currency,"symbol_native")}`
            }
        },
        
        currency_generic_html:(state,getters) =>(num, currency, locale, decimals=2)=>{
            if (num<0){
                return `<span class='vuered'>${getters.currency_generic_string(num, currency, locale, decimals)}</span>`
            } else {
                return getters.currency_generic_string(num, currency, locale, decimals)
            }
        }
    },
    mutations: { // Only sincronous changes data
        updateActivities: (state, payload) =>{
            state.activities=payload
        },
        updateAdditiveRisks: (state, payload) =>{
            state.additive_risks=payload
        },
        updateAdditives: (state, payload) =>{
            state.additives=payload
        },
        updateCatalogManager: (state, payload) =>{
            state.catalog_manager=payload
        },
        updateCompanies: (state, payload) =>{
            state.companies=payload
        },
        updateFoodTypes: (state, payload) =>{
            state.food_types=payload
        },
        updateFormats: (state, payload) =>{
            state.formats=payload
        },
        updateProducts: (state, payload) =>{
            state.products=payload
        },
        updateElaboratedProducts: (state, payload) =>{
            state.elaborated_products=payload
        },
        updateWeightWishes: (state, payload) =>{
            state.weight_wishes=payload
        },
        updateSettings: (state, payload) =>{
            state.settings=payload
        },


    },
    actions: {// Can be asynchronous. Fetch data

        getAll(context){
            return Promise.all([
                context.dispatch("getActivities"),
                context.dispatch("getAdditiveRisks"),
                context.dispatch("getAdditives"),
                context.dispatch("getCatalogManager"),
                context.dispatch("getCompanies"),
                context.dispatch("getFoodTypes"),
                context.dispatch("getFormats"),
                context.dispatch("getElaboratedProducts"),
                context.dispatch("getProducts"),
                context.dispatch("getSettings"),
                context.dispatch("getWeightWishes")
            ])
        },
        getActivities(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/activities/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateActivities', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} activities in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getAdditiveRisks(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/additive_risks/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateAdditiveRisks', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} additive risks in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getAdditives(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/additives/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateAdditives', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} additives in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getCatalogManager(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/catalog_manager/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateCatalogManager', response.data)
                console.log(`Updated catalog manager in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getCompanies(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/companies/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateCompanies', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} companies in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getFoodTypes(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/food_types/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateFoodTypes', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} food types in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getFormats(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/formats/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateFormats', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} formats in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getProducts(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/products/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateProducts', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} products in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getElaboratedProducts(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/elaborated_products/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateElaboratedProducts', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} elaborated products in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getWeightWishes(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/weight_wishes/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateWeightWishes', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} weight wishes in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getSettings(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/settings/`, store.$app.myheaders())
            .then((response) => {
                context.commit("updateSettings", response.data)
                console.log(`Updated settings in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },

    }
})
