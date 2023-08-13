import { createRouter, createWebHistory } from 'vue-router'


import About from './components/About'
import Home from './components/Home'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import Biometrics from './components/Biometrics.vue'
import CatalogTables from './components/CatalogTables.vue'
import Companies from './components/Companies.vue'
import Curiosities from './components/Curiosities.vue'
import Meals from './components/Meals.vue'
import MealsRanking from './components/MealsRanking.vue'
import Pots from './components/Pots.vue'
import Products from './components/Products.vue'
import ProductsDataTransfer from './components/ProductsDataTransfer.vue'
import Recipes from './components/Recipes.vue'



export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: `${import.meta.env.BASE_URL}/`, redirect: `${import.meta.env.BASE_URL}/home/` }, 
    { path: `${import.meta.env.BASE_URL}/about/`, name: 'about', component: About },
    { path: `${import.meta.env.BASE_URL}/biometrics/`, name: 'biometrics', component: Biometrics },
    { path: `${import.meta.env.BASE_URL}/catalog_tables/`, name: 'catalog_tables', component: CatalogTables },
    { path: `${import.meta.env.BASE_URL}/companies/`, name: 'companies', component: Companies },
    { path: `${import.meta.env.BASE_URL}/curiosities/`, name: 'curiosities', component: Curiosities },
    { path: `${import.meta.env.BASE_URL}/meals/`, name: 'meals', component: Meals },
    { path: `${import.meta.env.BASE_URL}/meals/ranking/`, name: 'meals_ranking', component: MealsRanking },
    { path: `${import.meta.env.BASE_URL}/pots/`, name: 'pots', component: Pots },
    { path: `${import.meta.env.BASE_URL}/products/`, name: 'products', component: Products },
    { path: `${import.meta.env.BASE_URL}/products/datatransfer/`, name: 'products_datatransfer', component: ProductsDataTransfer },
    { path: `${import.meta.env.BASE_URL}/recipes/`, name: 'recipes', component: Recipes },
    { path: `${import.meta.env.BASE_URL}/home/`, name: 'home', component: Home },
    { path: `${import.meta.env.BASE_URL}/settings/`, name: 'settings', component: Settings },
    { path: `${import.meta.env.BASE_URL}/statistics/`, name: 'statistics', component: Statistics },
  ]
})
