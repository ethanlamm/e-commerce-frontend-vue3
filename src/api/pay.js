import request from '@/utils/request'

/**
 * 获取订单信息
 * @param {String} id - 订单id
 */
export const getOrderDetail = (id) => {
  return request(`/member/order/${id}`, 'get')
}
