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



const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/`, redirect: `${process.env.VUE_APP_PUBLIC_PATH}/home/` }, 
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/about/`, name: 'about', component: About },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/biometrics/`, name: 'biometrics', component: Biometrics },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/companies/`, name: 'companies', component: Companies },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/home/`, name: 'home', component: Home },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/settings/`, name: 'settings', component: Settings },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/statistics/`, name: 'statistics', component: Statistics },
  ]
});

// MIXIN GLOBAL
import {
    localtime,
    myheaders,
    parseResponse,
    parseResponseError,
    listobjects_sum,
    myheaders_formdata,
    percentage_generic_html,
    percentage_generic_string, 
    zulu2date,
    date2zulu,
    my_round
} from './functions.js'
import {RulesFloat,RulesDate,RulesDatetime,RulesInteger,RulesString,RulesSelection, RulesFloatPositive, RulesFloatNegative, } from './rules.js'
Vue.mixin({
    data: function () {
        return {
        }
    },
    methods: {
        localtime,
        myheaders,
        my_round,
        myheaders_formdata,
        parseResponse,
        parseResponseError,
        zulu2date,
        date2zulu,

        listobjects_sum,
        RulesDate,
        RulesDatetime,
        RulesFloat,
        RulesInteger,
        RulesString,
        RulesSelection,
        RulesFloatPositive,
        RulesFloatNegative,


        currency_string(num, currency, decimals=2){
            return this.$store.getters.currency_generic_string(num, currency, this.$i18n.locale,decimals )
        },
        currency_html(num, currency, decimals=2){
            return this.$store.getters.currency_generic_html(num, currency, this.$i18n.locale,decimals )
        },
        percentage_string(num, decimals=2){
            return percentage_generic_string(num,this.$i18n.locale,decimals )
        },
        percentage_html(num, decimals=2){
            return percentage_generic_html(num,this.$i18n.locale,decimals )
        },
        localcurrency_string(num, decimals=2){
            return this.$store.getters.currency_generic_string(num, this.$store.state.local_currency, this.$i18n.locale,decimals )
        },
        localcurrency_html(num, decimals=2){
            return this.$store.getters.currency_generic_html(num, this.$store.state.local_currency, this.$i18n.locale,decimals )
        },


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




