import request from '@/utils/request'
/**
 *
 * 消耗品管理
 *
 **/

export const getConsumeList = (params: any) => {
  return request({
    url: '/consume/page',
    method: 'post',
    params
  })
}

// 删除当前列的接口
export const deleConsume = (ids: string) => {
  return request({
    url: '/consume',
    method: 'delete',
    params: { id:ids }
  });
};

// 修改---启用禁用接口
export const enableOrDisableConsume = (params: any) => {
  return request({
    url: `/consume/status/${params.status}`,
    method: 'post',
    params: { id:params.id }
  })
}

// 新增---添加员工
export const addConsume = (params: any) => {
  return request({
    url: '/consume',
    method: 'post', //POST 方法一般用于向服务器提交新的数据，也就是创建资源,@PostMapping 注解对应 POST 请求
    data: { ...params }
  })
}

// 修改---添加员工
export const editConsume = (params: any) => {
  return request({
    url: '/consume',
    method: 'put', //PUT 方法通常用于更新服务器上已存在的资源，@PutMapping 注解对应 PUT 请求
    data: { ...params }
  })
}

// 修改页面反查详情接口
export const queryConsumeById = (id: string | (string | null)[]) => {
  return request({
    url: `/consume/${id}`,
    method: 'get'
  })
}
