<template>
	<view>
		<view class="search-container">
			<search @click="GoSearchView"></search>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 导航 -->
		<view class="navigation-list">
			<view v-for="(item,i) in navigationList" :key="i" class="navigation-item" @click="NavigationClick(item)">
				<image :src="item.image_src"></image>
			</view>
		</view>
		<!-- 楼层图 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<view class="floor-title">
					<image :src="item.floor_title.image_src"></image>
				</view>
				<view class="floor-content-box">
					<navigator :url="item.product_list[0].url+'&&title='+item.product_list[0].name" class="left-box">
						<image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}"  mode="widthFix"></image>
					</navigator>
					<view class="right-box-list">
						<navigator class="right-box-item" v-for="(item2,index) in item.product_list" :key="index" :url="item2.url+'&&title='+item2.name">
							<image v-if="index!=0" :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tabbartip from '../../mixins/tabbar-tip.js'
	export default {
		mixins:[tabbartip],
		data() {
			return {
				//轮播图数组
				swiperList: [],
				navigationList: [],
				floorList:[]
			};
		},
		onLoad() {
			this.GetSwiperList(),
			this.GetNavigationList(),
			this.GetFloorList()
		},
		methods: {
			async GetSwiperList() {
				const res = await uni.$http.get('/api/public/v1/home/swiperdata');
				if (res.data.meta.status !== 200) {
					return uni.$showMsg();
				}
				this.swiperList = res.data.message
			},
			async GetNavigationList() {
				const res = await uni.$http.get('/api/public/v1/home/catitems');
				if (res.data.meta.status != 200) {
					return uni.$showMsg();
				}
				this.navigationList = res.data.message;
			},
			async GetFloorList(){
				const res= await uni.$http.get('/api/public/v1/home/floordata');
				if (res.data.meta.status != 200) {
					return uni.$showMsg();
				}
				//添加图片的自定义url
				res.data.message.forEach(item=>{
					item.product_list.forEach(product=>{
						product.url='/subpkg/goods_list/goods_list?'+product.navigator_url.split('?')[1];
					})
				})
				this.floorList=res.data.message;
			},
			GoSearchView(){
				uni.navigateTo({
					url:"../../subpkg/searchView/searchView"
				})
			},
			NavigationClick(item){
				if(item.name=="分类"){
					uni.switchTab({
						url:"../cate/cate"
					})
				}
			}
		}

	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			height: 100%;
			width: 100%;
		}
	}
	.navigation-list{
		display: flex;
		justify-content: space-around;
		margin: 15px 0px;
		.navigation-item{
			image{
				height: 130rpx;
				width: 130rpx;
			}
		}
	}
	.floor-list{
		.floor-item{
			.floor-title{
				image{
					height: 60rpx;
					width: 100%;
				}
			}
			.floor-content-box{
				display: flex;
				margin-left: 10rpx;
				.left-box{
					
				}
				.right-box-list{
					display: flex;
					flex-wrap: wrap;
					justify-content: space-around;
					.right-box-item{
						
					}
				}
			}
		}
	}
	.search-container{
		//位置为顶部
		position: sticky;
		// 距离顶部为0
		top: 0;
		//在第999层
		z-index: 999;
	}
</style>
