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
  },

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

  // qq登录：webpack-dev-server开启可IP和域名访问权限。
  // 1.需要在本地修改hosts地址
  // 1.1找到 C: \Windows\System32\drivers\etc 下hosts文件
  // 1.2在文件中加入  127.0.0.1 www.corho.com，保存
  // 2.需要开启IP或域名访问webpack服务器权限
  // 新写法
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all'
  },
  // 旧写法，disableHostCheck已被弃用
  // chainWebpack: config => {
  //   config.devServer.disableHostCheck(true)
  // }

  // 这个是设置外部扩展，模块为qc,变量名为QC，导入qc将不做打包。
  // 因为qq登录的js库是通过script标签引入(public/index.html)的，不是通过npm下载的
  // 引入QC时(import QC from 'qc')，由于没有qc这个包，所以会报错
  // 因此将qc排除
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
})
