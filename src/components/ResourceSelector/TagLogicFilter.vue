<template>
  <div class="cc-tag-logic-filter">
    <div class="tag-list">
      <div v-for="(tagList, listIndex) in tags" :key="listIndex">
        <el-button
          @click="handleAddTagStart(listIndex)"
          size="mini"
          type="primary">
          +选择标签
        </el-button>
        <el-tag
          v-for="(tag, index) in tagList"
          :key="tag.tagCode"
          type="primary"
          :closable="true"
          @close="handleRemoveTag(listIndex, index)">
          {{ tag.tagCnName }}
        </el-tag>
      </div>
    </div>
    <el-button v-if="!hiddenExtend" size="mini" type="primary" @click="handleAddTagStart(tags.length)">+且</el-button>

    <PanelTagSelector
      v-if="showPanelTagsDialog"
      @select-end="handleAddTagEnd"
      @select-cancel="handleAddTagCancel">
    </PanelTagSelector>
  </div>
</template>

<script>
import PanelTagSelector from '@/components/PanelTagSelector'
export default {
  components: {
    PanelTagSelector
  },
  data () {
    return {
      showPanelTagsDialog: false,
      activeTagListIndex: undefined,
      tags: [[]]
    }
  },
  props: {
    value: Array,
    hiddenExtend: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    reset () {
      this.tags = [[]]
    },
    emitInput () {
      const tagCodes = this.tags.reduce(function (result, item) {
        if (item.length > 0) {
          result.push(item.map(function (tag) { return tag.tagCode }).join(','))
        }
        return result
      }, [])
      this.$emit('get-tag-entity', this.tags)
      this.$emit('input', tagCodes)
    },
    handleRemoveTag (listIndex, index) {
      const list = this.tags[listIndex]
      list.splice(index, 1)
      if (list.length === 0 && listIndex !== 0) {
        this.tags.splice(listIndex, 1)
      }
      this.emitInput()
    },
    handleAddTagStart (index) {
      this.activeTagListIndex = index
      this.showPanelTagsDialog = true
    },
    handleAddTagCancel () {
      this.showPanelTagsDialog = false
    },
    handleAddTagEnd (tags) {
      const index = this.activeTagListIndex
      const currentTagList = this.tags[index]
      if (!currentTagList) {
        this.$set(this.tags, index, tags)
      } else {
        this.$set(this.tags, index, currentTagList.concat(tags))
      }
      // emit
      this.emitInput()
      this.showPanelTagsDialog = false
    }
  },
  created () {
  }
}
</script>
<style scoped>
.cc-tag-logic-filter {
  width: 500px;
}
.cc-tag-logic-filter .el-tag {
  margin-right: 10px
}
</style>
