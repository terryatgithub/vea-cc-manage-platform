<template>
 <el-form-item :prop="formProp" :rules="rules.mac">
    <el-input :value="value" @input="$emit('input', $event)" placeholder="mac地址, 12 位[0-9a-fA-F]字符" clearable></el-input>
    <slot></slot>
 </el-form-item>

</template>

<script>
export default {
  props: ['value', 'formProp', 'macList', 'clearable'],
  data () {
    return {
      rules: {
        mac: [
          {
            validator: (rule, value, cb) => {
              const reg = /^[0-9a-fA-F]{12}$/
              const macList = this.macList || []
              if (!reg.test(value)) {
                return cb(new Error('请输入 12 位[0-9a-fA-F]字符'))
              }
              if (macList.length > 1 && macList.filter(item => item === value).length > 1) {
                return cb(new Error('当前 mac 已存在'))
              }
              cb()
            }
          }
        ]
      }
    }
  }
}
</script>

<style>

</style>
