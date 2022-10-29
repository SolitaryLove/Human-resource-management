import request from '@/utils/request'

/**
 * @description 登录接口
 * @param {string} mobile
 * @param {string} password
 * @returns {Promise}
 */
export function loginAPI(data) {
  return request({
    url:'/sys/login',
    method: 'POST',
    data
  })
}

/**
 * @description 获取用户资料
 * @return {Promise}
 */
export function getUserProfileAPI(){
  return request({
    url:'/sys/profile',
    method:'POST'
  })
}

/**
 * @description 获取员工基本信息（只为了拿到员工头像）
 * @param {string} id
 * @return {Promise}
 */
 export function getUserPhotoAPI(id){
  return request({
    url:`/sys/user/${id}`,// 把员工id值携带在路径上传递给后端
    method:'GET'
  })
}