<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === null }"
        @click="changeSort(null)"
        >默认排序</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'publishTime' }"
        @click="changeSort('publishTime')"
      >
        最新商品
      </a>
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'orderNum' }"
        @click="changeSort('orderNum')"
      >
        最高人气
      </a>
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        @click="changeSort('evaluateNum')"
      >
        评论最多
      </a>
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <!-- 正序 -->
        <i
          class="arrow up"
          :class="{
            active:
              sortParams.sortField === 'price' &&
              sortParams.sortMethod === 'asc',
          }"
        />
        <!-- 降序 -->
        <i
          class="arrow down"
          :class="{
            active:
              sortParams.sortField === 'price' &&
              sortParams.sortMethod === 'desc',
          }"
        />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @click="changHandler" v-model="sortParams.inventory"
        >仅显示有货商品</XtxCheckbox
      >
      <XtxCheckbox @click="changHandler" v-model="sortParams.onlyDiscount">
        仅显示特惠商品
      </XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    //   参数依据接口文档整理
    const sortParams = reactive({
      // 默认排序null | 最新商品publishTime | 最高人气orderNum | 评论最多evaluateNum | 价格price
      sortField: null, // String
      // 价格排序：正序asc | 倒序desc
      sortMethod: null, // String
      // 仅显示有货商品
      inventory: false,
      // 仅显示特惠商品
      onlyDiscount: false
    })

    // 改变排序
    const changeSort = (params) => {
      if (params === 'price') {
        // 满足第一个条件
        sortParams.sortField = params
        // 判断正序还是倒序
        if (sortParams.sortMethod === null) {
          // 第一次点击，设置为倒序
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod =
            sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 停止多次点击相同选项
        if (sortParams.sortField === params) return
        sortParams.sortField = params
        // 重置价格排序为空
        sortParams.sortMethod = null
      }
      // 排序改变，通知父组件并传出排序参数
      emit('sort-change', sortParams)
    }

    // 勾选复选框(状态改变)
    const changHandler = () => {
      emit('sort-change', sortParams)
    }

    // 重置参数方法---要return出去
    const resetParams = () => {
      // 响应式数据，不能直接赋值
      sortParams.sortField = null
      sortParams.sortMethod = null
      sortParams.inventory = false
      sortParams.onlyDiscount = false
    }
    return { sortParams, changeSort, changHandler, resetParams }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      //   选中样式
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          //   价格选中样式
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          //   价格选中样式
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
