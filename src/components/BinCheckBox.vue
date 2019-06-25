<template>
  <el-checkbox
    :disabled="disabled"
    :value="boolValue"
    @input="handleInputValue"
  >
    {{ label }}
  </el-checkbox>
</template>

<script>
export default {
  props: ['value', 'label', 'disabled', 'isNegative'],
  computed: {
    boolValue() {
      const value = this.value
      if (this.isNegative !== undefined) {
        // 如果是否定，将自动取相反
        return !value
      }
      return !!value
    }
  },
  methods: {
    handleInputValue(value) {
      value = this.isNegative !== undefined
        ? value
          ? 0 : 1
        : value
          ? 1 : 0
      this.$emit('input', value)
    }
  }
}
</script>
