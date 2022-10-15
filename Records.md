### 小兔鲜项目

#### 项目准备

一、vuex 持久化

二、路由层级配置

三、样式变量和自动导入

- 插件 [style-resources-loader - npm (npmjs.com)](https://www.npmjs.com/package/style-resources-loader)
- `npm install package`和`vue add package`的区别

四、重置样式(`npm i normalize.css`)和公用样式

​	为什么需要公用样式？

​	一些全局组件(复用)在全局使用，手写样式要好几份，因此可以放在公用样式中

五、字体图标

六、批量注册公共组件为全局组件

require.context() ：webpack提供的一个自动导入的API

七、**消息提示组件**



#### 首页模块

一、头部组件

- 一级分类和二级分类点击隐藏(`mousemove`替代`mouseenter`)

- 常量数据的应用

二、吸顶头部组件

- 传统方法：`scrollTop`的使用

- 组合API：[useWindowScroll | VueUse](https://vueuse.org/core/usewindowscroll/)的使用

二者均是基于CSS样式变化来实现效果

三、左侧分类弹窗

- 弹窗实现效果：[分类弹窗实现效果(CSS)](https://blog.csdn.net/MILK_LL/article/details/126854856?csdn_share_tail={"type"%3A"blog"%2C"rType"%3A"article"%2C"rId"%3A"126854856"%2C"source"%3A"MILK_LL"})

- 数据实现：定义中间变量接收`id`(默认为`null`)，`mouseenter`某一项，将此项`id`赋值给中间变量，使用计算属性得到该项，`return`给弹层使用。`mouseleave`离开最外层容器时，将中间变量重置为`null`
- 骨架占位：props--长、宽、背景色、是否动画
- 绝对定位，但比轮播图层级高：`position: absolute;  z-index: 99;`

四、轮播图

- 绝对定位，但比轮播图层级低：`position: absolute;  z-index: 98;`
- 全局组件：props--数据源、是否自动播放、间隔时间；`index`索引与样式的配合

五、面板封装(作为一个模板供其他组件使用)

- 结构一致(完全一样，不是看起来差不多)，内容不一样的：`props`传入
- 结构不一致的：`slot`传入

六、[Transition组件](https://cn.vuejs.org/guide/built-ins/transition.html)

真实数据和骨架(二次封装)的切换：`v-if/v-else`

`<Transition>`组件：

- 触发条件：`v-if`、`v-show`、`<component>`切换动态组件、自定义组件`key`属性的改变
- 作用：真实数据和骨架切换时做过渡效果

七、热门品牌

左右按钮(`0`和`1`)控制整个`ul`的移动

```
style="{transform:`translateX(${-index*1240}px)`}"
```

八、数据懒加载：@vueuse/core--useIntersectionObserver

九、图片懒加载

- [Web API--IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver) + 自定义指令
- [第三方包 vue-lazyload](https://www.npmjs.com/package/vue-lazyload) （**适合vue2.0**）



#### 分类模块

一、面包屑

`xtx-bread`组件(父容器)、`xtx-bread-item`组件(子项)

**`render`函数：**

- 返回值：VNode(虚拟节点，即要渲染的节点)
- 参数：`createElement`函数(别称：`h`函数)

**`createElement`函数**：接受三个参数

第一个参数：HTML标签名{String}、组件变量{Object(例如：App)}、async函数{Function}

第二个参数：模板的属性对象{Object}

第三个参数：子级虚拟节点{String|Array}
<details>
	<summary>render函数的使用</summary>
	<pre>
/**
 * render: 渲染函数
 * @param {Function} createElement
 * @returns {VNode}
 */
render: createElement => {
    return createElement(
        // 1. 第一个参数，要渲染的标签名称【必需】
        'div',
        // 2. 第二个参数，1中渲染的标签的属性【可选】，不使用此参数，用 null 占位
        {
            // 与 `v-bind:class` 的 API 相同，
            // 接受一个字符串、对象或字符串和对象组成的数组
            'class': {
                foo: true,
                bar: false
            },
            // 与 `v-bind:style` 的 API 相同，
            // 接受一个字符串、对象，或对象组成的数组
            style: {
                color: 'red',
                fontSize: '14px'
            },
            // 普通的 HTML attribute
            attrs: {
                id: 'foo'
            },
            // 组件 prop
            props: {
                myProp: 'bar'
            },
            // DOM property
            domProps: {
                innerHTML: 'baz'
            },
            // 事件监听器在 `on` 内，
            // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
            // 需要在处理函数中手动检查 keyCode。
            on: {
                click: this.clickHandler
            },
            // 仅用于组件，用于监听原生事件，而不是组件内部使用
            // `vm.$emit` 触发的事件。
            nativeOn: {
                click: this.nativeClickHandler
            },
            // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
            // 赋值，因为 Vue 已经自动为你进行了同步。
            directives: [
                {
                    name: 'my-custom-directive',
                    value: '2',
                    expression: '1 + 1',
                    arg: 'foo',
                    modifiers: {
                        bar: true
                    }
                }
            ],
            // 作用域插槽的格式为
            // { name: props => VNode | Array<VNode> }
            scopedSlots: {
                default: props => createElement('span', props.text)
            },
            // 如果组件是其它组件的子组件，需为插槽指定名称
            slot: 'name-of-slot',
            // 其它特殊顶层 property
            key: 'myKey',
            ref: 'myRef',
            // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
            // 那么 `$refs.myRef` 会变成一个数组。
            refInFor: true
        },
        // 3. 第三个参数，1中渲染的标签的子元素数组【可选】，不使用此参数，用 null 占位 或不写
        [
            createElement(
                'span', 
                null, 
                '友情链接'
            )，
            createElement(
                'a', 
                {
                    attrs: {
                        href: 'https://www.baidu.com'
                    }
                }, 
                '百度'
            )
        ]
    )
}
</details>




二、一级分类页面数据展示

监听路由`params`参数`id`的变化，区分一级分类`id`还是二级分类`id`(通过`route.path`区分)，获取数据

三、面包屑切换动画

- 自定义组件`key`属性的改变
- 模式mode、动画延迟(`transition-delay: 0.5s;`)

四、二级分类面包屑

整理数据、动画

五、筛选区、排序区

- 请求参数的整理

- 封装复选框组件：@vueuse/core useVModel

六、无限组件(@vueuse/core useIntersectionObserver + emit通知父组件)



#### 商品详情

一、放大镜效果

- [useMouseInElement | VueUse](https://vueuse.org/core/usemouseinelement/)
- 显示哪张图片：`images[currIndex]`
- 遮罩层和大图的显示和隐藏：通过鼠标位置是否在检测的目标元素内控制
- 遮罩层和大图背景图的位置(style属性)：前者通过定位控制，后者通过背景图位置控制

二、城市组件

- 数据处理：内存缓存，包装成异步(Promise)

- [onClickOutside | VueUse](https://vueuse.org/core/onclickoutside/)

- 利用`computed`来更改展示地区信息

- 父子组件通信：

  1）父 ==> 子：默认地址|用户已选默认地址，子组件用作**初始地址**展示

  2）子 ==> 父：子组件选择完毕，传出选择的地址，再由父组件传给子组件，子组件展示选择的地址

三、★规格组件★

1.每个`value`属性都有`selected`、`disabled`类名，做选中和禁用效果

2.依据原生数组改造为幂数组：[方法power-set](https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/sets/power-set)、[源文件](https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/sets/power-set/bwPowerSet.js)

3.初始化可以属性和不可点属性`[undefined,...]`

4.选择完毕后，数组间通信

四、数量选择组件

- `input`标签`readonly`属性(避免了验证输入的合法性)
- 双向数据绑定：@vueuse/core useVModel

五、按钮组件

封装一个通用按钮组件，有大、中、小、超小四种**尺寸**，有默认、主要、次要、灰色四种**类型**（`props:{size、type}`）

六、Tab组件

结构：

```vue
<nav><a>标签1</a><a>标签1</a></nav>
<component :is="componentName"></component>
```

`component`动态渲染组件：`is`的值是一个字符串，它既可以是 HTML 标签名称也可以是组件名称

七、评价组件

​	**两种筛选条件的组合**

八、分页器

- 暴露属性(`props`属性)：总数据条数、当前页、中间连续页数、每页展示数据条数

- 需要的属性(`computed`属性)：

​		1）总页数

​		2）中间连续页数=>偏移量=>开始页码数、结束页码数=>中间连续页码数组

- 切换页数的方法、通知父组件

九、热榜组件

​	**map自定义字典的使用**



#### 登录模块

一、账户登陆和扫码登陆的切换、账号登录和短信登录的切换

​	切换后需要清除之前填入的数据

二、表单验证

- [第三方包vee-validate](https://www.npmjs.com/package/vee-validate)、[官网VeeValidate](https://vee-validate.logaretm.com/v4/)

- `Form组件`、`Field组件`需要注册！！！

- 给`Form组件`打上标签`ref="FormCom"`，则`FormCom`拥有许多验证相关的方法，例如：

  1）表单整体验证`FormCom.value.validate()`、

  2）清除验证结果`FormCom.value.resetForm()`

  3）提示错误信息`FormCom.value.setFieldError('mobile', vaild)`

- 亦可单独验证某一项：`const vaild = mySchema.mobile(form.mobile)`

三、定时器(验证码)

- [useIntervalFn | VueUse](https://vueuse.org/shared/useintervalfn/)
- 组件销毁需要销毁定时器：`vue2.x：beforeDestroy`、`vue3.x：onUnmounted`

四、[第三方登录(QQ登录)](http://zhoushugang.gitee.io/erabbit-client-pc-document/guide/06-login.html#_11-登录-qq登录-按钮处理)

- 文档说明：[JS_SDK使用说明](https://wiki.connect.qq.com/js_sdk使用说明)、[get_user_info](https://wiki.connect.qq.com/get_user_info)
- 注意：**回调地址**必须以http或https开头，所以开发时的临时服务器`localhost:8080`不能使用，需要一个**真实地址**，同时需要在`vue.config.js`中配置[allowedHosts](https://webpack.docschina.org/configuration/dev-server/#devserverallowedhosts)

- 得到QQ登录地址后，为了保持该地址的私密性，最好使用点击事件跳转，不要直接将地址赋值给`a`标签的`src`属性(浏览器`devtools`能查看到)

- QQ登录地址(包含回调地址)、`index.html`页引入的`script`标签中的回调地址、`router/index.js`中的回调路由应该保持一致(包括`hash`模式或`history`模式)

- QQ登录相关API：`QC.Login.check()`、`QC.Login.getMe(openId=>{})`、`QC.api('get_user_info').success(({data})=>{})`

五、回调地址

跳转至回调地址后的业务：

`index.vue`页依据`openId`去验证登录的QQ是否已绑定账号

若请求成功，表示有账号并且QQ已绑定存储返回用户信息，跳转至来源页或首页

若请求失败，展示两个表单进行绑定(①有账号，QQ未登录；②无账号，QQ未登录)。一开始两个表单都隐藏，验证期间展示`loading`图。两个表单拆分成两个组件



#### 购物车

- 购物车的各种操作都会有两种状态的区分(已登录、未登录)，封装在vuex中的action中区分
- 不管何种操作何种状态返回一个promise，然后组件能够判断操作是否完毕是否成功，再而去做其他事情
- 登录后，需要合并本地购物车到服务端
- 退出后，清空vuex数据也会同步清空本地数据





#### 结算和支付

一、确认框组件

二、对话框组件

三、支付

```text
jfjbwb4477@sandbox.com
111111
111111
```





#### 个人中心

一、mock数据

二、菜单激活	[active-class](https://router.vuejs.org/zh/api/#active-class)、[exact-active-class](https://router.vuejs.org/zh/api/#exact-active-class)

三、Tabs组件

四、steps组件
