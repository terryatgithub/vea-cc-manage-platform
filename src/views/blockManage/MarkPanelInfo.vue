<template>
  <div>
    <div class="hompage-upsert" v-if="mode!== 'read'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
         <div class="form-legend-header">
                <span>基本信息</span>
              </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="el-form-add">
          <el-form-item label="版块名称" prop="pannelList[0].pannelName">
            <el-input v-model="form.pannelList[0].pannelName" placeholder="版块名称"></el-input>
          </el-form-item>
          <el-form-item label="版块标题" prop="pannelList[0].pannelTitle">
            <el-input v-model="form.pannelList[0].pannelTitle" placeholder="版块标题"></el-input>
            <el-checkbox
              class="marginL"
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
            <el-radio v-model="form.pannelList[0].pannelResource" label="o_youku">优酷</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitStart">提交审核</el-button>
            <el-button type="primary" plain @click="submitEnd(2)">保存草稿</el-button>
          </el-form-item>
        </el-form>
      </ContentCard>
    </div>
    <div v-if="mode === 'read'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'; title='创建副本'"
          @edit="mode = 'edit'; title='编辑'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @select-version="fetchData"
        >
         <div class="form-legend-header">
                <span>基本信息</span>
              </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="el-form-add">
          <el-form-item label="版块名称" prop="pannelList[0].pannelName">
            {{form.pannelList[0].pannelName}}
          </el-form-item>
          <el-form-item label="版块标题" prop="pannelList[0].pannelTitle">
            {{form.pannelList[0].pannelTitle}}{{ form.pannelList[0].showTitle === 0 ? '(前端不显示)' : '' }}
          </el-form-item>
          <el-form-item label="功能类型" prop="clientType">
            {{form.clientType}}
          </el-form-item>
          <el-form-item label="内容源" prop="pannelList[0].pannelResource">
            <el-radio v-model="form.pannelList[0].pannelResource" :disabled="true" label>不限</el-radio>
            <el-radio v-model="form.pannelList[0].pannelResource" :disabled="true"  label="o_tencent">腾讯</el-radio>
            <el-radio v-model="form.pannelList[0].pannelResource" :disabled="true"  label="o_iqiyi">爱奇艺</el-radio>
            <el-radio v-model="form.pannelList[0].pannelResource" :disabled="true"  label="o_youku">优酷</el-radio>
          </el-form-item>
        </el-form>
        </CommonContent>
      </ContentCard>
    </div>
    <ReleaseTimeSetter
      v-if="showTimeShelf"
      @cancel="showTimeShelf = false"
      @submit="handleSubmitAudit"
    />
  </div>
</template>
<script>
import CommonContent from '@/components/CommonContent.vue'
import ReleaseTimeSetter from './../../components/ReleaseTimeSetter'
export default {
  components: {
    CommonContent,
    ReleaseTimeSetter
  },
  props: {
    id: Number,
    initMode: String,
    version: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
     const STATUS = {
      draft: 2,
      waiting: 3,
      accepted: 4,
      rejected: 5,
      processing: 7
    }
    return {
      STATUS,
      title: '',
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
            showTitle: false,
            pannelStatus: undefined,
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
      }
    }
  },
  computed: {
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
    }
  },
  methods: {
    submitEnd (status, data) {
       if(data !== undefined) {
          data = this.form
       }
      data.pannelList[0].pannelStatus = status
      data.pannelList[0]['showTitle'] ? data.pannelList[0]['showTitle'] = 1 : data.pannelList[0]['showTitle'] = 0
      if (this.mode ==='replicate') {
        data.currentVersion = ''
      }
      const jsonStr = JSON.stringify(data)
      this.$service
        .MarkPanelSave({ jsonStr: jsonStr }, '保存成功')
        .then(data => {
          this.$emit('upsert-end')
        })
    },
    handleSubmitAudit(timing) {
      const data = this.form
      data.isTiming = timing.isTiming
      data.releaseTime = timing.releaseTime
      this.showTimeShelf = false
      this.submitEnd(3, data)
    },
    /**提交审核 */
    submitStart() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.showTimeShelf = true
        }
      })
    },
    /**编辑数据回显 */
    fetchData(version) {
      this.$service.getViewData({ id: this.id, version }).then(data => {
        this.form = data
         if(version!==''&&version!==undefined) {
          this.$service.getTimedInfo({id: this.id,version,type: 'pannel'}).then(data => {
            this.releaseTime = data.releaseTime
          })
         }
      })
    }
  },
  created() {
    this.mode = this.initMode || 'create'
    switch (this.mode) {
      case 'create':
        this.title = '新增'
        break
      case 'copy':
        this.title = '复制'
        break
      case 'edit':
        this.title = '编辑'
        break
      case 'replica':
        this.title = '创建副本'
      case 'read':
        this.title = '预览'
        break
    }
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