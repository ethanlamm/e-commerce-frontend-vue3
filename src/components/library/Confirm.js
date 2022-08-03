// 1.导入确认组件
// 2.将确认组件转为虚拟DOM节点
// 3.准备放虚拟DOM的容器，放入body中
// 4.把虚拟DOM放入容器中
// 5.将方法挂载至vue原型上

import XtxConfirm from './xtx-confirm.vue'
import { createVNode, render } from 'vue'

// 准备容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)


/**
 *  确认弹窗函数
 * @param {String} text  文字提示内容
 * @param {String} title 标题
 * @return {Promise} then(点击确认) catch(点击取消)
 *  */
export default (text, title) => {
  return new Promise((resolve, reject) => {
    // 取消
    const cancelCallback = () => {
      // 组件隐藏
      render(null, div)
      // reject => catch
      // 需要一个error
      reject(new Error('取消'))
    }
    // 确认
    const confirmCallback = () => {
      // 组件隐藏
      render(null, div)
      // resolve => then
      resolve()
    }

    // 创建一个虚拟节点
    const vnode = createVNode(XtxConfirm, { text, title, cancelCallback, confirmCallback })
    // 虚拟节点放入容器，生效
    render(vnode, div)
  })
}

