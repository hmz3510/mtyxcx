<template>
	<view class="mycontainer">
		<view class="header">
			<!-- <view class="headerF1">
				<view>
					<image src="/static/images/index/icon_order_car@3x.png" mode=""></image>
				</view>
				<view>
					<view>[杭州市]您的包裹已签收，感谢为您服务</view>
					<view>2020-02-11 11:16:12</view>
				</view>
				<view>
					<image src="/static/images/icon_xyy@3x.png" mode=""></image>
				</view>
			</view> -->
			<view class="headerF2">
				<view>
					<image src="/static/images/index/icon_order_ordess@3x.png" mode=""></image>
				</view>
				<view>
					<view>
						<text>{{orderDetais.userName}}</text>
						<text>{{orderDetais.userPhone}}</text>
					</view>
					<view>{{orderDetais.userAddress}}</view>
				</view>
			</view>

		</view>
		<view class="OrderMain">
			<view class="title">商品详情</view>
			<view class="prodList">
				<view class="oneProd" v-for="item of orderDetais.goodsList" :key="item.id">
					<view style="margin: auto 0;">
						<image :src="item.goodsImg[0].url"></image>
					</view>
					<view>
						<view>{{item.goodsName}}</view>
						<view>×{{item.goodsNum}}</view>
					</view>
					<view>
						<view>￥{{item.goodsPrice}}</view>
						<view @click="CanClePay(orderDetais.orderNo,item.id)">申请退款</view>
					</view>
				</view>
			</view>
			<view class="prodMoney">
				<view>商品总价</view>
				<view>￥{{total}}</view>
			</view>
			<view class="prodMoney">
				<view>红包</view>
				<view style="color: #666666;" v-if="orderDetais.redPrice == ''">-￥0</view>
				<view style="color: #666666;" v-else>-￥{{orderDetais.redPrice}}</view>
			</view>
			<view class="prodMoney">
				<view>快递费</view>
				<view style="color: #666666;">￥{{orderDetais.postPrice}}</view>
			</view>
			<view class="AllMoney">
				<view>实付款</view>
				<view>￥{{orderDetais.countPrice}}</view>
			</view>
		</view>

		<view class="orderInfo">
			<view class="title">订单信息</view>
			<view class="orderNumber">
				<view>订单编号：{{orderDetais.orderNo}}</view>
				<view @click="copy(orderDetais.orderNo)">复制</view>
			</view>
			<view class="orderTime">付款时间：{{orderDetais.payTime}}</view>
			<view class="payType">支付方式：微信支付</view>
		</view>

	</view>


</template>

<script>
	export default {
		data() {
			return {
				id: '',
				token: '',
				orderDetais: '',
				total: '' //商品总价
			}
		},
		onLoad: function(options) {
			this.id = options.id
			this.token = uni.getStorageSync('token')
		},
		onShow: function() {
			this.getOrderDetail()
		},
		methods: {
			//获取订单详情
			getOrderDetail: function() {
				var total = 0
				var data = {
					id: this.id,
					token: this.token,
				}
				this.$urlRequest('getOrderDetailById.do', data).then(res => {
					for (var item in res.data) {
						if (res.data[item] == 'null' || res.data[item] == null) {
							res.data[item] = ''
						}
					}
					for (var childItem of res.data.goodsList) {
						for (var secondItem in childItem) {
							if (secondItem == 'goodsImg') {
								childItem[secondItem] = JSON.parse(childItem[secondItem])
							}
						}
						total += parseFloat(childItem.goodsNum) * parseFloat(childItem.goodsPrice)
					}
					this.total = total
					this.orderDetais = res.data
				})
			},
			copy: function(data) {
				uni.setClipboardData({
					data: data,
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								uni.showToast({
									title: '已复制订单号',
								});
							}
						});
					}
				});
			},
			//退款
			CanClePay:function(orderNo,prodId){
				var data = {
					orderNo,
					prodId,
					token:this.token
				}
				this.$urlRequest('productRefund.do',data).then(res=>{
					if(res.code == '1'){
						this.$myToast('申请退款成功')
					}else{
						this.$myToast(res.msg)
					}
				})
			}
		}
	}
</script>


<style>
	page {
		background: #F4F4F4;
	}


	.mycontainer {
		margin-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.header {
		background: #FFFFFF;
		padding: 31rpx 29rpx 30rpx 33rpx;
	}

	.headerF1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		border-bottom: 2rpx solid #F2F2F2;
	}



	.headerF1>view:first-child>image {
		height: 26rpx;
		width: 35rpx;
	}

	.headerF1>view:nth-child(2) {
		width: 85%;
	}

	.headerF1>view:nth-child(2)>view:first-child {
		font-size: 26rpx;
		color: #5BBC6A;
		margin-bottom: 19rpx;
	}

	.headerF1>view:nth-child(2)>view:last-child {
		font-size: 24rpx;
		color: #999999;
	}

	.headerF1>view:last-child>image {
		height: 30rpx;
		width: 17rpx;
	}

	.headerF2 {
		display: flex;
		align-items: center;
		margin-top: 30rpx;
	}

	.headerF2>view:first-child>image {
		height: 34rpx;
		width: 30rpx;
		display: block;
	}

	.headerF2>view:nth-child(2) {
		width: 90%;
		margin-left: 30rpx;
	}

	.headerF2>view:nth-child(2)>view:first-child>text:first-child,
	.headerF2>view:nth-child(2)>view:last-child {
		font-size: 26rpx;
		color: #333333;
	}

	.headerF2>view:nth-child(2)>view:last-child {
		margin-top: 21rpx;
	}

	.headerF2>view:nth-child(2)>view:first-child>text:last-child {
		font-size: 20rpx;
		color: ##666666;
		margin-left: 32rpx;

	}

	/*商品详情*/
	.OrderMain,
	.orderInfo {
		margin-top: 20rpx;
		padding: 21rpx 30rpx 30rpx 30rpx;
		background: #FFFFFF;
	}

	.title {
		font-size: 30rpx;
		color: #333333;
		margin-bottom: 30rpx;
	}

	.oneProd {
		display: flex;
		justify-content: space-between;
		/* align-items: center; */
		margin-bottom: 20rpx;
	}

	.oneProd>view:first-child>image {
		width: 110rpx;
		height: 110rpx;
		display: block;
	}

	.oneProd>view:nth-child(2)>view:first-child {
		font-size: 28rpx;
		color: #333333;
	}

	.oneProd>view:nth-child(3)>view:first-child {
		font-size: 28rpx;
		color: #333333;
		text-align: center;
	}

	.oneProd>view:nth-child(3)>view:last-child {
		border: 2rpx solid #E5E5E5;
		font-size: 28rpx;
		color: #333333;
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		border-radius: 50rpx;
		margin-top: 30rpx;
	}

	.oneProd>view:nth-child(2) {
		width: 55%;
	}

	.oneProd>view:nth-child(2)>view:last-child {
		font-size: 24rpx;
		color: #999999;
		margin-top: 20rpx;
	}

	.prodMoney {
		display: flex;
		justify-content: space-between;
		margin-bottom: 39rpx;
		align-items: center;
	}

	.prodMoney>view:first-child {
		color: #333333;
		font-size: 26rpx;
	}

	.prodMoney>view:last-child {
		color: #333333;
		font-size: 28rpx;
	}

	.AllMoney {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 2rpx solid #F2F2F2;
		padding-top: 29rpx;
	}

	.AllMoney>view:first-child {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
	}

	.AllMoney>view:last-child {
		font-size: 24rpx;
		color: #EA4545;
	}


	.orderInfo>.title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 30rpx;
	}

	.orderInfo>.orderNumber {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.orderInfo>.orderNumber>view:first-child {
		font-size: 24rpx;
		color: #999999;
	}

	.orderInfo>.orderNumber>view:last-child {
		background: #F8F8F8;
		text-align: center;
		font-size: 20rpx;
		color: #999999;
		height: 42rpx;
		line-height: 42rpx;
		width: 82rpx;
	}

	.orderInfo>view:nth-child(3),
	.orderInfo>view:last-child {
		margin: 39rpx 0;
		font-size: 24rpx;
		color: #999999;
	}

	.orderInfo>viwe:last-child {
		margin: 0;
	}
</style>
