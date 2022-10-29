import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner:false});

// 白名单（无需登录可以跳转查看的路由地址）
const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start();
  const token=store.getters.token
  if(token){// 已登录
    if(to.path==='/login'){
      // 中断要中转/login这次导航，重新跳转/
      next('/');
      NProgress.done();
    }else{
      if(!store.getters.name){store.dispatch('user/getUserInfoActions');}
      next();
    }
  }else{// 未登录
    if(whiteList.includes(to.path)){
      next();
    }else{
      next('/login');
      NProgress.done();
    }
  }
})

router.afterEach((to,from) => {
  // 设置页面标题
  document.title=getPageTitle(to.meta.title);
  NProgress.done();
})