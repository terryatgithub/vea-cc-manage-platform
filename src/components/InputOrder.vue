<template>
  <el-input ref="input" @focus="handleSelectAll" :disabled="disabled" v-model="order" @change="handleOrderChange" />
</template>

<script>
export default {
  data () {
    return {
      order: undefined
    }
  },
  watch: {
    value: 'handleInputValue'
  },
  props: ['value', 'disabled', 'clearable'],
  methods: {
    handleInputValue (val) {
      this.order = val
    },
    handleSelectAll () {
      this.$refs.input.select()
    },
    handleOrderChange (val) {
      if (/^\d+$/.test(val) && val > 0) {
        this.$emit('input', val)
      } else {
        this.$message({
          type: 'error',
          message: '请输入正整数'
        })
        this.order = this.value
      }
    }
  },
  created () {
    this.order = this.value
  }
}
</script>

<style>

</style>
