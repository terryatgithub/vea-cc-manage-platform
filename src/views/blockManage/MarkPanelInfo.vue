<template>
  <div>
    <ContentCard :title="title" @go-back="$emit('go-back')">
      <CommonContent
        ref="commonContent"
        :mode="mode"
        :resource-info="resourceInfo"
        @replicate="mode = 'replicate'"
        @edit="mode = 'edit'"
        @unaudit="$emit('upsert-end')"
        @shelves="fetchData"
        @audit="$emit('upsert-end')"
        @select-version="fetchData"
        @delete="$emit('upsert-end', $event)"
        @submit-audit="handleSubmitAudit"
        @save-draft="handleSaveDraft"
        @cancel-timing="fetchData(form.currentVersion)"
      >
        <div class="form-legend-header">
          <i class="el-icon-edit">基本信息</i>
        </div>
        <div v-if="mode!== 'read'">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="120px"
            class="el-form-add"
          >
            <el-form-item label="版块名称" prop="pannelList[0].pannelName">
              <el-input v-model="form.pannelList[0].pannelName" placeholder="版块名称"></el-input>
            </el-form-item>
            <el-form-item label="版块标题" prop="pannelList[0].pannelTitle">
              <el-input v-model="form.pannelList[0].pannelTitle" placeholder="版块标题"></el-input>
              <el-checkbox
                class="marginL"
                :value="!form.pannelList[0].showTitle"
                @input="form.pannelList[0].showTitle = $event ? 0 : 1"
              >前端不显示标题</el-checkbox>
            </el-form-item>
            <el-form-item label="功能类型" prop="clientType">
              <el-input v-model="form.clientType" placeholder="功能类型"></el-input>
            </el-form-item>
            <el-form-item label="内容源" prop="pannelList[0].pannelResource">
              <el-radio v-model="form.pannelList[0].pannelResource" label>不限</el-radio>
              <el-radio v-model="form.pannelList[0].pannelResource" label="o_tencent">腾讯</el-radio>
              <el-radio v-model="form.pannelList[0].pannelResource" label="o_iqiyi">爱奇艺</el-radio>
              <el-radio v-model="form.pannelList[0].pannelResource" label="o_youku">优酷</el-radio>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="mode === 'read'">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="120px"
            class="el-form-add"
          >
            <el-form-item
              label="版块名称"
              prop="pannelList[0].pannelName"
            >{{form.pannelList[0].pannelName}}</el-form-item>
            <el-form-item
              label="版块标题"
              prop="pannelList[0].pannelTitle"
            >{{form.pannelList[0].pannelTitle}}{{ form.pannelList[0].showTitle === 0 ? '(前端不显示)' : '' }}</el-form-item>
            <el-form-item label="功能类型" prop="clientType">{{form.clientType}}</el-form-item>
            <el-form-item label="内容源" prop="pannelList[0].pannelResource">
              <el-radio v-model="form.pannelList[0].pannelResource" :disabled="true" label>不限</el-radio>
              <el-radio
                v-model="form.pannelList[0].pannelResource"
                :disabled="true"
                label="o_tencent"
              >腾讯</el-radio>
              <el-radio
                v-model="form.pannelList[0].pannelResource"
                :disabled="true"
                label="o_iqiyi"
              >爱奇艺</el-radio>
              <el-radio
                v-model="form.pannelList[0].pannelResource"
                :disabled="true"
                label="o_youku"
              >优酷</el-radio>
            </el-form-item>
          </el-form>
        </div>
      </CommonContent>
    </ContentCard>
  </div>
</template>
<script>
import CommonContent from '@/components/CommonContent.vue'
import titleMixin from '@/mixins/title'
export default {
  mixins: [titleMixin],
  components: {
    CommonContent
  },
  props: {
    id: Number,
    initMode: String,
    version: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    const STATUS = {
      draft: 2,
      waiting: 3,
      accepted: 4,
      rejected: 5,
      processing: 7
    }
    return {
      STATUS,
      mode: 'create',
      resourceName: '功能版块',
      showTimeShelf: false,
      releaseTime: undefined,
      form: {
        parentType: 'function',
        pannelGroupId: undefined,
        currentVersion: undefined,
        panelGroupType: 8,
        clientType: '',
        pannelStatus: undefined,
        pannelList: [
          {
            pannelName: '',
            pannelType: 8,
            pannelResource: '',
            pannelTitle: '',
            showTitle: 0,
            pannelStatus: undefined,
            pannelCategory: 67
          }
        ]
      },
      rules: {
        // 表单规则
        'pannelList[0].pannelName': [
          { required: true, message: '请输入版块名称', trigger: 'blur' }
        ],
        'pannelList[0].pannelTitle': [
          { required: true, message: '请输入版块标题', trigger: 'blur' }
        ],
        clientType: [
          { required: true, message: '请输入功能类型', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // eslint-disable-next-line
    resourceInfo() {
      const form = this.form
      if (form.pannelGroupId) {
        return {
          id: form.pannelGroupId,
          type: 'pannel',
          menuElId: 'pannelInfo',
          version: form.currentVersion,
          status: form.pannelList[0].pannelStatus
        }
      }
    },
    couldSetReleaseTime () {
      const mode = this.mode
      const currentVersion = this.form.currentVersion
      const isCreatingOrCopying = mode === 'create' || mode === 'copy'
      const isEditingV1 = mode === 'edit' && currentVersion === 'V1'
      const isCoocaa = this.$consts.idPrefix === '10'
      return isCoocaa && !(isCreatingOrCopying || isEditingV1)
    }
  },
  methods: {
    handleSubmitAudit (timing) {
      const data = this.getFormData()
      data.pannelList[0].pannelStatus = this.$consts.status.waiting
      this.validateFormData(data, () => {
        if (this.couldSetReleaseTime) {
          if (timing) {
            data.isTiming = timing.isTiming
            data.releaseTime = timing.releaseTime
            this.submit(data)
          } else {
            this.$refs.commonContent.showReleaseTimeSetter = true
          }
        } else {
          this.submit(data)
        }
      })
    },
    handleSaveDraft () {
      const data = this.getFormData()
      data.isTiming = undefined
      data.releaseTime = undefined
      data.pannelList[0].pannelStatus = this.$consts.status.draft
      this.validateFormData(
        data,
        function () {
          this.submit(data)
        }.bind(this)
      )
    },
    getFormData () {
      const data = JSON.parse(JSON.stringify(this.form))
      const mode = this.mode
      if (mode === 'replicate') {
        data.currentVersion = ''
      }
      if (mode === 'copy') {
        data.tabId = undefined
        data.currentVersion = ''
      }
      return data
    },
    submit (data) {
      const jsonStr = JSON.stringify(data)
      this.$service
        .MarkPanelSave({ jsonStr: jsonStr }, '保存成功')
        .then(data => {
          this.$emit('upsert-end')
        })
    },
    validateFormData (data, cb) {
      this.$refs.form.validate(valid => {
        if (valid) {
          cb()
        } else {
          this.$message({
            type: 'error',
            message: '请把表单填写完整'
          })
        }
      })
    },
    /** 编辑数据回显 */
    fetchData (version) {
      this.$service.getViewData({ id: this.id, version }).then(data => {
        this.form = data
        if (version !== '' && version !== undefined) {
          this.$service
            .getTimedInfo({ id: this.id, version, type: 'pannel' })
            .then(data => {
              this.releaseTime = data.releaseTime
            })
        }
      })
    }
  },
  created () {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
  }
}
</script>

<style lang='stylus' scoped>
.base-info
  background-color: #fef8b8
  padding-bottom: 10px
  margin-bottom: 10px
.base-info div
  padding: 5px
</style>
