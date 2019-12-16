<template>
  <TabPage>
    <AlbumPannelInfoList
      v-show='isShowList'
      ref="list"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
      @delete="handleDelete"
    />
    <PanelInfo
      v-if='!isShowList'
      :id="id"
      :panel-data-type="3"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack">
    </PanelInfo>
  </TabPage>
</template>
<script>
import TabPage from '@/components/TabPage'
import PanelInfo from '../panelInfo/PanelInfo'
import AlbumPannelInfoList from './AlbumPannelInfoList'
const idField = 'pannelGroupId'
export default {
  components: {
    TabPage,
    PanelInfo,
    AlbumPannelInfoList
  },
  data () {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined
    }
  },
  methods: {
    handleCreate () {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit (item) {
      this.id = item[idField]
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead (item, version) {
      this.id = item[idField]
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleCopy (item) {
      this.id = item[idField]
      this.mode = 'copy'
      this.isShowList = false
    },
    handleUpsertEnd (onlyRefreshList) {
      this.$refs.list.fetchData()// 更新页面
      if (!onlyRefreshList) {
        this.isShowList = true
        this.mode = 'list'
        this.version = undefined
      }
    },
    handleDelete (selected) {
      this.$service.panelRemove({
        id: selected.map(item => item.pannelGroupId).join(',')
      }, '删除成功')
        .then(() => {
          this.$refs.list.fetchData()
        })
    },
    goBack () {
      this.isShowList = true
      this.mode = 'list'
      this.version = undefined
    }
  }
}
</script>
<style lang="stylus" scoped>
.resource-manager-wrapper
  height 100%
  overflow auto
</style>
