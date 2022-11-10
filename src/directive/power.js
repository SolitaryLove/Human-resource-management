// 按钮权限
import store from '@/store';

export default {
    inserted(el,binding){
        // 获取按钮权限数组
        const points=store.state.user.userInfo.roles.points;
        if(!points.includes(binding.value)){
            el.parentNode.removeChild(el);
        }
    }
}