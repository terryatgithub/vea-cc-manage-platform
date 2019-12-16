<template>
  <div>
    <el-row>
      <el-col :span="7">
        <el-time-select v-model="hour" :disabled="disabled" :picker-options="hourOption" placeholder="选择小时"></el-time-select>
      </el-col>
      <el-col :span="2" class="marginL">小时</el-col>
      <el-col :span="7">
        <el-time-select v-model="minute" :disabled="disabled"  :picker-options="minuteOption" placeholder="选择分钟"></el-time-select>
      </el-col>
      <el-col :span="1" class="marginL">分</el-col>
      <el-col :span="5" class="marginL">总共：{{sumTime}}分</el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ['hourOption', 'minuteOption', 'initSumTime', 'min', 'max', 'disabled'],
  data () {
    return {
      hour: null,
      minute: null
    }
  },
  computed: {
    sumTime () {
      return (
        parseInt(this.hour === null ? 0 : this.hour) * 60 +
        parseInt(this.minute === null ? 0 : this.minute.toString().replace('00:', ''))
      )
    }
  },
  methods: {
    limit () {
      if (this.sumTime > this.max) {
        this.$message({
          type: 'error',
          message: '不能超过' + this.max + '分钟'
        })
        return false
      }
      if (this.sumTime < this.min) {
        this.$message({
          type: 'error',
          message: '不能小于' + this.min + '分钟'
        })
        return false
      }
      return true
    },
    setHourAndMinute () {
      let hour = Math.floor(this.initSumTime / 60)
      let minute = this.initSumTime - hour * 60
      this.hour = '0' + hour + ':00'
      hour > 9 ? this.hour = hour + ':00' : this.hour = '0' + hour + ':00'
      minute > 9 ? this.minute = '00:' + minute : this.minute = '00:0' + minute
    }
  },
  watch: {
    hour: function (newV, oldV) {
      if (this.limit()) {
        this.$emit('input', this.sumTime)
      } else {
        this.hour = oldV
      }
    },
    minute: function (newV, oldV) {
      if (this.limit()) {
        this.$emit('input', this.sumTime)
      } else {
        this.minute = oldV
      }
    },
    initSumTime: function (newV) {
      this.setHourAndMinute()
    }
  },
  created () {
    this.setHourAndMinute()
  }
}
</script>
<style lang="stylus" scoped></style>
