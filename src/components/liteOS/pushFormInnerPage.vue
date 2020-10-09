<template>
  <el-form
  ref="pushForm"
  :rules="rules"
  :model="pushForm"
  class="pushEdit"
  >
    <el-form-item label='策略名称' prop="releaseConfName">
        <el-input
          placeholder="请输入策略名称"
          v-model="pushForm.releaseConfName"
          clearable
          maxlength="99"
        />
    </el-form-item>
    <el-form-item label='支持版本' prop="supportVersion">
      <el-select v-model="pushForm.supportVersion" multiple placeholder="请选择版本(支持多选)" @click.native='getData' @change='changeSelect' @remove-tag='removeTag' clearable>
        <el-option label='All' value='All' @click.native='selectAll'></el-option>
        <el-option
          v-for="item in versionOptions"
          :key="item.versionId"
          :label="item.supportVersion"
          :value="item.supportVersion"
        />
      </el-select>
    </el-form-item>
    <el-form-item label='选择区域' prop="ctmDevCtrId">
        <el-button type="primary" @click="regionSel" v-show="!ctmDevCtrName">选择区域</el-button>
        <div class="nameBox" v-show="ctmDevCtrName">
          {{ctmDevCtrName}}
          <i
            class="el-icon-error"
            @click="clearRegion"
          ></i>
        </div>
    </el-form-item>
    <el-form-item label='推送时间' prop="date">
        <el-date-picker
            unlink-panels
            v-model="pushForm.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
    </el-form-item>
    <el-form-item
      label="优先级"
      prop="priority"
    >
      <el-select
        placeholder="请选择优先级"
        v-model="pushForm.priority"
        clearable
      >
        <el-option value="3" label="A"/>
        <el-option value="2" label="B"/>
        <el-option value="1" label="C"/>
      </el-select>
    </el-form-item>
    <el-form-item label="使用MAC地址" prop="tvActiveId">
        <el-radio-group v-model="mac" @change="selectMac">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
        <el-input
          placeholder="MAC地址,多个用逗号隔开"
          v-model="pushForm.tvActiveId"
          clearable
          maxlength="99"
          :disabled = "mac === '0' ? true : false"
        />
      </el-form-item>
  </el-form>
</template>
<script>
export default {
  components: {},
  props: {
    ctmDevCtrName: {
      type: String
    },
    risId: {
      type: Object,
      default: () => ({
        id: '',
        random: ''
      })
    }
  },
  watch: {
    // risId: function (newVal, oldVal) {
    //   console.log(newVal)
    //   debugger
    //   this.pushForm.ctmDevCtrId = newVal
    // }
    'risId.random' (newVal, oldVal) {
      this.pushForm.ctmDevCtrId = this.risId.id
      this.$refs.pushForm.validateField('ctmDevCtrId')
    }
  },
  data () {
    return {
      mac: '0',
      pushForm: {
        releaseConfName: '',
        supportVersion: [],
        ctmDevCtrId: '',
        date: '',
        priority: '',
        tvActiveId: ''
      },
      rules: {
        releaseConfName: [
          { required: true, message: '请输入策略名称', trigger: ['blur', 'change'] }
        ],
        supportVersion: [
          { required: true, message: '请选择版本', trigger: ['blur', 'change'] }
        ],
        ctmDevCtrId: [
          { required: true, message: '请选择区域', trigger: ['blur', 'change'] }
        ],
        date: [
          { required: true, message: '请选择推送时间', trigger: ['blur', 'change'] }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: ['blur', 'change'] }
        ],
        tvActiveId: [
          { required: true, trigger: ['blur', 'change'], validator: this.macAlter }
        ]
      },
      versionOptions: []
    }
  },
  methods: {
    regionSel () {
      this.$emit('regionSel')
    },
    clearRegion () {
      this.ctmDevCtrName = ''
      this.pushForm.ctmDevCtrId = ''
      this.$emit('clearRegion')
    },
    getData () {
      this.$service.queryVersionList({ version: '' }).then(data => {
        if (data.code === 0) {
          this.versionOptions = data.data
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    selectAll () {
      if (this.pushForm.supportVersion.length < this.versionOptions.length) {
        this.pushForm.supportVersion = []
        this.versionOptions.map((item) => {
          this.pushForm.supportVersion.push(item.supportVersion)
        })
        this.pushForm.supportVersion.unshift('All')
      } else {
        this.pushForm.supportVersion = []
      }
    },
    changeSelect (val) {
      if (!val.includes('All') && val.length === this.versionOptions.length) {
        this.pushForm.supportVersion.unshift('All')
      } else if (val.includes('All') && (val.length - 1) < this.versionOptions.length) {
        this.pushForm.supportVersion = this.pushForm.supportVersion.filter((item) => {
          return item !== 'All'
        })
      }
    },
    removeTag (val) {
      if (val === 'All') {
        this.pushForm.supportVersion = []
      }
    },
    selectMac (val) {
      if (val === '0') {
        this.pushForm.tvActiveId = ''
      }
    },
    macAlter (rule, value, callback) {
      if (this.mac === '1') {
        value.trim() === ''
          ? callback(new Error('请输入mac地址'))
          : callback()
      } else {
        callback()
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang='scss'>
.pushEdit {
  .el-form-item {
      .el-form-item__label {
          width: 110px;
          text-align: left;
      }
      .el-form-item__content {
          width: 200px;
          display: inline-block;
      }
      .nameBox {
        display: inline-block;
        position: relative;
        .el-icon-error {
          position: absolute;
          font-size: 17px;
          top: 0;
          right: -10px;
          color: indianred;
          cursor: pointer;
        }
      }
  }
}
</style>
