<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <!-- 左侧目录 -->
    <ul class="menu">
      <li
        v-for="item in menulist"
        :key="item.id"
        @mouseenter="categoryId = item.id"
        :class="{ active: categoryId === item.id }"
      >
        <!-- 一级分类(左侧第一个) -->
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <!-- 两个二级分类(右侧) -->
        <template v-if="item.children">
          <RouterLink
            :to="`/category/sub/${sub.id}`"
            v-for="sub in item.children"
            :key="sub.id"
            >{{ sub.name }}</RouterLink
          >
        </template>
        <!-- 有数据显示 两个二级分类，无数据显示 骨架 -->
        <template v-else>
          <!-- 依据原来元素宽高传入数据 -->
          <XtxSkeleton
            width="60px"
            height="18px"
            style="margin-right: 5px"
            bg="rgba(255,255,255,0.2)"
          />
          <XtxSkeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)" />
        </template>
      </li>
    </ul>
    <!-- 右侧弹层 -->
    <div class="layer">
      <h4 v-if="currentCategory">
        {{ currentCategory.id == "brand" ? "品牌" : "分类" }}推荐
        <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <!-- 分类推荐 -->
      <ul
        v-if="
          currentCategory &&
          currentCategory.goods &&
          currentCategory.goods.length
        "
      >
        <!-- 每个 li 展示的是 goods 的 item -->
        <li v-for="goods in currentCategory.goods" :key="goods.id">
          <RouterLink to="/">
            <img :src="goods.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ goods.name }}</p>
              <p class="desc ellipsis">{{ goods.desc }}</p>
              <p class="price"><i>¥</i>{{ goods.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌推荐 -->
      <ul
        v-if="
          currentCategory &&
          currentCategory.brands &&
          currentCategory.brands.length
        "
      >
        <li
          class="brand"
          v-for="brand in currentCategory.brands"
          :key="brand.id"
        >
          <RouterLink to="/">
            <img :src="brand.picture" alt="" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ brand.place }}
              </p>
              <p class="name ellipsis">{{ brand.name }}</p>
              <p class="desc ellipsis-2">{{ brand.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { getBrand } from '@/api/home.js'
export default {
  name: 'HomeCategory',
  setup (props) {
    const store = useStore()
    // 第十个
    const Brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-child', name: '品牌推荐' }],
      brands: []
    })
    const menulist = computed(() => {
      // list：9个
      const list = store.state.category.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
          goods: item.goods,
          children: item.children && item.children.slice(0, 2)
        }
      })
      list.push(Brand)
      return list
    })

    // console.log(menulist);
    // 右侧商品，展示的是每个一级分类的 goods，即 menulist 中每一项的 goods
    const categoryId = ref(null)
    const currentCategory = computed(() => {
      return menulist.value.find((item) => item.id === categoryId.value)
    })

    // 获取品牌数据，注意setup不支持 async
    getBrand().then((res) => {
      Brand.brands = res.result
    })
    return { menulist, categoryId, currentCategory }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  // 弹层
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;

        // 品牌
        &.brand {
          height: 180px;
          a {
            align-items: flex-start;
            img {
              width: 120px;
              height: 160px;
            }
            .info {
              p {
                margin-top: 8px;
              }
              .place {
                color: #999;
              }
            }
          }
        }

        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
// 骨架效果
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
