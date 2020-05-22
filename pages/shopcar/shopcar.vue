<template>
	<view>
		<view v-if='token==""' class="nologin">
			<view style="margin-top:-60rpx;">
				<image src="/static/images/img_shopping_login@3x.png" alt="" style="height:544rpx;width:364rpx;"></image>
				<view style="color: #999999;font-size: 30rpx;">
					登录后去选购吧
				</view>
				<view class='nologin_button' @click='goToLogin'>
					立即登录
				</view>
			</view>
		</view>

		<view v-if="token!=''">

			<view v-if='isEnpty&&isready' class="car_Box_body">
				<view class='car_box'>
					<view class='store_name'>
						<view  @click='allClick'>
							<view class='choose_box'>
								<view class='xz_A' v-if='carList.isChoice==true'>
									<image src='/static/images/index/icon_choose_s@3x.png'></image>
								</view>
								<view class='xz' v-if='carList.isChoice==false'>
									<image src='/static/images/icon_xq_n@3x.png'></image>
								</view>
							</view>
							<view style="color:#58BA67;margin-left: 21rpx;" data-indexO='index'>{{carList.businessName}}</view>
						</view>
						<view @click='delpro' style="color:#999999;font-size:26rpx;">清空购物车</view>
					</view>
					<view v-for='(item,index) of carList.prodList' :key='index'>
						<view class='prod_list' :data-index='index' @click='changeClick_new'>
							<view class='choose_box' style='align-self: center;height: 100rpx;line-height: 100rpx;'>
								<view class='xz_A' v-if='item.isChoice==true'>
									<image src='/static/images/index/icon_choose_s@3x.png'></image>
								</view>
								<view class='xz' v-else>
									<image src='/static/images/icon_xq_n@3x.png'></image>
								</view>
							</view>
							<view class='prod_img' @click.stop="gotoDetail(item.prodId)">
								<image :src="item.prodImg[0].url" alt=""></image>
							</view>
							<view class='prod_msg'>
								<view>
									{{item.prodName}}
								</view>
								<view>
									规格: {{item.prodWeight}}g/{{item.spec}}
								</view>
								<view class='prod_price'>

									<view v-if='item.discount==0'>
										<span>￥</span>
										<span style="font-size: 32rpx;">{{item.salePrice}}</span>
									</view>
									<view wx:else style='text-align:right;margin-right:10rpx;'>
										<span>￥{{item.percentPrice}}</span>
									</view>
									<view class='count'>
										<view v-if='item.prodCount>0' :data-index='index' :data-type='0' @click.stop='jisuan' class='ciclr ciclr1'>
											<image src='/static/images/index/jian@3x.png'></image>
										</view>
										<view>
											{{item.prodCount}}
										</view>
										<view :data-index='index' :data-type='1' @click.stop='jisuan' class='ciclr ciclr2'>
											<image src='/static/images/index/add@3x.png'></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class='bottom' v-if='isEnpty&&isready'>
				<view @click='allClick'>
					<view class='xz_A' v-if='clickAll'>
						<image src='/static/images/index/icon_choose_s@3x.png'></image>
					</view>
					<view class='xz' v-if='!clickAll'>
						<image src='/static/images/icon_xq_n@3x.png'></image>
					</view>
					<view>全选</view>
				</view>
				<view style='text-align:center;padding:0;'>
					<view class="allmoney">
						<view>总共：{{weight}}件</view>
						<view>
							<text>总计：</text>
							<text>￥{{total}}</text>
						</view>
					</view>
				</view>
				<view class='submit' v-if='total_c<=0' @click='pay'>
					提交订单
				</view>
				<view v-else @click='clear' class='no_submit'>
					差{{total_c}}元起送
				</view>
			</view>


			<view v-if='!isEnpty&&isready' class='enpty noEnjoy'>
				<view class="empty1">
					<image src="/static/images/img_mf@3x.png"></image>
					<view>购物车都快饿瘪了</view>
					<view>快去选购自己的食物吧~</view>
					<navigator class="gotobutton" url="/pages/index/index" open-type="switchTab" hover-class="other-navigator-hover">去逛逛</navigator>
				</view>
			</view>

			<view class="gussLoveList">
				<view class="gussTitle">猜你喜欢</view>
				<view class="guessLove">
					<view class="oneLove" v-for="item of guessList" :key="item.prodid">
						<view @click.stop="gotoDetail(item.prodid)">
							<image :src="item.prodimg[0].url"></image>
						</view>
						<view>{{item.prodname}}</view>
						<view>
							<view>￥{{item.saleprice}}</view>
							<view :data-prodId="item.prodid" @click="add_shoppingcar">
								<image src="/static/images/index/icon_shop@3x.png"></image>
							</view>
						</view>
					</view>
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
				isEnpty: '',
				carList: '', //购物车列表 
				ok: false,
				clickAll: false,
				isready: false,
				oldCarList: {}, //原始数据
				total_c: '', //总金额
				total: 0,
				weight: 0, //重量
				guessList: '', //猜你喜欢商品
				marketid: '', //
				prodNumber: '' //商品数量
			}
		},
		onLoad: function(options) {},
		onShow: function() {
			this.token = uni.getStorageSync('token')
			this.marketid = uni.getStorageSync('marketid')
			this.getCarList()
			this.guessLove()
		},
		methods: {
			//获取购物车列表
			getCarList: function() {
				this.$urlRequest('getCar.do', {
					token: this.token
				}).then(res => {
					this.isready = true;
					if (res.length == 0) {
						this.isEnpty = false
					} else {
						this.clickAll = res[0].isChoice
						this.isEnpty = true
						for (var item of res[0].prodList) {
							for (var key in item) {
								if (key == 'prodImg') {
									item[key] = JSON.parse(item[key])
								}
							}
						}
						this.carList = res[0];
						this.total_weight()
					}
					// console.log(res)

				})
			},

			//勾选要买物件的函数
			changeClick_new: function(e) {
				var count = 0;
				var index = e.currentTarget.dataset.index;
				this.carList.prodList[index].isChoice = !this.carList.prodList[index].isChoice;
				for(var item of this.carList.prodList){
					if(item.isChoice == false){
						this.clickAll = false
						this.carList.isChoice = false
						break
					}else{
						count++
					}
				}
				if(count == this.carList.prodList.length){
					this.clickAll = true
					this.carList.isChoice = true
				}
				this.submit()

			},
			//前往登陆
			goToLogin: function() {
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
			},
			//加减事件
			jisuan: function(e) {
				var index = e.currentTarget.dataset.index;
				var type = e.currentTarget.dataset.type;
				if (type == '1') {
					if (parseInt(this.carList.prodList[index].prodCount) >= parseInt(this.carList.prodList[index].prodNum)) {
						this.$myToast('已经到达库存的最大值')
						return
					}
					this.carList.prodList[index].prodCount++
				} else {
					this.carList.prodList[index].prodCount--
					if (parseInt(this.carList.prodList[index].prodCount) <= 0) {
						this.carList.prodList.splice(index, 1);
					}
					if(this.carList.prodList.length == 0){
						this.isEnpty = false
					}
				}
				this.submit()
			},
			//更新数据事件
			submit: function() {
				var data = {
					businessId: this.carList.businessId,
					token: this.token,
					shoppingCarJson: JSON.stringify(this.carList)
				}
				this.$urlRequest('updateBusinessCar.do', data).then(res => {
					this.total_weight()
				})

			},
			//购物车全选事件
			allClick: function() {
				this.carList.isChoice = !this.carList.isChoice
				this.clickAll = this.carList.isChoice
				if (this.carList.isChoice) {
					for (var item of this.carList.prodList) {
						item.isChoice = this.carList.isChoice
					}
				} else {
					for (var item of this.carList.prodList) {
						item.isChoice = this.carList.isChoice
					}
				}
				this.submit()
			},
			//清空购物车
			delpro: function() {
				var data = {
					businessId: this.carList.businessId,
					token: this.token
				}
				uni.showModal({
					content: '确定删除所有宝贝?',
					success: (res) => {
						if (res.confirm) {
							this.$urlRequest('deleteBusinessCar.do', data).then(res => {
								if (res.state == 'true') {
									this.$myToast('已全部清空')
									uni.removeTabBarBadge({
										index: 2,
									})
									this.getCarList()
								}
							})
						}
					}
				});

			},
			//计算总价,重量
			total_weight: function() {
				var weight = 0,
					total = 0,
					prodNumber = 0
				for (var item of this.carList.prodList) {
					if (item.isChoice == true) {
						weight = weight + 1
						total = (parseFloat(total) + parseFloat(item.salePrice) * item.prodCount).toFixed(2)
						// weight = (parseFloat(weight) + parseFloat(item.prodWeight) * item.prodCount).toFixed(2)
					}
					prodNumber += parseInt(item.prodCount)
					this.total = total;
					this.weight = weight
				}
				uni.setTabBarBadge({
					index: 2,
					text: "" + prodNumber + ""
				})
				if(this.carList.prodList.length == 0){
					uni.removeTabBarBadge({
						index: 2,
					})
				}
			},

			//获取猜你喜欢商品
			guessLove: function() {
				this.$urlRequest('getLikeProd.do', {
					marketid: this.marketid,
					token: this.token
				}).then(res => {
					for (var item of res.data) {
						for (var key in item) {

							if (item[key] == null || item[key] == 'null') {
								item[key] = ''
							}
							if (key == 'prodimg') {
								item[key] = JSON.parse(item[key])
							}
						}
					}
					this.guessList = res.data
				})
			},
			//结算
			pay: function() {
				if (this.total <= 0) {
					this.$myToast('请先选择商品，在提交订单')
					return
				}
				var mydata = []
				var obj = [{
					businessId: this.carList.businessId,
					businessImg: this.carList.businessImg,
					businessName: this.carList.businessName,
					isChange: this.carList.isChange,
					isChoice: this.carList.isChoice,
					time: this.carList.time,
					status: this.carList.status,
				}]
				for (var item of this.carList.prodList) {
					if (item.isChoice == true) {
						mydata.push(item)
					}
				}
				obj[0].prodList = mydata
				var data = {
					token: this.token,
					shoppingCarJson: JSON.stringify(obj)
				}
				this.$urlRequest('getPayDetail.do', data).then(res => {
					if (res.resultCode == '1') {
						uni.navigateTo({
							url: '/pages/account/account?arr=' + JSON.stringify(res),
						})
					} else {
						this.$myToast(res.message)
					}
				})
			},
			//加入购物车
			add_shoppingcar: function(e) {
				if (!!!this.token) {
					uni.getSetting({
						success(res) {
							if (res.authSetting['scope.userInfo']) {
								// 已经授权，可以直接调用 getUserInfo 获取头像昵称
								uni.navigateTo({
									url: '/pages/login/login_type',
								})
							} else {
								uni.navigateTo({
									url: '/pages/getUserInfo/getUserInfo',
								})
							}
						}
					})
				} else {
					var data = {
						token: this.token,
						prodid: e.currentTarget.dataset.prodid
					}
					uni.showLoading({
						title:'正在加入购物车'
					})
					this.$urlRequest('addBusinessCarProd.do', data).then(res => {
						uni.hideLoading()
						if (res.state == 'true') {
							this.$myToast('已加入购物车');
							this.getCarList()
						}
					})

				}
			},
			gotoDetail: function(prodId) {
				uni.navigateTo({
					url: '/pages/prodDetail/prodDetail?prodId=' + prodId
				})
			},


		}


	}
</script>

<style>
	/* pages/shoppingcar/shoppingcar.wxss */
	page {
		background: #F4F4F4;
	}

	view {
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
	}

	body {
		margin: 0;
		background: rgb(242, 242, 242);
		font-family: '微软雅黑';
	}

	#content {
		padding: 22rpx;
		background: rgb(242, 242, 242);
		font-size: 18rpx;
	}

	.stoList {
		display: flex;
		justify-content: space-between;
		height: 125rpx;
		padding: 10rpx 0
	}

	.imgBox {
		width: 50rpx;
		height: 50rpx;
	}

	.stoInf {
		padding-left: 10rpx;
		margin-left: 10rpx;
		border-bottom: 1rpx solid #eeeeee;
		flex-grow: 1;
		line-height: 30rpx;
		font-size: 14rpx;
	}

	.stoInf>view {
		display: flex;
		justify-content: space-between;
	}

	.title {
		font-size: 20rpx;
	}

	#dX {
		text-align: center;
		padding-top: 10rpx;
	}

	.time {
		color: #aaaaaa
	}

	.els {
		width: 50%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.again {
		float: right;
		border-radius: 5rpx;
		/* border: 1rpx solid #aaaaaa; */
		padding: 0 10rpx;
	}

	.car_Box_body {
		margin: 0rpx 30rpx;
		margin-top: 20rpx;
	}

	.car_Box {
		margin-bottom: 10rpx;
		padding: 10rpx;
		background: white;
		border-bottom: 1rpx solid #eeeeee
	}

	.car_Box_noOpen {
		color: gray;
	}

	.store_name {
		display: flex;
		justify-content: space-between;
		/* margin-bottom: 38rpx; */
		font-size: 24rpx;
		color: rgb(83, 83, 83);
	}

	.store_name>view:first-child {
		display: flex;
		align-items: center;
	}

	.store_name image {
		height: 40rpx;
		width: 40rpx;
	}

	.car_Box>view:last-child {
		text-align: right;
	}

	.count {
		/*width: 50%;*/
		/*width:1.36rpx;*/
		height: 50rpx;
		display: flex;
		justify-content: space-between;
	}

	.count>view:nth-child(2) {
		height: 100%;
		line-height: 50rpx;
		font-size: 36rpx;
		color: rgb(92, 92, 92);
		margin: 0 20rpx;
	}

	.laji {
		width: 30rpx;
		height: 30rpx;
		background: url('/static/images/tarch.png');
		background-size: 100%
	}

	.bottom {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		height: 100rpx;
		width: 100%;
		background: #fff;
		display: flex;
		border-top: 1rpx solid rgb(246, 246, 246);
		border-bottom: 1rpx solid rgb(246, 246, 246);
		box-sizing: border-box;
		align-items: center;
		justify-content: space-between;
	}

	.bottom1 {
		position: fixed;
		bottom: 100rpx;
		left: 0rpx;
		width: 100%;
		background: #fff;
		font-size: 22rpx;
		opacity: 0.8;
		padding: 22rpx;
		color: rgb(161, 161, 161);
	}

	.bottom>view:first-child {
		display: flex;
		align-items: center;
		margin-left: 60rpx;
		font-size: 26rpx;
		color: #333333;
		width: 15%;
		height: 100%;
	}

	.bottom>view:first-child>view:last-child {
		margin-left: 16rpx;
	}

	.bottom>view:nth-child(2)>view:first-child {
		font-size: 28rpx;
		color: rgb(70, 70, 70);
	}

	.bottom>view:nth-child(2)>view:last-child {
		box-sizing: border-box;
		font-size: 22rpx;
		color: rgb(160, 159, 159);
	}

	.submit,
	.no_submit {
		color: #FFFFFF;
		background: #58BA67;
		border-radius: 20rpx;
		width: 180rpx;
		height: 80rpx;
		text-align: center;
		font-size: 27rpx;
		line-height: 80rpx;
		margin-right: 22rpx;
	}

	.no_submit {
		background: #a8a8a8;
	}

	.clear {
		background: rgb(71, 174, 245);
		color: #fff;
		height: 72rpx;
		width: 186rpx;
		text-align: center;
		line-height: 186rpx;

	}

	.clear_A {
		background: rgb(71, 174, 245);
		color: white
	}

	.ciclr {
		width: 50rpx;
		height: 50rpx;
		font-size: 50rpx;
		border-radius: 50%;
		text-align: center;
		box-sizing: border-box;
	}

	.enpty {
		width: 100%;
		text-align: center;
	}

	.enpty image {
		width: 496rpx;
		height: 538rpx;
		margin-top: 9rpx;
	}

	.enpty>view:first-of-type {
		margin: auto;
		/* margin-top:72rpx; */
		font-size: 38rpx;
		color: rgb(52, 75, 103);
	}

	.enpty>view:nth-of-type(2) {
		margin: auto;
		margin-top: 32rpx;
		font-size: 32rpx;
		color: rgba(52, 75, 103, 0.7);
	}

	.enpty>view:nth-of-type(3) {
		margin: auto;
		margin-top: 90rpx;
		width: 218rpx;
		height: 72rpx;
		border-radius: 36rpx;
		line-height: 72rpx;
		background: rgb(71, 147, 245);
		font-size: 27rpx;
		color: #fff;
	}

	.nologin {
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		width: 100%;
		height: 100%;
		z-index: 999;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.nologin_button {
		height: 66rpx;
		width: 260rpx;
		background: rgb(88, 186, 103);
		margin: 10px auto;
		text-align: center;
		line-height: 66rpx;
		color: black;
		margin-top: 20rpx;
		border-radius: 50rpx;
		color: #FFFFFF;
		font-size: 30rpx;
	}

	.prod_detail {
		display: flex;
		justify-content: flex-start;
		/*align-items:center;*/
	}

	.pro_detail {
		display: flex;
		justify-content: space-between;
		margin-top: 10rpx !important;
		/*align-items:center;*/
	}

	/*.flex_v{
					display:flex;
					flex-direction:column;
					justify-content:flex-start;
				}*/
	.car_box {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
	}

	.store_name {
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		color: rgb(83, 83, 83);
	}

	.store_name>view:first-child {
		display: flex;
		align-items: center;
		height: 100%;
	}

	.xz {
		height: 40rpx;
		width: 40rpx;
		border-radius: 50%;
	}

	.xz_A {
		height: 40rpx;
		width: 40rpx;
	}

	.car_box .store_icon image {
		width: 27rpx;
		height: 24rpx;
		display: block;
		margin-left: 20rpx;
		margin-right: 10rpx;
	}

	.prod_list {
		margin-top: 38rpx;
		display: flex;
	}

	.prod_msg {
		flex-grow: 1;
		align-self: flex-start;

	}

	.prod_img image {
		width: 180rpx;
		height: 170rpx;
		margin-left: 32rpx;
		margin-right: 40rpx;
		/* margin: auto; */
		border-radius: 10rpx;
		display: block;
	}

	.prod_msg>view:first-child {
		font-size: 26rpx;
		color: rgb(33, 33, 33);
		font-weight: bold;
		/*margin-bottom: 0.12rpx;*/
	}

	.prod_msg>view:nth-child(2) {
		font-size: 22rpx;
		color: #999999;
		margin-top: 29rpx;
		margin-bottom: 30rpx;
	}

	.prod_price {
		display: flex;
		justify-content: space-between;
	}

	.prod_price>view:first-child {
		font-size: 20rpx;
		color: rgb(155, 154, 149);
	}

	.prod_price>view:first-child span {
		font-size: 24rpx;
		color: #EA5252;
	}

	.ciclr1 {
		/* border:1rpx solid rgb(204,204,204); */
		color: rgb(204, 204, 204);
	}

	.ciclr2 {
		/* border:1rpx solid rgb(204,204,204); */
		color: #fff;
	}

	image {
		width: 100%;
		height: 100%;
	}


	.noEnjoy {
		width: 100%;
		margin-bottom:20rpx;
		/* position: relative;
		top: 28%;
		left: 50%;
		transform: translate(-50%, -50%) */
	}

	.noEnjoy .empty1 {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding-top: 20rpx;
	}

	.noEnjoy .empty1 image {
		width: 365rpx;
		height: 340rpx;
		margin-bottom: 20rpx;
	}

	.noEnjoy .empty1 view {
		font-size: 30rpx;
		color: #666;
	}

	.noEnjoy .empty1 view:nth-child(3) {
		margin: 25rpx 0;
	}

	.empty1 .gotobutton {
		height: 60rpx;
		line-height: 60rpx;
		width: 210rpx;
		text-align: center;
		color: #fff !important;
		background: #58BA67;
		font-size: 30rpx;
		border-radius: 50rpx;
	}

	.allmoney {
		display: flex;
	}

	.allmoney>view:first-child {
		color: #999999;
		font-size: 22rpx;
		margin-right: 20rpx;

	}

	.allmoney>view:last-child {
		color: #999999;
		font-size: 24rpx;
		/* display: inline-block */
	}

	.allmoney>view:last-child>text:last-child {
		color: #EA5252 !important;
		margin-left: 10rpx;
	}

	/*猜你喜欢*/
	.gussTitle {
		font-size: 26rpx;
		color: #000000;
		text-align: center;
		padding: 20rpx 0;
	}

	.gussLoveList {
		margin: 0 30rpx;
		padding-bottom: 100rpx;
	}

	.guessLove {
		display: flex;
		flex-wrap: wrap;
	}

	.guessLove>view:nth-child(2n) {
		margin-left: 23rpx;
	}

	.oneLove {
		background: #FFFFFF;
		border-radius: 20rpx;
		width: 48%;
		margin-bottom: 23rpx;
		padding: 0 17rpx;
		padding-bottom: 35rpx;
	}

	.oneLove>view:first-child {
		height: 200rpx;
		width: 50%;
		margin: auto;
		margin-top: 25rpx;
	}

	.oneLove>view:first-child>image {
		height: 100%;
		width: 100%;
		display: block;
	}

	.oneLove>view:nth-child(2) {
		color: #333333;
		font-size: 28rpx;
		margin: 50rpx 0;
		height: 120rpx;
		overflow: hidden;
	}

	.oneLove>view:nth-child(3) {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.oneLove>view:nth-child(3)>view:first-child {
		font-size: 26rpx;
		color: #EA5252;
	}

	.oneLove>view:nth-child(3)>view:last-child {
		margin-top: 10rpx;
	}

	.oneLove>view:nth-child(3)>view:last-child>image {
		width: 54rpx;
		height: 54rpx;

	}
</style>
