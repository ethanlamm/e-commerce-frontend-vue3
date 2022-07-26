// 商品相关接口

import request from '@/utils/request'

/**
 * 获取商品详情数据
 * @param {Number} id 商品id
 * @returns
 */
export const getGoods = (id) => {
  return request('/goods', 'get', { id })
}
