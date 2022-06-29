<template>
	<view>
		<view class="search-box">
			<uni-search-bar @confirm="search" @input="input" :value="searchKey" :radius="10" :focus="true" cancelButton="none"
				clearButton="auto"></uni-search-bar>
		</view>
		<!-- 搜索历史 -->
		<view class="search-history-box" v-if="searchKey.length==0">
			<!-- 标题 -->
			<view class="search-history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="CleanHistory"></uni-icons>
			</view>
			<!-- 历史列表 -->
			<view class="search-history-list">
				<uni-tag inverted="true" type="error" :text="item" v-for="(item,i) in historys" :key="searchHistory"
				@click="GoSearch(i)"></uni-tag>
			</view>
		</view>
		<!-- 搜索内容 -->
		<view class="search-list" v-else>
			<view class="search-item" v-for="(item,i) in searchResults" :key="i" @click="GotoDetail(item.goods_id)">
				<text>{{item.goods_name}}</text>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				searchKey: '',
				searchResults: [],
				searchHistory:[],
			};
		},
		onLoad() {
			this.searchHistory=JSON.parse(uni.getStorageSync('searchHistory')||'[]')
		},
		methods: {
			input(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.searchKey = e.valueOf();
					if(this.searchKey!==''){
						this.GetSearchRe();
					}else{
						this.searchResults=[]
					}
				}, 500)
			},
			async GetSearchRe() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.searchKey
				});
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				this.searchResults = res.message;
				this.SaveSearchKey(this.searchKey)
			},
			CleanHistory(){
				this.searchHistory=[];
				uni.setStorageSync('searchHistory',JSON.stringify(''))
			},
			GoSearch(ky){
				
				this.searchKey=[...this.searchHistory].reverse()[ky]
			},
			GotoDetail(goods_id) {
			  uni.navigateTo({
			    // 指定详情页面的 URL 地址，并传递 goods_id 参数
			    url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
			  })
			},
			SaveSearchKey(key){
				const set=new Set(this.searchHistory)
				set.delete(key)
				set.add(key);
				this.searchHistory=Array.from(set)
				uni.setStorageSync('searchHistory',JSON.stringify(this.searchHistory))
			}
		},
		computed:{
			historys() {
			    // 由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
			    // 而是应该新建一个内存无关的数组，再进行 reverse 反转
			    return [...this.searchHistory].reverse()
			  }
		}
	}
</script>

<style lang="scss">
	.search-list {
		padding: 0 5px;
		.search-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;
			text {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}
	.search-history-box{
		.search-history-title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 14px;
			border-bottom: 1px solid #efefef;
			text{
				padding-left: 10rpx;
			}
		}
		.search-history-list{
			display: flex;
			flex-wrap: wrap;
			margin-top: 5px;
			.uni-tag {
			      margin-left: 5px;
			    }
		}
	}
</style>
