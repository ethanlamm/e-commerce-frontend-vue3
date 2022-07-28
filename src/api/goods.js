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

/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const getRelGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'get', { id, limit })
}
