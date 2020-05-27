<template>
  <div>
    <el-form-item label="插件包名" :prop="formProp('packagename')" >
      <el-input v-model.trim="inputValue.packagename"></el-input>
    </el-form-item>
    <el-form-item label="插件分类名" :prop="formProp('category')"  >
      <el-input v-model.trim="inputValue.category"></el-input>
    </el-form-item>
    <el-form-item label="插件主页最低版本" :prop="formProp('minHomepageVersion')">
      <el-input v-model.trim="inputValue.minHomepageVersion"></el-input><i>例：7104343</i>
    </el-form-item>
    <el-form-item label="扩展参数">
      <div class="app-extend-params" v-for="(param, index) in inputValue.params" :key="index">
        <el-form-item
          label="key:"
          label-width="60px"
          :prop="formProp('params.' + index + '.key')"
          :rules="rules.params.key"
        >
          <el-input v-model.trim="param.key"></el-input>
        </el-form-item>
        <el-form-item
          label="value:"
          label-width="60px"
          :prop="formProp('params.' + index + '.value')"
          :rules="rules.params.value"
        >
          <el-input v-model.trim="param.value"></el-input>
        </el-form-item>
        <a class="app-params__remove-param" @click="handleRemoveParam(index)">
          <i class="el-icon-minus"></i>
        </a>
      </div>
      <el-button type="primary" plain @click="handleAddParam">
        <i class="el-icon-plus"></i>&nbsp;添加
      </el-button>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data () {
    const validateKey = (rule, value, cb) => {
      if (/[！￥……（）——【】：；“”‘’、《》，。？\s+]/.test(value)) {
        return cb(new Error('请勿输入特殊或空白字符'))
      }
      // 找到两个 key 是那个值，表明重复
      const duplicated = this.inputValue.params.filter(({ key }) => key === value).length > 1
      if (duplicated) {
        return cb(new Error('key 不能重复'))
      }
      cb()
    }
    const validateValue = (rule, value, cb) => {
      if (/[！￥……（）——【】：；“”‘’、《》，。？\s+]/.test(value)) {
        cb(new Error('请勿输入特殊或空白字符'))
      } else {
        cb()
      }
    }

    return {
      inputValue: {
        packagename: undefined,
        category: undefined,
        minHomepageVersion: undefined,
        params: [],
        exception: {}
      },
      rules: {
        packagename: [
          { required: true, message: '请输入应用包名', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入插件分类名', trigger: 'blur' }
        ],
        minHomepageVersion: [
          { required: true, message: '请输入插件主页最低版本', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              if (val && !/^\+?[1-9][0-9]*$/.test(val)) {
                return cb(new Error('插件主页最低版本只能输入数字'))
              }
              cb()
            }
          }

        ],
        params: {
          key: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validateKey, trigger: 'blur' }
          ],
          value: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validateValue, trigger: 'blur' }
          ]
        }
      }
    }
  },
  props: {
    value: {

    },
    propPrefix: {

    }
  },
  watch: {
    value: 'setInputValue'
  },
  methods: {
    formProp (key) {
      return (this.propPrefix || '') + key
    },
    genDefaultValue () {
      return {
        packagename: undefined,
        category: undefined,
        minHomepageVersion: undefined,
        params: []
      }
    },
    setInputValue (val) {
      if (val !== this.inputValue) {
        this.inputValue = Object.assign(this.genDefaultValue(), val)
      }
    },
    emitInputValue (val) {
      this.$emit('input', this.inputValue)
    },
    handleAddParam () {
      this.inputValue.params.push({
        key: undefined,
        value: undefined
      })
    },
    handleRemoveParam (index) {
      this.inputValue.params.splice(index, 1)
    }
  },
  created () {
    if (this.value) {
      this.setInputValue(this.value)
    }
    this.$watch('inputValue', this.emitInputValue, {
      deep: true
    })
  }
}
</script>
<style scoped>
.app-extend-params .el-form-item,
.app-extend-params .el-form-item__label,
.app-extend-params .el-form-item__content,
.app-extend-params .app-params__remove-param {
  display: inline-block;
}
.app-extend-params .el-form-item {
  margin-bottom: 24px;
  margin-right: 15px;
}
.app-params__remove-param {
  cursor: pointer;
  border: 1px solid #999;
  border-radius: 13px;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  color: #999;
  margin-left: 5px;
}
</style>
