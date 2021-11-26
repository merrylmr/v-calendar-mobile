## 安装
```javascript
npm install v-calendar-mobile
// or
yarn add v-calendar-mobile
```

## 使用
````javascript
import vCalendarMobile from 'v-calendar-mobile'
Vue.use(vCalendarMobile)
````

## 参数
参数 | 说明
--------- | ------------- 
mode | 日历的模式（week/month）默认值为：week
changeMoe | 是否支持切换日历模式（默认：false）

## 事件
事件名称| 说明  | 回调参数
--------- | -------------  | ----
change | 切换日期 | 选中的日期

## slot
name | 说明
--------- | -------------  
dateCell| 每个单元格插槽，参数为{day}

```
<v-calendar-mobile
        :changeMode="true">
      <template slot="dateCell" slot-scope="{day}">
        {{day.day}}
      </template>
    </v-calendar-mobile>
```
