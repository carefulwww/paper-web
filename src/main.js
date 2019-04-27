// import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex'
import Vuex from 'vuex'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import routes from './routes'
import Mock from './mock'
Mock.bootstrap()
import 'font-awesome/css/font-awesome.min.css'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import '@/assets/css/element.css'

import * as filters from './filters'

Vue.use(VueCodemirror)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

// NProgress.configure({ showSpinner: false });
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // NProgress.start();
  // if (to.path == '/login') {
  //   sessionStorage.removeItem('user');
  // }
  // let user = JSON.parse(sessionStorage.getItem('user'));
  // if (!user && to.path != '/login') {
  //   next({ path: '/login' })
  // } else {
  //   next()
  // }
  if (to.path === '/login') {
    next()
  } else {
    if (!store.state.user.isLogin) {
      next({ path: '/login' })
    } else {
      if (to.meta && to.meta.roles && to.meta.roles.indexOf(store.state.user.type) !== -1) {
        next()
      } else {
        next({ path: from.path })
      }
    }
  }
})

// router.afterEach(transition => {
// NProgress.done();
// });

new Vue({
  // el: '#app',
  // template: '<App/>',
  router,
  store,
  // components: { App }
  render: h => h(App)
}).$mount('#app')

