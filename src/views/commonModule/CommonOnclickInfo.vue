<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-button type="primary" @click="submitBtn">保存</el-button>
    <div class="form-legend-header">
      <i class="el-icon-edit">基本信息</i>
    </div>
    <el-form :model="form" :rules="formRules" ref="form" label-width="160px" class="el-form-add">
      <el-form-item label="点击事件名称" prop="onlickName">
        <el-input v-model="form.onlickName" placeholder="点击事件名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="备注"></el-input>
      </el-form-item>
      <!-- <el-form-item label="点击事件json串" prop="onlickJson">
            <el-input type="textarea" v-model="form.onlickJson" placeholder="异常处理(exception)"></el-input>
      </el-form-item>-->
      <AppParams prop-prefix="onclick." v-model="form.onclick"></AppParams>
      <el-form-item label="异常处理(exception)" prop="exception">
        <el-input type="textarea" v-model="form.exception" placeholder="异常处理(exception)"></el-input>
      </el-form-item>
    </el-form>
  </ContentCard>
</template>
<script>
import { AppParams } from 'admin-toolkit'
export default {
  components: {
    AppParams
  },
  props: {
    editId: Number,
    default: null
  },
  //  prop: ['editId'],
  data() {
    return {
      title: null,
      form: {
        onlickName: null,
        remark: null,
        onlickJson: null,
        onclick: {
          packagename: null,
          versioncode: '-1',
          dowhat: 'startActivity',
          bywhat: 'action',
          byvalue: null,
          params: []
        },
        exception: null
      },
      formRules: {
        //表单规则
        onlickName: [
          { required: true, message: '请输入点击事件名称', trigger: 'blur' }
        ],
        packagename: [
          { required: true, message: '请输入应用包名', trigger: 'blur' }
        ],
        byvalue: [
          { required: true, message: '请输入启动参数', trigger: 'blur' }
        ]
      },
      paramsList: [
        {
          key: '',
          value: ''
        }
      ]
    }
  },
  methods: {
    paramsAddBtn() {
      this.paramsList.push({
        key: '',
        value: ''
      })
    },
    paramsRedBtn(index) {
      this.paramsList.splice(index, 1)
    },
    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {}
          this.form.onclick.params.forEach(element => {
            params[element.key] = element.value
          })
          this.form.onclick.params = params
          this.form = Object.assign({}, this.form, this.form.onclick)
          this.form.onlickJson = JSON.stringify(this.form.onclick)
          delete this.form.onclick
          this.$service
            .commonOnclickInfoSave(
              { jsonStr: JSON.stringify(this.form) },
              '保存成功'
            )
            .then(data => {
              this.$emit('openListPage')
            })
        }
      })
    },
    getEditData() {
      this.$service.getCommonOnclickInfoEdit({ id: this.editId }).then(data => {
        const params = JSON.parse(data.params || '{}')
        data.params = Object.keys(params).map(key => {
          return {
            key,
            value: params[key]
          }
        })
        data.onclick = {
          packagename: data.packagename,
          versioncode: data.versioncode,
          dowhat: data.dowhat,
          bywhat: data.bywhat,
          byvalue: data.byvalue,
          params: data.params
        }
        delete data.packagename
        delete data.versioncode
        delete data.dowhat
        delete data.bywhat
        delete data.byvalue
        delete data.params
        this.form = Object.assign({}, this.form, data)
      })
    }
  },
  created() {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.getEditData()
    } else {
      this.title = '新增'
    }
  }
}
</script>
<style lang="stylus" scoped>
.cc-params-ul, .cc-params-ul li
  list-style: none
  margin: 0
  padding: 0
.cc-params-ul li
  margin-bottom: 8px
.cc-params-ul li > div
  display: inline-block
  width: 20%
  margin-right: 5px
</style>
