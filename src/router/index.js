import Vue from 'vue'
import Router from 'vue-router'
// import Home from 'pages/home/'
import Display from '@/components/display/'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/male/head'
    },
    {
      path: '/:gender',
      component: Display,
      children: [
        {
          path: '',
          redirect: 'head'
        },
        {
          path: ':part',
          redirect: ''
        }
      ]
    }
  ]
})
