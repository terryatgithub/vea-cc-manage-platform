<template>
  <div v-if="id" class="chart-viewer">
    <div @click="handleShowChart">
      <slot></slot>
    </div>
    <BroadcastSimpleData
      v-if="mountDialog"
      :show.sync="showChart"
      :id="id"
      :isRealTime="isRealTime"
    />
  </div>
</template>

<script>
import BroadcastSimpleData from '@/views/blockInfo/BroadcastSimpleData'
export default {
  components: {
    BroadcastSimpleData
  },
  props: ['id', 'isRealTime'],
  data () {
    return {
      mountDialog: false,
      showChart: false
    }
  },
  computed: {
  },
  methods: {
    handleShowChart () {
      if (!this.mountDialog) {
        this.mountDialog = true
      }
      this.$nextTick(() => {
        this.showChart = true
        this.$sendEvent({
          type: 'broadcast_data_search'
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
