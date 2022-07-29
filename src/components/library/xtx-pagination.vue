<template>
  <div class="xtx-pagination">
    <a v-if="myCurrPage === 1" href="javascript:;" class="disabled">上一页</a>
    <a v-else href="javascript:;" @click="pageChange(myCurrPage - 1)">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a
      href="javascript:;"
      v-for="page in pager.middleArr"
      :key="page"
      :class="{ active: page === myCurrPage }"
      @click="pageChange(page)"
      >{{ page }}</a
    >
    <span v-if="pager.end < pager.totalPage">...</span>
    <a
      v-if="myCurrPage === pager.totalPage"
      href="javascript:;"
      class="disabled"
      >下一页</a
    >
    <a v-else href="javascript:;" @click="pageChange(myCurrPage + 1)">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    // 中间连续页码数
    consecutive: {
      type: Number,
      default: 5
    },
    // 每页展示数据条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 当前页码数
    currPage: {
      type: Number,
      default: 1
    },
    // 总数据条数
    totalData: {
      type: Number,
      default: 50
    }
  },
  setup (props, { emit }) {
    // 需要的数据
    // 1.中间连续页码数
    const consecutive = ref(props.consecutive)
    // 2.当前页码数
    // 注意：组件内定义的变量不能和传入(props)的变量名相同！！
    const myCurrPage = ref(props.currPage)
    // 3.总数据条数
    const totalData = ref(props.totalData)
    // 4.每页展示数据条数
    const pageSize = ref(props.pageSize)
    // 5.总页数 = 总数据条数 / 每页展示数据条数(向上取整)、开始页码数、结束页码数、中间数组
    const pager = computed(() => {
      // 总页数
      const totalPage = Math.ceil(totalData.value / pageSize.value)
      // 左右偏移量
      const offset = parseInt(consecutive.value / 2)
      // 开始页码数、结束页码数
      // 理想情况
      let start = myCurrPage.value - offset
      let end = myCurrPage.value + offset
      // 其他情况
      if (start < 1) {
        start = 1
        end = start + consecutive.value - 1 > totalPage ? totalPage : 5
      }
      if (end > totalPage) {
        end = totalPage
        start =
          totalPage - consecutive.value + 1 < 1
            ? 1
            : totalPage - consecutive.value + 1
      }

      //   中间数组
      const middleArr = []
      for (let i = start; i < end + 1; i++) {
        middleArr.push(i)
      }
      return { totalPage, middleArr, start, end }
    })

    // 监听传入值的变化
    watch(
      props,
      () => {
        myCurrPage.value = props.currPage
        totalData.value = props.totalData
        pageSize.value = props.pageSize
        consecutive.value = props.consecutive
      },
      { immediate: true }
    )

    // 改变页码
    const pageChange = (page) => {
      myCurrPage.value = page
      // 通知父组件根据页数再次请求数据
      emit('pageChange', page)
    }
    return { myCurrPage, pager, pageChange }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
