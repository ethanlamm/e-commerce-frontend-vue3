import request from '@/utils/request'


/**
 *  账号登录
 * @param {String} account 用户名
 * @param {String} password 密码
 * @returns
 */
export const accountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}
