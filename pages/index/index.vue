<template>
	<view>
		<view class="header_s">
			<view class='search' @click="gotoSearch" style='width:100%;border-radius:30rpx;'>
				<view>
					<image src='/static/images/nav_icon_search@3x.png'></image>
				</view>
				<view>搜索你想要的商品</view>
			</view>
		</view>
		<view style="background:#fff;padding:0 30rpx;padding-bottom:30rpx;margin-top:110rpx">
			<swiper class="swiper" indicator-color="rgb(231,231,231)" indicator-active-color="rgb(246,193,55)" :indicator-dots="indicatorDots"
			 :autoplay="autoplay" circular="true" :interval="interval" :duration="duration">
				<swiper-item v-for="item of swiperList" :key="item.goodsId">
					<view class="swiper-item uni-bg-red">
						<image @click="gotoStore(item.goodsId)" :src="item.img[0].url"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="f1">
				<view class="hot">
					<view class="hot-title">
						<text>热卖单品</text>
						<text>跟着买不会错</text>
					</view>
					<view class="hotProd">
						<view class="oneHot" v-for="item of towHolist" :key="item.prodId">
							<view @click="gotoStore(item.prodId)">
								<image :src="item.prodImg[0].url"></image>
							</view>
							<view>
								<view>
									<text>￥</text>
									<text>{{item.salePrice}}</text>
								</view>
								<view @click.stop="add_shoppingcar(item.prodId)">
									<image src="/static/images/index/icon_shop@3x.png"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="hot goodProd">
					<view class="hot-title">
						<text>优选菜品</text>
						<text>样样都是平价</text>
					</view>
					<view class="hotProd">
						<view class="oneHot" v-for="item of  goodList" :key="item.prodId">
							<view @click="gotoStore(item.prodId)">
								<image :src="item.prodImg[0].url"></image>
							</view>
							<view>
								<view>
									<text>￥</text>
									<text>{{item.salePrice}}</text>
								</view>
								<view @click.stop="add_shoppingcar(item.prodId)">
									<image src="/static/images/index/icon_shop@3x.png"></image>
								</view>
							</view>
						</view> 
					</view>
				</view>
			</view>
			<view class="f2">
				<view class="belongYou">
					<view>专享尝鲜菜</view>
					<scroll-view class="myscroll" scroll-x="true" scroll-with-animation='true'>
						<view class="belongPord">
							<view class="oneBelong" v-for="item of belongList" :key="item.prodId">
								<view @click="gotoStore(item.prodId)">
									<image :src="item.prodImg[0].url"></image>
								</view>
								<view>{{(item.prodName).substring(0,13)}}</view>
								<view>
									<view>
										<text>￥</text>
										<text>{{item.salePrice}}</text>
									</view>
									<view @click.stop="add_shoppingcar(item.prodId)">
										<image src="/static/images/index/icon_shop@3x.png"></image>
									</view>
								</view>

							</view>

						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view style="padding-bottom: 20rpx;">
			<view class="moreTj">
				<view>
					<image src="/static/images/index/icon_star@3x.png"></image>
					<text>更多推荐</text>
					<image src="/static/images/index/icon_star@3x.png"></image>
				</view>
				<view class="tjProd">
					<view class="oneTj" @click="gotoStore(item.prodId)" v-for="item of hotList" :key="item.prodId">
						<view>
							<image :src="item.prodImg[0].url"></image>
						</view>
						<view>
							<view>{{(item.prodName).substring(0,21)}}</view>
							<view class="Tjb">
								<view>
									<text>￥</text>
									<text>{{item.salePrice}}</text>
								</view>
								<view @click.stop="add_shoppingcar(item.prodId)">
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
	import amap from '@/static/js/amap-wx.js';
	export default {
		data() {
			return {
				token: '',
				marketid: '',
				swiperList: [],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				hotList: [], //热卖单品
				towHolist: [], //热卖单品两个
				goodList: [], //优选商品
				mydata: {

				}, //请求参数
				belongList: [], //专属菜品
				myAmap: ''
			}
		},
		onReady() {
			this.getLocationInfo()

		},
		onLoad(options) {
			this.myAmap = new amap.AMapWX({
				key: 'fc7b2b1171e49890b952144ed8562195'
			})
			this.getAddress()

		},
		onShow() {
			this.mydata.marketid = '1254';
			this.token = uni.getStorageSync('token')
			uni.setStorage({
				key: 'marketid',
				data: '1254',
			})
			this.getSwiper()
			this.getHot();
			this.getbelongPord()
			this.getGoodList()
			this.getShopCarList()
		},
		onShareAppMessage:function(res){
			return {
				path: '/pages/index/index',
			}
		
		},
		methods: {
			//获取地理位置
			getLocationInfo: function() { //1. uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
				uni.getLocation({
					type: 'wgs84',
					success(res) {
						// console.log(res)
						getApp().globalData.longitude = res.longitude
						getApp().globalData.latitude = res.latitude
					},
					fail() { //1.2 拒绝授权
						console.log("你拒绝了授权，无法获得周边信息")
					}
				})
			},

			//获得当前地址
			getAddress: function() {
				this.myAmap.getRegeo({
					location: this.location,
					success: (data) => {
						// console.log(data)
						getApp().globalData.now_city = data[0].regeocodeData.addressComponent.city
					},
					fail: function(info) {
						//失败回调
						//  console.log(info)
					}
				})
			},

			//获取轮播
			getSwiper: function() {
				var that = this;
				this.$urlRequest('getIndexImg.do', this.mydata).then(res => {
					for (var item of res.data) {
						for (var key in item) {
							if (key == 'img') {
								item[key] = JSON.parse(item[key])
							}
						}
					}
					this.swiperList = res.data
				})
			},
			//获取热卖单品
			getHot: function() {
				this.$urlRequest('getIndexPageProductOrderByKC.do', this.mydata).then(res => {
					for (var item of res.data) {
						for (var key in item) {
							if (item[key] == null || item[key] == 'null') {
								item[key] = ''
							}
							if (key == 'prodImg') {
								item[key] = JSON.parse(item[key])
							}
						}
					}
					this.hotList = res.data
					this.towHolist = res.data.slice(0, 2)
				})
			},

			//优选
			getGoodList: function() {
				this.$urlRequest('getIndexPageProduct.do', this.mydata).then(res => {
					for (var item of res.data) {
						for (var key in item) {
							if (item[key] == null || item[key] == 'null') {
								item[key] = ''
							}
							if (key == 'prodImg') {
								item[key] = JSON.parse(item[key])
							}
						}
					}
					this.goodList = res.data.slice(0, 2)
				})
			},
			//专属菜品
			getbelongPord: function() {
				var that = this;
				this.$urlRequest('getIndexPageProductOrderByTime.do', this.mydata).then(res => {
					for (var item of res.data) {
						for (var key in item) {
							if (item[key] == null || item[key] == 'null') {
								item[key] = ''
							}
							if (key == 'prodImg') {
								item[key] = JSON.parse(item[key])
							}
						}
					}
					this.belongList = res.data
				})
			},
			//购物车添加事件
			add_shoppingcar: function(prodId) {
				if (!!!this.token) {
					uni.getSetting({
						success(res) {
							// console.log(res)
							uni.navigateTo({
								url: '/pages/login/login_type',
							})
							// if (res.authSetting['scope.userInfo']) {
							// 	// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							// 	uni.navigateTo({
							// 		url: '/pages/login/login_type',
							// 	})
							// } else {
							// 	uni.navigateTo({
							// 		url: '/pages/getUserInfo/getUserInfo',
							// 	})
							// }
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
							this.getShopCarList()
						}else{
							this.$myToast(res.state)
						}
					})
				}

			},
			//前往商品详情
			gotoStore: function(prodId) {
				uni.navigateTo({
					url: '/pages/prodDetail/prodDetail?prodId=' + prodId
				})
			},
			//前往搜索
			gotoSearch: function() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			//获取购物车
			getShopCarList:function(){
				if(uni.getStorageSync('token') != ''){
					this.$urlRequest('getCar.do', {
						token: uni.getStorageSync('token')
					}).then(res => {
						if(res.length != 0){
							var prodNumber = 0
							for (var item of res[0].prodList) {					
								prodNumber += parseInt(item.prodCount)
							}
							uni.setTabBarBadge({
								index: 2,
								text: "" + prodNumber + ""
							})
						}	
					})
				}
			}

		}
	}
</script>

<style>
	/**index.wxss**/
	page {
		/* height:100%; */
		background: #efefef;
	}

	.header_s {
		padding: 15rpx 30rpx;
		background: #fff;
		position: fixed;
		z-index: 9999999;
		top: 0;
		left: 0;
		right: 0;
	}

	swiper {
		width: 100%;
		height: 260rpx;
		margin-top: 20rpx;
		padding-top: 10rpx;
	}

	swiper view {
		height: 100%;
	}

	swiper image {
		width: 100%;
		height: 260rpx;
		border-radius: 10rpx;
	}

	button::after {
		border: none;
	}

	.h1 {
		border-left: 8rpx solid rgb(60, 185, 99);
		text-indent: 15rpx;
		margin-left: 22rpx;
	}

	.fix {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999999;
		/* background:#fff; */
	}

	#scroll {
		overflow: scroll-y;
		margin-top: 116rpx;
		/* padding: 0 30rpx; */
		/* background: #fff; */
	}

	/* .address{
	  font-size:32rpx;
	  width:93%;
	  height:40rpx;
	  margin:auto;
	  align-items:center;
	} */

	.search {
		background: rgb(245, 245, 245);
		border-radius: 10rpx;
		padding: 10rpx 15rpx !important;
		display: flex;
		align-items: center;
		color: #999;
		margin: 15rpx auto;
		height: 60rpx;
		width: 60%;
		font-size: 30rpx;
		box-sizing: border-box;
		justify-content: center;
	}

	.search_on {
		transition: all 0.3s linear;
		width: 100%;
	}

	.search view:first-child {
		margin-right: 10rpx;
	}

	.search image {
		width: 30rpx;
		height: 30rpx;
		display: block;
	}

	/*热卖*/
	.f1 {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.f1 .hot {
		background: linear-gradient(top, #FFF8E7 100%, #FFFFFF 0%);
		background: -webkit-linear-gradient(top, #FFF8E7 0%, #ffffff 100%);
		background: -o-linear-gradient(top, #FFF8E7 0%, #ffffff 100%);
		background: -ms-linear-gradient(top, #FFF8E7 0%, #ffffff 100%);
		background: linear-gradient(to bottom, #FFF8E7 0%, #ffffff 100%);
		padding: 20rpx 18rpx 43rpx 16rpx;
		border-radius: 10rpx;
	}

	.f1 .hot .hot-title>text:first-child {
		font-size: 28rpx;
		color: #000000;
		font-weight: bold;
	}

	.f1 .hot .hot-title>text:last-child {
		color: #FBB318;
		font-size: 20rpx;
		margin-left: 9rpx;
	}

	.f1 .hot .hotProd {
		display: flex;
		/* justify-content: space-between; */
		margin-top: 19rpx;
	}

	.f1 .hot .hotProd>view:nth-child(2) {
		margin-left: 10rpx;
	}

	.f1 .hot .hotProd .oneHot {
		width: 147rpx;
	}

	.f1 .hot .hotProd .oneHot>view:first-child>image {
		height: 136rpx;
		width: 136rpx;
		display: block;
	}

	.f1 .hot .hotProd .oneHot>view:last-child {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 30rpx;
	}

	.f1 .hot .hotProd .oneHot>view:last-child>view:first-child>text:first-child {
		font-size: 20rpx;
		color: #EA5252;
	}

	.f1 .hot .hotProd .oneHot>view:last-child>view:first-child>text:last-child {
		font-size: 28rpx;
		color: #EA5252;
	}

	.f1 .hot .hotProd .oneHot>view:last-child image {
		width: 54rpx;
		height: 54rpx;
		display: block;
		vertical-align: middle;
	}

	.goodProd {
		background: linear-gradient(top, #F4FDF3 100%, #FFFFFF 0%) !important;
		background: -webkit-linear-gradient(top, #F4FDF3 0%, #ffffff 100%) !important;
		background: -o-linear-gradient(top, #F4FDF3 0%, #ffffff 100%) !important;
		background: -ms-linear-gradient(top, #F4FDF3 0%, #ffffff 100%) !important;
		background: linear-gradient(to bottom, #F4FDF3 0%, #ffffff 100%) !important;
	}

	/**/
	.f2 {
		margin-top: 20rpx;
	}

	.f2 .belongYou {
		background: #FFF2F2;
		border-radius: 10rpx
	}

	.f2 .belongYou>view:first-child {
		color: #FF5E2C;
		font-size: 28rpx;
		padding: 20rpx 0;
		padding-left: 20rpx
	}

	.myscroll {
		background: #fff;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
	}

	.belongPord {
		display: flex;
		padding-top: 40rpx;
	}

	.belongPord>view {
		margin-left: 20rpx;
	}

	.oneBelong>view:first-child>image {
		height: 160rpx;
		width: 160rpx;
		display: block;
	}

	.oneBelong>view:last-child {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 30rpx;
	}

	.oneBelong>view:last-child>view:first-child>text:first-child {
		font-size: 20rpx;
		color: #EA5252;
	}

	.oneBelong>view:last-child>view:first-child>text:last-child {
		font-size: 28rpx;
		color: #EA5252;
	}

	.oneBelong>view:nth-child(2) {
		font-size: 22rpx;
		color: #333333;
		margin-top: 10rpx;
		height: 60rpx;
	}

	.oneBelong>view:last-child image {
		width: 54rpx;
		height: 54rpx;
		display: block;
		vertical-align: middle;
	}

	/*推荐*/
	.moreTj {
		background: #fff;
		padding: 0 15rpx;
		margin-top: 20rpx;
		/* padding-bottom: 20rpx; */
	}

	.moreTj>view:first-child {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20rpx 0;
	}

	.moreTj>view:first-child>image {
		width: 22rpx;
		height: 20rpx;
	}

	.moreTj>view:first-child>text {
		color: #999999;
		font-size: 24rpx;
		margin: 0 20rpx;
	}

	.tjProd>view:last-child>view:last-child{
		border: none;
		padding-bottom: 20rpx;
	}

	.oneTj {
		display: flex;
		margin: 0 48rpx;
		/* margin-bottom: 20rpx; */
		margin-top: 20rpx;
	}

	.oneTj>view:first-child>image {
		width: 200rpx;
		height: 180rpx;
		display: block;
	}

	.oneTj>view:last-child {
		margin-left: 50rpx;
		width: 100%;
		border-bottom: 2rpx solid #E5E5E5;
	}

	.oneTj>view:last-child>view:first-child {
		font-size: 26rpx;
		color: #333333;
		margin-bottom: 60rpx;
	}

	.oneTj>view:last-child .Tjb {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.oneTj>view:last-child .Tjb>view:first-child>text:first-child {
		font-size: 20rpx;
		color: #EA5252;
	}

	.oneTj>view:last-child .Tjb>view:first-child>text:last-child {
		font-size: 28rpx;
		color: #EA5252;
	}

	.oneTj>view:last-child .Tjb>view:last-child>image {
		width: 54rpx;
		height: 54rpx;
		display: block;
	}
</style>
