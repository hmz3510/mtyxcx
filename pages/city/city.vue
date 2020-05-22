<template>
	<view>
		<!--pages/city/city.wxml-->
		<view class='box mybox'>
			<view style='border-bottom:1rpx solid #eee;padding-bottom:22rpx;padding-top:10rpx;'>
				<view class='search flex'>
					<view>
						<image src='/static//images/nav_icon_search@3x.png'></image>
					</view>
					<view style="width: 100%;">
						<input type='text' placeholder="请输入收货地址" v-model="kesword" v-on:input='getVal'></input>
					</view>
				</view>
			</view>
			<view class='flex now_city' v-if='!search'>
				<view>
					<image src='/static/images/address.png'></image>
				</view>
				<view>当前定位城市</view>
				<view>{{now_city}}</view>
			</view>
		</view>
		<scroll-view scroll-y v-if='search' :style='{height:height,marginTop:top}'>
			<view v-if='search_list.length>0' v-for='(item,index) of search_list' :key='index' style='margin:0 22rpx;'>
				<view class='city_name' :data-indexo='index' :data-title = "item.name" @click="choose_city">
					<view>{{item.name}}</view>
				</view>
			</view>
			<view v-if='search_list.length==0'>
				<view class='empty'>没发现这个城市，换个关键词试试吧</view>
			</view>
		</scroll-view>
		<view class="cltyList" v-if="!search">
			<uni-indexed-list :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list>
		</view>


	</view>
</template>

<script>
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	import amap from '@/static/js/amap-wx.js';
	export default {
		components: {
			uniIndexedList
		},
		data() {
			return {
				search: false,
				city: [], //城市
				list: [],
				kesword: '',
				search_list: [],
				height: '',
				top: "",
				style: [],
				myAmap: '',
				now_city:''
			}
		},
		onLoad: function() {
			// console.log(getApp())
			this.myAmap = new amap.AMapWX({
				key: 'fc7b2b1171e49890b952144ed8562195'
			})
		},
		onShow: function() {
			this.getCity()
			this.getHeight()
			this.getAddress()
			
		},
		methods: {
			//获得当前地址
			getAddress: function() {
				this.myAmap.getRegeo({
					location: this.location,
					success:(data)=>{
						console.log(data)
						this.now_city = data[0].regeocodeData.addressComponent.city
					},
					fail: function(info) {
						//失败回调
						//  console.log(info)
					}
				})
			},
			//计算高度
			getHeight: function() {
				let info = uni.createSelectorQuery().select(".mybox");
				info.boundingClientRect((data) => { //data - 各种参数
					this.height = ((getApp().globalData.screenHeight - getApp().globalData.statusBarHeight - getApp().globalData.titleBarHeight) -
						data.height) + 'px'
					this.top = data.height + 'rpx'

				}).exec()
			},

			//获得城市列表
			getCity: function() {
				let that = this;
				uni.showNavigationBarLoading()
				this.$urlRequest('getCityListV2.do', {}).then(res => {
					uni.hideNavigationBarLoading();
					if (this.city == '') {
						this.search = false
					} else {
						this.search = true
					}
					this.list = res
					this.search = false
				})

			},
			getVal: function() {
				if (this.kesword != '') {
					this.$nextTick(() => {
						this.mysearch()
					})
				} else {
					this.$nextTick(() => {
						this.getCity()
					})

				}
			},
			mysearch: function() {
				let that = this;
				uni.showNavigationBarLoading()
				this.$urlRequest('getCityList.do', {
					name: this.kesword
				}).then(res => {
					uni.hideNavigationBarLoading();
					this.search_list = res
					this.search = true
				})

			},
			//选择城市
			bindClick:function(res){
				uni.setStorage({
					key:'name',
					data:res.item.name
				})
				uni.navigateBack({
				  delta:1
				})
			},
			choose_city:function(e){
				uni.setStorage({
					key:'name',
					data:e.currentTarget.dataset.title
				})
				uni.navigateBack({
				  delta:1
				})
			}
		}
	}
</script>

<style>
	/* pages/city/city.wxss */
	.box {
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 9999999;
	}

	.cltyList {
		position: fixed;
		width: 100%;
		top: 16%;
		height: 100%;
	}

	.empty {
		color: #999;
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 100%;
	}

	.search {
		background: rgb(245, 245, 245);
		border-radius: 5rpx;
		padding: 10rpx 15rpx;
		margin: 0 22rpx;
		/* width:90%;
	  margin:auto; */
	}

	.search input {
		font-size: 30rpx;
	}

	.search>view:first-child {
		width: 30rpx;
		margin-right: 20rpx;
	}

	.search image,
	.now_city image {
		width: 30rpx;
		height: 30rpx;
		display: block;
	}

	.now_city {
		font-size: 32rpx;
		margin-top: 15rpx;
		padding: 0 22rpx 22rpx;
		height: 30px;
		border-bottom: 1rpx solid #eee;
	}

	.now_city view:not(:first-child) {
		margin: 0 5rpx;
	}

	.now_city>view:last-child {
		font-weight: bold;
	}

	.left {
		width: 92%;
		padding-left: 22rpx;
		box-sizing: border-box;
		flex-shrink: 0;
	}

	.title {
		color: #999;
		margin: 10px 0 0;
	}

	.city_name {
		padding: 22rpx 0;
		border-bottom: 1rpx solid #ddd;
	}

	.right {
		width: 8%;
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		height: 396px;
		margin: auto;
		text-align: center;
		font-size: 26rpx;
	}

	.type_title>view {
		height: 18px;
		width: 18px;
		margin: auto;
		line-height: 18px;
		border-radius: 50%;
	}

	.nav_active {
		background: #ddd;
	}
</style>
