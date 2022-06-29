import {mapGetters} from'vuex'
	
	export default {
		computed:{
			...mapGetters('m_cart',['total'])
		},
		onShow() {
			this.ShowTabTip()
		},
		methods:{
			ShowTabTip(){
				uni.setTabBarBadge({
					index:2,
					text:this.total>0?this.total+'':''
				})
			}
		}
	}