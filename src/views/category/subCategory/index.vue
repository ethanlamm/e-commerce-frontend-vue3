<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter></SubFilter>
      <!-- 商品面板 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort></SubSort>
        <!-- 列表区 -->
        <!-- 商品展示区 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- loading区 -->
        <XtxInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="getData"
        ></XtxInfiniteLoading>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from '../components/goods-item.vue'
import { useRoute } from 'vue-router'
import { getSubCategoryGoods } from '@/api/category'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    const route = useRoute()
    // 加载中
    const loading = ref(false)
    // 数据是否加载已全部加载完毕
    const finished = ref(false)
    // 请求参数
    const reqParams = {
      page: 1,
      pageSize: 20
    }
    // 商品列表数据
    const goodsList = ref([])

    // 获取数据方法
    const getData = () => {
      loading.value = true
      // 依据路径上的二级分类id加载数据
      reqParams.categoryId = route.params.id
      // 发请求
      getSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          // 当前页数的数据加载完毕
          goodsList.value.push(...result.items)
          // 页码加一
          reqParams.page++
        } else {
          // 没有数据了
          finished.value = true
        }
        // 请求结束
        loading.value = false
      })
    }

    // 二级分类id改变--切换其他二级分类
    watch(
      () => route.params.id,
      (newValue) => {
        // 可以发请求，重置条件
        finished.value = false
        goodsList.value = []
        reqParams.page = 1
        newValue && `category/sub/${newValue}` === route.path && getData()
      },
      {
        immediate: true
      }
    )

    return { loading, finished, goodsList, getData }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
