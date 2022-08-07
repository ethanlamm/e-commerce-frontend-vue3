<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // v-vmodel 双向数据绑定
    const activeName = useVModel(props, 'modelValue', emit)
    provide('activeName', activeName) // 这样写，setUp 只执行一次

    // 点击切换tab标签
    const tabClick = (name, index) => {
      activeName.value = name
      provide('activeName', activeName) // 点击后再次传值，传完整的，不要 .value

      // 传出点击的对象
      emit('tab-change', { name, index })
    }
    return { activeName, tabClick }
  },
  render () {
    // 获取 XtxTabsPanel 组件的插槽内容
    const panelSlots = this.$slots.default()
    // console.log(panelSlots);

    // 区分动静态插槽内容
    const dynamicPanels = []

    panelSlots.forEach((item) => {
      if (item.type.name === 'XtxTabsPanel') {
        // 静态插槽内容
        dynamicPanels.push(item)
      } else {
        // 动态内容
        item.children.forEach((child) => {
          dynamicPanels.push(child)
        })
      }
    })

    // 选项--依据面板插槽长度和面板内容进行动态渲染(遍历)
    const nav = (
      <nav>
        {dynamicPanels.map((item, index) => {
          return (
            <a
              href="javascript:;"
              onClick={() => this.tabClick(item.props.name, index)}
              class={{ active: this.activeName === item.props.name }}
            >
              {item.props.label}
            </a>
          )
        })}
      </nav>
    )

    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>

<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
