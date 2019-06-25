<template>
  <div>
    <CommonPannelUserList
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
      :panel-data-type="1"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack">
    </PanelInfo>
  </div>
</template>
<script>
import PanelInfo from './../panelInfo/PanelInfo'
import CommonPannelUserList from './CommonPannelUserList'
const idField = 'pannelGroupId'
export default {
  components: {
    PanelInfo,
    CommonPannelUserList
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
    handleUpsertEnd (onlyRefreshList) {
      this.$refs.list.fetchData()// 更新页面
      if (!onlyRefreshList) {
        this.isShowList = true
        this.mode = 'list'
        this.version = undefined
      }
    },
    handleCreate() {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit(id) {
      this.id = id
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(id, version) {
      this.id = id
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleCopy(id) {
      this.id = id
      this.mode = 'copy'
      this.isShowList = false
    },
    /**
     * 新增编辑里面的返回事件
    */
    goBack () {
      this.isShowList = true
      this.mode = 'list'
      this.version = undefined
    }
  }
}
</script>
