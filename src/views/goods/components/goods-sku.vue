<template>
  <div class="goods-sku">
    <dl v-for="spec in goods.specs" :key="spec.id">
      <dt>{{ spec.name }}</dt>
      <dd>
        <template v-for="val in spec.values" :key="val.name">
          <img
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="selectSkuValue(spec, val)"
          />
          <span
            v-else
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="selectSkuValue(spec, val)"
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import bwPowerSet from '@/vender/power-set'
const spliter = '★'
// 得到路径字典对象的方法
const getPathMap = (skus) => {
  const pathMap = {}
  // console.log(skus);
  // 1.遍历skus，取出有货sku
  // 2.遍历有货sku.specs，取出每个属性，并组合成一个属性数组(映射)
  // 3.依据属性数组，使用bwPowerSet方法，得到幂数组
  // 4.依据幂数组，映射得到路径字典对象
  skus.forEach((sku) => {
    // 1.有货？
    if (sku.inventory > 0) {
      // 2.得到属性数组
      const attrArr = sku.specs.map((attrObj) => attrObj.valueName)

      // 3.得到幂数组
      // 属性数组[1,2,3] ==bwPowerSet==> 幂数组[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      const powerArr = bwPowerSet(attrArr)

      // 4.得到路径字典对象
      // 幂数组 -映射-> 路径字典
      // 幂数组中的元素(数组)，作为路径字典对象的key，sku.id作为路径字典对象的相应key的value
      powerArr.forEach((item) => {
        // 排除幂数组中第一个空数组
        if (item.length !== 0) {
          const key = item.join(spliter) // 数组不能作为key，要转换成字符串

          if (pathMap[key]) {
            // 如果路径字典中存在该key，则push当前项的sku.id
            pathMap[key].push(sku.id)
          } else {
            // 如果路径字典中不存在该key，则赋值当前项的sku.id作为元素的数组
            pathMap[key] = [sku.id]
          }
        }
      })
    }
  })

  return pathMap
}

// 得到点击后的已选择属性的数组
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach((spec) => {
    const selectedVal = spec.values.find((val) => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}
// 更新属性禁用状态
const updateStatus = (specs, pathMap) => {
  // 1.每个specs.values中的item项的disabled控制本身是否禁用
  // 标准：是否存在于pathMap的key中

  specs.forEach((spec, index) => {
    // selectedArr初始值均为undefined
    const selectedArr = getSelectedArr(specs)
    // console.log("##", selectedArr);
    spec.values.forEach((val) => {
      // 2.选中的值，说明是可选的，则不会禁用
      if (val.selected) return

      // 3.selectedArr初始值均为undefined，而specs每项的values的初始值均未选中，val.selected=false
      // 为初始化时，每项依据pathMap来决定是否禁用，则初始时每项选中一次，然后拿选中项与pathMap对比
      selectedArr[index] = val.name
      // console.log("@@", selectedArr);

      // 4.剔除undefined，并生成key
      const key = selectedArr.filter((v) => v !== undefined).join(spliter)
      // console.log(key);

      // 5.根据生成的key去pathMap中找，找到了，就不禁用；否则就禁用
      val.disabled = !pathMap[key]
    })
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    //   拿到路径字典
    const pathMap = getPathMap(props.goods.skus)
    // 初始化时，渲染可点属性与不可点属性
    updateStatus(props.goods.specs, pathMap)
    // console.log(pathMap);
    // 点击选择属性的回调
    const selectSkuValue = (spec, val) => {
      // vue2.0：Vue.$set(obj,key,value)
      // vue3.0：可直接添加属性并且是响应式的
      // 如果选择项的disabled为真，则return
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        spec.values.forEach((Item) => (Item.selected = false))
        val.selected = true
      }
      // 点击后，得到已选属性数组
      // console.log(getSelectedArr(props.goods.specs));
      updateStatus(props.goods.specs, pathMap)
    }

    return { selectSkuValue }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
