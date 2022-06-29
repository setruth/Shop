<template>
	<view class="login-tip-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" @click="GetUserInfo()">一键登录</button>
		 <text class="tips-text">避免影响正常购物请点击登录</text>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	export default {
		name:"login",
		computed:{
			 ...mapState('m_user', ['redirectInfo']),
		},
		data() {
			return {
				
			};
		},
		methods:{
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			GetUserInfo(e){
				uni.getUserProfile({
				desc:"完善你的个人信息",
				success: res =>{
					 // this.updateUserInfo(res.userInfo)
					 this.GetToken(res)
				},
				fail:(err) =>{
				uni.$showMsg("你取消了授权")
				}
				})
			},
			async GetToken(info){

				const [err, res] = await uni.login().catch(err => err)
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
				this.updateUserInfo(info.userInfo)
				// const query = {
				//     code: res.code,
				//     encryptedData: info.encryptedData,
				//     iv: info.iv,
				//     rawData: info.rawData,
				//     signature: info.signature
				//   }
				  //登录
				  // const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				    // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				this.updateToken('Bearer eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9. eyJ1 aWQi0jEyLCJpYXQi0jE1MjUOMDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_ 9DfHQQsBi0KZerk0-0-o')
				this.navigateBack()
			},
			navigateBack() {
			  // redirectInfo 不为 null，并且导航方式为 switchTab
			  if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
			    // 调用小程序提供的 uni.switchTab() API 进行页面的导航
			    uni.switchTab({
			      // 要导航到的页面地址
			      url: this.redirectInfo.from,
			      // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
			      complete: () => {
			        this.updateRedirectInfo(null)
			      }
			    })
			  }
			}
		}
	}
</script>

<style lang="scss">
.login-tip-container{
	height: 900rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  position: relative;
	  overflow: hidden;
	button{
		background-color: #d4237a;
		width: 60%;
		border-radius: 100px;
	}
	text{
		margin-top: 10rpx;
		    color: gray;
	}

}
</style>
