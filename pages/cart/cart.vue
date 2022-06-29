<template>
	<view>
		<choice-address></choice-address>
		<view class="cart-title">
			<uni-icons type="shop" size="18"></uni-icons>
			<text class="cart-title-text">购物车</text>
		</view>
		<view class="cart-content">
			<uni-swipe-action>
				<block v-for="(item,i) in cart" :key="i">
					<uni-swipe-action-item :right-options="options" @click="DeleteItem(item)">
						<view class="goods-item-box">
							<view class="item-left">
								<radio :checked="item.goods_state" @click="ClickRadio(item)" color="#c00000"></radio>
								<image :src="item.goods_small_logo ?item.goods_small_logo:defaultPic"></image>
							</view>
							<view class="item-right">
								<view class="item-right-name" @click="GotoGoodsDeTail(item)">
									<text>{{item.goods_name}}</text>
								</view>
								<view class="item-right-price">
									<text>￥{{item.goods_price | tofixed}}</text>
									<view class="goods-change-number-box">
										<button @click="AddCount(item)">+</button>
										<input class="inputNumber" type="number" :value="item.goods_count"
											@blur="InputChange(item,$event)" />
										<button @click="SubCount(item)">-</button>
									</view>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</block>
			</uni-swipe-action>
		</view>
		<view class="cart-tabbar-box">
			<label class="radio">
				<radio color="#C00000" :checked="isChoiseAll" @click="ClickAll()" /><text>{{showChoise}}</text>
			</label>
			<view class="settlement-container">
				已选:{{choiseGoods}}件
				合计<text>￥{{totalPrice}}</text>
				<button @click="Settlement()">结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import tabbartip from '../../mixins/tabbar-tip.js'
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		mixins: [tabbartip],
		computed: {
			...mapState('m_user', ['token']),
			...mapState('m_cart', ['cart']),
		},
		data() {
			return {
				timer: null,
				seconds: 3,
				choiseGoods: 0,
				totalPrice: 0,
				isChoiseAll: true,
				options: [{
					text: '删除', // 显示的文本内容
					style: {
						backgroundColor: '#C00000' // 按钮的背景颜色
					}
				}],
				showChoise: '全选'
			};
		},
		filters: {
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		},

		methods: {
			...mapMutations('m_user', ['updateRedirectInfo']),
			// 展示倒计时的提示消息
			showTips(n) {
				// 调用 uni.showToast() 方法，展示提示消息
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示的消息
					title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			...mapGetters('m_user', ['addstr']),
			//结算
			Settlement() {
				if (this.choiseGoods == 0)
					return uni.$showMsg("请选择商品")
				if (!this.token)
					return this.delayNavigate()
				if (!this.addstr())
					return uni.$showMsg('请选择收货地址！')
				this.payOrder()
			},
			//发起订单支付
			async payOrder(){
				const orderInfo = {
				    // 开发期间，注释掉真实的订单价格，
				    // order_price: 
				    // 写死订单总价为 1 分钱
				    order_price: 0.01,
				    consignee_addr: this.addstr,
				    goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
				  }
				  // 1.2 发起请求创建订单
				//  const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				const payObj={
					'nonceStr': "IYKlc5iscUgZIfxj",
					'package': "prepay_ _id=wx011604003115645ec1be4d48174ea70000",
					'paySign': "AD04ED5A386B52864E176A5DF26CF436",
					'signType': "MD5",
					'timeStamp':'1598947444'
				}
				uni.$showMsg("无后台!!不能结算")		 
			},
			delayNavigate() {
				this.seconds = 3
				// 1. 展示提示消息，此时 seconds 的值等于 3
				this.showTips(this.seconds)

				// 2. 创建定时器，每隔 1 秒执行一次
				this.timer = setInterval(() => {
					// 2.1 先让秒数自减 1
					this.seconds--
					if (this.seconds <= 0) {
						clearInterval(this.timer)
						// 2.2 跳转到 my 页面
						uni.switchTab({
							url: '../my/my',
							success: () => {
								// 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
								this.updateRedirectInfo({
									// 跳转的方式
									openType: 'switchTab',
									// 从哪个页面跳转过去的
									from: '../cart/cart'
								})
							}
						})
						return
					}
					// 2.2 再根据最新的秒数，进行消息提示
					this.showTips(this.seconds)
				}, 1000)
			},
			DeleteItem(item) {
				this.totalPrice -= item.goods_count * item.goods_price
				this.removeGoodsById(item.goods_id)
				if (this.cart.length == 0) {
					this.isChoiseAll = false
				}
				this.calculationTotalPrice()
				this.ShowTabTip()
			},
			ChangeGoodsNumber() {
				this.updateGoodsNumber()
				this.ShowTabTip()
			},
			...mapMutations('m_cart', ['updateGoodsState']),
			...mapGetters('m_cart', ['getSelectNum']),
			...mapMutations('m_cart', ['updateGoodsNumber', 'removeGoodsById', 'saveToStorage']),
			GotoGoodsDeTail(item) {
				uni.navigateTo({
					url: "/subpkg/goods_detail/goods_detail?goods_id=" + item.goods_id
				})
			},
			ClickRadio(item) {
				item.goods_state = !item.goods_state
				this.calculationTotalPrice()
				if (!item.goods_state) {
					this.isChoiseAll = false
				} else {
					this.calculationChooseCount()
				}
				this.updateGoodsState(item)
			},
			ClickAll() {
				if (!this.isChoiseAll) {
					this.cart.forEach(x => {
						x.goods_state = true
					})
					this.showChoise = "全选"
					this.isChoiseAll = !this.isChoiseAll
					this.calculationTotalPrice()
					this.saveToStorage()
				} else {
					this.isChoiseAll = false
					this.cart.forEach(x => {
						x.goods_state = false
					})
					this.showChoise = "未全选"
					this.calculationTotalPrice()
					this.saveToStorage()
				}
			},
			InputChange(item, e) {
				if (!isNaN(Number(e.detail.value))) {
					var nowNum = e.detail.value | 0;
					nowNum = nowNum < 1 ? 1 : nowNum;
					if (nowNum != item.goods_count) {
						// console.log('内容改变了' + nowNum)
						item.goods_count = nowNum
						this.ChangeGoodsNumber()
						this.calculationTotalPrice()

					} else {
						// console.log('和原数据相同')
						item.goods_count = nowNum
					}
				} else {
					item.goods_count = 1
				}
			},
			AddCount(item) {
				item.goods_count++
				this.ChangeGoodsNumber()
				this.totalPrice += item.goods_price
				this.ShowTabTip()
				this.choiseGoods = this.getSelectNum()
			},
			SubCount(item) {
				item.goods_count--
				this.ShowTabTip()
				if (item.goods_count < 1) {
					this.totalPrice = item.goods_count * item.goods_price
					this.removeGoodsById(item.goods_id)
					if (this.cart.length == 0) {
						this.isChoiseAll = false
					}
					this.choiseGoods = this.getSelectNum()
					return;
				}

				this.ChangeGoodsNumber()
				this.ShowTabTip()
				this.totalPrice -= item.goods_price
				this.choiseGoods = this.getSelectNum()
			},
			calculationTotalPrice() {
				this.totalPrice = 0
				this.cart.forEach(item => {
					if (item.goods_state) {
						this.totalPrice += (item.goods_count * item.goods_price)
					}
				})
				this.ShowTabTip()
				this.choiseGoods = this.getSelectNum()
			},
			calculationChooseCount() {
				var n = 0
				this.cart.forEach(item => {
					if (!this.isChoiseAll && item.goods_state) {
						n++
					}
				})
				if (this.cart.length == 0) {
					this.isChoiseAll = false
				} else if (n == this.cart.length) {
					this.isChoiseAll = true
				} else {
					this.isChoiseAll = false
				}
			}
		},
		onLoad() {
			this.calculationTotalPrice()
			this.calculationChooseCount()
		},
		onShow() {
			this.calculationTotalPrice()
			this.calculationChooseCount()
		}
	}
</script>

<style lang="scss">
	.cart-title {
		height: 80rpx;
		display: flex;
		width: 100%;
		border-bottom: 1px solid #efefef;
		align-items: center;

		text {
			font-size: 14px;
			padding-left: 10rpx;

		}
	}

	.goods-item-box {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.item-left {
			margin-right: 5px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			image {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.item.right-name {}

			.item-right-price {
				display: flex;
				justify-content: space-between;
				margin-top: 10px;

				text {
					font-size: 16px;
					color: #c00000;
				}

				.goods-change-number-box {
					display: flex;
					justify-content: space-around;
					align-items: center;
					height: 80rpx;
					border: 1rpx solid #efefef;
					box-shadow: 3px 5px 5px #656B79;

					input {
						height: 100%;
						width: 100rpx;
						font-size: 18px;
						text-align: center;
					}
				}
			}
		}
	}

	.cart-tabbar-box {
		display: flex;
		position: fixed;
		// 距离顶部为0
		bottom: 0;
		//在第999层
		z-index: 999;
		background-color: #FFFFFF;
		align-items: center;
		width: 100%;
		justify-content: space-between;

		.radio {
			margin-left: 10rpx;
		}

		.settlement-container {
			margin-right: 10rpx;
			align-items: center;
			display: flex;

			text {
				color: #C00000;
				margin-right: 20rpx;
			}

			button {
				background-color: #C00000;
				color: #FFFFFF;
				width: 200rpx;
			}
		}
	}

	.cart-content {
		margin-bottom: 100rpx;
	}
</style>
