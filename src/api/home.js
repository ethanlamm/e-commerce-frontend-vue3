import request from '@/utils/request'

/**
 * 获取品牌数据
 * @param {integer} limit 数据条数
 * @returns promise
 */
export const getBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取轮播图
 * @returns Promise
 */
export const getBanner = () => {
  return request('/home/banner', 'get')
}

/**
 * 获取新鲜好物
 */
export const getNew = () => {
  return request('home/new', 'get')
}

// 人气推荐
export const getHot = () => {
  return request('home/hot', 'get')
}

// 商品区域数据
export const getGoods = () => {
  return request('home/goods', 'get')
}

// 最新专题
export const getSpecial = () => {
  return request('home/special', 'get')
}
