import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {sortObjectsArray} from './components/reusing/my_commons.js'
Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token:null,
        logged:false,
        version: "0.2.0",
        versiondate: new Date(2022, 6, 30, 9, 49),
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
        pots: [],
        products: [],
        elaborated_products: [],
        weight_wishes: [],
        recipes_links_types: [],
        stir_types: [],
        temperatures_types: [],
        steps: [],
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
        updatePots: (state, payload) =>{
            state.pots=payload
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
        updateRecipesLinksTypes: (state, payload) =>{
            state.recipes_links_types=payload
        },
        updateSteps: (state, payload) =>{
            state.steps=payload
        },
        updateStirTypes: (state, payload) =>{
            state.stir_types=payload
        },
        updateTemperaturesTypes: (state, payload) =>{
            state.temperatures_types=payload
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
                context.dispatch("getPots"),
                context.dispatch("getProducts"),
                context.dispatch("getSettings"),
                context.dispatch("getWeightWishes"),
                context.dispatch("getSteps"),
                context.dispatch("getStirTypes"),
                context.dispatch("getRecipesLinksTypes"),
                context.dispatch("getTemperaturesTypes"),
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
        getPots(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/pots/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updatePots', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} pots in ${new Date()-start} ms`)
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

        getRecipesLinksTypes(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/recipes_links_types/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateRecipesLinksTypes', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} recipes links types in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getSteps(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/steps/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateSteps', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} steps in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getStirTypes(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/stir_types/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateStirTypes', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} stir types in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
        getTemperaturesTypes(context){
            var start=new Date()
            return axios.get(`${store.state.apiroot}/api/temperatures_types/`, store.$app.myheaders())
            .then((response) => {
                context.commit('updateTemperaturesTypes', sortObjectsArray(response.data, "name"))
                console.log(`Updated ${response.data.length} temperatures types in ${new Date()-start} ms`)
            }, (error) => {
                store.$app.parseResponseError(error)
            });
        },
    }
})
