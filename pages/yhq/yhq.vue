<template>
	<view>
		<view class="mycontainer" v-if="isEmpty">
			<view class="redList">
				<view class="oneRed">
					<view class="left">
						<view>
							<text>￥</text>
							<text>5</text>
						</view>
						<view>满89可使用</view>
						<view>有效期 2020.02.19-2020.03.31</view>
					</view>
					<view class="right">去使用</view>					
				</view>
				<view class="oneRed">
					<view class="left">
						<view>
							<text>￥</text>
							<text>5</text>
						</view>
						<view>满89可使用</view>
						<view>有效期 2020.02.19-2020.03.31</view>
					</view>
					<view class="right">去使用</view>					
				</view>
				
			</view>			
		</view>
		<view class='empty' v-if="!isEmpty">
			<view>
				<image src="/static/images/index/img_empty@3x.png"></image>
				<view>暂无优惠券可用</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				yhqList:[], //红包
				token: '',
				isEmpty:true
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token')
			// this.isEmpty = false
		},
		onShow: function() {},
		methods: {

		}
	}
</script>

<style>
	/* pages/red/red.wxss */
	page {
		background:#F4F4F4;
	}
	.mycontainer{
		margin:30rpx;
		margin-bottom: 0rpx;
	}
	.oneRed{
		height: 185rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 38rpx;
		align-items: center;
		margin-bottom: 20rpx;
		background-image:url(data:image/png;base64,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);
		background-size: cover;
	}
	
	.left>view:first-child>text:first-child{
		color: #58BA67;
		font-weight: bold;
		font-size: 40rpx;
	}
	.left>view:first-child>text:last-child{
		color: #58BA67;
		font-weight: bold;
		font-size: 60rpx;
	}
	.left>view:nth-child(2){
		color: #58BA67;
		font-size: 24rpx;
		margin: 10rpx 0;
		margin-top: 5rpx;
	}
	.left>view:nth-child(3){
		color: #666666;
		font-size: 22rpx;
	}
	
	.right{
		background: #58BA67;
		color: #FFFFFF;
		font-size: 26rpx;
		text-align: center;
		border-radius: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		width: 120rpx;
	}
	
	
	.empty {
		position: fixed;
		top: 25%;
		left: 50%;
		right: 0;
		transform: translate(-50%, -50%);
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 100%;
	}

	.empty>view {
		font-size: 24rpx;
		color: #999999;
	}

	.empty>view>image {
		width: 250rpx;
		height: 305rpx;
	}
</style>
