<template>
  <div>  
    <el-form-item label="应用参数">
      <div key="edit-params"  v-if="!readonly">
        <div class="app-extend-params" v-for="(param, index) in params" :key="index">
          <el-form-item
            label="key:"
            label-width="60px"
            :prop="propPrefix + index + '.key'"
            :rules="rules.params.key"
          >
            <el-input v-model.trim="param.key"></el-input>
          </el-form-item>
          <el-form-item
            label="value:"
            label-width="60px"
            :prop="propPrefix + index + '.value'"
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
      </div>

      <div key="read-params" v-else>
        <div class="app-extend-params" v-for="(param, index) in params" :key="index">
          <el-form-item label label-width="0px">
            <el-tag>key</el-tag>&nbsp;
            <el-tooltip class="item" effect="dark" :content="param.key" placement="top">
              <span>{{ param.key }}</span>
            </el-tooltip>
          </el-form-item>
          <el-form-item label label-width="0px">
            <el-tag>value</el-tag>&nbsp;
            <el-tooltip class="item" effect="dark" :content="param.value" placement="top">
              <span>{{ param.value }}</span>
            </el-tooltip>
          </el-form-item>
        </div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['params', 'readonly', 'propPrefix'],
  data () {
    const validateKey = (rule, value, cb) => {
      if (/[！￥……（）——【】：；“”‘’、《》，。？\s+]/.test(value)) {
        return cb(new Error('请勿输入特殊或空白字符'))
      } 
      // 找到两个 key 是那个值，表明重复
      const duplicated = this.params.filter(({key}) => key === value).length > 1
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
      rules: {
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
  methods: {
    handleRemoveParam (index) {
      this.params.splice(index, 1)
    },
    handleAddParam () {
      this.params.push({
        key: undefined,
        value: undefined
      })
    },
  },
  created () {
    console.log(this.propPrefix)
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