import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from '@/store/store.js'

//网络请求包
import { $http } from '@escook/request-miniprogram'
//挂载到顶级对象中
uni.$http=$http;
//配置拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
  	title:"数据加载中",
	mask:true
  })
  if (options.url.indexOf('/my/') !== -1) {
      // 为请求头添加身份认证字段
      options.header = {
        // 字段的值可以直接从 vuex 中进行获取
        Authorization: store.state.m_user.token,
      }
    }
}
//配置响应拦截器
$http.afterRequest = function () {
  uni.hideLoading()
}
//定义域名
$http.baseUrl='https://api-hmugo-web.itheima.net'
//封装弹窗方法
uni.$showMsg=function(title="请求失败",duration=1500){
	uni.showToast({
		title,
		duration,
		icon:"none"
	})
}
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif