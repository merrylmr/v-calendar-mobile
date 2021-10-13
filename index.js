import vCalendar from './calendar/Index.vue'

const install = function (Vue) {
    Vue.component(vCalendar.name, vCalendar)
}
export default install