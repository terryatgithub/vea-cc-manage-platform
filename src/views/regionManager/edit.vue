<template>
    <div>
      <el-form
        ref="regionForm"
        :rules="rules"
        :model="regionForm"
        style="width: 400px;text-align: center;"
        :inline="true"
        class="regionEdit"
      >
        <el-form-item label='客户&品牌' prop="brand">
          <el-cascader
            placeholder='请选择'
            :options='userOptions'
            :props="props"
            collapse-tags
            size='mini'
            :clearable='true'
            @change='brandIdSel'
            v-model="brand"
          ></el-cascader>
        </el-form-item>
        <el-form-item label='机芯&机型' prop="model">
          <el-cascader
            placeholder='请选择'
            :options='userOptions'
            :props="props"
            collapse-tags
            size='mini'
            :clearable='true'
            @change='brandIdSel'
            v-model="regionForm.model"
          ></el-cascader>
        </el-form-item>
        <el-form-item label='国家' prop="country">
          <el-cascader
            placeholder='请选择'
            :options='userOptions'
            :props="props"
            collapse-tags
            size='mini'
            :clearable='true'
            @change='brandIdSel'
            v-model="regionForm.country"
          ></el-cascader>
        </el-form-item>
        <el-form-item label='状态' class="item-type" prop="type">
          <el-radio-group v-model="regionForm.type">
            <el-radio label="生效"></el-radio>
            <el-radio label="失效"></el-radio>
          </el-radio-group>
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
    type: {
      type: String
    }
  },
  data () {
    return {
      props: {
        multiple: true,
        expandTrigger: 'hover'
      },
      regionForm: {
        brand: '',
        model: '',
        country: '',
        type: ''
      },
      rules: {
        brand: [
          { required: true, message: '请选择客户&品牌', trigger: 'change' }
        ],
        model: [
          { required: true, message: '请选择机芯&机型', trigger: 'change' }
        ],
        country: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      userOptions: [
        { key: 'CN', displayName: 'China' },
        { key: 'US', displayName: 'USA' },
        { key: 'JP', displayName: 'Japan' },
        { key: 'EU', displayName: 'Eurozone' }
      ]
    }
  },
  methods: {
    cancel () {

    },
    create () {
      this.$refs['regionForm'].validate((valid) => {
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
.regionEdit >>> .el-form-item__content
  width: 170px!important
.regionEdit >>> .el-form-item .el-form-item__label
  width: 90px;
  text-align: left
.regionEdit >>> .item-type .el-form-item__content
  text-align: left
</style>
