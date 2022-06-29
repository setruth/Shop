import Vue  from "vue"
import Vuex from "vuex"
//导入购物车模块
import moduleCart from '@/store/cart.js'
//导入用户地址
import moduleUser from './user.js'
Vue.use(Vuex)
const store=new Vuex.Store({
	modules:{
		'm_cart':moduleCart,
		'm_user': moduleUser,
	}
})
export default store