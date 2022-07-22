<template>
  <div class="home-new">
    <!-- 使用面板模板，并传入数据 -->
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <!-- 头部右侧插槽 -->
      <!-- vue3.0中 只支持v-slot指令，所以需要配合template来使用 -->
      <template #right>
        <XtxMore path="/" />
      </template>
      <!-- 面板内容 -->
      <!-- 放到第二个插槽中 -->
      <div style="position: relative; height: 426px" ref="target">
        <Transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
                <img :src="item.picture" alt="" />
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else bg="f0f9f4"></HomeSkeleton>
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>
<script>
import { ref } from 'vue'
// 引入面板模板
import HomePanel from './commons/home-panel.vue'
import HomeSkeleton from './commons/home-skeleton.vue'
import { getNew } from '@/api/home'
// 引入数据懒加载函数
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // const goods = ref([]);
    // getNew().then((data) => {
    //   goods.value = data.result;
    // });
    const target = ref(null)
    const goods = useLazyData(target, getNew)
    return { target, goods }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
