<template>
	<view>
		<view class='flex'>
			<view>联系人:</view>
			<view>
				<input type='text' placeholder="请填写收货人的姓名" focus="true" data-title='name' v-model='name'></input>
			</view>
		</view>
		<view class='flex'>
			<view>手机号:</view>
			<view>
				<input type='text' placeholder="请填写收货人手机号码" data-title='phone' v-model="phone"></input>
			</view>
		</view>
		<view class='flex'>
			<view>收货地址:</view>
			<view class='address'>
				<view @click='open_choose'>
					<input type='text' placeholder="点击选择" v-model='address' disabled="true"></input>
				</view>
				<view>
					<image src='/static/images/icon_xyy@3x.png'></image>
				</view>
			</view>
		</view>
		<view class='flex'>
			<view>门牌号:</view>
			<view>
				<input type='text' placeholder="详细地址，例：16号楼5层301室" data-title='detail_address' v-model="detail_address"></input>
			</view>
		</view>
		<view class='submit' style='background:rgb(246,193,55);color:#535353' @click="submit">保存地址</view>
		<view v-if='edit' class='del' style='background:#fff;color:rgb(246,193,55);' @click="del">删除地址</view>
		<view class='choose' v-if='choose'>
			<view class='box'>
				<view class='city' @click.stop="choose_city">
					<view>
						<image src='/static/images/address.png' style='width:30rpx;height:30rpx;'></image>
					</view>
					<view class='city_name'>{{CityName}}</view>
					<view>
						<image src='/static/images/down.png' style='width:20rpx;height:16rpx;'></image>
					</view>
				</view>
				<view class='search flex'>
					<view>
						<image src='/static/images/nav_icon_search@3x.png'></image>
					</view>
					<view>
						<input type='text' placeholder="请输入收货地址" v-model="keyword" data-title='keyword' v-on:input='getVal'></input>
					</view>
				</view>
			</view>
			<scroll-view scroll-y scroll-top="0" style="padding-bottom: 40rpx;" :style='{height:height}'>
				<view class='title' v-if='isnear'>附近地址</view>
				<view style='padding:0rpx 22rpx 0 44rpx;'>
					<view class='address_list'>
						<view style='padding:22rpx 0;' v-for="(item,index) of near_address" :data-name='item.name' :data-x='item.fix_x'
						 :data-y='item.fix_y' @click='mychoose' :key="index">
							<view class='address_name'>{{item.name}}</view>
							<view class='address_detail'>{{item.address}}</view>
						</view>
					</view>
					<view class='empty' style='display:flex;align-items:center;'>
						<view class='small_line'></view>
						<view>无更多地址，请尝试输入其他关键词</view>
						<view class='small_line'></view>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:'',
				edit: false,
				choose: false,
				empty: false,
				id:'',
				detail_address:'',
				name: '', //联系人
				phone: '', //手机号
				address: '', //地址
				keyword: '', //收后地址
				CityName: '', //城市名称
				longitude: getApp().globalData.longitude,
				latitude: getApp().globalData.latitude,
				pageIndex: 1,
				empty_search: '',
				isnear: '',
				near_address: '',
				url:'',//请求地址
				x: '',
				y: '',
				height: (getApp().globalData.screenHeight - getApp().globalData.statusBarHeight - getApp().globalData.titleBarHeight -
					60) + 'px'
			}
		},
		onLoad: function(options) {
			this.token = uni.getStorageSync('token')
			uni.setNavigationBarTitle({
				title: options.title
			})
			if(options.title =='新增收货地址'){
				this.url = 'addAddress.do'

			}else{
				this.url = 'upAddress.do'
				this.id = JSON.parse(options.address).id
				this.phone =  JSON.parse(options.address).concatphone
				this.name = JSON.parse(options.address).concatname
				this.detail_address =  JSON.parse(options.address).housenum
				this.address = JSON.parse(options.address).address
				this.x =  JSON.parse(options.address).Fix_X
				this.y =  JSON.parse(options.address).Fix_Y
			}
		},
		onShow: function() {			
			this.getNowAddress()
		},
		methods: {

			//判断选择那个显示地址
			getNowAddress: function() {
				if (uni.getStorageSync('name') == '') {
					this.CityName = getApp().globalData.now_city
				} else {
					this.CityName = uni.getStorageSync('name');
					// this.getLocation_xcx()
				}
				this.getLocation_xcx()

			},
			//获取经纬度
			getLocation_xcx: function() {
				this.$urlRequest('getLocation_xcx.do', {
					name: this.CityName
				}).then(res => {
						this.latitude = res.fix_y,
						this.longitude = res.fix_x;
						this.getUserXY()
					// this.getNearAddress()
				})
			},
			
			//转换经纬度
			getUserXY:function(){
				var data = {
					user_X:this.longitude,
					user_Y:this.latitude
				}
				this.$urlRequest('getUserXY.do',data).then(res=>{
					this.latitude = res.user_Y,
					this.longitude = res.user_X;
					this.getNearAddress()
				})
			},

			//获取附近地址
			getNearAddress: function() {
				let data = {
					user_Y: this.latitude,
					user_X: this.longitude,
					page: this.pageIndex,
					offset: 10
				}
				this.$urlRequest('getNearAddressList.do', data).then(res => {
					this.isnear = true
					this.empty_search = false
					if (res.length < 10) {
						this.empty_near = true
					}
					if (this.pageIndex = 1) {
						this.near_address = res
					} else {
						let list = this.near_address.concat(res);
						this.near_address = list
					}
				})

			},

			getVal: function() {
				if (this.keyword != '') {
					this.search_address()
				} else {
					this.getNearAddress()
				}
			},

			//保存地址
			submit: function() {
				let reg = /^1[3456789]\d{9}$/;
				if (this.name.length == 0) {
					this.$myToast('联系人不能为空');
					return false;
				} else if (this.phone.length == 0) {
					this.$myToast('手机号不能为空');
					return false;
				} else if (this.phone.length < 11) {
					this.$myToast('手机号长度有误');
					return false;
				} else if (!reg.test(this.phone)) {
					this.$myToast('手机号有误');
					return false;
				} else if (this.address.length == 0) {
					this.$myToast('收货地址不能为空');
					return false;
				} else {
					let data = {
						concatname: this.name,
						housenum: this.detail_address,
						concatphone: this.phone,
						address: this.address,
						token: this.token,
						Fix_X: this.x,
						Fix_Y: this.y,
						id: this.id
					}
					this.$urlRequest(this.url,data).then(res=>{
						if (res.state == 'true') {
							if(this.url == 'addAddress.do'){
								this.$myToast('新增地址成功')
							}else{
								this.$myToast('修改地址成功')
							}
							setTimeout(function(){
								uni.navigateBack({
									delta: 1
								})
							},1500)
							
						}
					})
				}

			},
			//选择收获地址
			open_choose: function() {
				this.choose = true
			},
			choose_city: function() {
				//选择收获城市
				uni.navigateTo({
					url: '/pages/city/city',
				})
			},
			//搜索地址
			search_address: function() {
				var data = {
					user_Y: this.latitude,
					user_X: this.longitude,
					keywords: (this.keyword).replace(/\s*/g, ""),
					cityName:this.CityName
				}
				this.$urlRequest('getAddressListByKeywords.do', data).then(res => {
					this.empty_near = false
					this.isnear = false
					if (res.length < 10 || res.length == 0 && this.pageIndex == 1) {
						this.empty_search = false
					}

					if (res.length > 0 && this.pageIndex == 1) {
						this.near_address = res
					} else if (res.length > 0 && this.pageIndex > 1) {
						let list = this.near_address.concat(res)
						this.near_address = list
					} else if (res.length == 0 && this.pageIndex == 1) {
						this.near_address = ''
					}
				})

			},
			//选择数据
			mychoose: function(e) {
				this.address = e.currentTarget.dataset.name
				this.x = e.currentTarget.dataset.x
				this.y = e.currentTarget.dataset.y
				this.choose = false
				this.pageIndex = 1
				this.keyword = ""
			},

		}
	}
</script>

<style>
	/* pages/address/address_detail.wxss */
	page {
		font-size: 26rpx;
	}

	.flex {
		margin-left: 22rpx;
		border-bottom: 1rpx solid #eee;
		padding: 22rpx 0;
		padding-right: 22rpx;
	}

	.flex>view:first-child {
		width: 200rpx;
	}

	.flex>view:last-child,
	.address>view:first-child {
		flex-grow: 1;
	}

	.address {
		display: flex;
		align-items: center;
	}

	.address image {
		width: 15rpx;
		height: 20rpx;
		display: block;
		margin-left: 15rpx;
	}

	/* 单选框 */
	.radio {
		margin-right: 10rpx;
		font-size: 28rpx;
		height: 20px;
		line-height: 22px;
	}

	radio-group {
		height: 20px;
	}

	radio {
		margin-right: 10rpx;
	}

	radio .wx-radio-input {
		height: 15px;
		width: 15px;
		margin-top: -3px;
	}

	radio .wx-radio-input.wx-radio-input-checked {
		background-color: rgb(246, 193, 55);
		border-color: rgb(246, 193, 55);
	}

	/* 光标颜色 */
	input {
		caret-color: rgb(246, 193, 55);
	}

	/* 按钮 */
	.submit,
	.del {
		width: 90%;
		margin: auto;
		margin-top: 15rpx;
		border-radius: 5rpx;
		font-size: 30rpx;
		padding: 22rpx;
		text-align: center;
	}

	.del {
		border: 1rpx solid rgb(246, 193, 55);
	}

	/* 地址选择 */
	.choose {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		background: #fff;
		z-index: 99999999;
	}

	.empty {
		color: #999;
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 100%;
	}

	.box {
		padding: 22rpx;
		height: 60px;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		border-bottom: 1rpx solid #eee;
	}

	.city {
		max-width: 35%;
		display: flex;
		align-items: center;
		margin-right: 10rpx;
		flex-shrink: 0;
	}

	.city>vew:first-child {
		width: 30rpx;
		height: 30rpx;
	}

	.city>vew:last-child {
		width: 20rpx;
		height: 16rpx;
	}

	.city image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.city_name {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		margin: 0 10rpx 0 5rpx;
	}

	.search {
		background: rgb(245, 245, 245);
		border-radius: 5rpx;
		padding: 10rpx 15rpx;
		width: 90%;
		margin: auto;
	}

	.search>view:first-child {
		width: 30rpx;
		margin-right: 20rpx;
	}

	.search image {
		width: 30rpx;
		height: 30rpx;
		display: block;
	}

	.title {
		color: #999;
		font-size: 26rpx;
		margin: 22rpx 22rpx 0;
	}

	.address_list>view:not(:last-child) {
		border-bottom: 1rpx solid #eee
	}

	.address_name {
		font-size: 32rpx;
		/* margin-bottom:10rpx; */
	}

	.address_detail {
		font-size: 24rpx;
		color: #999;
	}

	.empty .small_line {
		flex-grow: 1;
		border-top: 1rpx solid #ccc;
	}

	.empty>view:nth-child(2) {
		font-size: 24rpx;
		color: #999;
		margin: 0 10rpx;
	}
</style>
