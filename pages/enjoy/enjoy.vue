<template>
	<!--pages/ewm/ewm.wxml-->
	<view class="content">
		<view class="content_M1">
			<view class="enjoyList" v-if="!isEmpty">
				<view class="oneEnjoy" @click='gotoProdDetail(item.prodid)' v-for="item of enjoyQrcode" :key="item.prodid">
					<view class="oneInfo_H">
						<view>{{item.prodname}}</view>
					</view>
					<view class="oneInfo_M">于{{item.favoritetime}}时间收藏</view>
					<view class="oneInfo_B">
						<view @click.stop="delEnjoy(item.prodid)" >取消收藏</view>
						<view @click.stop='gotoProdDetail(item.prodid)'>查看详情</view>
					</view>
				</view>
			</view>
			<view v-if="isEmpty" class="noEnjoy">
				<view class="empty1">
					<image src="/static/images/index/img_empty@3x.png"></image>
					<view>暂无收藏记录</view>
					<view>快去收藏自己喜爱的商品吧~</view>
					<navigator class="gotobutton" url="/pages/index/index" open-type="switchTab" hover-class="changestyle">去收藏</navigator>
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
				enjoyQrcode: [], //收藏列表
				isEmpty:null,
				pageIndex:1,
				end:false 
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token')
		},
		onShow: function() {
			this.getEnjoyList('1')
		},
		onReachBottom: function () {
			if(!this.end){
				this.pageIndex ++;
				this.getEnjoyList('2')
			}
		},
		methods: {
			//获取收藏列表
			getEnjoyList:function(type){
				var data = {
					pageIndex:this.pageIndex,
					pagec:10,
					token:this.token
				}
				this.$urlRequest('getFavoriteProdByUserId.do',data).then(res=>{
					if(type =='1'){
						if(res.data.length == 0){
							this.isEmpty = true
						}else{
							this.isEmpty = false
						}
					}
					if(this.pageIndex == 1){
						this.enjoyQrcode = res.data
					}else{
						if(res.data.length == 0){
							this.$myToast('暂无更多收藏')
							this.end = true
						}else{
							this.enjoyQrcode.push(res.data)
						}
					}
				})
			},
			//取消收藏
			delEnjoy:function(prodid){
				
				uni.showModal({
					title:'提示',
					content: '确定对该商品取关?',
					success:(res=>{
						if (res.confirm) {
							this.$urlRequest('deleteFavoriteProd.do',{token:this.token,id:prodid}).then(res=>{
								if(res.code == '1'){
									this.$myToast('已取消收藏')
								}else{
									this.$myToast(res.msg)
								}
								this.getEnjoyList()
							})
						} else if (res.cancel) {
						}
					})
				})
				
				
			},		
			//前往商品详情
			gotoProdDetail:function(prodid){
				uni.navigateTo({
					url:'/pages/prodDetail/prodDetail?prodId=' + prodid
				})
			}
		}
	}
</script>

<style>
	/* pages/ewm/ewm.wxss */
	page{
	  height: 100%;
	  background: rgba(224, 224, 224,.2);
	  /* background:rgba(253, 253, 249, 1); */
	   /* background: rgb(246, 246, 246); */
	}
	.headerNav{
	  display: flex;
	  justify-content: space-around;
	  background: #fff;
	  font-size: 32rpx;
	  height: 80rpx;
	  line-height: 80rpx;
	  box-shadow: 0 0rpx 20rpx -1rpx rgba(120, 120, 120, 0.5);
	  position: fixed;
	  top: 0;
	  left: 0;
	  right: 0;
	}
	
	.headerNav>view:last-child{
	  color:rgb(105,105,105);
	}
	.active{
	  border-bottom: 2rpx solid rgb(110,200,119);
	  color:rgb(110,200,119);
	}
	.content_M{
	  padding:20rpx;
	  padding-top: 120rpx;
	}
	.one_M{
	  margin-bottom: 20rpx;
	   /* display: flex;
	  justify-content: space-between; */
	}
	.time{
	  width: 28%;
	}
	.time>text:first-child{
	  font-size: 30rpx;
	  margin-right:15rpx;
	}
	
	.ewmInfo{
	  margin-top: 20rpx;
	  padding: 20rpx;
	  border-radius: 10rpx;
	  background: #fff;
	}
	.ewmInfo .oneInfo{
	  padding:20rpx;
	  border-bottom: 1px solid #E5E5E5;
	}
	.ewmInfo .oneInfo .oneInfo_B, .ewmInfo .oneInfo .oneInfo_H{
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}
	.ewmInfo .oneInfo .oneInfo_B{
	  margin: 20rpx 0;
	}
	.ewmInfo .oneInfo .oneInfo_H>view:first-child{
	  font-size: 36rpx;
	}
	.ewmInfo .oneInfo .oneInfo_H>view:last-child>image{
	  width: 34rpx;
	  height: 36rpx;
	}
	.ewmInfo .oneInfo .oneInfo_M{
	  font-size: 28rpx;
	  color: #999999;
	}
	.ewmInfo .oneInfo .oneInfo_B>view:first-child>image{
	  width: 42rpx;
	  height: 42rpx;
	}
	
	.ewmInfo .oneInfo .oneInfo_B>view:last-child{
	  color:#888888;
	  font-size:30rpx;
	}
	/*收藏*/
	.enjoyList{
	  padding: 20rpx;
	}
	.enjoyList .oneEnjoy {
	box-shadow: 0 0rpx 10rpx -1rpx rgba(120, 120, 120, 0.3);
	padding: 20rpx;
	border-radius: 10rpx;
	margin-bottom: 40rpx;
	}
	.enjoyList .oneEnjoy .oneInfo_H>view:first-child{
	  font-size: 36rpx;
	}
	.enjoyList .oneEnjoy .oneInfo_H>view:last-child>image{
	  width: 50rpx;
	  height: 50rpx;
	}
	.enjoyList .oneEnjoy .oneInfo_M{
	  font-size: 28rpx;
	  color: #999999;
	  border-bottom: 2rpx dotted #999;
	  margin-top: 30rpx;
	  padding-bottom: 20rpx;
	  margin-bottom: 30rpx;
	}
	.enjoyList .oneEnjoy .oneInfo_B{
	  display: flex;
	  justify-content: space-between;
	}
	.enjoyList .oneEnjoy .oneInfo_B>view:first-child{
	  color:#888888;
	  font-size:30rpx;
	}
	
	.enjoyList .oneEnjoy .oneInfo_B>view:last-child{
	  color:#888888;
	  font-size:30rpx;
	}
	
	/*遮罩层*/
	.mask{
	  background-color: rgb(0,0,0,.3) !important;
	  position: fixed;
	  left: 0;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  flex-direction: column; 
	  z-index: 10; 
	}
	.maskContent{
	  z-index: 11;
	}
	.mycanvas{
	  background: #fff;
	  width:400rpx;
	  height: 400rpx;
	}
	.saveImg{
	  border-radius: 40rpx;
	  color: #fff;
	  font-size:30rpx;
	  text-align: center;
	  width: 400rpx;
	  height: 80rpx;
	  line-height: 80rpx;
	  background: rgb(0,0,0,.6);
	  margin-top: 40rpx;
	  z-index: 20;
	}
	.maskContent image{
	  width: 40rpx;
	  height: 40rpx;
	  background: #fff;
	  border-radius: 50%;
	  position: absolute;
	  top:240rpx;
	  right:120rpx;
	}
	.noEnjoy{
	  width: 100%;
	  position: fixed;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%,-60%)
	}
	.noEnjoy .empty1{
	  display: flex;
	  justify-content: center;
	  flex-direction: column;
	  align-items: center;
	}
	.noEnjoy .empty1 image{
	  width: 365rpx;
	  height: 455rpx;
	  margin-bottom: 20rpx;
	}
	.noEnjoy .empty1 view{
	  font-size: 30rpx;
	  color: #666;
	}
	.noEnjoy .empty1 view:nth-child(3){
	  margin: 25rpx 0;
	}
	.empty1 .gotobutton{
	  height: 60rpx;
	  line-height: 60rpx;
	  width: 210rpx;
	  text-align: center;
	  color: #fff !important;
	  background: #58BA67;
	  font-size: 30rpx;
	  border-radius: 50rpx;
	}

</style>
