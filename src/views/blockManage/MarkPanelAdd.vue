<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <el-row :gutter="40">
      <el-col :span="24">
          <div class="base-tit">
            <span class="el-icon-edit">基本信息</span>
          </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="版块名称" prop="pannelList[0].pannelName">
            <el-input v-model="form.pannelList[0].pannelName" placeholder="版块名称"></el-input>
          </el-form-item>
          <el-form-item label="版块标题" prop="pannelList[0].pannelTitle">
            <el-input v-model="form.pannelList[0].pannelTitle" placeholder="版块标题"></el-input>
            <el-checkbox
              :value="!form.pannelList[0].showTitle"
              @input="form.pannelList[0].showTitle = !$event"
            >前端不显示标题</el-checkbox>
          </el-form-item>
          <el-form-item label="功能类型" prop="clientType">
            <el-input v-model="form.clientType" placeholder="功能类型"></el-input>
          </el-form-item>
          <el-form-item label="内容源" prop="pannelList[0].pannelResource">
            <el-radio v-model="form.pannelList[0].pannelResource" label>不限</el-radio>
            <el-radio v-model="form.pannelList[0].pannelResource" label="o_tencent">腾讯</el-radio>
            <el-radio v-model="form.pannelList[0].pannelResource" label="o_iqiyi">爱奇艺</el-radio>
          </el-form-item>
        </el-form>
        <div style="padding: 10px;text-align:right">
            <el-button type="warning" @click="submitStart">提交审核</el-button>
            <el-button type="primary" @click="submitEnd">保存草稿</el-button>
         </div>
        <!--提交审核弹窗-->
        <el-dialog :visible.sync="dialogTableVisible">
          <el-form ref="submitForm" :model="submitForm" :rules="submitRules" label-width="100px">
            <el-form-item label="是否定时" prop="isTiming">
              <el-radio-group v-model="submitForm.isTiming">
                <el-radio class="radio" :label="1">是</el-radio>
                <el-radio class="radio" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="设定时间" v-if="submitForm.isTiming ==1" prop="releaseTime">
              <el-date-picker v-model="submitForm.releaseTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogTableVisible = false;resetFields('submitForm')">取 消</el-button>
              <el-button type="primary" @click="submitTime('submitForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
    </el-row>
  </ContentCard>
</template>

<script>
export default {
  props: {
    editId: Number,
    default: null
  },
  data() {
    return {
      title: '',
      form: {
        parentType: 'function',
        pannelGroupId: undefined,
        currentVersion: undefined,
        panelGroupType: 8,
        clientType: '',
        pannelList: [
          {
            pannelName: '',
            pannelType: 8,
            pannelResource: '',
            pannelTitle: '',
            showTitle: false,
            pannelCategory: 67
          }
        ]
      },
      rules: {
        //表单规则
        'pannelList[0].pannelName': [
          { required: true, message: '请输入板块名称', trigger: 'blur' }
        ],
        'pannelList[0].pannelTitle': [
          { required: true, message: '请输入板块标题', trigger: 'blur' }
        ],
        clientType: [
          { required: true, message: '请输入功能类型', trigger: 'blur' }
        ]
      },
      dialogTableVisible: false,
      submitForm: {
        isTiming: 0,
        releaseTime: ''
      },
      submitRules: {
        releaseTime: [
          { 
            required: true,
            message: '请选择时间'
          }
        ]
      }
    }
  },
  methods: {
    /**保存草稿 */
    submitEnd(timingParam, isSubmit) {
      const formData = this.getFormData(timingParam, isSubmit)
      this.$refs.form.validate(valid => {
        if (valid) {
          // const jsonStr = JSON.stringify(formData)
          this.$service
            .MarkPanelSave({ jsonStr: JSON.stringify(formData) }, '保存成功')
            .then(data => {
              this.$emit('open-list-page')
            })
        }
      })
    },
    getFormData(timingParam, isSubmit) {
      const originForm = this.form
      if (originForm.pannelList[0]['showTitle']) {
        originForm.pannelList[0]['showTitle'] = 1
      } else {
        originForm.pannelList[0]['showTitle'] = 0
      }
      originForm.pannelList[0]['pannelStatus'] = isSubmit ? 3 : 2
      const form = Object.assign({}, originForm, timingParam)
      return form
    },
    //时间弹框确定事件
    submitTime(form) {
      this.$refs.submitForm.validate(valid => {
        if (valid) {
            this.form.isTiming = this.$refs.submitForm.model.isTiming
            this.form.releaseTime = this.$refs.submitForm.model.releaseTime
            this.dialogTableVisible = false
            const jsonStr = JSON.stringify(this.form)
            this.$service.MarkPanelSave({jsonStr: JSON.stringify(this.form)}, '成功').then(data => {
                this.$emit('open-list-page')
            })
        }
      })
    },
    //时间弹框取消事件
    resetFields(form) {
      this.$nextTick(() =>{
        this.$refs.submitForm.resetFields();
      })
       console.log(this.$refs.submitForm.model)
    },
    /**提交审核 */
    submitStart() {
      this.dialogTableVisible = true
    },
    /**编辑数据回显 */
    getEditData() {
      this.$service.getEditData({ id: this.editId }).then(data => {
        console.log(data)
        this.form = data
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
<style scoped>
.base-tit {
   background-color: #e6e6e6;
    padding: 10px 2px;
    margin: 5px 0px
}
.base-tit span {
  padding: 0px 5px
}
</style>
