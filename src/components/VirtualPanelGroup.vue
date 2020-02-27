<template>
  <div class="cc-virtual-panel-group">
    <template v-if="panel.panelList">
      <template v-if="panel.parentType === 'group'">
        <el-tabs type="card" :value="active + ''" @input="$emit('activate', $event)">
          <el-tab-pane v-for="(item, index) in panel.panelList" :key="index" :name="index + ''">
            <span slot="label">{{ item.panelTitle }}</span>
            <cc-virtual-panel
              :blocks="item.blocks"
              :ratio="ratio"
              @copy-block="handleCopyBlock(index, $event)"
              @exchange-block="handleExchangeBlock(index, $event)"
              :show-title="showTitle"
              :show-exchange-tool="showExchangeTool"
              :disable-exchange-tool="disableExchangeTool"
              @click-block="handleClickBlock(index, $event)"
            ></cc-virtual-panel>
          </el-tab-pane>
        </el-tabs>
      </template>
      <cc-virtual-panel
        v-else
        :blocks="panel.panelList[0].blocks"
        @copy-block="handleCopyBlock(0, $event)"
        @exchange-block="handleExchangeBlock(0, $event)"
        :ratio="ratio"
        :show-title="showTitle"
        :show-exchange-tool="showExchangeTool"
        :disable-exchange-tool="disableExchangeTool"
        @click-block="handleClickBlock(0, $event)"
      ></cc-virtual-panel>
    </template>
    <div v-else class="skeleton">
      <div class="skeleton__block"></div>
      <div class="skeleton__block"></div>
      <div class="skeleton__block"></div>
      <div class="skeleton__block"></div>
    </div>
    <slot name="stat"></slot>
  </div>
</template>

<script>
import VirtualPanel from './VirtualPanel'
export default {
  components: {
    'cc-virtual-panel': VirtualPanel
  },
  props: ['panel', 'ratio', 'active', 'showTitle', 'showExchangeTool'],
  computed: {
    disableExchangeTool () {
      return this.isForbiddenType || this.isForbiddenStatus
    },
    isForbiddenType () {
      const panel = this.panel
      const parentType = panel.parentType
      const isRankingPanel = panel.pannelList[0].rankIsOpen === 1
      const isMediaRulePanel = panel.pannelList[0].fillType === 3
      return parentType === 'function' || parentType === 'subscribe' || isRankingPanel || isMediaRulePanel
    },
    isForbiddenStatus () {
      const status = this.panel.pannelStatus
      return !(status === 2 || status === 4)
    },
    errorMsg () {
      return this.isForbiddenStatus
        ? '只有审核通过和草稿状态的版块支持移动待'
        : '不能移动排行榜版块、影片规则筛选版块、预约版块、功能版块里的推荐位'
    }
  },
  methods: {
    handleClickBlock (panelIndex, blockIndex) {
      this.$emit('click-block', panelIndex, blockIndex)
    },
    handleCopyBlock (groupIndex, blockIndex) {
      if (this.disableExchangeTool) {
        return this.$message.error(this.errorMsg)
      }
      this.$emit('copy-block', groupIndex, blockIndex)
    },
    handleExchangeBlock (groupIndex, blockIndex) {
      if (this.disableExchangeTool) {
        return this.$message.error(this.errorMsg)
      }
      this.$emit('exchange-block', groupIndex, blockIndex)
    }
  }
}
</script>
<style lang="stylus" scoped>
.cc-virtual-panel-group .el-tab-pane
  overflow-x auto
.skeleton
  width 100%
  height 100%
  display flex
.skeleton__block
  height 200px
  width 25%
  margin 10px
  display inline-block
  background rgb(194, 207, 214)
  background-image linear-gradient(90deg,rgba(255, 255, 255, 0.15) 25%, transparent 25%)
  background-size 20rem 20rem
  animation skeleton-stripes 1s linear infinite
@keyframes skeleton-stripes
    from
      background-position 0 0
    to
      background-position 20rem 0

</style>
