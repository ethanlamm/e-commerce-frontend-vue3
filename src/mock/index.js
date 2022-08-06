// 1.引入
// 2.配置选项
// 3.配置模拟接口
// 4.在main.js中使用
// 5.当真实接口可用时，在main.js中注释掉 import '@/mock' 即可

import Mock from 'mockjs'

// qs：nodejs自带，不用安装，直接引入
import qs from 'qs'

// mock配置
Mock.setup({
  // 随机延时500-1000毫秒
  timeout: '500-1000'
})

// 拦截请求
// Mock.mock(p1,p2,p3)
// p1: 要模拟(拦截)的接口，可以是正则，与真实接口保持一致
// p2: 请求方式
// p3: 返回的数据(写成函数，处理逻辑后返回数据)

Mock.mock(/\/member\/collect/, 'get', (config) => {
  // config:请求时，前端携带的请求参数
  // console.log(config);

  // 将query参数(String)转换成对象(Object)

  // 拿到query参数
  const queryString = config.url.split('?')[1]
  // 转换
  const queryObject = qs.parse(queryString)
  // console.log(queryObject);

  const items = []

  for (let i = 0; i < parseInt(queryObject.pageSize); i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)',
      // 随机找一张图
      // http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_7.jpg
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }

  return {
    msg: '获取数据成功',
    result: {
      counts: 35,
      pageSize: parseInt(queryObject.pageSize),
      page: parseInt(queryObject.page),
      items
    }
  }
})
