<template>
  <div class="member-home">
    <!-- 个人信息概览 -->
    <HomeOverview></HomeOverview>
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem
        v-for="item in collect"
        :key="item.id"
        :goods="item"
      ></GoodsItem>
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem
        v-for="item in collect"
        :key="item.id"
        :goods="item"
      ></GoodsItem>
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant></GoodsRelevant>
  </div>
</template>
<script>
import HomeOverview from './components/home-overview.vue'
import HomePanel from './components/home-panel.vue'
import GoodsRelevant from '@/views/goods/components/goods-relevant.vue'
import GoodsItem from '@/views/category/components/goods-item.vue'
import { ref } from 'vue'
import { getCollect } from '@/api/my'
export default {
  name: 'MemberHome',
  components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },
  setup (props) {
    const collect = ref(null)
    // 注意：这里我的收藏和我的足迹使用的是 mock 数据，并且均为 mock 我的收藏的数据
    getCollect({
      page: 1,
      pageSize: 4
    }).then((data) => {
      collect.value = data.result.items
    })

    return { collect }
  }
}
</script>
<style scoped lang="less">
// 调整轮播图左右箭头样式
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
