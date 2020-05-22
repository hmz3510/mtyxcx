<template>
	<view>
		<view class="mycontainer" v-if="isEmpty">
			<view class="redList">
				<view class="oneRed" v-for="item of redList" :key="item.id">
					<view class="left">
						<view>
							<image src="/static/images/index/hongbao@3x.png"></image>
						</view>
						<view>
							<view>{{item.redtype}}</view>
							<view>{{item.starttime}}-{{item.endTime}}</view>
						</view>

					</view>
					<view class="right">
						<view>￥{{item.redprice}}</view>
						<view @click="gotoUser(item.redprice,item.redid)">去使用</view>
					</view>
				</view>


			</view>
		</view>
		<view class='empty' v-if="!isEmpty">
			<view>
				<image src="/static/images/index/img_empty@3x.png"></image>
				<view>暂无红包可用</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				redList: [], //红包
				token: '',
				isEmpty: null,
				marketid: '',
				pageIndex: 1,
				end:false,
				type:'',
				pay:'' //红包金额

			}
		},
		onLoad: function(options) {
			this.type = options.type;
			// console.log(this.type)
			this.pay = options.pay
			this.token = uni.getStorageSync('token')
			this.marketid = uni.getStorageSync('marketid')


		},
		onShow: function() {
			this.getRedList('1')
		},
		onReachBottom: function () {
			if(!this.end){
				this.pageIndex ++;
				this.getRedList('2')
			}
		},
		methods: {
			//获取红包列表
			getRedList: function(type) {
				if(this.type !=undefined){
					var url = 'getPayUserRed.do'
					var data = {
						token: this.token,
						businessId: this.marketid,
						pageIndex:this.pageIndex,
						pagec: 10,
						pay:this.pay
					}
				}else{
					var url = 'getUserRed.do'
					var data = {
						token: this.token,
						businessId: this.marketid,
						pageIndex: this.pageIndex,
						pagec: 10
					}
				}
				this.$urlRequest(url, data).then(res => {
					if(type =='1'){
						if(res.data.length == 0){
							this.isEmpty = false
						}else{
							this.isEmpty = true
						}
					}
					if(this.pageIndex == 1){
						this.redList = res.data
					}else{
						if(res.data.length == 0){
							this.$myToast('暂无更多红包')
							this.end = true
						}else{
							this.redList.push(res.data)
						}
					}
				})
			},
			//
			gotoUser:function(redPrice,redid){
				if(this.type !== undefined){
					var pageCount = getCurrentPages()
					var pageNum = pageCount[pageCount.length-2]
					pageNum.$vm.red = redPrice
					pageNum.$vm.userRedId = redid
					pageNum.$vm.buyInf.allProdTotalPrice = parseFloat(this.pay) - parseFloat(redPrice)
					uni.navigateBack({
						delta:1
					})
					
				}else{
					uni.switchTab({
						url:'/pages/index/index'
					})
				}		
			}
		}
	}
</script>

<style>
	/* pages/red/red.wxss */
	page {
		background: #F4F4F4;
	}

	.mycontainer {
		margin: 30rpx;
		margin-bottom: 0rpx;
	}

	.oneRed {
		background: #fff;
		height: 180rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 38rpx;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.left {
		display: flex;
		align-items: center;
	}

	.left>view:first-child>image {
		height: 78rpx;
		width: 63rpx;
		display: block;
	}

	.left>view:last-child {
		margin-left: 19rpx;
	}

	.left>view:last-child>view:first-child {
		font-size: 28rpx;
		color: #333333;

	}

	.left>view:last-child>view:last-child {
		font-size: 20rpx;
		color: #999999;
		margin-top: 20rpx;
	}

	.right>view:first-child {
		font-size: 32rpx;
		color: #333333;
	}

	.right>view:last-child {
		/* color: #EA5252; */
		font-size: 22rpx;
		color: #FFFFFF;
		height: 36rpx;
		line-height: 36rpx;
		width: 116rpx;
		border-radius: 50rpx;
		background: #EA5252;
		text-align: center;
		margin-top: 10rpx;
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
