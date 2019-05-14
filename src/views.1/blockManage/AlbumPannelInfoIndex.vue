<template>
  <div>
    <AlbumPannelInfoList
      v-show='isShowList' 
      ref="list" 
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
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
  </div>
</template>
<script>
import PanelInfo from './PanelInfo'
import AlbumPannelInfoList from'./AlbumPannelInfoList'
const idField = 'pannelGroupId'
export default {
  components: {
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
    handleCreate() {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit(item) {
      this.id = item[idField]
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(item, version) {
      this.id = item[idField]
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleCopy(item) {
      this.id = item[idField]
      this.mode = 'copy'
      this.isShowList = false
    },
    handleUpsertEnd () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
      this.mode = 'list'
      this.version = undefined
    },
    goBack () {
     this.isShowList = true
     this.mode = 'list'
     this.version = undefined
    }
  }
}
</script>