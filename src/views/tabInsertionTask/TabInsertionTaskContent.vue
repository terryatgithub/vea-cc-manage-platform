<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <CommonContent :mode="mode">
      <div slot="auditAndDraft" class="actions">
        <el-button type="primary" @click="handleSave">
          保存
        </el-button>
      </div>
      <DataForm ref="form" :readonly="mode === 'read'" :model="form" label-width="120px">
        <DataEnum
          label="内容源"
          :rules="rules.source"
          prop="source"
          type="radio"
          v-model="form.source"
          :options="$consts.sourceOptions"/>
        <DataString label="任务名称" :rules="rules.taskName" prop="taskName" v-model="form.taskName" />
        <DataAny label="版面" :rules="rules.tabId" prop="tabId" >
          <div slot="edit">
            <TabSelector :source="form.source" selection-type="single" @select-end="handleSelectTabEnd" />
            <span v-if="form.tabId">
              已选择: {{ form.tabId }}
            </span>
          </div>
          <div slot="read">
            {{ form.tabId }}
          </div>
        </DataAny>
        <DataAny
          label="强插位置"
          :rules="rules.insertIndex"
          prop="insertIndex">
          <InputPositiveInt slot="edit" v-model="form.insertIndex" />
          <span slot="read"> {{ form.insertIndex }}</span>
        </DataAny>
        <DataAny
          label="定向人群"
          :rules="rules.dmpRegistryInfo"
          prop="dmpRegistryInfo.dmpCrowdId"
          v-model="form.dmpRegistryInfo">
          <div slot="edit">
            <DmpSelector @select-end="handleSelectCrowdEnd"></DmpSelector>
            <span v-if="form.dmpRegistryInfo.dmpCrowdId">
              已选择: {{ `${form.dmpRegistryInfo.dmpPolicyName}/${form.dmpRegistryInfo.dmpCrowdName}`}}
            </span>
          </div>
          <div slot="read">
            {{ `${form.dmpRegistryInfo.dmpPolicyName} / ${form.dmpRegistryInfo.dmpCrowdName}`}}
          </div>
        </DataAny>
      </DataForm>
    </CommonContent>
  </ContentCard>
</template>
<script>
import { components } from 'admin-base'
import TabSelector from '@/components/selectors/TabSelector'
import DmpSelector from '@/components/selectors/DmpSelector'
import CommonContent from '@/components/CommonContent'
import InputPositiveInt from '@/components/InputPositiveInt'
import { cloneDeep } from 'lodash'
export default {
  extends: components.ResourceBaseContent,
  components: {
    TabSelector,
    DmpSelector,
    CommonContent,
    InputPositiveInt
  },
  data() {
    return {
      resourceName: '版面强插任务',
      form: {
        source: this.$consts.sourceOptions[0].value,
        taskName: undefined,
        tabId: undefined,
        insertIndex: undefined,
        dmpRegistryInfo: { }
      },
      rules: {
        source: [{ required: true, message: '请输入内容源', trigger: 'blur' }],
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { max: 45, message: '长度不能超过 45 个字符', trigger: 'blur' }
        ],
        tabId: [{ required: true, message: '请输入版面', trigger: 'blur' }],
        insertIndex: [
          { required: true, message: '请输入强插位置', trigger: 'blur' }
        ],
        dmpRegistryInfo: [
          { required: true, message: '请选择人群', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSelectTabEnd (tabInfo) {
      this.form.tabId = tabInfo.tabId
    },
    handleSelectCrowdEnd (policy, crowd) {
      this.form.dmpRegistryInfo = {
        dmpPolicyId: policy.value,
        dmpCrowdId: crowd.value,
        dmpPolicyName: policy.label,
        dmpCrowdName: crowd.label
      }
    },
    validate (data, cb) {
      this.$refs.form.$refs.form.validate((valid) => {
        if (valid) {
          cb()
        } else {
          this.$message.error('请把表单填写完整')
        }
      })
    },
    parseDataToApi (data) {

    },
    handleSave () {
      const data = this.$utils.cloneDeep(this.form)
      this.validate(data, () => {
        this.$service.tabInsertionTaskUpsert(data, '保存成功').then(() => {
          this.$emit('upsert-end')
        })
      })
    },
    setTabInsertionTask (data) {
      this.form = cloneDeep(data)
    },
    fetchData () {
      this.$service.tabInsertionTaskGetDetail({id: this.id}).then(data => {
        this.setTabInsertionTask(data)
      })
    }
  },
  created () {
    this.mode = this.initMode
    if (this.id) {
      this.fetchData(this.version)
    }
  }
}
</script>
<style lang="stylus" scoped>
.actions
  margin-bottom 10px
</style>
