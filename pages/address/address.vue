<template>
	<view>
		<scroll-view scroll-y class="mySrcll">
			<view class='empty' v-if='addressList.length==0'>暂无收货地址</view>
			<view class='addressList' v-else>
				<view v-for='(item,index) of addressList' :key='index' class='flex between'  @click="chooseMe(index,item.id)">
					<view>
						<view class='address_name ellipsis'>{{item.address}}</view>
						<view class='concat'>{{item.concatname}} {{item.concatphone}}</view>
					</view>
					<view @click.stop='gotoDetail' :data-index='index' data-title='编辑收货地址'>
						<image src='/static/images/change.png'></image>
					</view>
				</view>
			</view>
		</scroll-view>
		<view style="height:120rpx;"></view>
		<view :style='{height:bottom}' class='add_address flex' @click='gotoDetail' data-title='新增收货地址'>
			<view>
				<!-- <image src='../../images/add.png'></image> -->
				<view>新增收货地址</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				addressList: null,
				bottom: getApp().globalData.bottom,

			}
		},
		onLoad: function() {

		},
		onShow: function() {
			this.token = uni.getStorageSync('token')
			this.getList()
			
		},
		methods: {
			//获得地址列表
			getList: function() {
				var t = this;
				var data = {
					token: this.token
				}
				this.$urlRequest('addressList.do', {
					token: this.token
				}).then(res => {
					this.addressList = res.data
				})

			},
			//新增收获地址
			gotoDetail: function(e) {
				var index = e.currentTarget.dataset.index;
				var title = e.currentTarget.dataset.title;
				if (index != undefined) {
					uni.navigateTo({
						url: 'address_detail?title=' + title + '&address=' + JSON.stringify(this.addressList[index]),
					})
				} else {
					uni.navigateTo({
						url: 'address_detail?title=' + title,
					})
				}
			},
			//选择切换地址
			chooseMe:function(index,id){
				var data  = {
					token:this.token,
					id:id
				}
				this.$urlRequest('swapAddressList.do',data).then(res=>{
					if(res.code == '1'){
						this.$myToast('选择成功')
						setTimeout(function(){
							uni.navigateBack({
								delta:1
							})
						},1500)
					}else{
						this.$myToast(res.msg)
					}
					
				})
			}
		}
	}
</script>

<style>
	/* pages/address/address.wxss */
	page {
		background: #F4F4F4;
	}

	.mySrcll {
		margin-top: 20rpx;
		background: #fff;
	}

	.addressList>view {
		margin: 22rpx 22rpx;
		padding-bottom: 22rpx;
		border-bottom: 1rpx solid #E5E5E5;
		margin-bottom: 10rpx;
	}

	.address_name {
		font-size: 26rpx;
		margin-bottom: 10rpx;
		color: #333333 !important
	}

	.concat {
		margin-top: 10rpx;
		color: #BBBBBB;
		font-size: 26rpx;

	}

	.addressList>view>view:last-child image {
		height: 45rpx;
		width: 45rpx;
		display: block;
	}

	.add_address {
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 30rpx;
		box-sizing: border-box;
		/* background: #F4F4F4; */

	}

	.add_address>view:first-child {
		background: #58BA67;
		margin: 0 30rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		color: #fff;
		border-radius: 10rpx;
	}

	.empty {
		color: #999;
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 100%;
	}

	/* .add_address image{
  height:45rpx;
  width:45rpx;
  display:block;
  margin-right:15rpx;

} */
</style>
