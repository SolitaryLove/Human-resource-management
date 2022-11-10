import request from '@/utils/request'

/**
 * @description 获取员工列表
 * @param {object} params 
 * @returns
 */
export function getEmployeeListAPI(params){
    return request({
        url:'/sys/user',
        method:'GET',
        params
    })
}

/**
 * @descript 新增员工
 * @param {object} data 
 * @returns 
 */
export function addEmployeeAPI(data){
    return request({
        url:'/sys/user',
        method:'POST',
        data
    })
}

/**
 * @description 删除员工
 * @param {string} id 
 * @returns 
 */
export function delEmployeeAPI(id){
    return request({
        url:`/sys/user/${id}`,
        method:'DELETE'
    })
}

/**
 * @description 导入excel
 * @param {object} data [{},{},{}...]
 * @returns 
 */
export function importEmployeeAPI(data){
    return request({
        url:'/sys/user/batch',
        method:'POST',
        data
    })
}

/**
 * @description 保存员工信息
 * @param {object} data {username,password}
 * @returns 
 */
export function saveUserDetailByIdAPI(data){
    return request({
        url:`/sys/user/${data.id}`,
        method:'PUT',
        data,
    })
}

/**
 * @description 为员工分配角色
 * @param {object} data 
 * @returns 
 */
export function assignRolesAPI(data){
    return request({
        url:'/sys/user/assignRoles',
        method:'PUT',
        data,
    })
}