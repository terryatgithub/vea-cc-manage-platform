<template>
  <div>
    <template v-if="!onlyParams">
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
      <el-form-item label="数据配置" :prop="formProp('data')" >
        <el-input type="textarea" v-model.trim="inputValue.data"></el-input>
      </el-form-item>
    </template>
    <el-form-item label="扩展参数">
      <!-- 默认参数 -->
      <div class="app-extend-params" v-for="(param, index) in inputValue.defaultParams" :key="'default' + index">
        <template v-if="!param.hide">
          <el-form-item
            class="item-left"
            :label="param.label"
            label-width="80px"
          >
            <div style="width: 100px">{{param.key}}</div>
          </el-form-item>
          <el-form-item
            label="value:"
            label-width="60px"
            :prop="formProp('defaultParams') && formProp('defaultParams.' + index + '.value')"
            :rules="rules.params.value"
          >
            <template v-if="!param.type">
              <el-input v-if="param.ValueType === 'number'" v-model.trim.number="param.value"></el-input>
              <el-input v-else v-model.trim="param.value"></el-input>
            </template>
            <CommonSelector v-else
              :type="param.type"
              v-model="param.value"
              :options="param.valueOptions" />
          </el-form-item>
          <span class="tips">{{param.tip}}</span>
        </template>
      </div>
      <!-- 常规参数 -->
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
import CommonSelector from '@/components/CommonSelector'
export default {
  components: {
    CommonSelector
  },
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
      inputValue: this.genDefaultValue(),
      rules: {
        packagename: [
          { required: true, message: '请输入应用包名', trigger: 'blur' }
        ],
        versioncode: [
          { required: true, message: '请输入应用版本号', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              if (val && !/^(-1|\d*)$/.test(val)) {
                return cb(new Error('应用版本号只能是数字或者-1'))
              }
              cb()
            }
          }
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
    onlyParams: Boolean,
    propPrefix: {

    },
    dowhatOptions: {
      default () {
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
      default () {
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
          },
          {
            label: 'activity',
            value: 'activity'
          }
        ]
      }
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
        versioncode: undefined,
        dowhat: undefined,
        bywhat: undefined,
        byvalue: undefined,
        params: [],
        defaultParams: []
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
.tips {
  color: #333;
  font-size: 12px;
  font-style: italic;
}
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
.item-left >>> .el-form-item__label {
  text-align: left;
}
</style>
