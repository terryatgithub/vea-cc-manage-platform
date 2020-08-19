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
      <el-select v-model="pushForm.supportVersion" multiple placeholder="请选择版本(支持多选)" clearable>
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
            @click="regionSel"
          ></i>
        </div>
    </el-form-item>
    <el-form-item label='推送时间' prop="date">
        <el-date-picker
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
      type: String
    }
  },
  watch: {
    risId: function (newVal, oldVal) {
      console.log(newVal)
      this.pushForm.ctmDevCtrId = newVal
    }
  },
  data () {
    return {
      pushForm: {
        releaseConfName: '',
        supportVersion: '',
        ctmDevCtrId: '',
        date: '',
        priority: ''
      },
      rules: {
        releaseConfName: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        supportVersion: [
          { required: true, message: '请选择版本', trigger: 'change' }
        ],
        ctmDevCtrId: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择推送时间', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ]
      },
      versionOptions: [],
      userOptions: [
        { key: 'CN', displayName: 'China' },
        { key: 'US', displayName: 'USA' },
        { key: 'JP', displayName: 'Japan' },
        { key: 'EU', displayName: 'Eurozone' }
      ]
    }
  },
  methods: {
    regionSel () {
      this.$emit('regionSel')
    }
  },
  created () {
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
  }
}
</script>
<style lang='scss'>
.pushEdit {
    .el-form-item {
        .el-form-item__label {
            width: 90px;
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
