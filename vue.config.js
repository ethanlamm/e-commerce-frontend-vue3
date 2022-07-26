const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  }

  // vue-cli创建的webpack模板默认将10kb下的图片打包成base64的格式!!!!!!!

  // 配置
  // 城市地址组件：发请求获取城市数据的同时，loading也在获取背景图，为解决城市数据已返回而背景图还未返回，从而出现不显示loading效果的问题，将图片打包成base64格式，则背景图则不再发请求
  // chainWebpack: config => {
  //   config.module
  //     .rule('images')
  //     .use('url-loader')
  //     .loader('url-loader')
  //     .tap(options => Object.assign(options, { limit: 10000 }))
  // }
})
