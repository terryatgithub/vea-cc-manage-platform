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
            size='mini'
            v-model="regionForm.ctmDevCtrName"
            clearable
            maxlength="99"
          />
        </el-form-item>
        <el-form-item label='客户&品牌' prop="brandNames">
          <el-cascader
            placeholder='请选择'
            :options='userOptions'
            :props="props"
            size='mini'
            clearable
            v-model="regionForm.brandNames"
            :collapse-tags='collapseTags1'
            ref="brandNames"
            @change="val => changeSelect(val, 'brandNames')"
            @visible-change="v => visibleChange(v, 'brandNames')"
            @remove-tag="val => removeTag(val, 'brandNames')"
          ></el-cascader>
        </el-form-item>
        <el-form-item label='机芯&机型' prop="devices">
          <el-cascader
            placeholder='请选择'
            :options='chipModelOptions'
            :props="props"
            size='mini'
            clearable
            v-model="regionForm.devices"
            :collapse-tags='collapseTags2'
            ref="devices"
            @change="val => changeSelect(val, 'devices')"
            @visible-change="v => visibleChange(v, 'devices')"
            @remove-tag="val => removeTag(val, 'devices')"
          ></el-cascader>
        </el-form-item>
        <el-form-item label='国家' prop="countryNames">
          <el-cascader
            placeholder='请选择'
            :options='arealOptions'
            :props="props"
            size='mini'
            clearable
            v-model="regionForm.countryNames"
            :collapse-tags='collapseTags3'
            ref="countryNames"
            @change="val => changeSelect(val, 'countryNames')"
            @visible-change="v => visibleChange(v, 'countryNames')"
            @remove-tag="val => removeTag(val, 'countryNames')"
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
        <el-button type="primary" @click="create">
          确认
        </el-button>
        <el-button @click="cancel">
          取消
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
      // this.getAreaRisid()
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
      arealOptions: [],
      collapseTags1: false,
      collapseTags2: false,
      collapseTags3: false
    }
  },
  methods: {
    // 数据组装
    assemble (item, refName) {
      const itemArr = []
      if (refName === 'brandNames') {
        for (const i in item.brandList) {
          itemArr.push([item.customerName, item.brandList[i].brandName])
        }
      } else if (refName === 'devices') {
        for (const i in item.modelVOList) {
          itemArr.push([item.chip, item.modelVOList[i].model])
        }
      } else if (refName === 'countryNames') {
        for (const i in item.countryList) {
          itemArr.push([item.areaName, item.countryList[i].countryName])
        }
      }
      return itemArr
    },
    /**
     * 为element-ui的Cascader添加All操作按钮
     * @param visible
     * @param refName  设定的ref名称
     * @param onClick  底部操作按钮点击监听
     */
    visibleChange (visible, refName) {
      if (visible) {
        const ref = this.$refs[refName]
        let popper = ref.$refs.popper.getElementsByTagName('ul')[0].firstChild.firstChild
        let options = refName === 'brandNames'
          ? this.userOptions
          : refName === 'devices'
          ? this.chipModelOptions
          : this.arealOptions
        // const obj = Object.assign({}, this.regionForm)
        // let this.regionForm.brandNames = refName === 'brandNames'
        // ? obj.brandNames
        // : refName === 'devices'
        // ? obj.devices
        // : obj.countryNames
        popper.onclick = (e) => {
          if (e.target.tagName === 'INPUT') { // 解决点击多选框事件会触发两次
            let optionsLength = 0
            options.map((item) => {
              if (refName === 'brandNames') {
                item.brandList
                  ? optionsLength += item.brandList.length
                  : optionsLength += 1
              } else if (refName === 'devices') {
                item.modelVOList
                  ? optionsLength += item.modelVOList.length
                  : optionsLength += 1
              } else if (refName === 'countryNames') {
                item.countryList
                  ? optionsLength += item.countryList.length
                  : optionsLength += 1
              }
            })
            if (refName === 'brandNames') {
              if (this.regionForm.brandNames.length < optionsLength) {
                this.regionForm.brandNames = []
                options.map((item) => {
                  item.brandList
                    ? this.regionForm.brandNames = this.regionForm.brandNames.concat(this.assemble(item, refName))
                    : this.regionForm.brandNames.unshift(['All'])
                })
              } else {
                this.regionForm.brandNames = []
              }
              this.regionForm.brandNames.length > 20
                ? this.collapseTags1 = true
                : this.collapseTags1 = false
            } else if (refName === 'devices') {
              if (this.regionForm.devices.length < optionsLength) {
                this.regionForm.devices = []
                options.map((item) => {
                  item.modelVOList
                    ? this.regionForm.devices = this.regionForm.devices.concat(this.assemble(item, refName))
                    : this.regionForm.devices.unshift(['All'])
                })
              } else {
                this.regionForm.devices = []
              }
              this.regionForm.devices.length > 20
                ? this.collapseTags2 = true
                : this.collapseTags2 = false
            } else if (refName === 'countryNames') {
              if (this.regionForm.countryNames.length < optionsLength) {
                this.regionForm.countryNames = []
                options.map((item) => {
                  item.countryList
                    ? this.regionForm.countryNames = this.regionForm.countryNames.concat(this.assemble(item, refName))
                    : this.regionForm.countryNames.unshift(['All'])
                })
              } else {
                this.regionForm.countryNames = []
              }
              this.regionForm.countryNames.length > 20
                ? this.collapseTags3 = true
                : this.collapseTags3 = false
            }
          }
        }
      }
    },
    changeSelect (val, refName) {
      // 当多选超过20时折叠展示
      if (refName === 'brandNames') {
        val.length > 20
          ? this.collapseTags1 = true
          : this.collapseTags1 = false
      } else if (refName === 'devices') {
        val.length > 20
          ? this.collapseTags2 = true
          : this.collapseTags2 = false
      } else if (refName === 'countryNames') {
        val.length > 20
          ? this.collapseTags3 = true
          : this.collapseTags3 = false
      }
      // 选择国家要多传参数countryThreeCodes
      if (refName === 'countryNames') {
        const nodesObj = this.$refs[refName].getCheckedNodes()
        const countryThreeCodes = []
        for (const i in nodesObj) {
          countryThreeCodes.push(nodesObj[i].data.countryThreeCode)
        }
        this.regionForm.countryThreeCodes = countryThreeCodes.join(',')
      }
      let options = refName === 'brandNames'
        ? this.userOptions
        : refName === 'devices'
        ? this.chipModelOptions
        : this.arealOptions
      let optionsLength = 0
      options.map((item) => {
        if (refName === 'brandNames') {
          item.brandList
            ? optionsLength += item.brandList.length
            : optionsLength += 1
        } else if (refName === 'devices') {
          item.modelVOList
            ? optionsLength += item.modelVOList.length
            : optionsLength += 1
        } else if (refName === 'countryNames') {
          item.countryList
            ? optionsLength += item.countryList.length
            : optionsLength += 1
        }
      })
      if (!(val[0][0] === 'All') && val.length === optionsLength - 1) {
        options.map((item) => {
          if (refName === 'brandNames') {
            item.brandList
              ? this.regionForm.brandNames = this.regionForm.brandNames.concat(this.assemble(item, refName))
              : this.regionForm.brandNames.unshift(['All'])
          } else if (refName === 'devices') {
            item.modelVOList
              ? this.regionForm.devices = this.regionForm.devices.concat(this.assemble(item, refName))
              : this.regionForm.devices.unshift(['All'])
          } else if (refName === 'countryNames') {
            item.countryList
              ? this.regionForm.countryNames = this.regionForm.countryNames.concat(this.assemble(item, refName))
              : this.regionForm.countryNames.unshift(['All'])
          }
        })
      } else if (val[0][0] === 'All' && val.length < optionsLength) {
        if (refName === 'brandNames') {
          this.regionForm.brandNames = this.regionForm.brandNames.filter((item) => {
            return item[0] !== 'All'
          })
        } else if (refName === 'devices') {
          this.regionForm.devices = this.regionForm.devices.filter((item) => {
            return item[0] !== 'All'
          })
        } else if (refName === 'countryNames') {
          this.regionForm.countryNames = this.regionForm.countryNames.filter((item) => {
            return item[0] !== 'All'
          })
        }
      }
    },
    removeTag (val, refName) {
      if (refName === 'brandNames') {
        if (val[0] === 'All') {
          this.regionForm.brandNames = []
        }
      } else if (refName === 'devices') {
        if (val[0] === 'All') {
          this.regionForm.devices = []
        }
      } else if (refName === 'countryNames') {
        if (val[0] === 'All') {
          this.regionForm.countryNames = []
        }
      }
    },
    getAreaRisid () {
      this.$service.getAreaManageRlsId({ rlsId: this.rlsId }).then(data => {
        if (data.code === 0) {
          const detail = data.data
          this.regionForm.ctmDevCtrName = detail.ctmDevCtrName
          this.regionForm.state = detail.state.toString()
          if (detail.brandNames === 'all') {
            this.regionForm.brandNames = []
            this.userOptions.map((item) => {
              item.brandList
                ? this.regionForm.brandNames = this.regionForm.brandNames.concat(this.assemble(item, 'brandNames'))
                : this.regionForm.brandNames.unshift(['All'])
            })
          } else {
            this.regionForm.brandNames = liteOS.echoSemicolon(detail.brandNames)
          }
          if (detail.devices === 'all') {
            this.regionForm.devices = []
            this.chipModelOptions.map((item) => {
              item.modelVOList
                ? this.regionForm.devices = this.regionForm.devices.concat(this.assemble(item, 'devices'))
                : this.regionForm.devices.unshift(['All'])
            })
          } else {
            this.regionForm.devices = liteOS.echo(detail.devices)
          }
          if (detail.countryNames === 'all') {
            this.regionForm.countryNames = []
            this.arealOptions.map((item) => {
              item.countryList
                ? this.regionForm.countryNames = this.regionForm.countryNames.concat(this.assemble(item, 'countryNames'))
                : this.regionForm.countryNames.unshift(['All'])
            })
            this.regionForm.countryNames.length > 20
              ? this.collapseTags3 = true
              : this.collapseTags3 = false
          } else {
            this.regionForm.countryNames = liteOS.echo(detail.countryNames)
          }
          this.regionForm.countryThreeCodes = detail.countryThreeCodes
          this.regionForm.brandNames.length > 20
            ? this.collapseTags1 = true
            : this.collapseTags1 = false
          this.regionForm.devices.length > 20
            ? this.collapseTags2 = true
            : this.collapseTags2 = false
          this.regionForm.countryNames.length > 20
            ? this.collapseTags3 = true
            : this.collapseTags3 = false
          this.$emit('load')
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
          // 坑：对象直接赋值两边会双向绑定，深浅拷贝的原理
          const params = JSON.parse(JSON.stringify(this.regionForm))
          params.brand = []
          for (const i in params.brandNames) {
            params.brand[i] = params.brandNames[i][1]
            params.brandNames[i] = params.brandNames[i].join('|')
          }
          params.brand = params.brand.join(',')
          params.brandNames = params.brandNames.join(';')
          for (const i in params.devices) {
            params.devices[i] = params.devices[i].join('/')
          }
          params.devices = params.devices.join(',')
          for (const i in params.countryNames) {
            params.countryNames[i] = params.countryNames[i].join('/')
          }
          params.countryNames = params.countryNames.join(',')
          // 判断是否是全选
          if (params.brandNames.indexOf('All') !== -1) {
            params.brandNames = 'all'
            params.brand = 'all'
          }
          if (params.devices.indexOf('All') !== -1) {
            params.devices = 'all'
          }
          if (params.countryNames.indexOf('All') !== -1) {
            params.countryNames = 'all'
            params.countryThreeCodes = 'all'
          }
          params.creator = this.$appState.user.name
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
          console.log('error that.regionForm.brandNames!!')
          return false
        }
      })
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
    async getMediaResourceInfo () {
      let res1, res2, res3
      res1 = await this.$service.queryCustomerListAllContainBrands()
      res2 = await this.$service.queryChipAllContainModels()
      res3 = await this.$service.queryAreaCountryListAll()
      if (res1.code === 0 && res2.code === 0 && res3.code === 0) {
        this.userOptions = liteOS.userTransformAll(res1.data)
        this.chipModelOptions = liteOS.chipModelTransformAll(res2.data)
        this.arealOptions = liteOS.areaTransformAll(res3.data)
        if (this.rlsId !== '0') {
          this.getAreaRisid()
        }
      }
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
