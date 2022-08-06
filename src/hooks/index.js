// 提供复用逻辑的函数(钩子)

// 一、可视区加载
// https://vueuse.org/core/useIntersectionObserver/#useintersectionobserver
// 数据懒加载：使用 @vueuse/core 提供的 useIntersectionObserver，监视 DOM 元素是否进入可视区；
// 当进入可视区时，停止 stop 监视(防止多次加载数据)，然后发请求获得数据

import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'

import dayjs from 'dayjs'


/**
 *  数据懒加载函数
 * @param {Element} target 监视的DOM元素
 * @param {Function} apiFn 请求api
 * @returns {Array}
 */
export const useLazyData = (target, apiFn) => {
  // 解析：target--监视DOM对象；apiFn--请求api；
  // stop--停止监听(函数)；isIntersecting--是否进入可视区(Boolean)
  const res = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        // 1.停止监听
        stop()
        // 2.发请求
        apiFn().then(data => {
          res.value = data.result
        })
      }
    },
    // 配置选项
    {
      threshold: 0
    }
  )
  // 返回请求到的数据
  return res
}


// 二、倒计时
// 安装包 npm install dayjs
// 参考文档 https://dayjs.gitee.io/docs/zh-CN/parse/unix-timestamp

/**
 * 倒计时格式化
 * @param {String} countdown 服务器返回的倒计时秒数
 * @return {Object} {start:开始函数, tiemText:格式化的时间}
 */
export const usePayTime = () => {
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, { immediate: false })
  onUnmounted(() => {
    pause()
  })

  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return { start, timeText }
}
