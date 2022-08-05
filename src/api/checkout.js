// 订单相关

import request from '@/utils/request'

/**
 *  生成订单
 */
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

/**
 *  添加收货地址
 * @param {Object} form 表单数据
 */
export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}
