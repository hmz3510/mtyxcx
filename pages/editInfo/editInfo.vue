<template>
	<!--pages/editInfo/editInfo.wxml-->
	<view class="myontainer">
	  <view class="changeTel" @click="goTo('change_name')">
	    <view>修改用户名</view>
	    <view><image src="/static/images/index/ic_right@3x.png"></image></view>
	  </view>
	  <view class="changeTel" @click="goTo('change_phone')">
	    <view>修改手机号</view>
	    <view><image src="/static/images/index/ic_right@3x.png"></image></view>
	  </view>
	</view>

</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad:function(){
			
		},
		onShow:function(){
		},	
		methods:{
			goTo:function(type){
				uni.navigateTo({
					url:'/pages/' + type + '/' + type
				})
			}
		}
	}
</script>
	
<style>
	/* pages/editInfo/editInfo.wxss */
	page{
	  background:#F4F4F4;
	}
	.myontainer{
	  background: #fff;
	  padding:0 30rpx;
	  margin-top: 20rpx;
	}
	.myontainer>view:last-child{
	  border-bottom: none;
	}
	.changeTel{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0px;
	border-bottom: 1px solid #E5E5E5;
	}
	.changeTel>view:first-child{
	  font-size: 26rpx;
	  color: #333333;
	}
	.changeTel>view:last-child{
	  width: 50rpx;
	  height: 40rpx;
	}
	.changeTel>view:last-child>image{
	  width: 100%;
	  height: 100%;
	  display: blcok;
	
	}
	
</style>
