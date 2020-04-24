<template>
  <div v-if="panelGroup" class="chart-viewer">
    <div @click="handleShowChart" >
      <slot></slot>
    </div>
    <AnalyzeDmpDataDialog
      v-if="mountDialog"
      :show.sync="showChart"
      :parentId="panelGroup.pannelGroupId"
      :position="position"
      :isRealTime="isRealTime"/>
  </div>
</template>

<script>
import AnalyzeDmpDataDialog from '@/views/panelInfo/AnalyzeDmpDataDialog'
export default {
  components: {
    AnalyzeDmpDataDialog
  },
  props: ['panelGroup', 'panelIndex', 'blockIndex', 'isRealTime'],
  data () {
    return {
      mountDialog: false,
      showChart: false
    }
  },
  computed: {
    panelGroupId () {
      return this.panelGroup.pannelGroupId
    },
    position () {
      const { panelGroup, panelIndex, blockIndex } = this
      return panelGroup.parentType === 'group'
        ? panelIndex + '-' + blockIndex
        : blockIndex
    }
  },
  methods: {
    handleShowChart () {
      if (!this.mountDialog) {
        this.mountDialog = true
      }
      this.$nextTick(() => {
        this.showChart = true
        this.$sendEvent({
          type: 'block_data_show',
          payload: {
            type: 'dmp'
          }
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.chart-viewer
  display inline-block
</style>
