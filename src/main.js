import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 国际化 element-ui
Vue.use(ElementUI,{
  // key：el.pagination.total(查找语言包的属性路径)
  // value：{total:10}(对应要传入的值)
  i18n:(key,value)=>i18n.t(key,value)
});

import GlobalComponents from '@/components'
Vue.use(GlobalComponents);

import Directive from './directive';
Vue.use(Directive);

import i18n from '@/lang';

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})