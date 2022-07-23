import request from '@/utils/request'

// 首页头部所有分类数据
export const getCategoryList = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取单个顶级分类信息(children：各子分类)
 * @param {String} id - 顶级分类ID
 */
export const getTopCategory = (id) => {
  return request('/category', 'get', { id })
}
