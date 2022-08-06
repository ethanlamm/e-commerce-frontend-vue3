import request from '@/utils/request'

/**
 * 获取收藏列表(真实接口没数据)
 * @param {Number} page - 当前页
 * @param {Number} pageSize - 每页数据条数
 * @param {Number} pageSize - 收藏类型，1为商品，2为专题，3为品牌
 * @returns Promise
 */
export const getCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}
