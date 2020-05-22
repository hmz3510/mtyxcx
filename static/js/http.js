//封装请求
// var my_url = 'http://192.168.0.246:8080/o2o_xcxdk_ser/'
var my_url = 'https://wx.beta.ax168.com/o2o_xcxdk_ser/'
function urlRequest(url,data){
	var promise = new Promise((resolve, reject) => {
		uni.request({
			url: my_url + url, //仅为示例，并非真实接口地址。
			data: data,
			method:'post',
			dataType:'json',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function(res) {
				resolve(res.data);
			},
			error: function(e) {
				reject("网络出错"); 
			}
		});
	})
	return promise	
}

//提示
function myToast(title){
	uni.showToast({
		title:title,
		duration:2000,
		icon:'none'
	});

}


module.exports={
	urlRequest,myToast
	
}