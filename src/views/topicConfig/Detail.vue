<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'"
          @edit="mode = 'edit'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @copy="handleCopy($event)"
          @submit-audit="handleSubmitAudit"
          @save-draft="handleSaveDraft"
          @select-version="fetchData"
          @delete="$emit('upsert-end', $event)">
          <DataForm :readonly="mode === 'read'" ref="dataForm" :model="topic" :rules="rules" label-width="100px">
            <div class="form-legend-header">
              <i class="el-icon-edit">基本信息</i>
            </div>
            <String label="名称" :readonly="true" v-model="topic.topicConfigName" />
            <Enum label="内容源" :options="$consts.sourceOptions" :readonly="true" v-model="topic.source" />
            <Any label="话题列表" :readonly="mode === 'read'">
              <div slot="edit">
                <ResourceSelector
                  :disable-partner="true"
                  :source="topic.source"
                  :selectors="['shortVideoTopic']"
                  selection-type="multiple"
                  @select-end="handleSelectVideoTopicEnd">
                  <el-button type="primary" plain>
                    选择话题
                  </el-button>
                </ResourceSelector>
                <OrderableTable v-model="topic.contentList" :header="shortVideoListHeader" />
              </div>
              <div slot="read">
                <OrderableTable :readonly="true" :hide-action="true" v-model="topic.contentList" :header="shortVideoListHeader" />
              </div>
            </Any>
          </DataForm>
        </CommonContent>
      </ContentCard>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import ContentCard from '@/components/ContentCard'
import CommonContent from '@/components/CommonContent'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import titleMixin from '@/mixins/title'
import OrderableTable from '@/components/OrderableTable'
import { cloneDeep } from 'lodash'

import DataForm from '@/components/form/DataForm'
import String from '@/components/form/String'
import Enum from '@/components/form/Enum'
import Any from '@/components/form/Any'

export default {
  components: {
    PageWrapper,
    PageContentWrapper,
    ContentCard,
    CommonContent,
    GlobalPictureSelector,
    ResourceSelector,
    OrderableTable,

    DataForm,
    String,
    Enum,
    Any
  },
  mixins: [titleMixin],
  data() {
    return {
      mode: 'create',
      resourceName: '话题推荐',
      versionList: [],
      shortVideoListHeader: [
        {
          label: '话题ID',
          prop: 'id',
          width: 80
        },
        {
          label: '话题名',
          prop: 'topicName',
        },
        {
          label: '默认落焦',
          prop: 'topicIsFocus',
          render: (h, {row, $index}) => {
            if (this.mode === 'read') {
              return row.topicIsFocus ? '是' : ''
            }
            return h('el-radio', {
              props: {
                label: 1,
                value: row.topicIsFocus
              },
              on: {
                input: () => {
                  this.handleSetDefaultFocus($index)
                }
              }
            }, '')
          }
        }
      ],
      topic: {
        id: undefined,
        defaultFocusId: undefined,
        topicConfigName: '',
        source: undefined,
        status: undefined,
        currentVersion: '',
        duplicateVersion: undefined,
        contentList: [],
      },
      rules: {
      }
    }
  },
  props: ['initMode', 'id', 'version'],
  computed: {
    resourceInfo() {
      const topic = this.topic
      if (topic.id) {
        return {
          id: topic.id,
          type: 'topicConfig',
          menuElId: 'topicConfig',
          version: topic.currentVersion,
          status: topic.status
        }
      }
    }
  },
  methods: {
    fetchData(version) {
      this.$service.topicConfigGetDetail({ id: this.id, version }).then(data => {
        this.setData(data)
      })
    },
    handleSetDefaultFocus(index) {
      this.topic.contentList.forEach((item, idx) => {
        if (index === idx) {
          item.topicIsFocus = 1
        } else {
          item.topicIsFocus = 0
        }
      })
    },
    setData(data) {
      data = cloneDeep(data)
      data.contentList = data.contentList.map(item => {
        return {
          id: item.topicId,
          topicName: item.topicName,
          topicIsFocus: item.topicIsFocus
        }
      })
      
      this.topic = data
    },
    handleSelectIcon(img) {
      this.topic.icon = img.pictureUrl
    },
    handleTopicTypeChange() {
      this.topic.contentList = []
    },
    handleTopicSourceChange() {
      this.topic.contentList = []
    },
    handleSelectVideoTopicEnd({shortVideoTopic}) {
      const idField = 'id'
      const selectedList = shortVideoTopic || []
      const originSelectList = this.topic.contentList || []
      const originSelectedListIndexed = originSelectList.reduce((result, item, index) => {
        result[item[idField]] = index
        return result
      }, {})
      const result = selectedList.filter(function(item) {
        return originSelectedListIndexed[item[idField]] === undefined
      })

      // 把新添加都加到后面
      this.topic.contentList = originSelectList.concat(result)
    },
    validate(data, cb) {
      const error = (msg) => {
        this.$message({
          type: 'error',
          message: msg
        })
      }
      this.$refs.dataForm.$refs.form.validate((valid) => {
        if (valid) {
          const defaultFocus = data.contentList.find(({topicIsFocus}) => topicIsFocus === 1)
          if (!defaultFocus) {
            return error('请设置默认落焦')
          }
          cb()
        } else {
          this.$message({
            type: 'error',
            message: '请把表单填写完整'
          })
        }
      })
    },
    handleSubmitAudit() {
      const data = cloneDeep(this.topic)
      data.iconType = undefined
      data.status = this.$consts.status.waiting
      this.validate(data, () => {
        this.submit(data)
      })
    },
    handleSaveDraft() {
      const data = cloneDeep(this.topic)
      data.iconType = undefined
      data.status = this.$consts.status.draft
      this.validate(data, () => {
        this.submit(data)
      })
    },
    submit(data) {
      return this.$service.topicConfigUpsert(this.parseDataToApi(data), '保存成功').then(() => {
        this.$emit('upsert-end')
      })
    },
    parseDataToApi(data) {
      const mode = this.mode
      data.contentList = data.contentList.map((item) => {
        return {
          topicId: item.id,
          topicName: item.topicName,
          topicIsFocus: item.topicIsFocus ? 1 : 0
        }
      })
      if (mode === 'replicate') {
        data.currentVersion = ''
      }
      return data
    },
  },
  created() {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon-img
  cursor pointer
  width 90px
  height 90px
  border 1px solid #ccc
</style>
