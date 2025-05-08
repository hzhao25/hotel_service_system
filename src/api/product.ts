import request from '@/utils/request'
/**
 *
 * 商品管理
 *
 **/

export const getProductList = (params: any) => {
  return request({
    url: '/product/page',
    method: 'post',
    params
  })
}

// 删除当前列的接口
export const deleProduct = (ids: string) => {
  return request({
    url: '/product',
    method: 'delete',
    params: { id:ids }
  });
};

// 修改---启用禁用接口
export const enableOrDisableProduct = (params: any) => {
  return request({
    url: `/product/status/${params.status}`,
    method: 'post',
    params: { id:params.id }
  })
}

// 新增---添加商品
export const addProduct = (params: any) => {
  return request({
    url: '/product',
    method: 'post', //POST 方法一般用于向服务器提交新的数据，也就是创建资源,@PostMapping 注解对应 POST 请求
    data: { ...params }
  })
}

// 修改---添加员工
export const editProduct = (params: any) => {
  return request({
    url: '/product',
    method: 'put', //PUT 方法通常用于更新服务器上已存在的资源，@PutMapping 注解对应 PUT 请求
    data: { ...params }
  })
}

// 修改页面反查详情接口
export const queryProductById = (id: string | (string | null)[]) => {
  return request({
    url: `/product/${id}`,
    method: 'get'
  })
}
