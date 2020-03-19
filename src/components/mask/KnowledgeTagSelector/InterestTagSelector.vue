<template>
  <el-dialog
    title="选择标签"
    :fullscreen="true"
    :show-close="false"
    :modal="false"
    :modal-append-to-body="true"
    class="cc-media-tags-selector"
    :visible="true">
    <el-button type="primary" @click="handleSelectEnd">
      确定
    </el-button>
    <el-button type="warning" @click="handleSelectCancel">
      关闭
    </el-button>
    <div style="margin-top: 10px; display: block; min-height: 30px">
        <span style="float: left">已选择&nbsp; </span>
        <el-tag
          v-for="(item) in selectedTags"
          :key="item.tagCode"
          :closable="true"
          @close="handleRemoveTag(item)"
        >
            {{ item.tagCnName }}
        </el-tag>
    </div>
    <MediaTagSelector :selection-type="selectionType" ref="mediaTag" @get-tag-nodes="handleInputTags" />
  </el-dialog>
</template>

<script>
import MediaTagSelector from './MediaTagSelector'
export default {
  components: {
    MediaTagSelector
  },
  data () {
    return {
      selectedTags: [],
      removingTags: []
    }
  },
  props: ['selectionType'],
  methods: {
    handleSelectEnd () {
      if (this.selectedTags.length === 0) {
        return this.$message({
          type: 'error',
          message: '请选择至少一个标签'
        })
      }
      this.$emit('select-end', this.selectedTags.slice())
    },
    handleSelectCancel () {
      this.$emit('select-cancel')
    },
    handleRemoveTag (tag) {
      const index = this.selectedTags.findIndex(function (item) {
        return item.tagCode === tag.tagCode
      })
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      }
      this.$refs.mediaTag.handleRemoveTag(tag)
    },
    handleInputTags (tags) {
      this.selectedTags = tags
    }
  }
}
</script>
<style scoped>
.cc-media-tags-selector >>> .el-tag {
  margin-right: 10px
}
.cc-media-tags-selector >>> .el-dialog__body {
  overflow: auto;
}
</style>
