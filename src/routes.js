import { createRouter, createWebHistory } from 'vue-router'


import About from './components/About'
import Home from './components/Home'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: `${import.meta.env.BASE_URL}/`, redirect: `${import.meta.env.BASE_URL}/about/` }, 
    { path: `${import.meta.env.BASE_URL}/about/`, name: 'about', component: About },
    { path: `${import.meta.env.BASE_URL}/home/`, name: 'home', component: Home },
  ]
})
