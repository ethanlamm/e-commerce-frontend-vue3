<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <!-- 1.用 transition 组件包裹做动画的元素
        2.由于 XtxBreadItem 组件没有 创建移除|显示隐藏(做动画的条件)，因此用 key 绑定 XtxBreadItem，key 不同，则创建不同的 XtxBreadItem，从而达到做动画的条件
        3.mode 可指定进入|离开的顺序，避免样式卡顿问题 ==>无效，用动画延迟替代
        4.插槽内不能写注释!!!!!!! -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition name="fade-right">
          <XtxBreadItem :key="currCategory.id">
            {{ currCategory.name }}
          </XtxBreadItem>
        </transition>
      </XtxBread>
      <!-- 轮播图 -->
      <!-- 可传入自动播放 autoPlay -->
      <XtxCarousel :sliders="sliders" style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in currCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" />
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="cate in subList" :key="cate.id">
        <div class="head">
          <h3>- {{ cate.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore :path="`/category/sub/${cate.id}`" />
        </div>
        <div class="body">
          <GoodsItem v-for="item in cate.goods" :key="item.id" :goods="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from './components/goods-item'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { getBanner } from '@/api/home'
import { getTopCategory } from '@/api/category'
export default {
  name: 'CategoryVue',
  components: { GoodsItem },
  setup () {
    // 1.轮播图
    const sliders = ref([])
    getBanner().then((data) => {
      sliders.value = data.result
    })

    // 2.面包屑+所有子分类  从vuex中拿数据
    const store = useStore()
    const route = useRoute()
    // #region
    // 1.store.state.category.list : 所有一级分类以及其子分类
    // console.log(store.state.category.list);
    // 2.route.params.id：当前路径的参数 id
    // console.log(route.params.id);
    // 3.依据路径中的参数 id 来筛选出相应的 一级分类和其子分类

    // 从 store 中拿数据 store.state.category.list，需要用 computed(响应式)
    // 类似：computed:{
    //         ...mapState(仓库，['数据'])
    //      }
    // #endregion
    const currCategory = computed(() => {
      let temp = {}
      const findItem = store.state.category.list.find(
        (item) => item.id === route.params.id
      )
      if (findItem) {
        temp = findItem
      }
      return temp
    })
    // console.log(currCategory.value);

    // 3.依据路径 id 获取 顶级分类，children属性即为各子分类
    // 监听地址栏id的变化，从而调用获取数据的方法
    const subList = ref([])
    // 获取数据的方法
    const getSubList = (id) => {
      getTopCategory(id).then((data) => {
        subList.value = data.result.children
        // console.log(subList.value);
      })
    }
    watch(
      () => route.params.id,
      (newValue) => {
        // newValue && getSubList(newValue)
        // 由于二级分类也有id，上述拿id请求数据的方法，会造成拿二级分类的id请求一级分类的数据(不必要请求)，加判断路径后再发请求
        newValue &&
          route.path === `/category/${newValue}` &&
          getSubList(newValue)
      },
      { immediate: true }
    )
    return { sliders, currCategory, subList }
  }
}
</script>

<style lang="less" scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  // 所有二级分类
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  // 不同分类商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
