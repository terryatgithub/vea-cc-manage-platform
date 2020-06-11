<template>
   <ContentCard title="推荐流AB测试" @go-back="$emit('go-back')">
       <el-form ref="ABTestForm"
       :rules="rules"
       :model="ABTestForm"
       label-width="100px"
       class="el-form-add">
            <el-form-item label="A版块" prop="TestA">
                <el-button type="primary">选择资源</el-button>
            </el-form-item>
            <el-form-item label="B版块" prop="TestB">
                <el-button type="primary">选择资源</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmitABTest">完成创建</el-button>
                <span class="remarks marginL">注：AB实验最多持续15天，15天后自动关闭</span>
            </el-form-item>
       </el-form>
   </ContentCard>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      ABTestForm: {
        TestA: '',
        TestB: ''
      },
      rules: {
        TestA: [
          { required: true, message: '请填选择资源', trigger: 'blur' }
        ],
        TestB: [
          { required: true, message: '请填选择资源', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmitABTest () {
      this.$refs['ABTestForm'].validate((valid) => {
        if (valid) {
          alert('成功')
        } else {
          console.log('error')
        }
      })
    }
  }
}
</script>
