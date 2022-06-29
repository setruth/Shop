<template>
	<view class="my-container">
		<login v-if="!token"></login>
		<user-info v-else></user-info>
	</view>
</template>

<script>
	import tabbartip from '../../mixins/tabbar-tip.js';
	import { mapState } from 'vuex'
	export default {
		mixins:[tabbartip],
		computed:{
			...mapState('m_user', ['token']),
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
page, .my-container{
	height: 100%;
}
</style>
