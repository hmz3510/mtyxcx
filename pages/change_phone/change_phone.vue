<template>
	<view class='container'>
		<view class='box' style='margin-top:100rpx;'>
			<view style='margin-right:10rpx;'>原手机号</view>
			<input type='number' pattern="[0-9]*" maxlength="11" disabled="disabled" v-model='old_phone' style='flex-grow:1'></input>
		</view>
		<view class='box'>
			<view style='margin-right:10rpx;'>新手机号</view>
			<input type='number' style='flex-grow:1' pattern="[0-9]*" maxlength="11" placeholder='输入新手机号' auto-focus='auto-focus'
			 v-model='phone'></input>
		</view>
		<view class='box'>
			<input type='number' pattern="[0-9]*" maxlength="6" placeholder='输入验证码' v-model='code'></input>
			<view @click='getCode' class="code_ok">{{note}}</view>
		</view>
		<!-- <view class='note'>温馨提示：未注册账号的手机号，登录将自动注册</view> -->
		<button class="login login_ok" @click="login">确定</button>
	</view>


</template>

<script>
	export default {
		data() {
			return {
				note: '获得验证码',
				time: 30,
				timer: '',
				start: false,
				phone: '',
				code: '',
				code_ok: false,
				login_ok: false,
				old_phone: '',
				token: '',
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token')
			this.old_phone = uni.getStorageSync('phone')
		},
		onShow: function() {},
		methods: {
			//获取验证码
			getCode: function() {
				if (this.phone == '') {
					this.$myToast('手机号不能为空')

				} else {
					if ((/^1[3456789]\d{9}$/.test(this.phone))) {
						if (!this.code_ok) {
							this.timer = setInterval(() => {
								this.time--;
								if (this.time != 0) {
									this.note = this.time + '秒后重试'
									this.code_ok = true
								} else {
									this.note = '获取验证码'
									this.time = 30
									clearInterval(this.timer)
									this.code_ok = false
								}
							}, 1000)
							this.$myToast('发送成功')
							this.$urlRequest('getcode.do', {
								phone: this.phone
							}).then(res => {

							})

						}
					} else {
						this.$myToast('手机号格式不正确')
					}
				}
			},
			login: function() {
				if (this.phone == '') {
					this.$myToast('手机号不能为空')
					return;
				}
				if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
					this.$myToast('手机号格式不正确')
					return
				}
				if (this.code == '') {
					this.$myToast('验证码不能为空')
					return
				}
				var data = {
					phone: this.phone,
					smscode: this.code,
					token: this.token
				}
				this.$urlRequest('updateUserphone.do', data).then(res => {
					if (res.state == "false") {
						this.$myToast(res.msg);
					} else if (res.state == "true") {
						this.$myToast('修改成功');
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					}
				})

			}
		}
	}
</script>

<style>
	/* pages/change_phone/change_phone.wxss */
	.container {
		width: 93%;
		margin: auto;
		font-size: 36rpx;
	}

	page {
		background: #fff;
	}

	.box {
		padding: 10rpx 0;
		width: 100%;
		height: 50rpx;
		border-bottom: 1rpx solid #ddd;
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.box view {
		line-height: 50rpx;
		color: #888;
		font-size: 30rpx;
		height: 100%;
		text-align: right;
	}

	.box input {
		height: 100%;
	}

	.note {
		font-size: 30rpx;
		text-align: center;
		color: #888;
	}

	.code_ok {
		color: rgb(246, 193, 55) !important;
	}

	.login {
		width: 100%;
		text-align: center;
		background: rgb(222, 222, 222);
		color: rgb(188, 188, 188);
		margin-top: 20rpx;
	}

	.login_ok {
		background: rgb(246, 193, 55) !important;
		color: rgb(53, 53, 53);
	}
</style>
