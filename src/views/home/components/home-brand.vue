<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <!-- 右侧插槽内容：左右箭头 -->
    <template v-slot:right>
      <a
        href="javascript:;"
        class="iconfont icon-angle-left prev"
        @click="toggle(-1)"
        :class="{ disabled: currIndex === 0 }"
      ></a>
      <a
        href="javascript:;"
        class="iconfont icon-angle-right next"
        @click="toggle(1)"
        :class="{ disabled: currIndex === 1 }"
      ></a>
    </template>
    <!-- 面板插槽内容 -->
    <div class="box" ref="target">
      <transition name="fade">
        <!-- 有数据 -->
        <ul
          v-if="brands.length"
          class="list"
          :style="{ transform: `translateX(${-currIndex * 1240}px)` }"
        >
          <li v-for="item in brands" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" />
            </RouterLink>
          </li>
        </ul>
        <!-- 结构一致的骨架 -->
        <div v-else class="skeleton">
          <XtxSkeleton
            class="item"
            v-for="i in 5"
            :key="i"
            animated
            bg="#e4e4e4"
            width="240px"
            height="305px"
          />
        </div>
      </transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { getBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
import HomePanel from './commons/home-panel.vue'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // 懒加载获取数据
    const target = ref(null)
    // 注意：useLazyData需要的是API函数，如果遇到要传参的情况，自己写函数，在函数中调用API
    const brands = useLazyData(target, () => getBrand(10))

    // 上一页 下一页：通过 currIndex 控制展示的数据(ul的位移)、箭头的样式(disabled)
    const currIndex = ref(0)
    const toggle = (step) => {
      const newIndex = currIndex.value + step
      if (newIndex < 0 || newIndex > 1) return
      currIndex.value = newIndex
    }
    return { target, brands, currIndex, toggle }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background: #f5f5f5;
}
// 右侧插槽箭头样式
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  // 禁用样式
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }

  // 骨架样式
  .skeleton {
    width: 100%;
    display: flex;
    .item {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
