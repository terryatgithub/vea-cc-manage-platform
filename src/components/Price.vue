<template>
    <el-input v-model="inputValue" :disabled="disabled" />
</template>

<script>
// 处理诸如这些
// 0.1 + 0.2 = 0.30000000000000004
// 16.08 * 100 = 1607.9999999999998
// 如果要保留2位小数，最多可处理10位整数的数字
var accurateNumber = function (number) {
  // 转为12位有效数字的指数记数法，再转为浮点数
  return (parseFloat(number.toPrecision(12)))
}
export default {
  data () {
    return {
      inputValue: undefined
    }
  },
  props: ['value', 'disabled'],
  watch: {
    'inputValue': 'updateValue',
    'value': 'updateInputValue'
  },
  methods: {
    updateValue (val) {
      const numVal = +val
      if (!isNaN(numVal) && numVal !== 0) {
        val = accurateNumber(val * 100)
      }
      this.$emit('input', val)
    },
    updateInputValue (val) {
      const newVal = accurateNumber(val / 100)
      if (!isNaN(newVal) && newVal !== 0) {
        if (newVal !== (+this.inputValue)) {
          this.inputValue = newVal
        }
      } else {
        this.inputValue = val
      }
    }
  },
  created () {
    this.updateInputValue(this.value)
  }
}
</script>
