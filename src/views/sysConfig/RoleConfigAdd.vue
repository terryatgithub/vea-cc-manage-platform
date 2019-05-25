<template>
  <ContentCard
    :title="title"
    @go-back="$emit('go-back')"
  >
    <!-- 角色新增编辑页面 -->
    <el-form
        :model="formData"
        :rules="formRules"
        ref="form"
        label-width="100px"
        class="el-form-add"
    >
      <el-form-item label="角色名称" prop="roleName" >
        <el-input v-model="formData.roleName" placeholder="用户名称"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="seq">
        <el-input v-model="formData.seq" placeholder="用户名称"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="roleDesc">
        <el-input v-model="formData.roleDesc" placeholder="用户名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveRoleInfo">保存</el-button>
      </el-form-item>
    </el-form>
  </ContentCard>
</template>

<script>
export default {
  name: 'RoleConfigAdd',
  props: {
    editId: undefined,
    index: undefined
  },
  data () {
    return {
      title: '',
      formData: {
        roleName: '',
        seq: '',
        roleDesc: ''
      },
      formRules: {
        // 表单规则
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        seq: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色说明', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    saveRoleInfo () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service.saveRoleData({ jsonStr: JSON.stringify(this.formData) }, '保存成功').then(data => {
            this.$emit('open-list-page')
          })
        }
      })
    },
    getEditData () {
      this.$service.getRoleDetailById({ id: this.editId }).then(data => {
        Object.keys(this.formData).forEach(v => {
          this.formData[v] = data[v]
        })
      })
    }
  },
  created () {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.formData.roleId = this.editId
      this.getEditData()
    } else {
      this.title = '新增'
    }
  }
}
</script>

<style scoped>

</style>
