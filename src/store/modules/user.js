import { loginAPI, getUserProfileAPI, getUserPhotoAPI,  } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    // Vuex的state值使用本地持久化的
    token: getToken(),
    userInfo:{},
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN(state,newToken){
    state.token=newToken;
    // token持久化
    setToken(newToken);
  },
  REMOVE_TOKEN(state){
    state.token='';
    removeToken();
  },
  SET_USER(state,value){
    state.userInfo=value;
  },
  REMOVE_USER(state){
    state.userInfo={}
  }
}

const actions = {
  // 用户登录
  async loginActions({commit},data){
    const res=await loginAPI(data);
    // 设置token
    commit('SET_TOKEN',res.data);
    return res;
  },

  // 用户登出(token过期被动退出 || 主动退出)
  logoutActions({commit}){
    commit('REMOVE_TOKEN');
    commit('REMOVE_USER');
    resetRouter();// 重置路由
  },

  // 获取用户信息
  async getUserInfoActions({commit}){
    const {data:infoObj}=await getUserProfileAPI();
    const {data:userObj}=await getUserPhotoAPI(infoObj.userId);
    // 把两个对象都展开形成一个全新的对象传递给userInfo
    commit('SET_USER',{...infoObj,...userObj});
    return infoObj.roles.menus;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

