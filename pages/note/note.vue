<template>
	<view>
		<!--pages/note/note.wxml-->
		<!-- <component-topnav inner-title="添加备注" isShowBack='true'></component-topnav> -->
		<view class='box'>
		  <view class='note'>
		    <textarea maxlength='50' v-model="note" placeholder="请输入备注,最多50个字哦" v-on:input="getVal"></textarea>
		    <view>{{length}} / 50</view>
		  </view>
		</view>
		<view class='submit' @click="submit">完成</view>
	</view>
	
	
</template>

<script>
	export default {
		data() {
			return {
				note:'',
				length:0,
			}
		},
		onLoad:function(options){
			this.note = options.note	
		},
		onShow:function(){
		},	
		methods:{
			getVal:function(){
				this.length = this.note.length
			},
			submit:function(){
				if(this.note!=''){
					if(this.note.length>=50){
						this.$myToast('备注最多50个字')
						return;
					}
				}
				let pages = getCurrentPages()
				let prevPage = pages[pages.length-2]
				prevPage.$vm.note = this.note
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>
	
<style>
/* pages/note/note.wxss */
page{
  background:#F4F4F4;
}
.box{
  margin:25rpx;
  background:#fff;
  border-radius: 10rpx;
}
.note{
  padding:25rpx 15rpx 15rpx 25rpx;
}
textarea{
  width:100%;
  height:160rpx;
  font-size:26rpx;
  color: #CCCCCC;

}
.note>view:last-child{
  text-align: right;
  margin-top:20rpx;
  color:#ccc;
}
.note_list{
  flex-wrap: wrap;
  border-top: 2rpx solid #EEEEEE;
  margin-top: 10rpx;
  padding: 0 20rpx;
  padding-bottom: 20rpx;
}
.note_list>view{
  padding:15rpx 20rpx;
  border:1rpx solid #eee;
  font-size:24rpx;
  color:#999;
  margin-top:20rpx;
  margin-right:25rpx;
  border-radius: 5rpx;
}
.submit{
  margin:25rpx;
  background:#58BA67;
  height:80rpx;
  line-height: 80rpx;
  font-size:34rpx;
  text-align: center;
  color: #fff;
  border-radius: 10rpx;
}
	
</style>
