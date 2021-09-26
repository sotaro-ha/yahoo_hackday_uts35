import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Routing from './views/Routing.vue'
import Shop1 from './views/Shop1.vue'
import Shop2 from './views/Shop2.vue'
import Shop3 from './views/Shop3.vue'
import Shop4 from './views/Shop4.vue'
import Shop5 from './views/Shop5.vue'
import Shop6 from './views/Shop6.vue'
import Shop7 from './views/Shop7.vue'
import Shop8 from './views/Shop8.vue'
import Api from './views/api.vue'
import buyPage from "./views/buyPage.vue"

Vue.use(Router)

export default new Router({

  mode: 'history',                  
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/routing',
      name: 'routing',
      component: Routing 
    },
    {
        path: '/shops/1',
        name: 'shop-1',
        component: Shop1
    },
    {
        path: '/shops/2',
        name: 'shop-2',
        component: Shop2
    },
    {
        path: '/shops/3',
        name: 'shop-3',
        component: Shop3
    },
    {
        path: '/shops/4',
        name: 'shop-4',
        component: Shop4
    },
    {
        path: '/shops/5',
        name: 'shop-5',
        component: Shop5
    },
    {
        path: '/shops/6',
        name: 'shop-6',
        component: Shop6
    },
    {
        path: '/shops/7',
        name: 'shop-7',
        component: Shop7
    },
    {
        path: '/shops/8',
        name: 'shop-8',
        component: Shop8
    },
    {
      path: '/api',
      name: 'api',
      component: Api
  },
  {
    path: '/buypage',
    name: 'api',
    component: buyPage
},
  ]
})