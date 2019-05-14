<template>
  <div class="el-tab-pane-preview">
    <FilmDetailPageAdd
      v-if="tabParentType==='special'&&id!==undefined"
      :editId="id"
      :initMode="mode"
      :duplicateVersionVersion = "version"
      @open-list-page="handleUpsertEnd" 
      @go-back="goBack"
    />
      <BusinessTabInfo 
      v-if="tabParentType==='biz'&&id!==undefined"
        @upsert-end="handleUpsertEnd"
       :id="id" 
      :init-mode="mode"
      :version="version"
      @go-back="goBack">
    </BusinessTabInfo>
      <TabInfo
      v-if="tabParentType==='home'&&id!==undefined"
      :id="id"
      :init-mode="mode"
      @go-back="goBack"
        @upsert-end="handleUpsertEnd"
    ></TabInfo>
  </div>
</template>
<script>
 import FilmDetailPageAdd from  './../panelManage/FilmDetailPageAdd'
 import BusinessTabInfo from './../panelManage/BusinessTabInfo'
 import TabInfo from './../tabInfo/TabInfo.vue'
export default {
  components: {
    FilmDetailPageAdd,
    BusinessTabInfo,
    TabInfo
  },
  props: ['row'],
  data() {
    return {
      id: undefined,
      mode: 'read',
      version: undefined,
      tabParentType: undefined
    }
  },
  methods: {
     goBack () {
      this.$emit("go-back")
    },
    handleUpsertEnd(){
      this.$emit("upsert-end")
    }
  },
  created () {
    let row = this.row
    this.id = row.resourceId
    this.tabParentType = row.tabParentType
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

