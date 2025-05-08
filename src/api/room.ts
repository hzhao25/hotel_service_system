import request from '@/utils/request'
/**
 *
 * 消耗品管理
 *
 **/

export const getRoomList = (params: any) => {
  return request({
    url: '/room/page',
    method: 'post',
    params
  })
}

// 删除当前列的接口
export const deleRoom = (ids: string) => {
  return request({
    url: '/room',
    method: 'delete',
    params: { id:ids }
  });
};

// 修改---启用禁用接口
export const enableOrDisableRoom = (params: any) => {
  return request({
    url: `/room/status/${params.status}`,
    method: 'post',
    params: { id:params.id }
  })
}

// 新增---添加员工
export const addRoom = (params: any) => {
  return request({
    url: '/room',
    method: 'post', //POST 方法一般用于向服务器提交新的数据，也就是创建资源,@PostMapping 注解对应 POST 请求
    data: { ...params }
  })
}

// 修改---添加员工
export const editRoom = (params: any) => {
  return request({
    url: '/room',
    method: 'put', //PUT 方法通常用于更新服务器上已存在的资源，@PutMapping 注解对应 PUT 请求
    data: { ...params }
  })
}

// 修改页面反查详情接口
export const queryRoomById = (id: string | (string | null)[]) => {
  return request({
    url: `/room/${id}`,
    method: 'get'
  })
}
