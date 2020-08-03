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
          prop="customer"
        >
          <el-select
            placeholder="请选择客户"
            v-model="brandForm.customer"
            :disabled="isSelect === 1"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
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
        >
          <el-select
            placeholder="请选择机芯"
            v-model="modelForm.movement"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="输入机芯" prop="movementName">
          <el-input
            placeholder="请输入机芯"
            v-model="modelForm.movementName"
          />
        </el-form-item>
        <el-form-item label="输入机型" prop="modelName">
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
        customer: '',
        customerName: '',
        brandName: ''
      },
      brandRules: {
        customer: [{
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
        movementName: '',
        modelName: ''
      },
      modelRules: {
        movement: [{
          required: this.isSelect !== 1,
          message: '请选择机芯',
          trigger: ['change'],
          validator: this.check
        }],
        movementName: [{
          required: this.isSelect !== -1,
          message: '请输入机芯',
          trigger: ['change'],
          validator: this.inputName
        }],
        modelName: [
          { required: true, message: '请输入机型', trigger: 'blur' }
        ]
      },
      userOptions: [
        { key: 'CN', displayName: 'China' },
        { key: 'US', displayName: 'USA' },
        { key: 'JP', displayName: 'Japan' },
        { key: 'EU', displayName: 'Eurozone' }
      ],
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
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang='stylus' scoped>

</style>
