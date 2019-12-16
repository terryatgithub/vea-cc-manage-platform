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
              :show-title="showTitle"
              @click-block="handleClickBlock(index, $event)"
            ></cc-virtual-panel>
          </el-tab-pane>
        </el-tabs>
      </template>
      <cc-virtual-panel
        v-else
        :blocks="panel.panelList[0].blocks"
        :ratio="ratio"
        :show-title="showTitle"
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
  props: ['panel', 'ratio', 'active', 'showTitle'],
  methods: {
    handleClickBlock (panelIndex, blockIndex) {
      this.$emit('click-block', panelIndex, blockIndex)
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
