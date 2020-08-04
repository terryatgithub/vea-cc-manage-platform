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
        <el-form-item label="区域名" prop="ctmDevCtrName">
          <el-input
            placeholder="请输入区域名"
            v-model="regionForm.ctmDevCtrName"
          />
        </el-form-item>
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
        ctmDevCtrName: '',
        brand: '',
        model: '',
        country: '',
        type: ''
      },
      rules: {
        ctmDevCtrName: [
          { required: true, message: '请输入区域名', trigger: 'blur' }
        ],
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
      userOptions: []
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
    },
    transform (oldArray) {
      const options = []
      // options[0] = {
      //   label: '全部客户',
      //   value: '',
      //   customerId: '',
      //   customerName: '',
      //   children: null,
      //   brandList: null,
      // };
      for (let i = 0; i < oldArray.length; i++) {
        const brandList = this.filterOptions(oldArray[i].brandList)
        options[i] = {
          label: oldArray[i].customerName,
          value: oldArray[i].customerId,
          customerId: oldArray[i].customerId,
          customerName: oldArray[i].customerName,
          brandList,
          children: brandList
        }
      }
      return options
    },
    filterOptions (oldList) {
      const options2 = []
      // options2[0] = {
      //   label: '全部品牌',
      //   value: '',
      //   brandId: '',
      //   brandName: '',
      //   customerId: '',
      // };
      for (let i = 0; i < oldList.length; i++) {
        options2[i] = {
          label: oldList[i].brandName,
          value: oldList[i].brandId,
          brandId: oldList[i].brandId,
          brandName: oldList[i].brandName,
          customerId: oldList[i].customerId
        }
      }
      return options2
    },
    // 获取下拉数据
    getMediaResourceInfo () {
      this.$service.queryCustomerListAllContainBrands().then(data => {
        if (data.code === '0') {
          this.userOptions = this.transform(data.data)
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
.regionEdit >>> .el-form-item__content
  width: 220px!important
.regionEdit >>> .el-form-item .el-form-item__label
  width: 90px;
  text-align: left
.regionEdit >>> .item-type .el-form-item__content
  text-align: left
</style>
<style lang="scss">
.el-popper .el-cascader-panel {
  max-width: 600px
}
</style>
