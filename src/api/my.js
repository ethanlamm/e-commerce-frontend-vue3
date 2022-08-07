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

/**
 * 查询订单列表(全部类型)
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const getOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return request('/member/order', 'get', { page, pageSize, orderState })
}
