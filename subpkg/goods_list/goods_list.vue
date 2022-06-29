<template>
	<view class="goods-list">
		<view class="goods-item-box" v-for="(item,i) in goodsList" :key="i" @click="GotoGoodsDeTail(item)">
			<view class="item-left">
				<image :src="item.goods_big_logo ?item.goods_big_logo:defaultPic"></image>
			</view>
			<view class="item-right">
				<view class="item-right-name">
					<text>{{item.goods_name}}</text>
				</view>
				<view class="item-right-price">￥{{item.goods_price | tofixed}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj: {
					//查询关键字
					query: '',
					//商品分类id
					cid: '',
					//页码值
					pagenum: 1,
					// 一次请求数量
					pagesize: 10
				},
				goodsList: [],
				total: 0,
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		onLoad(parameter) {
			this.queryObj.query = parameter.query || ''
			this.queryObj.cid = parameter.cid || ''
			this.GetGoodsList()
		},
		filters:{
			tofixed(num){
				return Number(num).toFixed(2)
			}
		},
		onReachBottom() {
			
			if(this.queryObj.pagenum*this.queryObj.pagesize<=this.total){
				this.queryObj.pagenum+=1
				this.GetGoodsList()
			}else{
				uni.$showMsg("没有内容了")
			}
			
		},
		onPullDownRefresh() {
			this.queryObj.pagenum=1
			this.total=0
			this.goodsList=[]
			this.GetGoodsList(()=>{
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			async GetGoodsList(cd) {
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				if (res.meta.status == 200) {
					this.total = res.message.total;
					this.goodsList =[...this.goodsList,...res.message.goods];
					cd&&cd()
				}else{
					uni.$showMsg()
				}
			},
			GotoGoodsDeTail(item){
				uni.navigateTo({
					url:"/subpkg/goods_detail/goods_detail?goods_id="+item.goods_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item-box {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.item-left {
			margin-right: 5px;

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
			.item.right-name {
				
			}

			.item-right-price {
				margin-top: 10px;
				font-size: 16px;
				color: #c00000;
			}
		}
	}
</style>
