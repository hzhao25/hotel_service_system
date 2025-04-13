import request from '@/utils/request'
/**
 *
 * 员工管理
 *
 **/
// 登录、
export const login = (data: any) =>
  request({
    'url': '/employee/login',
    'method': 'post',
    data
  })
  // 退出
 export const userLogout = (params: any) =>
 request({
   'url': `/employee/logout`, // 授课老师接口
   'method': 'post',
   params
 })

export const getEmployeeList = (params: any) => {
  return request({
    url: '/employee/page',
    method: 'post',
    params
  })
}

// 修改---启用禁用接口
export const enableOrDisableEmployee = (params: any) => {
  return request({
    url: `/employee/status/${params.status}`,
    method: 'post',
    params: { id:params.id }
  })
}

// 新增---添加员工
export const addEmployee = (params: any) => {
  return request({
    url: '/employee',
    method: 'post', //POST 方法一般用于向服务器提交新的数据，也就是创建资源,@PostMapping 注解对应 POST 请求
    data: { ...params }
  })
}

// 修改---添加员工
export const editEmployee = (params: any) => {
  return request({
    url: '/employee',
    method: 'put', //PUT 方法通常用于更新服务器上已存在的资源，@PutMapping 注解对应 PUT 请求
    data: { ...params }
  })
}

// 修改页面反查详情接口
export const queryEmployeeById = (id: string | (string | null)[]) => {
  return request({
    url: `/employee/${id}`,
    method: 'get'
  })
}
