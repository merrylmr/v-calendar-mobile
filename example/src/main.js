import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import vCalendarMobile from '../../dist/index'

Vue.use(vCalendarMobile)
new Vue({
    render: h => h(App),
}).$mount('#app')
