<template>
 <ContentCard class="content">
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="200px" class="admin-control-content">
      <el-form-item label="是否开启管理后台缓存" prop="openCache">
        <el-select v-model="form.openCache">
          <el-option v-for="(item, index) in cacheItems" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="缓存版本" prop="cacheVersion">
        <el-input v-model="form.cacheVersion"></el-input>
      </el-form-item>
      <el-form-item label="媒资回溯策略" prop="mediaRecallPolicy">
        <el-select v-model="form.mediaRecallPolicy">
          <el-option v-for="(item, index) in callBackItems" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm" type="primary">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
 </ContentCard>
</template>
<script>

export default {
  data: function () {
    return {
      form: {
        openCache: '',
        cacheVersion: '',
        mediaRecallPolicy: ''
      },
      id: 1,
      cacheItems: [{
        label: '开启缓存',
        value: 1
      },
      {
        label: '关闭缓存',
        value: 0
      }],
      callBackItems: [
        {
          label: '推送',
          value: 'push'
        },
        {
          label: '定时',
          value: 'polling'
        },
        {
          label: '不回溯',
          value: 'none'
        }
      ],
      rules: {
        openCache: [
          { required: true, message: '请选择是否开启缓存', trigger: 'blur' }
        ],
        cacheVersion: [
          { required: true, message: '请输入缓存版本', trigger: 'blur' }
        ],
        mediaRecallPolicy: [
          { required: true, message: '请选择媒资回溯策略', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    fetchData () {
      this.$service.getAdminMasterControllInfo({ id: this.id }).then((data) => {
        console.log(data)
         this.form = data
      })
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service.saveAdminMasterControll({ jsonStr: JSON.stringify(this.form) }, '保存成功').then(data => {
            console.log(data)
          })
        }
      })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style lang="stylus" scoped>
  .admin-control-content
    width 500px
    margin 20px
</style>
