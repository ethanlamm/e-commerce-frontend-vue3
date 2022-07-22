<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <!-- 没有头部的右侧 -->
    <div style="position: relative; height: 426px" ref="target">
      <Transition name="fade">
        <!-- 有数据，展示 ul -->
        <ul v-if="goods.length" class="goods-list">
          <li v-for="item in goods" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
              <p class="name">{{ item.title }}</p>
              <p class="desc">{{ item.alt }}</p>
            </RouterLink>
          </li>
        </ul>
        <!-- 无数据，展示一样结构的骨架 -->
        <HomeSkeleton v-else></HomeSkeleton>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import HomePanel from './commons/home-panel.vue'
import HomeSkeleton from './commons/home-skeleton.vue'
import { ref } from 'vue'
import { getHot } from '@/api/home'
// 引入数据懒加载函数
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeHot',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // const goods = ref([]);
    // getHot().then((data) => {
    //   goods.value = data.result;
    // });
    const target = ref(null)
    const goods = useLazyData(target, getHot)
    return { target, goods }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
