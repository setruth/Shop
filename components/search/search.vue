<template>
	<view>
		<view class="search-container" @click="GoSearchView">
			<view class="search-box">
				<uni-icons type="search" size="20"></uni-icons>
				<text class="search-text">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"search",
		data() {
			return {
				
			};
		},
		methods:{
			GoSearchView(){
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
.search-container{
	background-color: #d4237a;
	padding: 10px 10px;
	.search-box{
		background-color: #FFFFFF;
		border-radius: 10px;
		height: 100%;
		line-height: 80rpx;
		text-align: center;
		font-size: 30rpx;
	}
}
</style>
