<template>
  <div>
    <el-form-item label="开启个性化推荐">
      <el-switch
        :disabled="disabled"
        :value="!!value.flagSetRec" 
        @input="hanleSwitchInput"
        active-color="#13ce66"
        inactive-color="grey"
      >
      </el-switch>
    </el-form-item>
    <div v-if="!!value.flagSetRec">
    <el-form-item label="推荐流选择" prop="mediaAutomationBlockRls.mediaAutomationId">
      <el-button type="primary" @click="isVisiableRecom = true" :disabled="disabled">选择推荐流</el-button>
      <el-tag
        v-if="value.mediaAutomationBlockRls.mediaAutomationId"
        type="primary"
        class="margin-left-10"
        :closable="!disabled"
        @close="handleDelStreamTag"
      >
        {{value.mediaAutomationBlockRls.mediaAutomationId}}
      </el-tag>
    </el-form-item>
    <el-form-item label="刷新机制" prop="mediaAutomationBlockRls.refreshCal">
      <InputPositiveInt 
        v-model="value.mediaAutomationBlockRls.refreshCal" 
        class="flash-count-input"
        :disabled="disabled"
      />
      客户端曝光X次之后刷新推荐位
    </el-form-item>
    </div>
    <!-- 推荐流弹框  -->
    <el-dialog title="推荐流" :visible.sync="isVisiableRecom" width="40%" @open="$emit('open-dialog')">
      <el-tag
        v-for="(tag, index) in recomStreamTags"
        :key="index"
        size="medium"
        class="recom-tag cursor-tip"
        @click="$emit('select-end', index)"
      >{{tag.name}}</el-tag>
    </el-dialog>
    <!-- 推荐流弹框 end -->
  </div>
</template>

<script>
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    InputPositiveInt
  },
  data() {
    return {
      isVisiableRecom: false
    }
  },
  props: ['value', 'disabled', 'recomStreamTags', 'rules'],
  watch: {
    value: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {
    handleDelStreamTag () {
      this.value.mediaAutomationBlockRls.mediaAutomationId = undefined
    },
    hanleSwitchInput (val) {
      this.value.flagSetRec = val ? 1 : 0
      this.$emit('flag-set-change', val)
    }
  },
  created() {
  }
}
</script>

<style lang="stylus" scoped>
.flash-count-input
  width 100px !important
.recom-tag
  margin-right 10px
  font-size 14px
.cursor-tip
  cursor pointer
.margin-left-10
  margin-left 10px
</style>