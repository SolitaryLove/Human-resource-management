import axios from 'axios'
import { Message } from 'element-ui';
import store from '@/store';
import router from '@/router';

const service = axios.create({
  // process.env是node.js内置的固定环境变量对象
  // npm run dev → 启动开发服务，项目根目录.env.development环境变量配置文件里值
  // 添加到process.env对象上
  // npm run build:prod → 
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const token=store.getters.token;
    if(token){
      // 后台解析的方法要求必须前面拼接一个Bearer和空格的字符串
      config.headers['Authorization']=`Bearer ${token}`;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // 因为后台成功/失败都是200，使用success字段区分请求成功与否
    const {success,message}=response.data;
    if(success){
      return response.data;
    }else{
      // 逻辑失败（把后台返回message提示文字返回到逻辑页面）
      Message.error(message);
      return Promise.reject(message);
    }
  },
  error => {
    // 4xx的响应状态，如果后台返回了响应数据就当成提示信息，如果没有就用error.message
    // &&为了防止null.data报错
    Message.error((error.response&&error.response.data&&error.response.data.message)||error.message);
    // 通过http状态码来判断error.response.status===401 或者使用code逻辑码
    /* ?.可选链运算符，
    功能类似于.链式运算符，不同之处在于，在引用为空 (null 或者 undefined) 的情况下不会引起错误，
    该表达式短路返回值是 undefined */
    if(error?.response?.data?.code===10002){// 10002 → token过期
      // 前端token过期进行处理
      // 1.清除token 2.清除用户信息 3.返回login页面
      store.dispatch('user/logoutActions');
      // 将被动退出时所在页面的路由地址传递给登录页面
      router.replace(`/lgoin?redirect=${router.currentRoute.fullPath}`);
    }
    return Promise.reject(error)
  }
)

export default service