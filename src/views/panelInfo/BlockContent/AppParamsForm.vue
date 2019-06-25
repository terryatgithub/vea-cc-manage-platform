<template>
  <div>
    <el-form-item label="应用包名" :prop="formProp('packagename')" :rules="rules.packagename">
      <el-input v-model.trim="inputValue.packagename"></el-input>
    </el-form-item>
    <el-form-item label="应用版本号" :prop="formProp('versioncode')" :rules="rules.versioncode">
      <el-input v-model.trim="inputValue.versioncode"></el-input>
    </el-form-item>
    <el-form-item label="启动动作" :prop="formProp('dowhat')" :rules="rules.dowhat">
      <el-select v-model="inputValue.dowhat">
        <el-option
            v-for="(item, index) in dowhatOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="启动方式" :prop="formProp('bywhat')" :rules="rules.bywhat">
      <el-select v-model="inputValue.bywhat">
        <el-option
            v-for="(item, index) in bywhatOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="启动参数" :prop="formProp('byvalue')" :rules="rules.byvalue">
      <el-input type="textarea" v-model.trim="inputValue.byvalue"></el-input>
    </el-form-item>
    <el-form-item label="数据配置" prop="formProp('data')">
      <el-input v-model.trim="inputValue.data"></el-input>
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
  data() {
    function validateKV(rule, value, cb) {
      if (/[！￥……（）——【】：；“”‘’、《》，。？\s+]/.test(value)) {
        cb(new Error('请勿输入特殊或空白字符'))
      } else {
        cb()
      }
    }
    return {
      inputValue: {
        packagename: undefined,
        versioncode: undefined,
        dowhat: undefined,
        bywhat: undefined,
        byvalue: undefined,
        data: undefined,
        params: [],
        exception: {}
      },
      rules: {
        packagename: [
          { required: true, message: '请输入应用包名', trigger: 'blur' }
        ],
        versioncode: [
          { required: true, message: '请输入应用版本号', trigger: 'blur' }
        ],
        dowhat: [
          { required: true, message: '请选择启动动作', trigger: 'blur' }
        ],
        bywhat: [
          { required: true, message: '请选择启动方式', trigger: 'blur' }
        ],
        byvalue: [
          { required: true, message: '请输入启动参数', trigger: 'blur' }
        ],
        params: {
          key: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validateKV, trigger: 'blur' }
          ],
          value: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validateKV, trigger: 'blur' }
          ]
        }
      }
    }
  },
  props: {
    value: {

    },
    propPrefix: {

    },
    dowhatOptions: {
      default() {
        return [
          {
            label: 'startActivity',
            value: 'startActivity'
          },
          {
            label: 'startService',
            value: 'startService'
          },
          {
            label: 'sendBroadcast',
            value: 'sendBroadcast'
          }
        ]
      }
    },
    bywhatOptions: {
      default() {
        return [
          {
            label: 'action',
            value: 'action'
          },
          {
            label: 'class',
            value: 'class'
          },
          {
            label: 'uri',
            value: 'uri'
          }
        ]
      }
    }
  },
  watch: {
    value: 'setInputValue'
  },
  methods: {
    formProp(key) {
      return (this.propPrefix || '') + key
    },
    genDefaultValue() {
      return {
        packagename: undefined,
        versioncode: undefined,
        dowhat: undefined,
        bywhat: undefined,
        byvalue: undefined,
        params: []
      }
    },
    setInputValue(val) {
      if (val !== this.inputValue) {
        this.inputValue = Object.assign(this.genDefaultValue(), val)
      }
    },
    emitInputValue(val) {
      this.$emit('input', this.inputValue)
    },
    handleAddParam() {
      this.inputValue.params.push({
        key: undefined,
        value: undefined
      })
    },
    handleRemoveParam(index) {
      this.inputValue.params.splice(index, 1)
    }
  },
  created() {
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
