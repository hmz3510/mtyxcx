<template>
	<view>
		<scroll-view scroll-y style='padding-bottom:120rpx;'>
			<view class='box' style='padding:0 22rpx;'>
				<view class='address flex'>
					<view>
						<image src='/static/images/address.png'></image>
					</view>
					<view @click='chooseSezi'>
						<view v-if='address==""'>请选择送货地址</view>
						<view v-if='address!=""' class='ellipsis' style='font-weight:bold;'>{{address.address}}</view>
						<view v-if='address!=""' style='font-size:26rpx;color:#555;margin-top:15rpx;'>{{address.concatname}}
							{{address.concatphone}}</view>
					</view>
					<view>
						<image src='/static/images/icon_xyy@3x.png'></image>
					</view>
				</view>
			</view>
			<view class="addLine">
				<image src="/static/images/index/line@3x.png"></image>
			</view>
			<view class='box'>
				<view>
					<view>
						<view class='store_name flex' data-id='123'>
							<!-- <view>
								<image src="/static/images/index/icon_dianpu@3x.png"></image>
							</view> -->
							<view style="color:#58BA67;font-size:26rpx;">{{buyInf.businessList[0].businessName}}</view>
						</view>
						<view class='prod' v-for='(items,indexs) of buyInf.businessList[0].prodList' :key='indexs'>
							<view @click.stop="gotoDetail(items.prodId)">
								<image :src='items.prodImg[0].url'></image>
							</view>
							<view>
								<view class='prodname'>{{items.prodName}}</view>
								<view style='font-size:22rpx;color:#999999'>x{{items.prodCount}}</view>
							</view>
							<view v-if='items.discount==1' style="font-size:28rpx;color:#333333;">￥{{items.percentPrice}}</view>
							<view v-else style="font-size:28rpx;color:#333333;">￥{{items.salePrice}}</view>
						</view>
						<view class='line'></view>
					</view>
					<!-- <view class='flex between order_pay'>
						<view>包装费</view>
						<view>￥0</view>
					</view>
					<view class='flex between order_pay'>
						<view>配送费</view>
						<view>￥{{dispatchPrice}}</view>
					</view> -->
					<view class='flex between order_pay' @click='chooseSezi_red'>
						<view>红包</view>
						<view v-if='red!=""' style='flex-grow:1;text-align:right;color:rgb(255,88,88)'>-￥{{red}}</view>
						<view v-else style='flex-grow:1;text-align:right;color:#999'>
							<text v-if='redCount.length==0'>暂无可用</text>
							<text v-else style='color:rgb(255,88,88)'>{{redCount.length}}个红包可用</text>
						</view>
						<view>
							<image src='/static/images/icon_xyy@3x.png'></image>
						</view>
					</view>
					<view class='flex total order_pay'>
						<view v-if='discount_price>0'>已优惠￥{{discount_price}}</view>
						<view>合计：
							<text>￥{{total}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class='box' style="padding:5rpx 22rpx;">
				<view class='flex note' @click='gotonote'>
					<view>备注</view>
					<view>
						<input type='text' v-model="note" disabled="disable" placeholder="请输入你想对商家说的话"></input>
					</view>
					<view>
						<image src='/static/images/icon_xyy@3x.png'></image>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class='pay' :style='{height:bottom}'>
			<view class='flex between' style='margin-top:10rpx;'>
				<view>
					<text>合计：</text>
					<text style='font-weight:bold;'>￥{{total}}</text>
				</view>
				<view class='gotopay' @click="pay">去支付</view>
			</view>
		</view>



	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		data() {
			return {
				token: '',
				address: '',
				buyInf: '',
				total: '', //总金额
				bottom: getApp().globalData.bottom,
				note: '',
				marketid: '',
				redCount: '',
				red: '', //红包金额,
				userRedId: '' //红包ID
			}
		},
		onLoad: function(options) {
			var data = JSON.parse(options.arr)
			for (var item of data.businessList[0].prodList) {
				for (var key in item) {
					if (key == 'prodImg') {
						item[key] = JSON.parse(item[key])
					}
				}
			}
			this.buyInf = data;
			// console.log(this.buyInf)
		},
		onShow: function() {
			this.marketid = uni.getStorageSync('marketid')
			this.token = uni.getStorageSync('token')
			this.getTotal()
			this.getAddressList()
		},
		methods: {
			//计算总价
			getTotal: function() {

				// if (this.data.red.redprice!=undefined){
				//   var total = (parseFloat(this.buyInf.allProdTotalPrice) - parseFloat(this.data.red.redprice) + parseFloat(this.data.dispatchPrice)).toFixed(2)
				// }else{
				//   var total =
				// }
				this.total = parseFloat(this.buyInf.allProdTotalPrice).toFixed(2)
				// console.log(this.total)

			},

			//获取地址列表
			getAddressList: function() {
				this.$urlRequest('addressList.do', {
					token: this.token
				}).then(res => {
					this.address = res.data[0]
					this.getRedCount(res.data[0].concatphone)
				})
			},

			//获取红包个数
			getRedCount: function(phone) {
				var data = {
					token: this.token,
					phone: phone,
					businessId: this.marketid,
					pay: this.buyInf.allProdTotalPrice
				}
				this.$urlRequest('getPayUserRed.do', data).then(res => {
					this.redCount = res.data
				})
			},
			//去支付
			pay: function() {
				if (!!!this.address) {
					this.$myToast('请先选择收获地址')
					return
				}
				var data = {
					token: this.token,
					packingPrice: 0,
					dispatchPrice: 3,
					dispatchAddress: this.address.address,
					dispatchContact: this.address.concatname,
					dispatchPhone: this.address.concatphone,
					payType: '2',
					user_X: this.address.Fix_X,
					user_Y: this.address.Fix_Y,
					shoppingCarJson: JSON.stringify(this.buyInf),
					userRedId: this.userRedId,
					notes: this.note
				}
				uni.showLoading({
					title: '正在支付中'
				});
				this.$urlRequest('goToPay.do', data).then(res => {
					if (res.resultCode != '0') {
						var billNo = res.message;
						uni.login({
							success: res => {
								// 登录注册接口
								if (res.code) {
									// 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中
									this.$urlRequest('getOpenId2.do', {
										code: res.code
									}).then(res => {
										this.hlb(billNo, res.openid)
									})
								} else {
									console.log('登录失败！' + res.errMsg)
								}
							}
						})
					} else {
						uni.hideLoading()
						this.$myToast(res.message)

					}
				})
			},
			//地址弹窗
			chooseSezi: function() {
				uni.navigateTo({
					url: '/pages/address/address'
				})
			},

			gotoDetail: function(prodId) {
				uni.navigateTo({
					url: '/pages/prodDetail/prodDetail?prodId=' + prodId
				})
			},
			//支付
			hlb: function(billNo, openId) {
				var that = this
				this.$urlRequest('unifiedorder.do', {
					billNo: billNo,
					openId: openId
				}).then(res => {
					uni.hideLoading()
					uni.requestPayment({
						provider: 'wxpay',
						'timeStamp': res.timeStamp,
						'nonceStr': res.nonceStr,
						'package': res.package,
						'signType': res.signType,
						'paySign': res.paySign,
						'success': function(ret) {
							// console.log(res.package)
							if (ret.errMsg == "requestPayment:ok") {
								that.$myToast('支付成功')
								that.sendModel(openId,res.package,billNo)
							}

						},
						'fail': function(res) {
							uni.hideLoading()
							that.$myToast(res)
							setTimeout(function() {
								uni.navigateTo({
									url: '/pages/order/order?type=待支付'
								})
							}, 1500)
						},
						'complete': function(res) {}
					})
				})
			},

			//前往备注
			gotonote: function() {
				uni.navigateTo({
					url: '/pages/note/note?note=' + this.note
				})
			},

			chooseSezi_red: function() {
				if (this.red == '') {
					var pay = this.buyInf.allProdTotalPrice
				} else {
					var pay = this.buyInf.businessList[0].oneBusinessTotalPrice
				}
				uni.navigateTo({
					url: '/pages/red/red?type=2' + '&pay=' + pay
				})
			},
			//发送模板
			sendModel:function(openId,Package,billNo){
				var data = {
					openid:openId,
					formid:Package,
					billNo:billNo
				}
				uni.requestSubscribeMessage({
					tmplIds: ['N7iYUpeuBKbr5TNsYt2HU1_OfH1IgFO6HMgYJMCHNVo'],
					success: (res) => {
						// this.$myToast('走到了成功函数')
					},
					fail:(res)=>{
						// this.$myToast('走到了失败函数')
					},
					complete:(res)=>{
						this.$urlRequest('sendTemplateMessage.do',data).then(ret=>{
							// this.$myToast('发送成功')
							setTimeout(function() {
								uni.navigateTo({
									url: '/pages/order/order?type=待发货'
								})
							}, 1500)
						})
					}
				})
			}




		}
	}
</script>

<style>
	/* pages/account/account.wxss */
	.noscroll {
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: fixed;
		z-index: 0;
	}

	page {
		background: #F4F4F4;
		/* background:rgba(224, 224, 224,.2); */
	}

	.addLine {
		padding: 0 22rpx;
		height: 8rpx;
		margin-top: -24rpx;
	}

	.addLine image {
		width: 100%;
		height: 100%;

	}

	.box {
		/* box-shadow: 0px 3px 10px -5px rgba(0,0,0,.3); */
		margin: 22rpx;
		background: #fff;
		font-size: 26rpx;
	}

	.order_pay {
		padding: 10rpx 22rpx;
		font-size: 26rpx;
		color: #333333;
		margin-bottom: 20rpx;
	}

	.order_pay image {
		width: 15rpx;
		height: 20rpx;
		margin-left: 20rpx;
	}

	.time,
	.address {
		background: #fff;
		padding: 22rpx 0;
		justify-content: space-between;
	}

	.time {
		border-top: 1rpx solid #eee;
	}

	scroll-view image {
		height: 100%;
		width: 100%;
		display: block;
	}

	/* 时间选择栏 */
	.time>view:first-child,
	.address>view:first-child {
		width: 40rpx;
		height: 40rpx;
	}

	.time>view:nth-child(2),
	.address>view:nth-child(2) {
		flex-grow: 1;
		margin: 0 15rpx;
		font-size: 28rpx;
		color: #333333;
	}

	.time>view:last-child,
	.address>view:last-child {
		width: 15rpx;
		height: 25rpx;
	}

	/* 店铺 */
	.store_name {
		padding: 22rpx;
		font-size: 30rpx;
		height: 40px;
	}

	.store_name image {
		height: 20px;
		width: 20px;
		display: block;
		/* border-radius: 50%; */
		margin-right: 20rpx;
	}

	/* 商品 */
	.prod {
		/* background:rgb(240,240,240); */
		padding: 22rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 15rpx auto;
	}

	.prod image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.prod>view:first-child {
		width: 90rpx;
		height: 90rpx;
		margin-right: 15rpx;
		flex-shrink: 0;
	}

	.prod>view:nth-child(2) {
		flex-grow: 1;
	}

	.prodname {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		font-size: 26rpx;
		color: #000;
		margin-bottom: 20rpx;
	}

	/* 备注 */
	.note {
		font-size: 26rpx;
		padding: 22rpx 0;
	}

	.note>view:first-child {
		width: 80px;
		flex-shrink: 0;
		color: #333333;
	}

	.note>view:nth-child(2) {
		flex-grow: 1;
		margin: 0 10rpx;
		color: #666666;
	}

	.note>view:last-child {
		width: 15rpx;
		height: 25rpx;
	}

	.note input {
		width: 100%;
		text-align: right;
	}

	/* 合计 */
	.total {
		justify-content: flex-end;
	}

	.total>view:first-child {
		font-size: 30rpx;
		color: #333333;
		margin-right: 10rpx;
	}

	.total>view:last-child text {
		color: #EA5252;
		font-size: 28rpx;

	}

	/* 底部栏 */
	.pay {
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 10rpx 22rpx;
		width: 100%;
		box-sizing: border-box;
		z-index: 9999999;
	}

	.between>view:first-child>text:first-child {
		font-size: 30rpx;
		color: #999999;
	}

	.between>view:first-child>text:last-child {
		font-size: 32rpx;
		color: #EA5252;
	}

	/* 支付按钮 */
	.gotopay {
		background: #58BA67;
		color: white;
		text-align: center;
		line-height: 80rpx;
		height: 80rpx;
		box-sizing: border-box;
		width: 180rpx;
		border-radius: 10rpx;
	}

	/* 地址弹窗头部 */
	.title,
	.title2 {
		text-align: center;
		position: relative;
		width: 100%;
		height: 40px;
		line-height: 40px;
		border-bottom: 1rpx solid #ddd;
		font-size: 26rpx;
	}

	.title>view:first-child {
		font-size: 26rpx;
		position: absolute;
		top: 0;
		left: 22rpx;
		bottom: 0;
		margin: auto;
	}

	.title>view:last-child {
		font-size: 26rpx;
		position: absolute;
		top: 0;
		right: 22rpx;
		bottom: 0;
		margin: auto;
	}

	.title2>view {
		font-size: 26rpx;
		position: absolute;
		top: 0;
		right: 22rpx;
		bottom: 0;
		margin: auto;
	}

	/* 地址列表 */
	.scroll_view {
		height: calc(100% - 40px);
		overflow: scroll;
	}

	.addressList>view {
		border-bottom: 1rpx solid #ddd;
		padding: 22rpx 22rpx;
	}

	.address_name {
		font-size: 26rpx;
		margin-bottom: 10rpx;
	}

	.concat {
		color: #999;
		font-size: 26rpx;
	}

	.addressList>view>view:last-child image {
		height: 40rpx;
		width: 40rpx;
		display: block;
	}

	/* 红包列表 */
	.red_one {
		width: 95%;
		margin: auto;
		border-radius: 10rpx;
		box-shadow: 0px 3px 10px -5px rgba(0, 0, 0, .3);
		background: #fff;
		padding: 5rpx 0;
		margin-top: 20rpx;
		overflow: hidden;
		position: relative;
	}

	.red_msg {
		width: 50%;
	}

	.red_msg,
	.red_price,
	.options {
		padding: 15rpx;
	}

	.red_msg>view:first-child {
		width: 100%;
		font-size: 32rpx;
		margin-bottom: 15rpx;
	}

	.red_msg>view:last-child,
	.red_price>view:last-child,
	.options {
		font-size: 24rpx;
		color: #999;
	}

	.red_price>view:first-child {
		color: rgb(255, 88, 88);
		font-size: 22rpx;
		margin-bottom: 15rpx;
	}

	.red_price>view:first-child text:last-child {
		font-size: 36rpx;
	}

	.options>view:first-child {
		width: 70%;
	}

	.options>view:last-child {
		color: #fff;
		font-size: 24rpx;
		padding: 8rpx 11rpx;
		border-radius: 8rpx;
		background: rgb(255, 88, 88);
	}


	.r_text {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		right: -40rpx;
		top: -40rpx;
		transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		/* Internet Explorer */
		-moz-transform: rotate(45deg);
		/* Firefox */
		-webkit-transform: rotate(45deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(45deg);
		font-size: 26rpx;
		color: white;
		background: rgb(255, 88, 88);
		z-index: 2;
	}

	.r_text icon {
		position: absolute;
		bottom: 1rpx;
		right: 20rpx;
		transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		/* Internet Explorer */
		-moz-transform: rotate(-45deg);
		/* Firefox */
		-webkit-transform: rotate(-45deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(-45deg);
	}

	.add_address {
		width: 100%;
		text-align: center;
		border-top: 1rpx solid #ddd;
		font-size: 30rpx;
		display: flex;
		justify-content: center;
	}

	.add_address image {
		height: 45rpx;
		width: 45rpx;
		display: block;
		margin-right: 15rpx;
	}
</style>
