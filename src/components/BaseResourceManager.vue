<template>
  <div>
    <ResourceList
      v-show="isShowList"
      ref="list"
      @create="handleCreate"
      @delete="handleDelete"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
    />
    <ResourceContent
      v-if="!isShowList"
      :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack"
    />
  </div>
</template>
<script>
export default {
  components: {
    ResourceList: () => {},
    ResourceContent: () => {}
  },
  data() {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined
    }
  },
  computed: {
    resourceInfo() {
      return {
        type: 'resource',
        idField: 'id',
      }
    }
  },
  methods: {
    handleCreate() {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit(item) {
      this.id = item[this.resourceInfo.idField]
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(item, version) {
      this.id = item[this.resourceInfo.idField]
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleDelete(selected) {
      const resourceInfo = this.resourceInfo
      const idField = resourceInfo.idField
      this.$service
        .deleteResource({
          type: resourceInfo.type,
          id: selected.map(item => item[idField]).join(',')
        },'删除成功')
        .then(() => {
          this.$refs.list.fetchData()
        })
    },
    handleCopy(item) {
      this.id = item[this.resourceInfo.idField]
      this.mode = 'copy'
      this.isShowList = false
    },
    handleUpsertEnd() {
      this.isShowList = true
      this.$refs.list.fetchData() 
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