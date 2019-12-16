<template>
  <div>
    <el-input-number
      class="input-hour"
      controls-position="right"
      :precision="0"
      :min="0"
      :max="hourMax"
      :value="hour"
      @input="handleInputHour" /> 小时
    <el-input-number
      class="input-minute"
      controls-position="right"
      :precision="0"
      :min="0"
      :max="minMax"
      :value="minute"
      @input="handleInputMinute"/> 分钟
  </div>
</template>

<script>
export default {
  data () {
    return {
      inited: false,
      hour: 0,
      minute: 0
    }
  },
  computed: {
    hourMax () {
      if (this.max) {
        return Math.floor(this.max / 60)
      }
      return 24
    },
    minMax () {
      if (this.max < 60) {
        return this.max
      }
      return 59
    }
  },
  props: ['value', 'max', 'min'],
  methods: {
    handleInputMinute (minute) {
      const total = this.hour * 60 + minute
      if (total > this.max) {
        return this.setHourAndMinute(this.max)
      }
      if (total < this.min) {
        return this.setHourAndMinute(this.min)
      }
      this.minute = minute
      this.emitInput(total)
    },
    handleInputHour (hour) {
      const total = hour * 60 + this.minute
      if (total > this.max) {
        return this.setHourAndMinute(this.max)
      }
      if (total < this.min) {
        return this.setHourAndMinute(this.min)
      }
      this.hour = hour
      this.emitInput(total)
    },
    setHourAndMinute (val) {
      if (val) {
        this.$nextTick(() => {
          this.hour = Math.floor(val / 60)
          this.minute = val % 60
        })
      }
    },
    emitInput (val) {
      if (this.inited) {
        this.$emit('input', val)
      }
    }
  },
  mounted () {
    // mounted 之后再初始化值，因为elementui一开始就会触发 input 事件... 坑...
    this.$watch('value', this.setHourAndMinute, {
      immediate: true
    })
    this.inited = true
  }
}
</script>

<style lang="stylus" scoped>
.input-hour,
.input-minute
  display inline-block
  width 200px
</style>
