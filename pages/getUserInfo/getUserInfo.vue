<template>
	<view class='container'>
	  <view class='logo'>
	    <view>
	      <image src='/static/images/img_webchat_login@3x.png'></image>
	    </view>
	  </view>
	  <button class='wx_login' open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true"> 授权用户信息 </button>
	</view>

	
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad:function(){
			
		},
		methods:{
			getUserInfo:function(){
				uni.getUserInfo({
				  provider: 'weixin',
				  success:(res)=>{
					 if(res.errMsg == 'getUserInfo:ok'){
						 this.gotoLogin()
					 }else{
					  uni.navigateBack({
							 delta:1
						})
					 }
				  }
				});
				
			},
			gotoLogin:function(){	
				uni.navigateTo({
					url:'/pages/login/login_type'
				})
			}
		}
	}
</script>
	
<style>
	/* pages/login/login_type.wxss */
	.container{
		/* margin:0 30rpx; */
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-75%);
	}
	.logo{
	  /* margin:200rpx auto; */
	  text-align: center;
	}
	.logo image{
	  width:300rpx;
	  height:420rpx;
	}
	.wx_login{
	  background:#58BA67;
	  color:#FFFFFF;
	  text-align: center;
	  height: 66rpx;
	  line-height: 66rpx;
	  font-size: 30rpx;
	  width: 300rpx;
	  margin-top: 80rpx;
	  border-radius: 50rpx;
	}
	.phone_login{
	  margin-top:20rpx;
	  text-align: center;
	  color:#576a94;
	  font-size:30rpx;
	}
	
</style>
