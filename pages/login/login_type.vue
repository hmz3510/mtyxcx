<template>
	<view class='container'>
		<view class='logo'>
			<view>
				<image src='/static/images/img_webchat_login@3x.png'></image>
			</view>
		</view>
		<button class='wx_login' open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" withCredentials="true"> 微信登陆
		</button>
	</view>


</template>

<script>
	export default {
		data() {
			return {
				unionid: '',
				code:''
			}
		},
		onLoad: function() {
			// uni.login({
			// 	provider: 'weixin',
			// 	success: (result) => {
			// 		uni.getUserInfo({
			// 			provider: 'weixin',
			// 			success: (res) => {
			// 				var data = {
			// 					encryptedData: res.encryptedData,
			// 					iv: res.iv,
			// 					code: result.code
			// 				}
			// 				this.$urlRequest('getUnionid2.do', data).then(res => {
			// 					this.unionid = res.unionid
			// 				})

			// 			}
			// 		});
			// 	}
			// });
			uni.login({
				provider: 'weixin',
				success: (result) => {
					this.code = result.code
				}
			})
		},
		methods: {
			getPhoneNumber: function(res) {
				// console.log(res)
				var data = {
					iv: res.detail.iv,
					encryptedData: res.detail.encryptedData,
				}
				if (res.detail.errMsg == 'getPhoneNumber:fail user deny') {
					uni.showModal({
						title: '提示',
						showCancel: false,
						cancelText: '知道了',
						cancelColor: '#000000',
						confirmColor: '#576a94',
						confirmText: '知道了',
						content: '您已拒绝获得微信绑定手机号登录授权',
						success: function(res) {}
					})
				} else {
					uni.checkSession({
						success: (res) => {
							data.code = this.code
							this.$urlRequest('WXlogin2.do', data).then(res => {
								if (res.resultCode == 1) {
									uni.setStorage({
										key: 'token',
										data: res.token
									})
									var pages = getCurrentPages()
									uni.navigateBack({
										delta: pages.length - 1
									})
								}
							})
							
							// uni.login({
							// 	success: res => {
							// 		// 登录注册接口
							// 		if (res.code) {
							// 			data.code = res.code;
										
							// 		}
							// 	}
							// })
						},
						fail: (err) => {
							uni.login({
								success: res => {
									this.code = res.code
									// if (res.code) {
									// 	data.code = res.code;
									// 	this.$urlRequest('WXlogin2.do', data).then(res => {
									// 		if (res.resultCode == 1) {
									// 			uni.setStorage({
									// 				key: 'token',
									// 				data: res.token
									// 			})
									// 			var pages = getCurrentPages()
									// 			uni.navigateBack({
									// 				delta: pages.length - 1
									// 			})
									// 		}
									// 	})
									// }
								}
							})
						}
					})


					// uni.login({
					// 	success: res => {
					// 		console.log(res)
					// 		// 登录注册接口
					// 		if (res.code) {
					// 			data.code = res.code;
					// 			this.$urlRequest('WXlogin2.do', data).then(res => {
					// 				if (res.resultCode == 1) {
					// 					uni.setStorage({
					// 						key:'token',
					// 						data:res.token
					// 					})
					// 					var pages = getCurrentPages()
					// 					uni.navigateBack({
					// 						delta: pages.length - 1
					// 					})
					// 				}
					// 			})
					// 		}
					// 	}
					// })
				}
			},
		}
	}
</script>

<style>
	/* pages/login/login_type.wxss */
	.container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -75%);
	}

	.logo {
		/* margin: 200rpx auto; */
		text-align: center;
	}

	.logo image {
		width: 300rpx;
		height: 420rpx;
	}

	.wx_login {
		background: #58BA67;
		color: #FFFFFF;
		text-align: center;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 30rpx;
		width: 300rpx;
		margin-top: 80rpx;
		border-radius: 50rpx;
	}

	.phone_login {
		margin-top: 20rpx;
		text-align: center;
		color: #576a94;
		font-size: 30rpx;
	}
</style>
