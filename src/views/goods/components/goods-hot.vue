<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <div>
      <GoodsItem
        v-for="item in hotGoods"
        :key="item.id"
        :goods="item"
      ></GoodsItem>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import GoodsItem from '@/views/category/components/goods-item.vue'
import { getHotGoods } from '@/api/goods'
import { useRoute } from 'vue-router'
export default {
  name: 'GoodsHot',
  components: { GoodsItem },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    const titleMap = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    const title = computed(() => {
      return titleMap[props.type]
    })

    const route = useRoute()
    const hotGoods = ref([])
    getHotGoods({ id: route.params.id, type: props.type }).then((data) => {
      hotGoods.value = data.result
    })
    return { title, hotGoods }
  }
}
</script>

<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
