<template>
  <div>
    <GlobalCornerIconTypeList 
      v-show="isShowList" 
      ref="list" 
      @create="handleCreate"
      @edit="handleEdit"
      @read="handleRead"
      @delete="handleDelete"/>
    <GlobalCornerIconType
      v-if="!isShowList"
      :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack"/>
  </div>
</template>
<script>
import GlobalCornerIconTypeList from './GlobalCornerIconTypeList'
import GlobalCornerIconType from './GlobalCornerIconType'
export default {
  components: {
    GlobalCornerIconTypeList,
    GlobalCornerIconType
  },
  data() {
    return {
      isShowList: true,
      mode: 'list',
      id: undefined,
      version: undefined
    }
  },
  methods: {
    handleCreate() {
      this.mode = 'create'
      this.id = undefined
      this.isShowList = false
    },
    handleEdit(row) {
       this.id = row.typeId
       this.mode = 'edit'
       this.isShowList = false
    },
    handleRead(row){
       this.id = row.typeId
       this.mode = 'read'
       this.isShowList = false
    },
    handleDelete(selected) {
      this.$service
        .globalCornerIconTypeBatchDel({ 
          id: selected.map(item => item.typeId).join(',')
        },'删除成功')
        .then(_ => {
          this.$refs.list.fetchData()
        })
    },
    handleUpsertEnd() {
      this.isShowList = true
      this.$refs.list.fetchData() //更新页面
      this.mode = 'list'
      this.version = undefined
    },
    goBack() {
      this.isShowList = true
      this.mode = 'list'
      this.version = undefined
    }
  }
}
</script>