import { constantRoutes } from "@/router";

export default {
    namespaced:true,
    state:()=>({
        routes:constantRoutes,
    }),
    mutations:{
        // 设置动态路由
        setRoutes(state,asyncRoutes){
            state.routes=[...constantRoutes,...asyncRoutes];
        }
    }
}