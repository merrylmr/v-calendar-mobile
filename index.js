import vCalendar from './calendar/Index.vue'

const install = function (Vue) {
    console.log('vCalendar', vCalendar.name)
    Vue.component(vCalendar.name, vCalendar)
}
export default install