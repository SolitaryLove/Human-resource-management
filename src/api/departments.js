import request from '@/utils/request'

/**
 * @description 获取组织架构信息列表
 * @returns {Promise}
 */
export function departmentsListAPI(){
    return request({
        url:'/company/department',
        method:'GET'
    })
}

/**
 * @description 获取部门负责人列表数据
 * @returns {Promise}
 */
export function getEmployeeSimpleAPI(){
    return request({
        url:'/sys/user/simple',
        method:'GET'
    })
}

/**
 * @description 新增子部门
 * @param {object} data {name, code, manager, introduce, pid}
 * @returns {Promise}
 */
export function addDepartmentAPI(data){
    return request({
        url:'/company/department',
        method:'POST',
        data
    })
}

/**
 * @description 获取部门详情
 * @param {string} id 
 * @returns {Promise}
 */
export function getDepartDetailAPI(id){
    return request({
        url:`/company/department/${id}`,
        method:'GET'
    })
}

/**
 * @description 更新部门详情
 * @param {object} data 
 * @returns {Promise}
 */
export function updateDepartmentsAPI(data){
    return request({
        url:`/company/department/${data.id}`,
        method:'PUT',
        data
    })
}

/**
 * @description 删除部门
 * @param {string} id 
 * @returns {Promise}
 */
export function delDepartmentAPI(id){
    return request({
        url:`/company/department/${id}`,
        method:'delete'
    })
}