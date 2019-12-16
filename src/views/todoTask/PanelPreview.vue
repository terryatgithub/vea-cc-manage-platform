<template>
 <div class="el-tab-pane-preview">
        <MarkPanelInfo
      v-if="pannelType===8"
       :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="$emit('upsert-end')"
      @go-back="goBack">
    </MarkPanelInfo>
    <PanelInfo
       v-if="pannelType===1"
      :id="id"
      :panel-data-type="1"
      :init-mode="mode"
      :version="version"
      @upsert-end="$emit('upsert-end')"
      @go-back="goBack">
    </PanelInfo>
    <PanelInfo
       v-if="pannelType===3"
      :id="id"
      :panel-data-type="3"
      :init-mode="mode"
      :version="version"
      @upsert-end="$emit('upsert-end')"
      @go-back="goBack">
    </PanelInfo>
    <PrivatePannelInfo
    v-if="pannelType===9||pannelType===10||pannelType===5"
       :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="$emit('upsert-end')"
      @go-back="goBack">
    </PrivatePannelInfo>
  </div>
</template>
<script>
import PanelInfo from './../panelInfo/PanelInfo.vue' // 常规运营
import MarkPanelInfo from './../blockManage/MarkPanelInfo' // 为功能版块
import PrivatePannelInfo from './../blockManage/PrivatePannelInfo.vue' // 专属影院
export default {
  components: {
    PanelInfo,
    MarkPanelInfo,
    PrivatePannelInfo
  },
  props: ['row'],
  data () {
    return {
      id: undefined,
      mode: 'read',
      version: undefined,
      pannelType: undefined
    }
  },
  methods: {
    goBack () {
      this.$emit('go-back')
    }
  },
  created () {
    let row = this.row
    this.id = row.resourceId
    this.pannelType = row.pannelType
    this.version = row.resourceVersion
  }
}
</script>
<style lang="stylus" scoped>
.el-tab-pane-preview >>> .page-content-wrapper {
    position: relative;
    width: 100%;
    top: 0;
}
</style>
