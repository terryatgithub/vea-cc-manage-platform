<template>
 <el-form-item :prop="formProp" :rules="rules.mac">
    <el-input :value="value" @input="$emit('input', $event)" placeholder="mac地址, 12位字母/数字"></el-input>
    <slot></slot>
 </el-form-item>

</template>

<script>
export default {
  props: ['value', 'formProp', 'macList'],
  data () {
    return {
      rules: {
        mac: [
          {
            validator: (rule, value, cb) => {
              value = value.replace(/(^\s*)|(\s*$)/g, '') // 去掉空格
              const reg = /^[a-zA-Z0-9]{12}$/
              const macList = this.macList || []
              if (!reg.test(value)) {
                return cb(new Error('请输入12位字母数字组成的MAC地址'))
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
