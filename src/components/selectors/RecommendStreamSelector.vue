<template>
    <div>
      <el-form-item :label="title" prop="mediaAutomationBlockRls.mediaAutomationId">
        <el-button type="primary" @click="isVisiableRecom = true" :disabled="disabled">选择推荐流</el-button>
        <el-tag
          v-if="value"
          type="primary"
          class="margin-left-10"
          :closable="!disabled"
          @close="handleDelStreamTag"
        >
          {{value}}
        </el-tag>
      </el-form-item>

      <!-- 推荐流弹框  -->
      <el-dialog title="推荐流" :visible.sync="isVisiableRecom" width="40%" @open="fetchData" class="dia-log">
        <h4>运营指定影片流</h4>
        <el-tag
          v-for="tag in normalStreamTags"
          :key="tag.id"
          size="medium"
          class="recom-tag cursor-tip"
          @click="handleSelectTag(tag)"
        >{{tag.name}}</el-tag>
        <!-- <h4>规则筛选影片流</h4>
        <el-tag
          v-for="tag in standardStreamTags"
          :key="tag.id"
          size="medium"
          class="recom-tag cursor-tip"
          @click="handleSelectTag(tag)"
        >{{tag.name}}</el-tag> -->
      </el-dialog>
      <!-- 推荐流弹框 end -->
    </div>
  </template>

<script>
import { cloneDeep } from 'lodash'
export default {
  components: {
  },
  data () {
    return {
      isVisiableRecom: false,
      recomStreamTags: [],
      mediaAutomationId: undefined,
      normalStreamTags: [],
      standardStreamTags: [],
      title: ''
    }
  },
  props: ['value', 'disabled', 'source', 'resolution', 'show', 'type'],
  methods: {
    handleDelStreamTag () {
      this.$emit('del-select')
    },
    fetchData () {
      const resolution = this.resolution
      let params = {
        page: 1,
        rows: 100,
        source: this.source || undefined,
        resolution
      }
      this.$service.getMediaAutomationDataList(params).then(data => {
        this.recomStreamTags = data.rows.filter(item => {
          return item.openStatus === 1 // 流状态开启
        })
        // 分类显示
        let normal = []
        let standard = []
        this.recomStreamTags.forEach(streamTag => {
          const copyTag = cloneDeep(streamTag)
          if (streamTag.type === 'normal') {
            normal.push(copyTag)
          } else {
            standard.push(copyTag)
          }
        })
        this.normalStreamTags = normal
        this.standardStreamTags = standard
        // 无匹配
        if (this.recomStreamTags.length === 0) {
          this.$message('流状态关闭，尺寸不匹配，或者暂无该内容源的推荐流')
        }
      })
    },
    handleSelectTag (tag) {
      this.$emit('select-end', tag)
      this.isVisiableRecom = false
    }
  },
  created () {
  },
  mounted () {
    if (this.show) {
      this.title = '推荐流选择'
    } else {
      this.title = ''
    }
  }
}
</script>

  <style lang="stylus" scoped>
  .recom-tag
    margin-right 10px
    margin-bottom 10px
    font-size 14px
  .cursor-tip
    cursor pointer
  .margin-left-10
    margin-left 10px
  .dia-log >>> .el-dialog__body
    padding-top 0px
  h4
    margin-top 0px
  </style>
