import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import IndexPage from '@/components/Index'
import CarList from '@/components/CarList'
import Login from '@/components/Login'

Vue.use(Router)
Vue.use(Resource)

export default new Router({
  routes: [
    {
      path: '/',
      component: IndexPage,
      children:[
        {
          path:'/',
          component:CarList
        },
        {
          path:'/carlist',
          component:CarList
        }
      ]
    },
    {
      path: '/index',
      component: IndexPage,
      children:[
        {
          path:'/',
          component:CarList
        },
        {
          path:'/carlist',
          component:CarList
        }
      ]
    },
    {
      path:'/login',
      component:Login
    }
  ]
})
