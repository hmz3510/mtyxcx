<template>
	<!--pages/change_ame/change_name.wxml-->
	<!-- <component-topnav inner-title="修改用户名" isShowBack='true'></component-topnav> -->
	<view class='box'>
		<view>用户名:</view>
		<view>
			<input type='text' v-model='name' placeholder="输入新的用户名" focus="true"></input>
		</view>
		<view class='submit' @click='submit'>确认</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				name: '',
				token: ''
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token')
		},
		onShow: function() {},
		methods: {
			submit: function() {
				if (this.name == '') {
					this.$myToast('要修改新昵称的话不能为空哦(⊙o⊙)？')

				} else {
					var data = {
						token: this.token,
						username: this.name
					}
					this.$urlRequest('editUserInfo.do', data).then(res => {
						if (res.state == 'true') {
							this.$myToast('修改成功')
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/mine/mine',
								})
							}, 1500);
						} else {
							this.$myToast(res.msg)
						}
					})
				}
			}
		}
	}
</script>

<style>
	/* pages/change_ame/change_name.wxss */
	.box {
		padding: 22rpx;
	}

	.box>view:first-child {
		font-size: 28rpx;
		color: #535353;
	}

	.box>view:nth-child(2) {
		border-bottom: 1rpx solid #eee;
		padding: 20rpx 0;
	}

	.submit {
		border-radius: 5rpx;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: rgb(246, 193, 55);
		text-align: center;
		margin-top: 20rpx;
	}
</style>
