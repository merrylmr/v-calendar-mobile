import vCalendar from './calendar/Index.vue'

const install = function (Vue) {
    console.log('vCalendar', vCalendar.name)
    Vue.component(vCalendar.name, vCalendar)
}
// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue) // 通过use方式全部引入
}

export default install