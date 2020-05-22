<script>
	export default {
		data: {
			globalData: {
				latitude: '',
				longitude: '',
				now_city: '',
				isIphoneX: ''
			}
		},
		onLaunch: function() {},
		onShow: function() {
			uni.getSystemInfo({
				success: (res) => {
					// console.log(res)
					// if(res.screenHeight>=812){
					// 	this.globalData.bottom = 94 + 'pimage x'
					// }else{
					// 	this.globalData.bottom = 60 + 'px'
					// }
					if (res.model.indexOf('iPhone X') !== -1) {
						this.globalData.isIphoneX = true
						this.globalData.totalTopHeight = 88
					} else if (res.model.indexOf('iPhone') !== -1) {
						this.globalData.isIphoneX = false
						this.globalData.totalTopHeight = 64
					}
					if (res.screenHeight >= 812)
						this.globalData.bottom = 94 + 'px';
					else
						this.globalData.bottom = 60 + 'px';
					this.globalData.statusBarHeight = res.statusBarHeight;
					this.globalData.titleBarHeight = 44;
					this.globalData.winHeight = res.windowHeight;
					this.globalData.screenHeight = res.screenHeight;
				},
				failure() {
					// that.globalData.statusBarHeight = 0
					// that.globalData.titleBarHeight = 0
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		
	}
</script>

<style>
	.flex {
		display: flex;
		align-items: center;
	}

	.between {
		justify-content: space-between;
	}
</style>
