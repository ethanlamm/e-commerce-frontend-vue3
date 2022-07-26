<template>
  <div class="xtx-city" ref="target">
    <div class="select" :class="{ active }" @click="toggleDialog">
      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          v-for="item in curlist"
          :key="item.code"
          @click="select(item)"
        >
          {{ item.name }}
        </span>
      </template>
    </div>
  </div>
</template>
<script>
import { computed, ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      tyepe: String,
      default: ''
    },
    placeholder: {
      tyepe: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 控制展开收起,默认收起
    const active = ref(false)
    // 城市数据
    const cityData = ref([])
    // loading效果
    const loading = ref(false)

    // 打开
    const openDialog = () => {
      active.value = true
      // 打开时 loading
      loading.value = true
      // 每次打开先清空上次选择的数据
      for (const key in selectedRecord) {
        selectedRecord[key] = ''
      }
      // 打开时请求数据
      getCityData().then((data) => {
        cityData.value = data
        // 有数据后关闭
        loading.value = false
      })
    }
    // 关闭
    const closeDialog = () => {
      active.value = false
    }
    // 切换展开收起
    const toggleDialog = () => {
      // 打开-->关闭 | 关闭-->打开
      active.value ? closeDialog() : openDialog()
    }
    // 点击其他位置隐藏 使用onClickOutside方法
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })

    // 计算属性
    const curlist = computed(() => {
      // 城市数据结构：省-市-区
      // 省
      let templist = cityData.value
      // 市
      if (selectedRecord.provinceCode) {
        // 说明已选择了省，此时应该展示该省的市列表
        templist = templist.find(
          (item) => item.code === selectedRecord.provinceCode
        ).areaList
      }
      // 区
      if (selectedRecord.cityCode) {
        // 说明已选择了市，此时应该展示该市的地区列表
        templist = templist.find(
          (item) => item.code === selectedRecord.cityCode
        ).areaList
      }
      return templist
    })

    // 记录选择的地址
    const selectedRecord = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countryCode: '',
      countryName: '',
      fullLocation: ''
    })
    // 选择地址方法
    const select = (item) => {
      // 省
      if (item.level === 0) {
        selectedRecord.provinceCode = item.code
        selectedRecord.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        selectedRecord.cityCode = item.code
        selectedRecord.cityName = item.name
      }
      // 区
      if (item.level === 2) {
        selectedRecord.countryCode = item.code
        selectedRecord.countryName = item.name
        // 选择完毕，关闭选择对话框，传数据给父组件
        selectedRecord.fullLocation = `${selectedRecord.provinceName} ${selectedRecord.cityName} ${selectedRecord.countryName}`
        closeDialog()
        emit('selectedAttr', selectedRecord)
      }
    }
    return { active, toggleDialog, target, curlist, loading, select }
  }
}
// 获取城市地址数据
const getCityData = () => {
  // 获取城市数据
  // 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 2. 何时获取？打开城市列表的时候，做个内存中缓存 ===> window.cityData
  // 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
  // 由于请求数据是异步，而从内存中取数据是同步，那么则包装成一个promise
  return new Promise((resolve, reject) => {
    // 若内存中有数据，则返回内存中的数据
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      // 无数据则发请求，并存储于内存中
      const url =
        'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(({ data }) => {
        // 存储
        window.cityData = data
        // 返回数据
        resolve(data)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    // loading效果
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
