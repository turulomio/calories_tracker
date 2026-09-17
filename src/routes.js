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
import PillOrganizer from './components/PillOrganizer.vue'
import Pots from './components/Pots.vue'
import Products from './components/Products.vue'
import ProductsDataTransfer from './components/ProductsDataTransfer.vue'
import Recipes from './components/Recipes.vue'



export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '', redirect: { name: 'home' } },
    { path: '/', redirect: { name: 'home' } },
    { path: '/about/', name: 'about', component: About },
    { path: '/biometrics/', name: 'biometrics', component: Biometrics },
    { path: '/catalog_tables/', name: 'catalog_tables', component: CatalogTables },
    { path: '/companies/', name: 'companies', component: Companies },
    { path: '/curiosities/', name: 'curiosities', component: Curiosities },
    { path: '/meals/', name: 'meals', component: Meals },
    { path: '/meals/ranking/', name: 'meals_ranking', component: MealsRanking },
    { path: '/pill_organizer/', name: 'pill_organizer', component: PillOrganizer },
    { path: '/pots/', name: 'pots', component: Pots },
    { path: '/products/', name: 'products', component: Products },
    { path: '/products/datatransfer/', name: 'products_datatransfer', component: ProductsDataTransfer },
    { path: '/recipes/', name: 'recipes', component: Recipes },
    { path: '/home/', name: 'home', component: Home },
    { path: '/settings/', name: 'settings', component: Settings },
    { path: '/statistics/', name: 'statistics', component: Statistics },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
  ]
})
