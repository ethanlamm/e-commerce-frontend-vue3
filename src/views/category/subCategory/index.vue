<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter @filter-change="filterChange"></SubFilter>
      <!-- 商品面板 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change="sortChange" ref="target"></SubSort>
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
    let reqParams = {
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

    // 重置排序条件
    const target = ref(null)
    const resetSortParams = () => {
      // console.log('父组件调用子组件的重置方法');
      target.value.resetParams()
    }

    // 二级分类id改变--切换其他二级分类
    watch(
      () => route.params.id,
      (newValue) => {
        // console.log(route.path);
        if (newValue && route.path === `/category/sub/${newValue}`) {
          // 可以发请求，重置条件
          finished.value = false
          reqParams.page = 1
          // 切换二级分类后，重置排序条件
          resetSortParams()
          goodsList.value = [] // 先整理参数，当goodsList重置为空时，底部的 无限组件 进入可视区，则会依据整理好的请求参数发请求，因此goodsList重置为空放最后
        }
      }
      // {
      //   immediate: true,
      // }
    )

    // 1.排序改变的回调
    const sortChange = (sortParams) => {
      // 可以发请求，重置条件，并合并请求参数
      // console.log(sortParams);
      finished.value = false
      reqParams.page = 1
      // 合并参数
      reqParams = { ...reqParams, ...sortParams }
      goodsList.value = []
    }

    // 2.筛选条件改变的回调
    const filterChange = (filterParams) => {
      // 可以发请求，重置条件，并合并请求参数
      // console.log(filterParams);
      finished.value = false
      reqParams.page = 1
      // 改变筛选后，重置排序条件(要先重置参数)
      resetSortParams()
      // 再合并参数
      reqParams = { ...reqParams, ...filterParams }
      goodsList.value = []
    }

    return {
      loading,
      finished,
      goodsList,
      target,
      getData,
      sortChange,
      filterChange
    }
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
