// 订单相关

import request from '@/utils/request'

/**
 *  生成订单
 */
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}
