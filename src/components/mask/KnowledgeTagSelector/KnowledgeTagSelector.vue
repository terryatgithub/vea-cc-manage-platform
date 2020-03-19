<template>
  <div style="display: inline-block">
    <div @click="handleAddTagStart">
      <slot>
        <el-button :disabled="disabled" type="primary" plain>{{ title || '选择知识'}}</el-button>
      </slot>
    </div>
    <InterestTagSelector
      v-if="showTagsDialog"
      :selection-type="selectionType"
      @select-end="handleAddTagEnd"
      @select-cancel="handleAddTagCancel"
    />
  </div>
</template>

<script>
import InterestTagSelector from './InterestTagSelector'
export default {
  components: {
    InterestTagSelector
  },
  data () {
    return {
      showTagsDialog: false
    }
  },
  props: ['title', 'selectionType', 'disabled'],
  methods: {
    handleAddTagStart () {
      if (this.disabled) {
        return
      }
      this.showTagsDialog = true
    },
    handleAddTagEnd (data) {
      this.$emit('select-end', data)
      this.showTagsDialog = false
    },
    handleAddTagCancel () {
      this.showTagsDialog = false
    }
  }
}
</script>

<style>

</style>
