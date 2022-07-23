<template>
  <!-- Layout：有头部和底部的一级路由容器 -->
  <div class="LayoutConatiner">
    <!-- 顶部通栏 -->
    <AppTopnav></AppTopnav>
    <!-- 头部组件 -->
    <AppHeader></AppHeader>
    <!-- 吸顶组件 -->
    <AppHeaderSticky></AppHeaderSticky>
    <!-- 二级路由容器(出口) -->
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- 底部组件 -->
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import AppTopnav from '@/components/app-topnav'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppHeaderSticky from '@/components/app-header-sticky'
import { useStore } from 'vuex'
export default {
  name: 'LayoutVue',
  components: { AppTopnav, AppHeader, AppFooter, AppHeaderSticky },
  setup () {
    const store = useStore()
    store.dispatch('category/getCategory')
  }
}
</script>

<style lang="less" scoped>
</style>
