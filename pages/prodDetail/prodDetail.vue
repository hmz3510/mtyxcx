<template>
	<!--pages/prodDetail/prodDetail.wxml-->
	<view>
		<view class="container">
			<view class="header_c">
				<view class="header_c_t">
					<swiper class="swiper" autoplay="false" circular="true">
						<swiper-item v-for="(item,index) of prodDetail.prodimg" :key="item.url">
							<view class="swiper-item uni-bg-red">
								<image lazy-load="true" @click="preImg(item.url)" :src="item.url" mode="scaleToFill"></image>
							</view>
						</swiper-item>
					</swiper>
					<!-- <image @click="preImg(prodDetail.prodimg[0].url)" lazy-load="true" :src="prodDetail.prodimg[0].url" mode="scaleToFill"></image> -->
				</view>
				<view class="header_c_M">
					<view class="header_c_M_b">
						<view>
							<text>￥</text>
							<text>{{prodDetail.saleprice}}</text>
						</view>
					</view>
					<view>{{prodDetail.prodname}}</view>
				</view>
				<view class="header_c_b">
					<view>
						<view>发货</view>
						<view>上海 | 快递：0.00</view>
					</view>
					<view>月销量{{prodDetail.salenum}}件</view>
				</view>
				<!-- <view class="header_midlle">
					<view>
						<text>信息</text>
						<text>{{prodDetail.proddepict}}</text>
					</view>
				</view> -->
			</view>
			<view class="header_M">
				<view>店铺推荐</view>
				<scroll-view scroll-x='true' style='white-space: nowrap;'>
					<view class='one_prod' v-for='item of prodDetail.products' :key="item.prodid">
						<view @click="gotoStore(item.prodid)">
							<image :src='item.prodimg[0].url'></image>
						</view>
						<view>{{item.prodname}}</view>
						<view class='flex between'>
							<view>
								￥
								<text style='font-size:24rpx;'>{{item.saleprice}}</text>
								<!-- <text>{{item.decimal}}</text> -->
							</view>
							<view style='width:60rpx;height:60rpx;' @click="add_shoppingcar(item.prodid)">
								<image src='/static/images/index/icon_shop@3x.png' style='width:44rpx;height:44rpx;display:block;margin:10rpx auto 0'></image>
							</view>
						</view>
						<view style="height:10rpx;"></view>
					</view>
				</scroll-view>
			</view>
			<view class="footer" :style='{height:bottom}'>
				<view class="footer_l">
					<view class="footer_l_t" @click='gotoCar'>
						<image src="/static/images/index/tabbar_gwc_n@3x.png"></image>
						<text>购物车</text>
					</view>
					<view class="footer_l_t" v-if="!isEnjoy" @click="myenjoy('1')">
						<image src="/static/images/star.png"></image>
						<text>收藏</text>
					</view>
					<view class="footer_l_t" v-else @click="myenjoy('0')">
						<image src="/static/images/star_light.png"></image>
						<text>已收藏</text>
					</view>
				</view>
				<view class="footer_r">
					<view @click="open('1')">加入购物车</view>
					<view @click="open('2')">立即购买</view>
				</view>
			</view>
		</view>

		<view class="AllProdImg" :class="isIphoneX==true?'isIphone':''">
			<view>商品详情</view>
			<view>
				<view v-for="item of prodDetail.proddetailimgs" :key="item.url">
					<image @click="preImg(item.url)" lazy-load="true" :src="item.url" mode="widthFix"></image>
				</view>
			</view>

		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="detail">
				<view @click="close()">
					<image src="/static/images/index/icon_close@3x.png"></image>
				</view>
				<view class="detaiImg">
					<view style="border:2rpx solid #E5E5E5">
						<image :src="prodDetail.prodimg[0].url"></image>
					</view>
					<view>
						<view>￥{{prodDetail.saleprice}}</view>
						<view>库存{{prodDetail.number}}</view>
					</view>
				</view>
				<view class="number">
					<view>购买数量</view>
					<view>
						<image @click="add('1')" src="/static/images/index/icon_js@3x.png" mode=""></image>
						<text>{{prodNumber}}</text>
						<image @click="add('2')" src="/static/images/index/icon_zj@3x.png" mode=""></image>
					</view>
				</view>
				<view class="payButton" @click="add_shoppingcar('type')">
					<button class="myButton">确定</button>
				</view>

			</view>
		</uni-popup>
	</view>

</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				prodId: '',
				token: '',
				isEnjoy: false,
				prodDetail: {}, //商品详情
				bottom: getApp().globalData.bottom,
				prodNumber: 1,
				isType: '',
				isIphoneX: getApp().globalData.isIphoneX
			}
		},
		onLoad: function(options) {
			this.token = uni.getStorageSync('token')
			this.prodId = options.prodId
			this.getProdDetail()
		},
		methods: {
			//获取商品详情接口
			getProdDetail: function() {
				this.$urlRequest('getProductById.do', {
					id: this.prodId,
					token: this.token
				}).then(res => {
					for (var item in res.data) {
						if (item == 'proddetailimgs') {
							res.data[item] = JSON.parse(res.data[item])
						}
						if (item == 'prodimg') {
							res.data[item] = JSON.parse(res.data[item])
						}
					}
					for (var myItem of res.data.products) {
						for (var key in myItem) {
							if (key == 'prodimg') {
								myItem[key] = JSON.parse(myItem[key])
							}
						}
					}
					if (res.data.isfavorite == '1') {
						this.isEnjoy = true
					} else {
						this.isEnjoy = false
					}
					this.prodDetail = res.data;
					// console.log(this.prodDetail)	
				})
			},
			//加入购物车
			add_shoppingcar: function(e) {
				// console.log(this.isType)
				if (!!!this.token) {
					uni.getSetting({
						success(res) {
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
					if (e == 'type') {
						var data = {
							prodid: this.prodId,
							token: this.token,
							num: this.prodNumber
						}
					} else {
						var data = {
							prodid: e,
							token: this.token,
						}
					}

					if (this.isType != '2') {
						uni.showLoading({
							title: '正在加入购物车'
						})
						this.$urlRequest('addBusinessCarProd.do', data).then(res => {
							uni.hideLoading()
							if (res.state == 'true') {
								this.$myToast('添加成功，在购物车等亲~');
								if (e == 'type') {
									this.$refs.popup.close()
									this.prodNumber = 1
								}
							}
						})
					} else {
						var data = {
							token: this.token,
						}
						var obj = [{
							businessId: this.prodDetail.businessid,
							businessName: this.prodDetail.businessname,
							prodList: [{
								prodId: this.prodDetail.prodid,
								prodCount: this.prodNumber,
								prodName: this.prodDetail.prodname,
								saleprice: this.prodDetail.saleprice,
								prodImg: this.prodDetail.prodimg
							}]
						}]
						data.shoppingCarJson = JSON.stringify(obj)
						this.$urlRequest('getPayDetail.do', data).then(res => {
							if (res.resultCode == '1') {
								uni.navigateTo({
									url: '/pages/account/account?arr=' + JSON.stringify(res),
								})
							} else {
								this.$myToast(res.message)
							}
						})
					}

				}
			},

			//打开弹窗
			open: function(type) {
				this.isType = type
				this.$refs.popup.open()
			},
			add: function(type) {
				if (type == '1') {
					if (this.prodNumber <= 1) {
						this.$myToast('商品数量最少为1')
						return
					}
					this.prodNumber--
				} else {
					if (this.prodNumber >= this.prodDetail.number) {
						this.$myToast('商品数量超过库存了')
						return;
					}
					this.prodNumber++
				}
			},
			//关闭弹窗
			close: function() {
				this.prodNumber = 1
				this.$refs.popup.close()
			},
			gotoCar: function() {
				wx.switchTab({
					url: '/pages/shopcar/shopcar'
				})
			},
			//收藏
			myenjoy: function(type) {
				if (type == '1') {
					this.isEnjoy = true
					var title = '收藏成功'
					var url = 'favoriteProd.do'
				} else {
					var title = '已取消收藏'
					var url = 'deleteFavoriteProd.do'
					this.isEnjoy = false
				}
				this.$urlRequest(url, {
					token: this.token,
					id: this.prodDetail.prodid
				}).then(res => {
					if (res.code == '1') {
						this.$myToast(title)
					} else {
						this.$myToast(res.msg)
					}
				})
			},
			//放大图片
			preImg: function(url) {
				var imgArr = [];
				imgArr.push(url);
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
					// longPressActions: {
					// 	itemList: ['发送给朋友', '保存图片', '收藏'],
					// 	success: function(data) {
					// 		console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					// 	},
					// 	fail: function(err) {
					// 		console.log(err.errMsg);
					// 	}
					// }
				});
			},
			//前往商品详情
			gotoStore: function(prodId) {
				uni.navigateTo({
					url: '/pages/prodDetail/prodDetail?prodId=' + prodId
				})
			},
		}
	}
</script>

<style>
	.detail {
		z-index: 9999999999999;
		height: 750rpx;
		background: #fff;
		color: #000000;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		padding: 0 30rpx;
	}

	.detail>view:first-child {
		position: relative;
	}

	.detail>view:first-child>image {
		width: 36rpx;
		height: 37rpx;
		position: absolute;
		right: 0rpx;
		top: 30rpx;
	}

	.detaiImg {
		display: flex;
		align-items: center;
		padding-top: 75rpx;
		margin-bottom: 20rpx;
	}

	.detaiImg>view:first-child>image {
		width: 190rpx;
		height: 190rpx;
		/* margin-right: 20rpx; */
	}

	.detaiImg>view:nth-child(2) {
		margin-left: 20rpx;
	}

	.detaiImg>view:nth-child(2)>view:first-child {
		font-size: 26rpx;
		color: #EA5252;
	}

	.detaiImg>view:nth-child(2)>view:last-child {
		font-size: 22rpx;
		color: #999999;
		margin-top: 19rpx;
	}

	.number {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.number>view:first-child {
		font-size: 26rpx;
		color: #333333;
	}

	.number>view:nth-child(2)>image {
		width: 59rpx;
		height: 54rpx;
		vertical-align: middle;
	}

	.number>view:nth-child(2)>text {
		height: 54rpx;
		width: 66rpx;
		background: #F5F5F5;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		line-height: 54rpx;
		margin: 0 3rpx;
		display: inline-block;
	}

	.payButton {
		position: absolute;
		bottom: 40rpx;
		width: 92.5%;
	}

	.myButton {
		background: #58BA67;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 30rpx;
		color: #FFFFFF;

	}

	.AllProdImg {
		margin-top: 40rpx;
		padding-bottom: 150rpx;
	}

	.AllProdImg>view:nth-child(2)>view>image {
		width: 100%;
		display: block;
	}

	.AllProdImg>view:first-child {
		color: #333333;
		font-size: 30rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.container {
		margin: 0 30rpx;
	}

	.mygoodNav {
		width: 100%;
	}

	page {
		background: #FDFDFD;
		height: 100%;
	}

	.header_c_t {
		display: flex;
		justify-content: center;
	}

	.header_c_t image {
		/* width: 100%;
		height: 100%; */
		padding-top: 10rpx;
		display: block;
		margin: 0 auto;
	}

	.header_c_M {
		margin-top: 26rpx;
	}

	.header_c_M view:nth-child(2) {
		font-size: 28rpx;
		color: #333333;
		margin-top: 16rpx;
	}

	.header_c_M .header_c_M_b view:first-child {
		color: #EA5252;
		font-size: 34rpx;
	}

	.header_c_b {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 38rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.header_c_b>view:first-child {
		width: 70%;
		font-size: 26rpx;
		color: #999999;
		display: flex;
	}

	.header_c_b>view:first-child>view:last-child {
		color: #333333;
		margin-left: 30rpx;
	}

	.header_c_b>view:last-child {
		font-size: 24rpx;
		color: #999999;
	}

	.header_midlle {
		margin-top: 20rpx;
		/* 		height: 80rpx;
		line-height: 80rpx; */
	}

	.header_midlle>view:first-child {
		display: flex;
	}

	.header_midlle>view:first-child>text:first-child {
		font-size: 26rpx;
		color: #999999;
		margin-right: 25rpx;
		display: block;
		width: 9%;
	}

	.header_midlle>view:first-child>text:last-child {
		font-size: 26rpx;
		color: #333333;
		display: block;
	}


	.header_M {
		margin-top: 50rpx;
	}

	.header_M>view:first-child {
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 20rpx;
	}

	.one_prod {
		width: 188rpx;
		font-size: 30rpx;
		display: inline-block;
		padding: 0 11rpx;
		box-sizing: border-box;
		margin-right: 20rpx;
		border: 1px solid #E5E5E5;
		border-radius: 20rpx;
	}

	.one_prod>view:nth-child(1) {
		margin: 20rpx;
		height: 129rpx;
	}

	.one_prod>view:nth-child(1) image {
		width: 100%;
		height: 100%;
		display: block;
		margin: auto;
	}

	.one_prod>view:nth-child(2) {
		font-size: 24rpx;
		color: #333333;
		margin: 10rpx 0;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.one_prod>view:nth-child(3)>view:first-child {
		font-size: 22rpx;
		color: #EA5252;

	}

	/*底部*/
	.footer {
		position: fixed;
		bottom: 0;
		z-index: 99;
		left: 0;
		right: 0px;
		background: #fff;
		height: 100rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.footer .footer_l {
		display: flex;
		justify-content: space-around;
		width: 40%;
		margin-top: 10rpx;
	}

	.footer .footer_l .footer_l_t {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 35%;
	}

	.footer .footer_l .footer_l_t>image {
		width: 41rpx;
		height: 41rpx;
	}

	.footer .footer_l .footer_l_t>text {
		font-size: 28rpx;
		color: #999;
	}

	.footer .footer_r {
		width: 55%;
		display: flex;
		justify-content: center;
		margin-top: 10rpx;
	}

	.footer .footer_r>view:first-child {
		margin-right: 10rpx;
		height: 80rpx;
		line-height: 80rpx;
		/* background:linear-gradient(to right,rgb(254,197,0), rgb(255,152,2)); */
		background: #58BA67;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		border-radius: 20rpx;
		width: 180rpx;
	}

	.footer .footer_r>view:last-child {
		height: 80rpx;
		line-height: 80rpx;
		background: #F99D3B;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		border-radius: 20rpx;
		width: 180rpx;
	}

	/*判断是否为ipneX*/
	.isIphone {
		padding-bottom: 250rpx;
	}

	.swiper {
		width: 100%;
		height: 480rpx;
	}
</style>
