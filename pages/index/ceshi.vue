<template>
    <view>
        <view>
            <form @submit="formSubmit" @reset="formReset" report-submit="true">
                <view class="uni-form-item uni-column">
                    <view class="title">switch</view>
                    <view>
                        <switch name="switch" />
                    </view>
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">radio</view>
                    <radio-group name="radio">
                        <label>
                            <radio value="radio1" /><text>选项一</text>
                        </label>
                        <label>
                            <radio value="radio2" /><text>选项二</text>
                        </label>
                    </radio-group>
                </view>
                <view class="uni-btn-v">
                    <button form-type="submit">Submit</button>
                    <button type="default" form-type="reset">Reset</button>
                </view>
            </form>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
				openid:'',
            }
        },
		onShow:function(){
			uni.login({
				success: res => {
					// 登录注册接口
					if (res.code) {
						// 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中
						this.$urlRequest('getOpenId2.do', {
							code: res.code
						}).then(ret => {
							console.log(res)
							this.openid = ret.openid
							// this.hlb(billNo, res.openid)
						})
					} else {
						console.log('登录失败！' + ret.errMsg)
					}
				}
			})
		},
        methods: {
            formSubmit: function(e) {
				// console.log(e)
				console.log(this.openid)
				var data = {
					openid:this.openid,
					formid:e.detail.formId,
				}
				uni.requestSubscribeMessage({
					tmplIds: ['N7iYUpeuBKbr5TNsYt2HU1_OfH1IgFO6HMgYJMCHNVo'],
					success: (res) => {
						// this.$myToast('走到了成功函数')
					},
					fail:(res)=>{
						// this.$myToast('走到了失败函数')
					},
					complete:(res)=>{
						this.$urlRequest('sendTemplateMessage.do',data).then(ret=>{
							// this.$myToast('发送成功')
						})
					}
				})
				
            },
            formReset: function(e) {
                console.log('清空数据')
            }
        }
    }
</script>

<style>
    .uni-form-item .title {
        padding: 20rpx 0;
    }
</style>