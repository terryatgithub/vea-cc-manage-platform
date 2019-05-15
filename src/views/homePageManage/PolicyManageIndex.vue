<template>
  <div>
    <PolicyManageList 
      v-show='isShowList' 
      ref="list" 
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
    />
    <PolicyManageInfo 
      v-if='!isShowList' 
      :id="id" 
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </PolicyManageInfo>
  </div>
</template>
<script>
import PolicyManageInfo from './PolicyManageInfo'
import PolicyManageList from './PolicyManageList'
export default {
  components: {
    PolicyManageInfo,
    PolicyManageList
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