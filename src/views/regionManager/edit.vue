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
        <el-form-item label='客户&品牌' prop="brandNames">
          <el-cascader
            placeholder='请选择'
            :options='userOptions'
            :props="props"
            collapse-tags
            size='mini'
            :clearable='true'
            v-model="regionForm.brandNames"
            @change='brandNamesSel'
          ></el-cascader>
        </el-form-item>
        <el-form-item label='机芯&机型' prop="devices">
          <el-cascader
            placeholder='请选择'
            :options='chipModelOptions'
            :props="props"
            collapse-tags
            size='mini'
            :clearable='true'
            v-model="regionForm.devices"
            @change='devicesSel'
          ></el-cascader>
        </el-form-item>
        <el-form-item label='国家' prop="countryNames">
          <el-cascader
            placeholder='请选择'
            ref="areaCascader"
            :options='arealOptions'
            :props="props"
            collapse-tags
            size='mini'
            :clearable='true'
            v-model="regionForm.countryNames"
            @change='countryNamesSel'
          ></el-cascader>
        </el-form-item>
        <el-form-item label='状态' class="item-type" prop="state">
          <el-radio-group v-model="regionForm.state">
            <el-radio label="1">生效</el-radio>
            <el-radio label="0">失效</el-radio>
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
import liteOS from '@/assets/liteOS.js'
export default {
  components: {},
  props: {
    rlsId: {
      type: String
    }
  },
  watch: {
    rlsId: function (newVal, oldVal) { // 使用箭头函数调用方法会失败,this指向不一样
      if (newVal !== '0') {
        this.getAreaRisid()
      }
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
        brandNames: '',
        devices: '',
        countryNames: '',
        countryThreeCodes: '',
        state: ''
      },
      rules: {
        ctmDevCtrName: [
          { required: true, message: '请输入区域名', trigger: 'blur' }
        ],
        brandNames: [
          { required: true, message: '请选择客户&品牌', trigger: 'change' }
        ],
        devices: [
          { required: true, message: '请选择机芯&机型', trigger: 'change' }
        ],
        countryNames: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      userOptions: [],
      chipModelOptions: [],
      arealOptions: []
    }
  },
  methods: {
    getAreaRisid () {
      this.$service.getAreaManageRlsId({ rlsId: this.rlsId }).then(data => {
        if (data.code === 0) {
          const detail = data.data
          this.regionForm.ctmDevCtrName = detail.ctmDevCtrName
          this.regionForm.state = detail.state.toString()
          this.regionForm.countryThreeCodes = detail.countryThreeCodes
          this.regionForm.brandNames = liteOS.echo(detail.brandNames)
          this.regionForm.devices = liteOS.echo(detail.devices)
          this.regionForm.countryNames = liteOS.echo(detail.countryNames)
          console.log(this.regionForm)
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    cancel () {
      this.$refs['regionForm'].clearValidate()
      this.$refs['regionForm'].resetFields()
      this.$emit('close')
    },
    create () {
      this.$refs['regionForm'].validate((valid) => {
        if (valid) {
          const params = this.regionForm
          for (const i in params.brandNames) {
            params.brandNames[i] = params.brandNames[i].join('/')
          }
          params.brandNames = params.brandNames.join(',')
          for (const i in params.devices) {
            params.devices[i] = params.devices[i].join('/')
          }
          params.devices = params.devices.join(',')
          for (const i in params.countryNames) {
            params.countryNames[i] = params.countryNames[i].join('/')
          }
          params.countryNames = params.countryNames.join(',')
          params.creator = '管理员'
          if (this.rlsId !== '0') { // 判断是新增还是编辑
            params.ctmDevCtrId = this.rlsId
            this.$service.updateAreaManage(params).then(data => {
              if (data.code === 0) {
                this.$refs['regionForm'].clearValidate()
                this.$refs['regionForm'].resetFields()
                this.isSelect = 0
                this.$emit('close')
                this.$message({
                  type: 'success',
                  message: '修改成功！'
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
            this.$service.addAreaManage(params).then(data => {
              if (data.code === 0) {
                this.$refs['regionForm'].clearValidate()
                this.$refs['regionForm'].resetFields()
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
    brandNamesSel (val) {
      console.log(val)
    },
    devicesSel (val) {
      console.log(val)
    },
    countryNamesSel (val) {
      const nodesObj = this.$refs['areaCascader'].getCheckedNodes()
      const countryThreeCodes = []
      for (const i in nodesObj) {
        countryThreeCodes.push(nodesObj[i].data.countryThreeCode)
      }
      this.regionForm.countryThreeCodes = countryThreeCodes.join(',')
    },
    // 获取下拉数据
    getMediaResourceInfo () {
      this.$service.queryCustomerListAllContainBrands().then(data => {
        if (data.code === 0) {
          this.userOptions = liteOS.userTransform(data.data)
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.$service.queryChipAllContainModels().then(data => {
        if (data.code === 0) {
          this.chipModelOptions = liteOS.chipModelTransform(data.data)
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
      this.$service.queryAreaCountryListAll().then(data => {
        if (data.code === 0) {
          this.arealOptions = liteOS.areaTransform(data.data)
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
