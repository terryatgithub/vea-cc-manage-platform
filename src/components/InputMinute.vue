<template>
  <div>
    <el-input-number 
      @change="handleInputHour" 
      controls-position="right" 
      :precision="0"  
      :min="0" 
      :max="hourMax" 
      v-model="hour" /> 小时 
    <el-input-number 
      @change="handleInputMinute" 
      controls-position="right" 
      :precision="0"  
      :min="0" 
      :max="minMax"  
      v-model="minute" /> 分钟
  </div>
</template>

<script>
export default {
  data() {
    return {
      hour: 0,
      minute: 0
    }
  },
  computed: {
    hourMax() {
      if (this.max) {
        return Math.floor(this.max/60)
      }
      return 24
    },
    minMax() {
      if (this.max < 60) {
        return this.max
      }
      return  59
    }
  },
  props: ['value', 'max', 'min'],
  methods: {
    handleInputMinute(minute) {
      const total = this.hour * 60 + minute
      if (total > this.max) {
        return this.setHourAndMinute(this.max)
      }
      if (total < this.min) {
        return this.setHourAndMinute(this.min)
      }
      this.minute = minute
      this.$emit('input', total)
    },
    handleInputHour(hour) {
      const total = hour * 60 + this.minute
      if (total > this.max) {
        return this.setHourAndMinute(this.max)
      }
      if (total < this.min) {
        return this.setHourAndMinute(this.min)
      }
      this.hour = hour
      this.$emit('input', total)
    },
    setHourAndMinute(val) {
      if (val) {
        this.$nextTick(() => {
          this.hour = Math.floor(val/60)
          this.minute = val%60
        })
      }
    }
  },
  created() {
    this.$watch('value', this.setHourAndMinute, {
      immediate: true
    })
  }
}
</script>

<style>

</style>
