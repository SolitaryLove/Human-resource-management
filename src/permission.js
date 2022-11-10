import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'

// 动态路由表
import {asyncRoutes} from './router'

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
      if(!store.getters.userId){
        const menus=await store.dispatch('user/getUserInfoActions');
        // 根据用户拥有的权限 menus 从 asyncRoutes 里过滤出实际路由对象
        const filterRoutes=asyncRoutes.filter(route=>{
          /* const routeName=route.children[0].name.toLowerCase();
          return menus.includes(routeName); */
          return true;
        })
        router.addRoutes(filterRoutes);
        // 手动在最后添加防止刷新后动态添加的路由404
        filterRoutes.push({path:'*',redirect:'/404',hidden:true});
        // 实现路由合并且能响应式更新侧边栏菜单
        store.commit('permission/setRoutes',filterRoutes);
        // 解决动态路由刷新页面白屏
        next({
          path:to.path,// 确保动态路由添加后，再跳转能够找到对应的路由规则
          replace:true// 重进一次不保留重复历史
        });
      }
      next();// 如果存在 token，访问的是其他页面则直接放行
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