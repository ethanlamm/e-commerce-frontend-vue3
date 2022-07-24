<template>
  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <!-- 一级分类 -->
    <!-- mousemove：解决点击二级分类时，由于页面切换至顶部，鼠标再次进入一级分类，二级分类弹框再次弹出的问题 -->
    <li
      v-for="category in categoryList"
      :key="category.id"
      @mousemove="show(category)"
      @mouseleave="hide(category)"
    >
      <router-link :to="`/category/${category.id}`" @click="hide(category)">
        {{ category.name }}
      </router-link>
      <div class="layer" :class="{ open: category.flag }">
        <ul>
          <!-- 二级分类 -->
          <li v-for="subItem in category.children" :key="subItem.id">
            <router-link
              :to="`/category/sub/${subItem.id}`"
              @click="hide(category)"
            >
              <img :src="subItem.picture" />
              <p>{{ subItem.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'AppHeaderNav',
  setup (props) {
    const store = useStore()
    const categoryList = computed(() => store.state.category.list)

    // 显示与隐藏的回调
    const show = (item) => {
      store.commit('category/SHOW', item.id)
    }
    const hide = (item) => {
      store.commit('category/HIDE', item.id)
    }
    return { categoryList, show, hide }
  }
}
</script>

<style scoped lang='less'>
// 一级分类
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // 鼠标经过一级分类时，二级分类显示
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}
// 二级分类
.layer {
  &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
