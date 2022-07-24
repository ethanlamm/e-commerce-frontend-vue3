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

/**
 * 获取二级分类筛选条件数据
 * @param {String} id - 二级分类ID
 */
export const getSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}
