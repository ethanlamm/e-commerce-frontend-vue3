import request from '@/utils/request'

// 首页头部分类数据
export const getCategoryList = () => {
  return request('/home/category/head', 'get')
}
