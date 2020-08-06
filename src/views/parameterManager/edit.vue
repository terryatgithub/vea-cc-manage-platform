<template>
    <div>
        <el-form
        ref="brandForm"
        class="parameterEdit"
        :rules="brandRules"
        :model="brandForm"
        label-position="left"
        style="width: 400px;"
        v-if="dialogType === 'brand'"
      >
        <el-form-item
          label="选择客户"
          prop="customerId"
        >
          <el-select
            placeholder="请选择客户"
            v-model="brandForm.customerId"
            :disabled="isSelect === 1"
          >
            <el-option
              v-for="item in customerOptions"
              :key="item.customerId"
              :label="item.customerName"
              :value="item.customerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="输入客户" prop="customerName">
          <el-input
            placeholder="请输入客户"
            v-model="brandForm.customerName"
            :disabled="isSelect === -1"
          />
        </el-form-item>
        <el-form-item label="输入品牌" prop="brandName">
          <el-input
            placeholder="请输入品牌"
            v-model="brandForm.brandName"
          />
        </el-form-item>
      </el-form>
      <el-form
        ref="modelForm"
        class="parameterEdit"
        :rules="modelRules"
        :model="modelForm"
        label-position="left"
        style="width: 400px;"
        v-if="dialogType === 'model'"
      >
        <el-form-item
          label="选择机芯"
          prop="movement"
          :disabled="isSelect === 1"
        >
          <el-select
            placeholder="请选择机芯"
            v-model="modelForm.movement"
          >
            <el-option
              v-for="item in chipOptions"
              :key="item.chip"
              :label="item.chip"
              :value="item.chip"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="输入机芯" prop="chip">
          <el-input
            placeholder="请输入机芯"
            v-model="modelForm.chip"
            :disabled="isSelect === -1"
          />
        </el-form-item>
        <el-form-item label="输入机型" prop="model">
          <el-input
            placeholder="请输入机型"
            v-model="modelForm.model"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="create">
          确定
        </el-button>
      </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    dialogType: {
      type: String
    }
  },
  data () {
    return {
      brandForm: {
        customerId: '',
        customerName: '',
        brandName: ''
      },
      brandRules: {
        customerId: [{
          required: this.isSelect !== 1,
          message: '请选择客户',
          trigger: ['change'],
          validator: this.check
        }],
        customerName: [{
          required: this.isSelect !== -1,
          message: '请输入客户',
          trigger: ['change'],
          validator: this.inputName
        }],
        brandName: [
          { required: true, message: '请输入品牌', trigger: 'blur' }
        ]
      },
      modelForm: {
        movement: '',
        chip: '',
        model: ''
      },
      modelRules: {
        movement: [{
          required: this.isSelect !== 1,
          message: '请选择机芯',
          trigger: ['change'],
          validator: this.check
        }],
        chip: [{
          required: this.isSelect !== -1,
          message: '请输入机芯',
          trigger: ['change'],
          validator: this.inputName
        }],
        model: [
          { required: true, message: '请输入机型', trigger: 'blur' }
        ]
      },
      customerOptions: [],
      chipOptions: [],
      isSelect: 0
    }
  },
  methods: {
    check (rule, value, callback) {
      if (this.isSelect === 1) {
        callback()
        return
      }
      if (value.trim() === '') {
        const msg = this.dialogType === 'brand' ? '请选择客户' : '请选择机芯'
        callback(new Error(msg))
        this.isSelect = 0
      } else {
        this.isSelect = -1
        callback()
      }
    },
    inputName (rule, value, callback) {
      if (this.isSelect === -1) {
        callback()
        return
      }
      if (value.trim() === '') {
        const msg = this.dialogType === 'brand' ? '请输入客户名称' : '请输入机芯名称'
        callback(new Error(msg))
        this.isSelect = 0
      } else {
        this.isSelect = 1
        if (value.length > 60) {
          return callback(new Error('长度超出限制，60字以内'))
        }
        callback()
      }
    },
    cancel () {
      const typeForm = this.dialogType === 'brand' ? 'brandForm' : 'modelForm'
      this.$refs[typeForm].clearValidate()
      this.$refs[typeForm].resetFields()
      this.isSelect = 0
      this.$emit('close')
    },
    create () {
      const typeForm = this.dialogType === 'brand' ? 'brandForm' : 'modelForm'
      this.$refs[typeForm].validate((valid) => {
        if (valid) {
          const params = this.dialogType === 'brand' ? this.brandForm : this.modelForm
          params.creator = '管理员'
          if (this.dialogType === 'brand') {
            this.$service.addBrand(params).then(data => {
              if (data.code === 0) {
                this.$refs[typeForm].clearValidate()
                this.$refs[typeForm].resetFields()
                this.isSelect = 0
                this.$emit('close')
                this.$message({
                  type: 'success',
                  message: '新增成功！'
                })
                this.$emit('fetchData')
              } else {
                this.$message({
                  type: 'error',
                  message: data.msg
                })
              }
            })
          } else {
            debugger
            if (this.isSelect === -1) {
              params.chip = params.movement
              delete params.movement
            } else if (this.isSelect === 1) {
              delete params.movement
            }
            this.$service.addChipModel(params).then(data => {
              if (data.code === 0) {
                this.$refs[typeForm].clearValidate()
                this.$refs[typeForm].resetFields()
                this.isSelect = 0
                this.$emit('close')
                this.$message({
                  type: 'success',
                  message: '新增成功！'
                })
                this.$emit('fetchData')
              } else {
                this.$message({
                  type: 'error',
                  message: data.msg
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取下拉数据
    getMediaResourceInfo () {
      this.$service.queryCustomerListAll().then(data => {
        if (data.code === 0) {
          this.customerOptions = data.data
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.$service.queryModelChipList().then(data => {
        if (data.code === 0) {
          this.chipOptions = data.data.chipList
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    }
  },
  created () {
    this.getMediaResourceInfo()
  }
}
</script>
<style lang='stylus' scoped>

</style>
