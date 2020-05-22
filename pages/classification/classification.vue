<template>
	<view>
		<!--pages/classification/classification.wxml-->
		<view class="mycontainer">
			<view class="header_t">
				<view class="header_s" @click="gotoSearch">
					<image src="/static/images/nav_icon_search@3x.png"></image>
					<input placeholder="搜索你想要的商品"></input>
				</view>
			</view>
			<view class="contaner_m">
				<swiper :style="{height:height}">
					<swiper-item class="myswiper" catchtouchmove="stopTouchMove">
						<!-- <swiper-item class="myswiper"  > -->
						<scroll-view style="height:100%;width:21.5%;background:#F8F8F8;" scroll-y="true" scroll-with-animation='true'>
							<view class="container_m_l">
								<view class="oneNav" @click="changeNav(index)" :class="myIndex==index?'choose':''" :data-index="index" :key="index"  v-for="(item,index) of shopList ">
									{{item.prodTypeName}}
								</view>

							</view>
						</scroll-view>
						<view class="contaier_m_r">
							<scroll-view style="height:100%;" scroll-y="true" scroll-with-animation='true' bindscroll='changTop'>
								<view class="container_m_r_m">
									<view class="containerProd" @click="gotoDetail(items.prodId)" v-for="(items,indexs) of shopList[myIndex].prodList" :key="indexs">
										<view>											
											<image :src="items.prodImg[0].url"></image>
										</view>
										<view>
											<view>{{items.prodName}}</view>
											<!-- <view>重量：{{items.prodWeight}}{{items.spec}}</view> -->
											<view>
												<view>
													<text>￥</text>
													<text>{{items.salePrice}}</text>
												</view>
												<view @click.stop="add_shoppingcar(items.prodId)"><image src="/static/images/index/icon_shop@3x.png" mode=""></image></view>
											</view>
										</view>
									</view>
									
								</view>
							</scroll-view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>




	</view>

</template>

<script>
	export default {
		data() {
			return {
				height: getApp().globalData.winHeight - 46 + 'px',
				shopList:[], //
				myIndex:'0',
				businessId:'',
				token:'',
			}
		},
		onLoad: function() {		
		},
		onShow: function() {
			this.businessId = uni.getStorageSync('marketid')
			this.token = uni.getStorageSync('token')
			this.getClassList()
		},
		methods: {
			stopTouchMove: function() {
				return false
			},
			
			//获取分类
			getClassList:function(){
				this.$urlRequest('getBusinessCar.do',{businessId:this.businessId}).then(res=>{
					for(var item of res){
						for(var childItem of item.prodList){
							for(var key in childItem){
								if(key == 'prodImg'){
									childItem[key] = JSON.parse(childItem[key])
								}
							}
						}
						
											
					}
					this.shopList = res
					this.getShopCarList()
					// console.log(this.shopList)
				})
			},
			//切换分类
			changeNav:function(index){
				this.myIndex = index
			},
			gotoSearch:function(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			//加入购物车
			add_shoppingcar:function(prodId){
				if (!!!this.token) {
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
				} else {
					var data = {
						token: this.token,
						prodid:prodId
					}
					this.$urlRequest('addBusinessCarProd.do', data).then(res => {
						if (res.state == 'true') {
							this.$myToast('已加入购物车');
							this.getShopCarList()
						}
					})
				
				}
			},
			gotoDetail:function(prodId){
				uni.navigateTo({
					url:'/pages/prodDetail/prodDetail?prodId=' + prodId
				})
			},
			//获取购物车
			getShopCarList:function(){
				if(uni.getStorageSync('token') != ''){
					this.$urlRequest('getCar.do', {
						token: uni.getStorageSync('token')
					}).then(res => {		
						var prodNumber = 0
						for (var item of res[0].prodList) {					
							prodNumber += parseInt(item.prodCount)
						}
						uni.setTabBarBadge({
							index: 2,
							text: "" + prodNumber + ""
						})
					})
				}
			}
			
		}




	}
</script>

<style>
	/* pages/classification/classification.wxss */
	page{
	  background: #FDFDFD;
	  /* height: 100%; */
	}
	.choose{
		color:#58BA67 !important;
		background: #FFFFFF;
	}
	
	::-webkit-scrollbar {
	  width: 0rpx !important;
	  height: 0rpx;
	  color: transparent !important;
	}
	
	/*定义滚动条轨道 内阴影+圆角*/
	::-webkit-scrollbar-track{
	-webkit-box-shadow: inset 0 0 0rpx rgba(0,0,0,0);
	border-radius: 0rpx;
	background-color: #ffffff;
	}
	/*定义滑块 内阴影+圆角*/
	::-webkit-scrollbar-thumb{
	border-radius: 0rpx;
	-webkit-box-shadow: inset 0 0 0rpx rgba(0,0,0,0);
	background-color: rgba(0,0,0,0);
	}
	
	.header_t{
	  width: 100%;
	}
	.header_s{
	  margin: 0 30rpx;
	  margin-top: 10rpx;
	  height: 60rpx;
	  line-height: 60rpx;
	  background: #F4F4F4;
	  border-radius: 30rpx;
	  font-size: 24rpx;
	  text-align: center;
	  position: relative;
	  margin-bottom: 20rpx;
	}
	.header_s>image{
	  width: 23rpx;
	  height: 23rpx;
	  position: absolute;
	  top:31%;
	  left:31%;
	}
	.header_s>input{
	  height: 100%;
	}
	.contaner_m{
	  background: #ffffff;
	
	}
	.contaner_m .container_m_l{
	  height: 100%;
	}
	.contaner_m .container_m_l .oneNav{
	  color: #999999;
	  font-size: 26rpx;
	  text-align: center;
	  height: 96rpx;
	  line-height: 96rpx;
	}
	.myswiper{
	  display: flex;
	}
	.contaier_m_r{
	  width: 72%;
	  margin-right: 30rpx;
	  margin-left: 20rpx;
	}
	.container_m_r_h{
	  display: flex;
	}
	.topScrpoll{
	  white-space: nowrap;
	  width: 100%;
	  height: 80rpx
	}
	.container_m_r_h .oneHeaderNav{
	  border: 1px solid #E5E5E5;
	  font-size: 24rpx;
	  padding: 15rpx 20rpx;
	  margin-right: 10rpx;
	}
	
	/*右边商品样式*/
	.container_m_r_m{
	  /* padding-bottom: 100rpx; */
	  position: relative;
	  padding-top: 20rpx;
	  display:flex;
	  justify-content: space-between;
	  flex-wrap: wrap;
	  padding-bottom: 20rpx;
	}
	/* .container_m_r_m>view:last-child{
	  border-bottom: none;
	} */
	.container_m_r_m_t{
	  /* margin: 10rpx 0; */
	  font-size: 26rpx;
	  color: #333333;
	  position: fixed;
	  z-index: 99999;
	  background: #ffffff;
	  width: 72%;
	  height: 60rpx;
	  line-height:60rpx;
	  top:7%;
	}
	.containerProd{
	  /* display: flex;
	  align-items: center; */
	  border:2rpx solid #E5E5E5;
	  padding-bottom: 10rpx;
	  margin-bottom: 24rpx;
	  width:230rpx;
	  padding:5rpx 15rpx 10rpx 15rpx;
	  border-radius: 10rpx;
	}
	.containerProd>view:first-child{
	  height: 190rpx;
	  width:100%;
	  margin-right: 10rpx;
	}
	.containerProd>view:first-child>image{
	  width: 100%;
	  height: 100%;
	  display: block;
	}
	.containerProd>view:nth-child(2){
	  width: 100%;
	}
	.containerProd>view:nth-child(2)>view:first-child{
	  color: #000000;
	  font-size: 26rpx;
	  white-space:nowrap;
	  text-overflow: ellipsis;
	  width:100%;
	  overflow: hidden;
	  
	}
	.containerProd>view:nth-child(2)>view:nth-child(2){
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-top: 30rpx;
	}
	.containerProd>view:nth-child(2)>view:nth-child(2)>view:first-child{
	  font-size: 22rpx;
	  color: #EA5252;
	}
	.containerProd>view:nth-child(2)>view:nth-child(2)>view:first-child>text:last-child{
	  font-size: 32rpx;
	}
	.containerProd>view:nth-child(2)>view:nth-child(2)>view:nth-child(2)>image{
	  width: 54rpx;
	  height: 54rpx;
	  vertical-align: middle;
	}
	.containerProd>view:nth-child(2)>view:nth-child(2)>view:nth-child(2)>text{
	  width: #333333;
	  font-size: 26rpx;
	  margin: 0 15rpx;
	}
</style>
