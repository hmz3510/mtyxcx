<template>
	<view>
		<!--pages/myorder/myorder.wxml-->
		<view class="mycontainer">
			<view class="headerNav">
				<view class="oneNav" :class="type=='全部'?'headerActive':''" @click="changeType('全部')" data-type="0">全部</view>
				<view class="oneNav" :class="type=='待支付'?'headerActive':''" @click="changeType('待支付')" data-type="1">待支付</view>
				<view class="oneNav" :class="type=='待发货'?'headerActive':''" @click="changeType('待发货')" data-type="2">待发货</view>
				<view class="oneNav" :class="type=='待收货'?'headerActive':''" @click="changeType('待收货')" data-type="3">待收货</view>
				<view class="oneNav" :class="type=='待评价'?'headerActive':''" @click="changeType('待评价')" data-type="4">待评价</view>
			</view>
			<view class="containerMiddle">
				<view class="allOrder">
					<view class="dzfEmpty" v-if="dzfType!=''">
						<image src="/static/images/index/img_empty@3x.png"></image>
						<view>暂无相关订单</view>
					</view>
					<view class="oneOrder" @click="gotoOrderD(item.id)" v-for="(item,index) of orderList" :key="index">
						<view class="oneHeader">
							<view>{{item.time}}</view>
							<view>{{item.state}}</view>
						</view>
						<view class="imgTotal">
							<scroll-view scroll-x="true" scroll-with-animation='true'>
								<view class="orderImg">
									<view class="oneImg" v-for="items of item.goodsList" :key="items.name">
										<image :src="items.goodsImg[0].url"></image>

									</view>
								</view>
							</scroll-view>
						</view>
						<view class="oneBottom">
							<view>
								<text>合计：</text>
								<text>￥{{item.countPrice}}</text>
							</view>
							<view>
								<view @click.stop="delOrder(item.id)" v-if="item.state == '已完成' || item.state == '待支付'">删除订单</view>
								<view @click.stop="gotoClick(item.type,item.orderNo,item.id)">{{item.type}}</view>
							</view>
						</view>
					</view>
				</view>

				<!-- <view class="dzf" v-if="type=='待支付'">
					<view class="dzfEmpty" v-if="dzfType!=''">
						<image src="/images/index/img_empty@3x.png"></image>
						<view>暂无相关订单</view>
					</view>
					<view class="oneOrder" v-for="(item,index) of orderList" :key="index">
						<view class="oneHeader">
							<view>{{item.time}}</view>
							<view>{{item.state}}</view>
						</view>
						<view class="imgTotal">
							<scroll-view scroll-x="true" scroll-with-animation='true'>
								<view class="orderImg">
									<view class="oneImg" v-for="items of item.goodsList" :key="items.name">
										<image :src="items.goodsImg[0].url"></image>

									</view>
								</view>
							</scroll-view>
						</view>
						<view class="oneBottom" >
							<view>
								<text>合计：</text>
								<text>￥{{item.countPrice}}</text>
							</view>
							<view @click="gotoPay(item.orderNo)">去支付</view>
						</view>
					</view>

				</view>

				<view class="dps" v-if="type=='待发货'">
					<view class="dzfEmpty" v-if="dzfType!=''">
						<image src="/static/images/index/img_empty@3x.png"></image>
						<view>暂无相关订单</view>
					</view>
					<view class="oneOrder" v-for="(item,index) of orderList" :key="index">
						<view class="oneHeader">
							<view>{{item.time}}</view>
							<view>{{item.state}}</view>
						</view>
						<view class="imgTotal">
							<scroll-view scroll-x="true" scroll-with-animation='true'>
								<view class="orderImg">
									<view class="oneImg" v-for="items of item.goodsList" :key="items.name">
										<image :src="items.goodsImg[0].url"></image>

									</view>
								</view>
							</scroll-view>
						</view>
						<view class="oneBottom">
							<view>
								<text>合计：</text>
								<text>￥{{item.countPrice}}</text>
							</view>
							<view>提醒发货</view>
						</view>
					</view>
				</view>


				<view class="psz" v-if="type=='待收货'">
					<view class="dzfEmpty" v-if="dzfType!=''">
						<image src="/static/images/index/img_empty@3x.png"></image>
						<view>暂无相关订单</view>
					</view>

					<view class="oneOrder" v-for="(item,index) of orderList" :key="index">
						<view class="oneHeader">
							<view>{{item.time}}</view>
							<view>{{item.state}}</view>
						</view>
						<view class="imgTotal">
							<scroll-view scroll-x="true" scroll-with-animation='true'>
								<view class="orderImg">
									<view class="oneImg" v-for="items of item.goodsList" :key="items.name">
										<image :src="items.goodsImg[0].url"></image>

									</view>
								</view>
							</scroll-view>
						</view>
						<view class="oneBottom">
							<view>
								<text>合计：</text>
								<text>￥{{item.countPrice}}</text>
							</view>
							<view>确认收获</view>
							
						</view>
					</view>


				</view>

				<view class="qpj" v-if="type=='待评价'">
					<view class="dzfEmpty" v-if="dzfType!=''">
						<image src="/static/images/index/img_empty@3x.png"></image>
						<view>暂无相关订单</view>
					</view>
					<view class="oneOrder" v-for="(item,index) of orderList" :key="index">
						<view class="oneHeader">
							<view>{{item.time}}</view>
							<view>{{item.state}}</view>
						</view>
						<view class="imgTotal">
							<scroll-view scroll-x="true" scroll-with-animation='true'>
								<view class="orderImg">
									<view class="oneImg" v-for="items of item.goodsList" :key="items.name">
										<image :src="items.goodsImg[0].url"></image>

									</view>
								</view>
							</scroll-view>
						</view>
						<view class="oneBottom">
							<view>
								<text>合计：</text>
								<text>￥{{item.countPrice}}</text>
							</view>
							<view>去评价</view>
							
						</view>
					</view>

				</view> -->

			</view>
		</view>
	</view>




	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: "全部",
				dzfType: '', //判断待支付是否为空
				pageIndex: 1,
				orderList: [], //订单列表
				token: ''

			}
		},
		onLoad: function(options) {
			this.token = uni.getStorageSync('token')
			this.type = options.type;

		},
		onShow: function() {
			this.getOrderList()
		},
		onReachBottom: function() {
			// this.pageIndex ++ ;
			// this.getOrderList()
		},
		methods: {
			//获取订单列表
			getOrderList: function() {
				var data = {
					pageIndex: this.pageIndex,
					token: this.token,
					pagec: 2,
					orderState: this.type
				}
				this.$urlRequest('getOrderList.do', data).then(res => {
					if (res.data.length == 0) {
						this.dzfType = true
					}
					for (var item of res.data) {
						for (var childItem of item.goodsList) {
							for (var key in childItem) {
								if (key == 'goodsImg') {
									childItem[key] = JSON.parse(childItem[key])
								}
							}
						}
						if (item.state == '待支付') {
							item['type'] = '去支付'
						} else if (item.state == '待发货') {
							item['type'] = '提醒发货'
						} else if (item.state == '待收货') {
							item['type'] = '确认收货'
						} else if (item.state == '待评价') {
							item['type'] = '去评价'
						} else if (item.state == '已完成') {
							item['type'] = '再来一单'
						}
					}

					if (this.pageIndex == 1) {
						this.orderList = res.data
					} else {
						if (res.data.length == 0) {
							this.$myToast('暂无更多订单')
							return;
						}
						this.orderList.push(res.data)
					}

				})
			},
			//切换状态
			changeType: function(type) {
				this.dzfType = ''
				this.pageIndex = 1;
				this.type = type
				this.getOrderList()
			},

			gotoClick: function(type, orderNo,id) {
				if (type == '去支付') {
					this.gotoPay(orderNo)
				}else if(type == '确认收货'){
					this.confirmProd(type,id)
				}else if(type == '提醒发货'){
					this.confirmProd(type,id)
				}
			},
			
			//确定收货 //提醒发货
			confirmProd:function(type,id){
				if(type == '确认收货'){
					var title = '收货成功'
					var url = 'confirmOrder.do'
				}else{
					var title = '已通知商家尽快发货'
					var url = ''
				}
				var data = {
					token:this.token,
					id:id
				}
				this.$urlRequest(url,data).then(res=>{
					if(res.code == '1'){
						this.$myToast(title)
						this.getOrderList()
					}else{
						this.$myToast(res.msg)
					}
				})
			},
			
			//支付
			gotoPay: function(orderNo) {
				uni.showLoading({
					title: '正在支付中'
				});
				uni.login({
					success: res => {
						//登录注册接口
						if (res.code) {
							// 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中
							this.$urlRequest('getOpenId2.do', {
								code: res.code
							}).then(res => {
								this.hlb(orderNo, res.openid)
							})
						} else {
							console.log('登录失败！' + res.errMsg)
						}
					}
				})
			},

			//调用支付
			hlb: function(orderNo, openId) {
				var that = this
				this.$urlRequest('unifiedorder.do', {
					billNo: orderNo,
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
							if (ret.errMsg == "requestPayment:ok") {
								that.$myToast('支付成功,请到全部中查看')
								that.getOrderList()
								that.sendModel(openId,res.package,orderNo)	
							}

						},
						'fail': function(res) {
							uni.hideLoading()
							that.$myToast(res)
						},
						'complete': function(res) {}
					})
				})
			},

			//前往订单详情
			gotoOrderD: function(id) {
				uni.navigateTo({
					url: "/pages/orderDetail/orderDetail?id=" + id
				})
			},
			//删除订单
			delOrder: function(id) {
				uni.showModal({
					content: '确定删除该订单?',
					success: (res) => {
						if (res.confirm) {
							this.$urlRequest('forgetOrderById.do', {
								id: id,
								token: this.token
							}).then(res => {
								if (res.code == '1') {
									this.$myToast('删除订单成功')
									this.getOrderList()

								} else {
									this.$myToast(res.msg)
								}
							})
						}
					}
				});

			},
			//发送模板
			sendModel:function(openId,Package,billNo){
				console.log(111)
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
						})
					}
				})
			}

		}
	}
</script>

<style>
	/* pages/myorder/myorder.wxss */
	page {
		background: #F4F4F4;
	}

	.headerNav {
		background: #fff;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		z-index: 999999999;
	}

	.headerNav .oneNav {
		color: #333333;
		font-size: 26rpx;
		height: 64rpx;
		line-height: 64rpx;
	}

	.headerActive {
		border-bottom: 1px solid #58BA67;
		color: #58BA67 !important;
	}

	.containerMiddle {
		margin: 0 30rpx;
		margin-top: 90rpx;
	}

	.oneOrder {
		background: #fff;
		border-radius: 10rpx;
		padding: 30rpx 18rpx;
		margin-bottom: 20rpx;
	}

	.oneOrder .oneHeader {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #E5E5E5;
		padding-bottom: 20rpx;
	}

	.oneOrder .oneHeader>view:first-child {
		font-size: 24rpx;
		color: #999999;
	}

	.oneOrder .oneHeader>view:last-child {
		font-size: 24rpx;
		color: #58BA67;
	}

	.oneOrder .imgTotal {
		margin-top: 30rpx;
		border-bottom: 1px solid #E5E5E5;
		padding-bottom: 20rpx;
	}

	.oneOrder .imgTotal .orderImg {
		display: flex;
	}

	.oneOrder .imgTotal .orderImg .oneImg {
		margin-right: 20rpx;
	}

	.oneOrder .imgTotal .orderImg .oneImg image {
		width: 94rpx;
		height: 94rpx;
	}

	.oneOrder .oneBottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.oneOrder .oneBottom>view:first-child>text:first-child {
		font-size: 28rpx;
		color: #333333;
	}

	.oneOrder .oneBottom>view:first-child>text:last-child {
		font-size: 32rpx;
		color: #F65151;
	}

	.oneOrder .oneBottom>view:last-child {
		display: flex;

	}

	.oneOrder .oneBottom>view:last-child>view {
		font-size: 24rpx;
		color: #333333;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		width: 130rpx;
		border: 1px solid #E5E5E5;
		border-radius: 10rpx;
	}

	.oneOrder .oneBottom>view:last-child>view:first-child {
		margin-right: 20rpx;
	}

	.oneOrder::after {
		clear: both;
		display: block;
		content: '';
	}

	/*待支付样式*/
	.dzfEmpty {
		position: absolute;
		top: 50%;
		left: 50%;
		right: 0;
		transform: translate(-50%, -65%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.dzfEmpty>image:first-child {
		width: 250rpx;
		height: 305rpx;
	}

	.dzfEmpty>view:last-child {
		font-size: 24rpx;
		color: #999999;
		margin-top: 30rpx;
	}
</style>
