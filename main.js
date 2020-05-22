import Vue from 'vue'
import App from './App'
import {urlRequest,myToast} from '@/static/js/http.js';
Vue.config.productionTip = false
Vue.prototype.$urlRequest = urlRequest
Vue.prototype.$myToast = myToast
App.mpType = 'app'

const app = new Vue({
    ...App
	
})
app.$mount()
