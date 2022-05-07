import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import i18n from './i18n'
import VueRouter from 'vue-router';
import {store} from './store.js'

import "echarts";
import ECharts from 'vue-echarts'
Vue.component('v-chart', ECharts)

Vue.use(VueRouter);


import About from './components/about'
import Home from './components/Home'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import Biometrics from './components/Biometrics.vue'
import Companies from './components/Companies.vue'
import Meals from './components/Meals.vue'
import Products from './components/Products.vue'
import MaintenanceCatalogsUpdate from './components/MaintenanceCatalogsUpdate.vue'



const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/`, redirect: `${process.env.VUE_APP_PUBLIC_PATH}/home/` }, 
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/about/`, name: 'about', component: About },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/biometrics/`, name: 'biometrics', component: Biometrics },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/companies/`, name: 'companies', component: Companies },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/meals/`, name: 'meals', component: Meals },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/products/`, name: 'products', component: Products },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/home/`, name: 'home', component: Home },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/settings/`, name: 'settings', component: Settings },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/statistics/`, name: 'statistics', component: Statistics },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/maintenance/catalogs/update/`, name: 'maintenance_catalogs_update', component: MaintenanceCatalogsUpdate },
  ]
});

// MIXIN GLOBAL
import {
    localtime,
    myheaders,
    myheaders_noauth,
    myheaders_formdata,
    parseResponse,
    parseResponseError,
    listobjects_sum,
    my_round
} from './components/reusing/my_commons.js'
import {
    html_fullname,
} from './functions.js'
import {RulesFloat,RulesDate,RulesDatetime,RulesInteger,RulesString,RulesSelection, RulesEmail } from './components/reusing/rules.js'
Vue.mixin({
    data: function () {
        return {
        }
    },
    methods: {
        html_fullname,
        localtime,
        myheaders,
        myheaders_formdata,
        myheaders_noauth,
        my_round,
        parseResponse,
        parseResponseError,
        listobjects_sum,
        RulesDate,
        RulesDatetime,
        RulesEmail,
        RulesFloat,
        RulesInteger,
        RulesString,
        RulesSelection,
    }
})

const app=new Vue({
    i18n,
    store:store,
    router,
    vuetify,
    render: h => h(App)
})
store.$app = app
app.$mount('#app')




