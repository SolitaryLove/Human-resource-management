import request from '@/utils/request'

/**
 * @description 获取所有角色信息
 * @param {object} params {page,pageSize}
 * @returns {Promise}
 */
export function getRolesAPI(params){
    return request({
        url:'/sys/role',
        method:'GET',
        params
    })
}

/**
 * @description 获取公司信息
 * @param {string} companyId 
 * @returns {Promise}
 */
export function getCompanyInfoAPI(companyId){
    return request({
        url:'/company',
        method:'GET',
        params:{
            companyId
        }
    })
}

/**
 * @description 添加角色
 * @param {object} data 
 * @returns {Promise}
 */
export function addRoleAPI(data){
    return request({
        url:'/sys/role',
        method:'POST',
        data
    })
}

/**
 * @description 获取当前角色信息
 * @param {string} id 
 * @returns {Promise}
 */
export function getRoleIdAPI(id){
    return request({
        url:`/sys/role/${id}`,
        method:'GET'
    })
}

/**
 * @description 编辑当前角色信息
 * @param {object} data 
 * @returns {Promise}
 */
export function updateRoleAPI(data){
    return request({
        url:`/sys/role/${data.id}`,
        method:'PUT',
        data,
    })
}

/**
 * @description 删除角色
 * @param {string} id 
 * @returns {Promise}
 */
export function deleteRoleAPI(id){
    return request({
        url:`/sys/role/${id}`,
        method:'DELETE'
    })
}

/**
 * @description 给角色分配权限
 * @param {object} data 
 * @returns {Promise}
 */
export function assignPermAPI(data){
    return request({
        url:'/sys/role/assignPrem',
        method:'PUT',
        data,
    })
}
