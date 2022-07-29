<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span>
          <span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span>
          <span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            v-for="(tag, i) in commentInfo.tags"
            :key="i"
            :class="{ active: currIndex === i }"
            @click="changeTag(i)"
            >{{ tag.title }}（{{ tag.tagCount }}）</a
          >
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === null }"
        @click="changSort(null)"
        >默认</a
      >
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'createTime' }"
        @click="changSort('createTime')"
        >最新</a
      >
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        @click="changSort('praiseCount')"
        >最热</a
      >
    </div>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="(item, index) in listInfo" :key="index">
        <div class="user">
          <img :src="item.member.avatar" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i
              class="iconfont icon-wjx01"
              v-for="(score, i) in item.score"
              :key="i + 's'"
            ></i>
            <i
              class="iconfont icon-wjx02"
              v-for="(score, i) in 5 - item.score"
              :key="i + 'k'"
            ></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">{{ item.content }}</div>
          <!-- 图片组件 -->
          <GoodsCommentImage :pictures="item.pictures"></GoodsCommentImage>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan">
              <i class="iconfont icon-dianzan"></i>
              {{ item.praiseCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <XtxPagination
      @pageChange="pageChangeHandler"
      v-if="listInfo.length"
      :totalData="totalData"
      :pageSize="reqParams.pageSize"
      :currPage="reqParams.page"
    ></XtxPagination>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { getCommentInfoByGoods, getListInfoByGoods } from '@/api/goods'
import { useRoute } from 'vue-router'
import GoodsCommentImage from './goods-comment-image.vue'
export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup (props) {
    // 评价的头部信息
    const commentInfo = ref({})
    const route = useRoute()
    getCommentInfoByGoods(route.params.id).then((data) => {
      // 处理数据
      data.result.tags.unshift({
        title: '有图',
        tagCount: data.result.hasPictureCount
      })
      data.result.tags.unshift({
        title: '全部评价',
        tagCount: data.result.evaluateCount
      })
      commentInfo.value = data.result
    })

    // tag或排序改变的请求参数
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      // 当hasPicture、tag为null，即不携带这两个字段时，则请求'全部评价'数据
      hasPicture: null, // 为true时，请求'有图'数据
      tag: null, // 为title(String)时，请求该tag数据
      sortField: null // 排序 默认 null | 最新 createTime | 最热 praiseCount
    })

    // 列表信息
    const listInfo = ref({})
    const totalData = ref(0)
    watch(
      reqParams,
      (newValue) => {
        getListInfoByGoods(route.params.id, newValue).then((data) => {
          listInfo.value = data.result.items
          totalData.value = data.result.counts
        })
      },
      { immediate: true }
    )
    // vue2.0过滤器 <--> vue3.0函数
    // 格式化 specs
    const formatSpecs = (specs) => {
      return specs
        .reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '')
        .trim()
    }
    // 格式化 nickname
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }

    // tag改变，修改请求参数
    const currIndex = ref(0)
    const changeTag = (i) => {
      currIndex.value = i
      // 三种情况
      const tag = commentInfo.value.tags[i]
      if (i === 0) {
        // 1.请求'全部评价'数据
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (i === 1) {
        // 2.请求'有图'数据
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        // 3.请求其他tag数据
        reqParams.hasPicture = null
        reqParams.tag = tag.title
      }
      reqParams.page = 1
      reqParams.sortField = null
    }

    // 排序改变，修改请求参数
    const changSort = (type) => {
      reqParams.sortField = type
      reqParams.page = 1
    }

    // 页码改变，再次请求数据
    const pageChangeHandler = (newPage) => {
      reqParams.page = newPage
    }

    return {
      commentInfo,
      currIndex,
      reqParams,
      changeTag,
      changSort,
      listInfo,
      formatSpecs,
      formatNickname,
      totalData,
      pageChangeHandler
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
