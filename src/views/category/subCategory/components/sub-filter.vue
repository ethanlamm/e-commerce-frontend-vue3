<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="!filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:;"
          v-for="item in filterData.brands"
          :key="item.id"
          :class="{ active: item.id === filterData.selectedBrand }"
          @click="changBrand(item.id)"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
    <div
      class="item"
      v-for="saleprops in filterData.saleProps"
      :key="saleprops.id"
    >
      <div class="head">{{ saleprops.name }}：</div>
      <div class="body">
        <a
          href="javascript:;"
          v-for="p in saleprops.properties"
          :key="p.id"
          :class="{ active: p.id === saleprops.selectedProps }"
          @click="changProps(saleprops, p.id)"
        >
          {{ p.name }}
        </a>
      </div>
    </div>
  </div>
  <!-- 骨架 -->
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    const filterData = ref({})
    const filterLoading = ref(false)
    const getFilterData = () => {
      // 正在加载(请求)数据，则显示骨架
      filterLoading.value = true
      // then：是数据请求成功的回调，filterLoading.value = true 不能写在里面

      getSubCategoryFilter(route.params.id).then((data) => {
        // 处理数据：首项增加全部，选中属性(初始值设为'全部'的id(null))
        // 1.品牌处理
        data.result.brands.unshift({ id: null, name: '全部' })
        // 2.属性处理
        data.result.saleProperties.forEach((item) => {
          // 选中的属性(id)
          item.selectedProps = null
          item.properties.unshift({ id: null, name: '全部' })
        })
        // 选中的品牌(id)
        filterData.value.selectedBrand = null
        filterData.value.brands = data.result.brands
        filterData.value.saleProps = data.result.saleProperties

        // 数据请求完毕，则隐藏骨架显示数据
        filterLoading.value = false
      })
      //   console.log(filterData.value);
    }

    // 监听路径 id 的变化
    watch(
      () => route.params.id,
      (newValue) => {
        newValue &&
          route.path === `/category/sub/${newValue}` &&
          getFilterData()
      },
      { immediate: true }
    )

    // 获取筛选条件
    const getFilterParams = () => {
      const temp = { brandId: null, attrs: [] }
      // 1.选中的品牌id
      temp.brandId = filterData.value.selectedBrand
      // 2.1筛选出选中的属性，排除null(全部)
      filterData.value.saleProps.forEach((saleprops) => {
        if (saleprops.selectedProps) {
          // 选中的属性不是全部(null)
          const prop = saleprops.properties.find(
            (item) => item.id === saleprops.selectedProps
          )
          temp.attrs.push({
            groupName: saleprops.name,
            propertyName: prop.name
          })
        }
      })
      // 2.2若属性没有选择，默认全部，则将attrs设为null
      if (!temp.attrs.length) temp.attrs = null
      // 参考接口文档  {brandId:Integer, attrs:[{groupName:String, propertyName:String},...]}
      return temp
    }

    // 1.品牌改变
    const changBrand = (id) => {
      if (filterData.value.selectedBrand === id) return
      filterData.value.selectedBrand = id

      // 通知父组件发请求
      emit('filter-change', getFilterParams())
    }

    // 2.属性改变
    const changProps = (item, id) => {
      if (item.selectedProps === id) return
      item.selectedProps = id

      // 通知父组件发请求
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changBrand, changProps }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
// 骨架
.xtx-skeleton {
  padding: 10px 0;
}
</style>
