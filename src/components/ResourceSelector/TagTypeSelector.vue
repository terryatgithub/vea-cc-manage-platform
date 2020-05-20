<template>
  <div style="display: inline-block">
    <div class="selector-wrapper">
      <slot name="label">标签跳转分类</slot>
      <el-button :disabled="disabled" class="selector-button" type="primary" @click="isShowDialog = true">分类选择</el-button>
      <el-tag
        :closable="!disabled"
        @close="$emit('input')"
        v-if="value !== undefined">
        {{valueTagName}}</el-tag>
      <slot name="tip"><span style="margin-left: 10px">本字段仅用于配置客户端上标签详情页的默认落焦，与其他逻辑无关</span></slot>
    </div>
    <el-dialog @open="handleOpenDialog" title="标签跳转分类选择" :visible.sync="isShowDialog" width="800px">
      <CommonSelector
        v-model="inputValue"
        type="radio"
        :options="categoryEnums" />
      <span slot="footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleComfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CommonSelector from '@/components/CommonSelector'
export default {
  components: {
    CommonSelector
  },
  props: {
    value: String,
    disabled: Boolean
  },
  data () {
    return {
      isShowDialog: false,
      selectTags: [], // 选择的标签
      categoryEnums: [],
      inputValue: undefined
    }
  },
  computed: {
    valueTagName () {
      return (this.categoryEnums.find(item => item.value === this.value) || {}).label
    }
  },
  methods: {
    handleOpenDialog () {
      this.inputValue = this.value
    },
    handleComfirm () {
      this.$emit('input', this.inputValue)
      this.isShowDialog = false
    }
  },
  created () {
    this.$service.getFocusCategory().then(data => {
      this.categoryEnums = (data || []).map(item => {
        return { label: item.dictCnName, value: item.dictEnName }
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
.selector-wrapper
  margin-left 12px
  color #606266
.selector-button
  margin 0 8px
.tag-check
  min-width 95px
</style>
