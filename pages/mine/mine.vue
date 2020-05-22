<template>
	<view>
		<view class="myContainer">
			<view class="header">
				<view>
					<image src="/static/images/index/img_me_bg@3x.png"></image>
				</view>
				<view class="userInfo" v-if="token!=''">
					<view class="userInfoTotal">
						<view>
							<image :src="userInfo.headimg"></image>
						</view>
						<view>
							<view v-if='userInfo.username!=""'>{{userInfo.username}}</view>
							<view v-else>{{nickName}}</view>
							<view>{{userInfo.mbphone}}</view>
						</view>
					</view>
					<view @click="editInfo">编辑资料</view>
				</view>
				<view v-else class="noLogin">
					<view class="userInfoTotal" style='align-items: center;'>
						<view>
							<image src="/static/images/user.png"></image>
						</view>
						<view @click="goToLogin">
							登录/注册
						</view>
					</view>

				</view>
			</view>

			<view class="ContainerM">
				<view class="ContainerM_h">
					<view @click="goTo" data-url='red'>
						<view>{{redCount}}</view>
						<view>红包</view>
					</view>
					<view class="myline"></view>
					<view @click="goTo" data-url='yhq'>
						<view>2</view>
						<view>优惠券</view>
					</view>
				</view>
				<view class="ContainerM_m">
					<view>我的订单</view>
					<view class="orderAll">
						<view class="oneOder" @click="gotoMyorder('待支付')" >
							<view>
								<image src="/static/images/index/icon_dzf@3x.png"></image>
							</view>
							<view>待支付</view>
						</view>
						<view class="oneOder" @click="gotoMyorder('待发货')">
							<view>
								<image src="/static/images/index/icon_dps@3x.png"></image>
							</view>
							<view>待发货</view>
						</view>
						<view class="oneOder" @click="gotoMyorder('待收货')" >
							<view>
								<image src="/static/images/index/icon_psz@3x.png"></image>
							</view>
							<view>待收货</view>
						</view>
						<view class="oneOder" @click="gotoMyorder('待评价')" >
							<view>
								<image src="/static/images/index/icon_dpj@3x.png"></image>
							</view>
							<view>待评价</view>
						</view>
						<view class="oneOder">
							<view>
								<image src="/static/images/index/icon_shtk@3x.png"></image>
							</view>
							<view>售后/退款</view>
						</view>
					</view>
				</view>
				<view class="otherInfoTotal">
					<view class="myEnjoy" @click="goTo" data-url="enjoy">
						<view>我的收藏</view>
						<view>
							<image src="/static/images/index/ic_right@3x.png"></image>
						</view>
					</view>
					<view class="myaddress" @click="goTo" data-url='address'>
						<view>收货地址</view>
						<view>
							<image src="/static/images/index/ic_right@3x.png"></image>
						</view>
					</view>
					<view class="myhistory" @click="gotoEwm">
						<view>溯源记录</view>
						<view>
							<image src="/static/images/index/ic_right@3x.png"></image>
						</view>
					</view>
				</view>
				<view class="login" v-if='token!=""' @click="logout()">
					退出登录
				</view>
			</view>

		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				token: '',
				userInfo: '',
				avatarUrl: '',
				nickName: '',
				marketid:'',
				redCount:''
			}
		},
		onLoad: function() {
			this.marketid = uni.getStorageSync('marketid')
		},
		onShow: function() {
			uni.getStorage({
				key: 'token',
				success: (res) => {
					this.token = res.data
					uni.getSetting({
						success: (res) => {
							console.log(res)
							if (res.authSetting['scope.userInfo']) {
								// 已经授权，可以直接调用 getUserInfo 获取头像昵称
								uni.getUserInfo({
									success: (res) => {
										console.log(res)
										this.avatarUrl = res.userInfo.avatarUrl,
											this.nickName = res.userInfo.nickName
										this.getUser();
										this.getRedList()
									}
								})
							} else {
								this.getUser();
								
							}
						}
					})
				},
				fail: (error) => {
					this.token = ''
				}
			})
			
		},
		methods: {
			
			//获取红包列表
			getRedList:function(){
				var data = {
					token:this.token,
					businessId:this.marketid,
					pageIndex:1,
					pagec:1
				}
				this.$urlRequest('getUserRed.do',data).then(res=>{
					this.redCount = res.data[0].count
					
				})
			},
			
			getUser: function() {
				this.$urlRequest('getUserInfo.do', {
					token: this.token
				}).then(res => {
					this.userInfo = res.data
					uni.setStorage({
						key: 'phone',
						data: res.data.mbphone
					})
					this.getRedList()
				})
			},
			//退出登陆
			logout: function() {
				uni.removeStorage({
					key: 'token',
					success: (res) => {
						this.token = ''
					}
				})
				uni.removeTabBarBadge({
					index:2
				})
			},
			//登陆
			goToLogin: function() {
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
			},
			//前往我的订单
			gotoMyorder:function(type){				
				if(!!!this.token){
					this.goToLogin()
				}else{					
					uni.navigateTo({
						url:'/pages/order/order?type=' + type
					})
				}
				
			},
			goTo:function(e){
				if(!!!this.token){
					this.goToLogin()
				}else{					
					var url = e.currentTarget.dataset.url
					uni.navigateTo({
						url:'/pages/' + url + '/' + url
					})
				}	
			},
			//前往编辑资料
			editInfo:function(){
				uni.navigateTo({
					url:'/pages/editInfo/editInfo'
				})
			},
			gotoEwm:function(){
				uni.navigateTo({
					url:'/pages/index/ceshi'
				})
			}
		}
	}
</script>

<style>
	/* pages/mineNew/mineNew.wxss */
	page {
		background: #F4F4F4;
	}

	.header>view:first-child>image {
		width: 100%;
		height: 250rpx;
		position: absolute;
		top: 0;
		z-index: -1;
	}

	.userInfo,
	.noLogin {
		margin: 67rpx 40rpx 0 75rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.userInfoTotal {
		display: flex;
	}

	.userInfoTotal>view:first-child>image {
		height: 100rpx;
		width: 100rpx;
		border-radius: 50%;
		margin: auto;
	}

	.userInfoTotal>view:last-child {
		color: #fff;
		font-size: 28rpx;
		margin-left: 20rpx;
	}

	.userInfoTotal>view:last-child>view:last-child {
		font-size: 26rpx;
		margin-top: 27rpx;
	}

	.userInfo>view:last-child {
		font-size: 20rpx;
		color: #fff;
		border-radius: 40rpx;
		border: 1px solid #fff;
		padding: 5rpx 20rpx;
	}

	.ContainerM {
		margin: 0 45rpx;
		margin-top: 100rpx;
	}

	.ContainerM .ContainerM_h {
		display: flex;
		background: #fff;
		position: relative;
		border-radius: 10rpx;
	}

	.ContainerM .ContainerM_h>view:first-child,
	.ContainerM .ContainerM_h>view:last-child {
		width: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15rpx 0rpx;
	}

	.ContainerM .ContainerM_h>view>view:first-child {
		font-size: 28rpx;
		color: #999999;
	}

	.ContainerM .ContainerM_h>view>view:last-child {
		font-size: 28rpx;
		color: #333333;
		margin-top: 5rpx;
	}

	.myline {
		position: absolute;
		width: 2rpx;
		height: 62rpx;
		background: #E5E5E5;
		top: 24%;
		left: 50%;
	}

	.ContainerM_m,
	.otherInfoTotal {
		border-radius: 10rpx;
		background: #fff;
		padding: 30rpx 22rpx;
		margin-top: 30rpx;
	}

	.ContainerM_m>view:first-child {
		font-size: 28rpx;
		color: #333333;
	}

	.ContainerM_m .orderAll {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.ContainerM_m .orderAll .oneOder {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.ContainerM_m .orderAll .oneOder>view:first-child>image {
		width: 42rpx;
		height: 42rpx;
	}

	.ContainerM_m .orderAll .oneOder>view:last-child {
		color: #333333;
		font-size: 28rpx;
		margin-top: 14rpx;
	}

	.otherInfoTotal>view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0px;
	}

	.otherInfoTotal>view:first-child,
	.otherInfoTotal>view:nth-child(2) {
		border-bottom: 2rpx solid #EEEEEE;
	}

	.otherInfoTotal>view>view:first-child {
		color: #333333;
		font-size: 26rpx;
	}

	.otherInfoTotal>view>view:last-child {
		width: 50rpx;
		height: 40rpx;
	}

	.otherInfoTotal>view>view:last-child>image {
		width: 100%;
		height: 100%;
		display: blcok;
	}

	.otherInfoTotal {
		padding-bottom: 0rpx;
		padding-top: 0rpx;
	}

	.login {
		background: #fff;
		border-radius: 10rpx;
		text-align: center;
		padding: 25rpx 0;
		color: #F65151;
		font-size: 28rpx;
		margin-top: 30rpx;
	}
</style>
