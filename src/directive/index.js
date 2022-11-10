import power from './power';

export default {
    // 按钮级权限控制的自定义指令
    install(Vue){
        Vue.directive('power',power);
    }
}