<template>
	<view>
		<view class='search_box'>
			<view>
				<image src='/static/images/nav_icon_search@3x.png'></image>
				<form bindsubmit="submit" action="">
					<input type='text' focus="true" :placeholder="placeholder" v-model='keyword' v-on:input="getVal"></input>
				</form>
			</view>
			<view @click="submit">搜索</view>
		</view>
		<view style="background:#fff;" :style="{height:height}" v-if="!searchTrue">
			<view>
				<view class="history">
					<view>
						<view>历史搜索</view>
						<image @click='clearHistory' src="/static/images/icon_sc@3x.png"></image>
					</view>
					<view class="historyTotal">
						<view v-for="item of history_list" :key="item.prodId" @click='chooseMe' :data-title="item">{{item}}</view>
					</view>
				</view>
				<view class="hot">
					<view>热门搜索</view>
					<view class="hotTotal">
						<view v-for="item of hotList" :key="item.id" @click='chooseMe' :data-title="item">{{item}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="searchProd" v-if="searchTrue">
			<view class="searchNav">
				<view @click="changeNav('')" :class="myIndex==''?'active':''">综合</view>
				<view @click="changeNav('2')" :class="myIndex==2?'active':''">销量</view>
				<view @click="changeNav('3')" :class="myIndex==3?'active':''">价格</view>
			</view>
			<view class="prodTotal" v-if="!isEmpty">
				<view class="oneProd" v-for="item of prodList " :key="item.prodid">
					<view @click.stop="gotoDetail(item.prodid)">
						<image :src="item.prodimg[0].url"></image>
					</view>
					<view>{{item.prodname}}</view>
					<view class="oneProdB">
						<view>
							<text>￥</text>
							<text>{{item.saleprice}}</text>
						</view>
						<view @click.stop="add_shoppingcar(item.prodid)">
							<image src="/static/images/index/icon_shop@3x.png"></image>
						</view>
					</view>

				</view>

			</view>
			<view v-if="isEmpty">
				<view class="mycontainer">
					<view class="headerTips">
						<view>
							<image src="/static/images/index/img_empty@3x.png"></image>
						</view>
						<view>哎呀，没有找到相关商品</view>
					</view>
				</view>

				<view class="gussLoveList">
					<view class="gussTitle">猜你喜欢</view>
					<view class="guessLove">
						<view class="oneLove" v-for="item of guessList" :key="item.prodid">
							<view @click.stop="gotoDetail(item.prodid)">
								<image :src="item.prodimg[0].url"></image>
							</view>
							<view>{{item.prodname}}</view>
							<view>
								<view>￥{{item.saleprice}}</view>
								<view @click.stop="add_shoppingcar(item.prodid)">
									<image src="/static/images/index/icon_shop@3x.png"></image>
								</view>
							</view>
						</view>


					</view>
				</view>

			</view>
		</view>




	</view>
</template>

<script>
	export default {
		data() {
			return {
				placeholder: '搜索你想要的商品',
				height: '',
				history_list: [],
				hotList: [], //热门搜索
				guessList: [], //猜你喜欢
				keyword: '', //关键词
				searchTrue: false, //是否搜索
				marketid: '',
				prodList: [], //全部商品
				prod_show: false,
				token: '',
				isEmpty: '',
				myIndex: ''

			}
		},
		onLoad: function() {
			this.marketid = uni.getStorageSync('marketid')
			this.history_list = uni.getStorageSync('history_list')
			this.token = uni.getStorageSync('token')
			if (this.history_list == '') {
				this.history_list = []
			}
		},
		onShow: function() {
			this.getHeight()
			this.getHotsearch()
		},
		methods: {
			//计算高度
			getHeight: function() {
				let info = uni.createSelectorQuery().select(".search_box");
				info.boundingClientRect((data) => { //data - 各种参数
					this.height = ((getApp().globalData.screenHeight - getApp().globalData.statusBarHeight - getApp().globalData.titleBarHeight) -
						data.height) + 'px'
				}).exec()
			},

			//获取热门搜索
			getHotsearch: function() {
				this.$urlRequest('getHotProduct.do', {
					marketid: this.marketid
				}).then(res => {
					this.hotList = res.data
				})
			},
			//搜索
			submit: function() {
				if (this.keyword == "") {
					this.$myToast('请输入商家名称或者菜品名称')
					return;
				}
				this.searchTrue = true
				this.$urlRequest('getProductByName.do', {
					marketid: this.marketid,
					name: this.keyword,
					type:this.myIndex
				}).then(res => {
					if (res.data.length != 0) {
						for (var item of res.data) {
							for (var key in item) {
								if (item[key] == null || item[key] == 'null') {
									item[key] = ''
								}
								if (key == 'prodimg') {
									item[key] = JSON.parse(item[key])
								}
							}
						}
						this.prodList = res.data
						this.isEmpty = false
					} else {
						this.prodList = []
						this.isEmpty = true
						this.guessLove()
					}
				})
				let history_list = this.history_list;
				let flag = false;
				for (var i = 0; i < this.history_list.length; i++) {
					if (this.history_list[i] == this.keyword) {
						flag = true;
					}
				}
				if (!flag) {
					if (this.history_list.length == 10) {
						history_list.pop();
					}

					history_list.unshift(this.keyword)
				} else {
					for (var i = 0; i < this.history_list.length; i++) {
						if (this.history_list[i] == this.keyword) {
							this.history_list.splice(i, 1)
						}
					}
					history_list.unshift(this.keyword)
				}
				uni.setStorage({
					key: "history_list",
					data: history_list
				})
				this.prod_show = true
				this.history_list = history_list

			},
			//获取猜你喜欢
			guessLove: function() {
				this.$urlRequest('getLikeProd.do', {
					marketid: this.marketid,
				}).then(res => {
					for (var item of res.data) {
						for (var key in item) {

							if (item[key] == null || item[key] == 'null') {
								item[key] = ''
							}
							if (key == 'prodimg') {
								item[key] = JSON.parse(item[key])
							}
						}
					}
					this.guessList = res.data
				})
			},
			//选择
			chooseMe: function(e) {
				this.keyword = e.currentTarget.dataset.title
				this.submit()
			},
			getVal: function() {
				this.prod_show = false;
				this.myIndex = ''
				if (this.keyword == '') {
					this.searchTrue = false
				}
			},
			//加入购物车
			add_shoppingcar: function(prodId) {
				console.log(prodId)
				if (!!!this.token) {
					uni.getSetting({
						success(res) {
							uni.navigateTo({
								url: '/pages/login/login_type',
							})
						}
					})
				} else {
					var data = {
						token: this.token,
						prodid: prodId
					}
					uni.showLoading({
						title:'正在加入购物车'
					})
					this.$urlRequest('addBusinessCarProd.do', data).then(res => {
						uni.hideLoading()
						if (res.state == 'true') {
							this.$myToast('已加入购物车')
						} else {
							this.$myToast(res.state)
						}
					})
				}
			},
			//清除历史搜素
			clearHistory: function() {
				uni.showModal({
					content: '确定清除所以历史记录?',
					success: (res) => {
						if (res.confirm) {
							this.history_list = []
							uni.setStorage({
								key: "history_list",
								data: this.history_list
							})
							this.$myToast('已全部清除')
						}
					}
				});
			},
			gotoDetail: function(prodId) {
				uni.navigateTo({
					url: '/pages/prodDetail/prodDetail?prodId=' + prodId
				})
			},
			//
			changeNav: function(type) {
				this.myIndex = type;
				this.$urlRequest('getProductByName.do', {
					marketid: this.marketid,
					name: this.keyword,
					type:this.myIndex
				}).then(res => {
					if (res.data.length != 0) {
						for (var item of res.data) {
							for (var key in item) {
								if (item[key] == null || item[key] == 'null') {
									item[key] = ''
								}
								if (key == 'prodimg') {
									item[key] = JSON.parse(item[key])
								}
							}
						}
						this.prodList = res.data
						this.isEmpty = false
					} else {
						this.prodList = []
						this.isEmpty = true
						this.guessLove()
					}
				})
			}
		}
	}
</script>

<style>
	/* pages/search/search.wxss */
	page {
		background: #efefef;
	}

	.active {
		border-bottom: 1px solid #58BA67;
		color: #58BA67 !important;
	}

	.search_box {
		background: #fff;
		padding: 10rpx;
		display: flex;
		justify-content: space-between;
	}

	.search_box>view:first-child {
		background: #F4F4F4;
		border-radius: 32rpx;
		padding: 5px;
		width: 85%;
		height: 50rpx;
		line-height: 50rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;

	}

	.search_box>view:first-child image {
		height: 23rpx;
		width: 23rpx;
		flex-shrink: 0;
		margin-right: 15rpx;
		display: block;
	}

	.search_box>view:first-child form {
		flex-grow: 1;
		font-size: 24rpx;
	}

	.search_box>view:last-child {
		flex-grow: 1;
		text-align: center;
		height: 50rpx;
		color: #58BA67;
		font-size: 26rpx;
		line-height: 50rpx;
	}

	.history,
	.hot {
		padding: 10rpx 30rpx;

	}

	.history>view:first-child,
	.hot>view:first-child {
		color: #333333;
		font-size: 26rpx;
	}

	.history>view:first-child {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.history>view:first-child>image {
		width: 25rpx;
		height: 27rpx;
		display: block;
	}

	.history>view:last-child,
	.hot>view:last-child {
		display: flex;
		margin-top: 20rpx;
		flex-wrap: wrap;
	}

	.history>view:last-child>view,
	.hot>view:last-child>view {
		font-size: 22rpx;
		color: #666666;
		background: #F4F4F4;
		margin-right: 30rpx;
		padding: 15rpx;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
	}

	/*搜素商品*/
	.searchNav {
		display: flex;
		justify-content: space-around;
		background: #fff;
		color: #333333;
		font-size: 32rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.prodTotal {
		margin: 0 30rpx;
		display: flex;
		flex-wrap: wrap;
		margin-top: 20rpx
	}

	.prodTotal .oneProd {
		background: #fff;
		border-radius: 10rpx;
		margin-bottom: 25rpx;
		width: 48%;
	}

	.prodTotal>view:nth-child(2n) {
		margin-left: 25rpx;
	}

	.prodTotal .oneProd>view:first-child {
		width: 310rpx;
		height: 310rpx;
		margin: auto;
		margin-top: 5rpx;
	}

	.prodTotal .oneProd>view:first-child>image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.prodTotal .oneProd>view:nth-child(2) {
		font-size: 28rpx;
		color: #333333;
		margin: 20rpx 10rpx;
	}

	.prodTotal .oneProd>view:nth-child(3) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20rpx 10rpx;
	}

	.prodTotal .oneProd>view:nth-child(3)>view:first-child>text:first-child {
		font-size: 26rpx;
		color: #FE6263;
	}

	.prodTotal .oneProd>view:nth-child(3)>view:first-child>text:last-child {
		font-size: 32rpx;
		color: #FE6263;
	}

	.prodTotal .oneProd>view:nth-child(3)>view:last-child>image {
		width: 54rpx;
		height: 54rpx;
		display: block;
	}

	.headerTips {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 60rpx;
	}

	.headerTips>view:first-child {
		width: 240rpx;
		height: 280rpx;
	}

	.headerTips>view:first-child>image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.headerTips>view:last-child {
		margin-top: 30rpx;
		font-size: 28rpx;
		color: #999999;
	}

	/*猜你喜欢*/
	.gussTitle {
		font-size: 30rpx;
		color: #000000;
		padding: 20rpx 0;
		text-align: center;
	}

	.gussLoveList {
		margin: 0 30rpx;
		margin-top: 60rpx;
	}

	.guessLove {
		display: flex;
		flex-wrap: wrap;
	}

	.guessLove>view:nth-child(2n) {
		margin-left: 32rpx;
	}

	.oneLove {
		background: #FFFFFF;
		border-radius: 20rpx;
		width: 43%;
		margin-bottom: 32rpx;
		padding: 0 17rpx;
		padding-bottom: 35rpx;
	}

	.oneLove>view:first-child {
		height: 200rpx;
		width: 50%;
		margin: auto;
		margin-top: 25rpx;
	}

	.oneLove>view:first-child>image {
		height: 100%;
		width: 100%;
		display: block;
	}

	.oneLove>view:nth-child(2) {
		color: #333333;
		font-size: 28rpx;
		margin: 50rpx 0;
	}

	.oneLove>view:nth-child(3) {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.oneLove>view:nth-child(3)>view:first-child {
		font-size: 26rpx;
		color: #EA5252;
	}

	.oneLove>view:nth-child(3)>view:last-child {
		margin-top: 10rpx;
	}

	.oneLove>view:nth-child(3)>view:last-child>image {
		width: 44rpx;
		height: 44rpx;

	}
</style>
