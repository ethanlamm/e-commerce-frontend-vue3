
<!-- HomeNew、HomeHot、HomeBrand组件使用的 面板组件，分头部区和内容区 -->

<template>
  <div class="home-panel">
    <div class="container">
      <!-- 头部区 -->
      <div class="head">
        <!-- 标题和副标题 -->
        <h3>
          {{ title }}<small>{{ subTitle }}</small>
        </h3>
        <!-- 右侧插槽 -->
        <slot name="right"></slot>
      </div>
      <!-- 内容区 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePanel',
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background-color: #fff;
  .head {
    padding: 40px 0;
    display: flex;
    align-items: flex-end;
    h3 {
      flex: 1;
      font-size: 32px;
      font-weight: normal;
      margin-left: 6px;
      height: 35px;
      line-height: 35px;
      small {
        font-size: 16px;
        color: #999;
        margin-left: 20px;
      }
    }
  }
}
</style>
