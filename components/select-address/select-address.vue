<template>
	<view>
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
		  <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		<view class="address-info-box" v-else>
		  <view class="row1">
		    <view class="row1-left">
		      <view class="username">收货人：<text>{{address.userName}}</text></view>
		    </view>
		    <view class="row1-right">
		      <view class="phone">电话：<text>{{address.telNumber}}</text></view>
		      <uni-icons type="arrowright" size="16"></uni-icons>
		    </view>
		  </view> 
		  <view class="row2">
		    <view class="row2-left">收货地址：</view>
		    <view class="row2-right">{{addstr}}</view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"select-address",
		
		computed:{
			...mapState('m_user', ['address']),
			 addstr() {
			    if (!this.address.provinceName) return ''
			
			    // 拼接 省，市，区，详细地址 的字符串并返回给用户
			    return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
			  }
		},
		data() {
			return {
				
			};
		},
		methods:{
			...mapMutations('m_user', ['updateAddress']),
			 async chooseAddress() {
			    // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
			    //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
			    const [err, succ] = await uni.chooseAddress().catch(err => err)
			
			    // 2. 用户成功的选择了收货地址
			    if (err === null && succ.errMsg === 'chooseAddress:ok') {
			     this.updateAddress(succ)
			    }
			  }
		}
	}
</script>

<style lang="scss">

</style>
