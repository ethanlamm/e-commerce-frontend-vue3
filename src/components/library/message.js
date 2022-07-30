// 使用函数形式来显示消息组件(挂载至vue原型上)

// 1.导入消息组件
// 2.将消息组件转为虚拟DOM节点
// 3.准备放虚拟DOM的容器，放入body中
// 4.把虚拟DOM放入容器中
// 5.将方法挂载至vue原型上


import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 准备容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 消息消失
let timer = null

/**
 *  消息函数
 * @param {String} type 消息类型
 * @param {String} text 消息文字
 */
export default (text, type) => {
  // createVNode(p1,p2)：组件 ==> 虚拟DOM    p1:组件，p2:props(Object)
  const vnode = createVNode(XtxMessage, { text, type })

  // render(p1,p2)：虚拟DOM放入容器中     p1:虚拟DOM，p2:容器
  // 消息出现
  render(vnode, div)

  // 消息关闭
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
