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
    handleClickBlock(panelIndex, blockIndex) {
      this.$emit('click-block', panelIndex, blockIndex)
    }
  }
}
</script>
<style scoped>
.cc-virtual-panel-group .el-tab-pane {
  overflow-x: auto;
}
</style>
