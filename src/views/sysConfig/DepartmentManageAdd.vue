<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!-- 新增编辑表单 -->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="formData" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="formData.deptName" placeholder="部门名称"></el-input>
          </el-form-item>
          <el-form-item label="部门电话" prop="deptTel">
            <el-input v-model="formData.deptTel" placeholder="部门电话"></el-input>
          </el-form-item>
          <el-form-item label="部门传真" prop="deptFax">
            <el-input v-model="formData.deptFax" placeholder="部门传真"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seq">
            <el-input v-model="formData.seq" placeholder="排序"></el-input>
          </el-form-item>
          <el-form-item label="上级部门" prop="pid">
            <el-select v-model="formData.pid" placeholder="所在部门">
              <el-option label="无" value="0"/>
              <el-option
                v-for="item in pidList"
                :key="item.deptId+''"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否禁用" prop="disabled">
            <el-radio v-model="formData.disabled" label="0">否</el-radio>
            <el-radio v-model="formData.disabled" label="1">是</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitBtn">保存</el-button>
            <el-button type="info" @click="$emit('go-back')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    
  </ContentCard>
</template>

<script>
import _ from '../../utlis/gateschema'

export default {
  props: {
    editId: Number,
    default: null
  },

  data() {
    return {
      title: null,
      pidList: [],
      formData: {
        deptName: '',
        deptTel: '',
        deptFax: '',
        remark: '',
        seq: null,
        disabled: '0',
        pid: '0'
      },
      formRules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        deptTel: [
          { required: true, message: '请输入部门电话', trigger: 'blur' }
        ],
        deptFax: [
          { required: true, message: '请输入部门传真', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        seq: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ]
      }
    };
  },

  methods: {
    //保存表单信息
    submitBtn () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = this.formData
          if(this.editId) {
            data.deptId = this.editId
          }
          this.$service.sysDeptSave(data, '保存成功').then(() => {
            this.$emit('open-list-page')
          })
        }
      })
    },
    getDepts() {
      return this.$service.getDepts().then(data => {
        this.pidList = data
      });
    },
    getEditData() {
      this.$service.sysDeptDetailInfo({id: this.editId}).then(data => {
        Object.keys(this.formData).forEach(v => {
          if (v === 'disabled') {
            this.formData[v] = data[v] + ''
          } else {
            this.formData[v] = data[v]
          }
        })
      });
    }
  },

  created() {
    this.getDepts()
    if (this.editId) {
      this.title = '编辑'
      this.getEditData()
    } else {
      this.title = '新增'
    }
  }
};
</script>

<style lang='stylus' scoped>
.el-input
  width 200px
</style>