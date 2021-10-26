<template>
  <div class="calendar-box">
    <div class="calendar-today">
            <span class="arrow" @click="prevHandle">
              <img src="./assets/arrow-left.svg" alt="">
            </span>
      <span>{{ formatTime }}</span>
      <span @click="nextHandle" class="arrow next">
              <img src="./assets/arrow-left.svg" alt="">
            </span>
    </div>
    <ul class="calendar-head">
      <li v-for="(item,index) in weekList"
          :key="index">{{ item.text }}
      </li>
    </ul>
    <calendarContent
        :style="{height:calenderInnerH+'px'}"
        ref="calendar_swiper"
        :checkDate="currentDate"
        :mode="curMode"
        :calenderInnerH="calenderInnerH"
        :changeMode="changeMode"
        @on-change="changeIndex"
        @calendarHeight="calendarHeight"
        @changeMode="changeModeHandle">
      <div v-for="(month,index) in monthList"
           :key="index"
           class="month swiper-item">
        <ul v-for="(week,weekIndex) in month"
            :key="weekIndex">
          <li v-for="(day,dayIndex) in week"
              :key="dayIndex"
              class="week-day"
              :class="{
                        'is-checked':formatTime===day.date,
                        'is-today':day.isToday,
                         'other-month':day.otherMonth
             }"
              @click.prevent.stop="chooseDay(day.year,day.month,day.day,day.otherMonth,day.mode)">
            <slot name="dateCell" :day="day">
                                <span class="one-day">
                                    <i v-if="day.isToday" class="day today">今</i>
                                    <i v-else class="day">{{ day.day }}</i>
                                </span>
            </slot>
            <slot name="record" :day="day">
              <span v-if="day.thing" class="record"></span>
            </slot>
          </li>
                </ul>
            </div>
        </calendarContent>
    </div>
</template>
<script>
// 1.切换动画优化
// 2.日历配置项 :支持中英文，顶部日期格式，插槽，
// 3.样式：支持跟换主题色等、样式优化
// 4.代码优化
import calendarContent from './swiper-monthorweek.vue'
import format from './format.js'
import {weekList} from './config.js'

import {MIN_HEIGHT, MAX_HEIGHT} from './const.js'

export default {
  name: 'v-calendar-mobile',
  data() {
    return {
      weekList,
      currentDate: new Date(),
      today: new Date(),
      // 当前日期
      monthList: [],
      // 选中的日期
      can_click: true,
      calHeight: '',  // 日历外框高度，自适应要用到
      calenderInnerH: this.mode === 'week' ? MIN_HEIGHT : MAX_HEIGHT,
      curMode: 'week'
    }
    },
    props: {
        changeMode: {
            type: Boolean,
        },
        recordList: {
            type: Array,
            default: () => []
        },
        mode: {
            type: String,
            default: 'week'
        }
    },
    components: {
        calendarContent
    },
    computed: {
      // 当前选中日期(标准时间转xxxx年xx月xx日)
        formatTime() {
          return this.formatDateTime(this.currentDate);
        }
    },
    created() {
      this.curMode = this.mode;
      if (this.curMode === 'month') {
        this.get3month()
      } else {
        this.get3week()
      }
    },
    methods: {
        calendarHeight(newVal) {
            const diffH = this.changeMode ? 80 : 50
            this.calHeight = newVal + diffH;
            this.calenderInnerH = newVal
            this.$emit('changeH', this.calHeight)
            console.log('---val---' + newVal);
        },
        changeModeHandle(mode) {
          console.log('changeModeHandle mode', mode)
          if (mode === this.curMode) {
            return
          }
          this.curMode = mode;
          if (mode === 'week') {
            this.get3week();
          } else {
            this.get3month()
          }
        },
        chooseDay(year, month, day, otherMonth, mode) {
          // 为了PC端点击事件和移动冲突
          if (!this.can_click) return
          if (otherMonth && mode === 'month') {
            const tempDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - otherMonth, 0)
            const maxDay = tempDate.getDate()
            const _day = maxDay < day ? maxDay : day
            this.currentDate = new Date(year, month - otherMonth, _day)
            this.changeIndex(otherMonth, true)
          } else if (otherMonth && mode === 'week') {
            this.currentDate = new Date(year, month, day)
          } else {
            this.currentDate = new Date(year, month, day)
          }
          this.$emit('change', this.currentDate)
        },
        formatDateTime(date) {
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = date.getHours();
            let minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            return y + '-' + m + '-' + d;
        },
        format(year, month, day) {
            month++
            month < 10 && (month = '0' + month)
            day < 10 && (day = '0' + day)
            return year + '-' + month + '-' + day;
        },
        // 组装成一周的数据
        getWeek(year, month, day) {
            // year,month,day为选中当天的年月日
            let dt = new Date(year, month, day)
            let weekArr = []
            let dt_first = new Date(year, month, day - ((dt.getDay() + 6) % 7))
            let week = []
            // 循环选中当天所在那一周的每一天
            for (let j = 0; j < 7; j++) {
                let newdt = new Date(dt_first.getFullYear(), dt_first.getMonth(), dt_first.getDate() + j)
                let _year = newdt.getFullYear()
                let _month = newdt.getMonth()
                let _day = newdt.getDate()
                week.push({
                  mode: 'week',
                  day: _day,
                  year: _year,
                  month: _month,
                  date: this.format(_year, _month, _day),
                  // 日历要显示的其他内容
                  thing: this.ifOrder(_year, _month, _day),
                  nongLi: format.solar2lunar(_year, _month + 1, _day),
                  isToday: this.today.getFullYear() === _year && this.today.getMonth() === _month && this.today.getDate() === _day,
                  isChecked: false,
                  otherMonth: _month !== month
                })
            }
          weekArr.push(week)
          return weekArr
        },
      // 创建单月历
      getMonth(year, month) {
        let monthArr = []
        let dt_first = new Date(year, month, 1)   // 每个月第一天
        let dt_last = new Date(year, month + 1, 0)   // 每个月最后一天
        let monthLength = dt_last.getDate() - dt_first.getDate() + 1
        let space = (dt_first.getDay() - 1 + 7) % 7   // 月历前面空格
        // console.log(year,month)
        for (let i = -space; i < 36; i += 7) {
          let week = []
          for (let j = 0; j < 7; j++) {
            let day = i + j + 1
            // console.log('day:'+day);
            if (day > 0 && day <= monthLength) {
              week.push({
                mode: 'month',
                day: day,
                year: year,
                month: month,
                date: this.format(year, month, day),
                // 日历要显示的其他内容
                thing: this.ifOrder(year, month, day),
                nongLi: format.solar2lunar(year, month + 1, day),
                isToday: this.isSameDay(this.today, new Date(year, month, day)),
                isChecked: false
              })
            } else {
              // 其它月份
              // week.push({})
              let newdt = new Date(year, month, day)
              let _year = newdt.getFullYear()
              let _month = newdt.getMonth()
              let _day = newdt.getDate()
              week.push({
                mode: 'month',
                day: _day,
                year: _year,
                month: _month,
                date: this.format(year, month, day),
                thing: this.ifOrder(year, month, day),
                nongLi: format.solar2lunar(_year, _month + 1, _day),
                isToday: this.isSameDay(this.today, new Date(_year, _month, _day)),
                isChecked: false,
                otherMonth: day <= 0 ? -1 : 1,
              })
            }
          }
          monthArr.push(week)
        }
        return monthArr
      },
      ifOrder(year, month, day) {
        let dateTime = this.format(year, month, day);

        const target = this.recordList.find(item => {
          return item.date === dateTime
        })
        return !!target
      },
      get3month() {
        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()
        this.monthList = []
        this.monthList.push(this.getMonth(year, month - 1))
        this.monthList.push(this.getMonth(year, month))
        this.monthList.push(this.getMonth(year, month + 1))
      },
      get3week() {
        let year = this.currentDate.getFullYear()
        let month = this.currentDate.getMonth()
        let day = this.currentDate.getDate()
        this.monthList = []
        this.monthList.push(this.getWeek(year, month, day - 7))
        this.monthList.push(this.getWeek(year, month, day))
        this.monthList.push(this.getWeek(year, month, day + 7))
      },
      isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate()
      },
      // 左右滑动
      changeIndex(index, is_click = false) {
        if (index) {
          const year = this.currentDate.getFullYear();
          const month = this.currentDate.getMonth();
          const date = this.currentDate.getDate();
          if (this.curMode === 'week') {
            this.currentDate = new Date(year, month, date + (7 * (index)))
            this.get3week()
          } else {
            const tmpDate = new Date(year, month + index, 0)
            const maxDay = tmpDate.getDate()
            const _day = maxDay < date ? maxDay : date
            console.log(_day)
            this.currentDate = new Date(year, month + index, _day)
            if (!is_click) {
            }
            this.get3month()
          }
          this.$refs.calendar_swiper.move_change()
          this.$emit('swiperCalendar', this.currentDate);
        }
      },
      nextHandle() {
        this.changeIndex(1)
      },
      prevHandle() {
        this.changeIndex(-1)
      }
    }
}
</script>
<style lang="scss" scoped>
@import "./assets/base.scss";
.calendar-box {
  position: relative;
  background: #fff;
  z-index: 99;
  transition: all .2s ease;
  overflow: hidden;
}

.calendar-head {
  display: flex;
  height: 30px;
  line-height: 30px;

}

.calendar-head li {
  flex-grow: 1;
  text-align: center;
  color: #9AA5B1;
  font-size: 13px;
}

.calendar-today {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  color: #1F2933;
  z-index: 9;
  background: #fff;

  .arrow {
    display: block;
    padding: 10px;
    color: #9AA5B1;
    font-size: 16px;

    &.next {
      img {
        transform: rotate(-180deg);
      }
    }

    img {
      width: 16px;
    }
  }
}


.swiper-item {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;

  &:nth-child(1) {
    left: -100%;
  }

  &:nth-child(2) {
    left: 0;
  }

  &:nth-child(3) {
    left: 100%;
  }
}
.month ul {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 40px;
  min-height: 40px;
  border-right: 1px solid #eee;
}

.month li {
  flex: 1;
  color: #333;
  overflow: hidden;
}

.week-day {
  position: relative;
  width: 32px;
  height: 32px;
  text-align: center;
  overflow: hidden;
  z-index: 1;
  @include flex(center);

  ::v-deep.record {
    display: inline-block;
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: red;
  }

  .day {
    display: block;
    text-align: center;
    font-style: normal;;
    font-size: 14px;
    line-height: 32px;
    width: 32px;
    height: 32px;
    border: 0.5px solid #E4E7EB;
    border-radius: 2px;
  }

  &.is-checked {
    .day {
      color: #fff !important;
      background-color: #409eff;
    }

    .today {
      color: #fff;
    }
  }

  &.other-month {
    color: #ccc;
  }

  &.is-today {
    .today {
      font-size: 16px;
      color: #409eff;
    }
  }
}
</style>
