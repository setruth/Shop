<template>
	<view>
		<search @click="GoSearchView"></search>
		<view class="scroll-view-container">
			<scroll-view class="left-scroll-container" scroll-y="true" :style="{height: containerHeight + 'px'}">
				<view :class="['.left-scroll-item',i===leftActive?'active':'']" v-for="(item,i) in cateList" :key="i"
					@click="ClickLeftItem(i)">
					{{item.cat_name}}
				</view>
			</scroll-view>
			<scroll-view class="right-scroll-container" scroll-y="true" :scroll-top="srollTop" :style="{height: containerHeight + 'px'}">
				<view class="right-scroll-item" v-for="(item,i) in cateLevel2" :key="i">
					<view class="right-scroll-item-title">/{{item.cat_name}}/</view>
					<view class="right-scroll-content">
						<view class="right-scroll-item-content" v-for="(item2,i2) in item.children" :key="i2" @click="GoToGoodsList(item2)">
							<image :src="item2.cat_icon"></image>
							<text>{{item2.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import tabbartip from '../../mixins/tabbar-tip.js'
	export default {
		mixins:[tabbartip],
		data() {
			return {
				cateList: [],
				leftActive: 0,
				containerHeight: 0,
				cateLevel2: [],
				srollTop:0,
			};
		},
		methods: {
			async GetCateList() {
				const res = await uni.$http.get('/api/public/v1/categories');
				if (res.data.meta.status !== 200) {
					return uni.$showMsg();
				}
				this.cateList = res.data.message;
				this.cateLevel2 = res.data.message[0].children;
			},
			ClickLeftItem(i) {
				this.leftActive = i;
				this.cateLevel2 = this.cateList[i].children;
				this.srollTop=this.srollTop===0?0.01:0;
			},
			GoToGoodsList(item){
				uni.navigateTo({
					url:'../../subpkg/goods_list/goods_list?cid='+item.cat_id+'&&listName='+item.cat_name
				})
			},
			GoSearchView(){
				uni.navigateTo({
					url:"../../subpkg/searchView/searchView"
				})
			}
		},
		onLoad() {
			 const sysInfo = uni.getSystemInfoSync()
			       // 为 wh 窗口可用高度动态赋值
			this.containerHeight = sysInfo.windowHeight-65
			this.GetCateList()
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-container {
			width: 120px;

			.left-scroll-item {
				text-align: center;
				line-height: 120rpx;
				background-color: #f7f7f7;

				&.active {
					background-color: #ffffff;
					position: relative;

					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 100%;
						background-color: #c00000;
						position: absolute;
					}
				}
			}
		}
		.right-scroll-container {
			.right-scroll-item {
				.right-scroll-item-title {
					text-align: center;
					font-weight: bold;
					padding: 20rpx;
				}
				.right-scroll-content{
					display: flex;
					flex-wrap: wrap;
					.right-scroll-item-content{
						width: 33.33%;
						display: flex;
						 flex-direction: column;
						 align-items: center;
						 margin-bottom: 20rpx;
						image{
							width: 120rpx;
							height: 120rpx;
						}
						text{
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
</style>
