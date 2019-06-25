<template>
  <el-time-select
    v-model="value1" :picker-options="{  start: '00:00', step: '00:10',  end: '24:00' }" placeholder="选择时间" @change="handle" >
</el-time-select>
</template>

<script>
export default {
  data() {
    return {
      value1: '',
      time: ''
    }
  },
  methods: {
    parseStrToMin(str) {
      const timeArr = str.split(':')
      const hours = parseInt(timeArr[0])
      const mins = parseInt(timeArr[1])
      return hours * 60 + mins
    },
    handle() {
      if (this.value1 != undefined) {
        this.time = this.parseStrToMin(this.value1)
        this.$emit('input', this.time)
      }
    }
  }
}
</script>
