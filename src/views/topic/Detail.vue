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
              <i class="el-icon-edit">话题类型</i>
            </div>
            <Enum label="话题类型" @change="handleTopicTypeChange" :options="$consts.topicTypesOptions" v-model="topic.type" />
            <div class="form-legend-header">
              <i class="el-icon-edit">话题配置</i>
            </div>
            <String label="话题名" prop="topicName" v-model="topic.topicName" />
            <String v-if="topic.type === 1" prop="recommendSign" label="推荐流标记" v-model="topic.recommendSign" />
            <Enum label="话题icon" type="radio" :options="iconOptions" v-model="topic.iconType">
              <div v-if="topic.iconType === 'custom'">
                <GlobalPictureSelector
                  resolution="30*30"
                  @select-end="handleSelectIcon">
                  <img class="icon-img" v-if="topic.icon" :src="topic.icon" />
                  <div class="icon-img" v-else>
                  </div>
                </GlobalPictureSelector>
              </div>
            </Enum>
            <Enum label="内容源" :confirm="{title: '提示', content: '切换源将清空短视频，确定切换?'}" type="radio" :options="$consts.sourceOptions" :value="topic.source" @input="topic.source = $event, topic.contentList = []" />
            <template v-if="topic.type === 2">
              <div class="form-legend-header">
                <i class="el-icon-edit">短视频筛选</i>
              </div>
              <Any label="短视频" :readonly="mode === 'read'">
                <div slot="edit">
                  <ResourceSelector
                    :source="topic.source"
                    :selectors="['shortVideo']"
                    :disable-partner="true"
                    :auto-fetch-selectors="['shortVideo']"
                    selection-type="multiple"
                    @select-end="handleSelectVideoEnd">
                    <el-button type="primary" plain>
                      选择短视频
                    </el-button>
                  </ResourceSelector>
                  <OrderableTable v-model="topic.contentList" :header="shortVideoListHeader" />
                </div>
                <div slot="read">
                  <OrderableTable :readonly="true" :hide-action="true" v-model="topic.contentList" :header="shortVideoListHeader" />
                </div>
              </Any>
            </template>
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
      resourceName: '短视频话题',
      versionList: [],
      iconOptions: [
        {
          label: '默认icon',
          value: 'default'
        },
        {
          label: '自定义icon',
          value: 'custom'
        }
      ],
      shortVideoListHeader: [
        {
          label: '短视频ID',
          prop: 'sCoocaaMId'
        },
        {
          label: '短视频标题',
          prop: 'sShowTitle'
        },
        {
          label: '内容源',
          prop: 'source',
          render: (h, {row}) => {
            return this.$consts.partnerText[row.source]
          }
        },
        {
          label: '短视频时长',
          prop: 'mDuration',
          render: (h, {row}) => {
            const mDuration = row.mDuration
            const hour = Math.floor(mDuration/3600)
            const min = Math.floor((mDuration - 3600 * hour)/60)
            const sec = mDuration - 3600 * hour - 60 * min
            return `${hour}小时${min}分${sec}秒`
          }
        }
      ],
      topic: {
        id: undefined,
        type: this.$consts.topicTypesOptions[0].value,
        topicName: '',
        source: 'o_tencent',
        iconType: 'default',
        icon: '',
        status: undefined,
        contentList: [],
        recommendSign: undefined,
        currentVersion: '',
        duplicateVersion: undefined
      },
      rules: {
        topicName: [
          {required: true, message: '请输入话题标题'}
        ],
        recommendSign: [
          {required: true, message: '请输入标记'}
        ]
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
          type: 'topic',
          menuElId: 'topic',
          version: topic.currentVersion,
          status: topic.status
        }
      }
    }
  },
  methods: {
    fetchData(version) {
      this.$service.topicGetDetail({ id: this.id, version }).then(data => {
        this.setData(data)
      })
    },
    setData(data) {
      const topic = cloneDeep(data)
      const contentList = topic.contentList || []
      topic.contentList = contentList.map(item => {
        const positiveInfo = item.positiveInfo ? JSON.parse(item.positiveInfo) : {}
        return {
          sShowThumb: item.thumb,
          sShowTitle: item.title,
          sCoocaaMId: item.shortVideoId,
          mDuration: positiveInfo.mDuration,
          source: positiveInfo.source
        }
      })
      if (topic.icon) {
        topic.iconType = 'custom'
      } else {
        topic.iconType = 'default'
      }
      this.topic = topic
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
    handleSelectVideoEnd({shortVideo}) {
      const idField = 'sCoocaaMId'
      const selectedList = shortVideo || []
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
      this.$refs.dataForm.$refs.form.validate((valid) => {
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
      return this.$service.topicUpsert(this.parseDataToApi(data), '保存成功').then(() => {
        this.$emit('upsert-end')
      })
    },
    parseDataToApi(data) {
      const mode = this.mode
      data.contentList = data.contentList.map((item) => {
        return {
          shortVideoId: item.sCoocaaVId,
          title: item.sShowTitle,
          thumb: item.sShowThumb,
          positiveInfo: JSON.stringify({
            mDuration: item.mDuration,
            source: item.source
          })
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
