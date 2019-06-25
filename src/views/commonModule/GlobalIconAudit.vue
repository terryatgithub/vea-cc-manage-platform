<template>
  <div>
    <el-form
      :model="auditForm"
      status-icon
      :rules="auditFormRule"
      ref="auditForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="审核意见" prop="auditFlag">
        <el-radio v-model="auditForm.auditFlag" label="4">通过</el-radio>
        <el-radio v-model="auditForm.auditFlag" label="5">打回</el-radio>
      </el-form-item>
      <el-form-item label="意见说明" prop="auditDesc">
        <el-input type="textarea" :rows="2" placeholder="请输入意见说明" v-model="auditForm.auditDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancle('auditForm')">取消</el-button>
       <el-button type="primary" @click="onSubmit('auditForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
//   props: {
//     idStr: Number //自增ID
//   },
  data() {
    return {
      auditForm: {
        auditFlag: '4', // 审核状态
        auditDesc: '' // 审核描述
      },
      auditFormRule: {
        auditDesc: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit(auditForm) {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          const auditFormObj = this.auditForm
          this.$emit('auditForm', auditFormObj)
        }
      })
    },
    cancle(auditForm) {
      this.$refs.auditForm.resetFields()
      const close = false
      this.$emit('cancle', close)
    }
  },
  created() {
  }
}
</script>
