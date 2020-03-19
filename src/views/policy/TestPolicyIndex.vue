<template>
  <TabPage>
    <PolicyList
      v-show="isShowList"
      ref="list"
      :list-props="listProps"
      :policyGroupCategory="2"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
      @delete="handleDelete"
    />
    <Policy
      v-if="!isShowList"
      :content-props="contentProps"
      :id="id"
      :policyGroupCategory="2"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack"/>
  </TabPage>
</template>
<script>
import TabPage from '@/components/TabPage'
import PolicyList from './PolicyList'
import Policy from './Policy'
const ID_FIELD = 'id'
export default {
  components: {
    TabPage,
    PolicyList,
    Policy
  },
  data () {
    return {
      isShowList: true,
      id: null,
      mode: 'create',
      version: undefined
    }
  },
  props: ['listProps', 'contentProps'],
  computed: {
  },
  methods: {
    handleCreate () {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit (item) {
      this.id = item[ID_FIELD]
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead (item, version) {
      this.id = item[ID_FIELD]
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleCopy (item) {
      this.id = item[ID_FIELD]
      this.mode = 'copy'
      this.isShowList = false
    },
    handleDelete (selected) {
      this.$service.policyGroupRemove({
        id: selected.map(item => item[ID_FIELD]).join(',')
      }, '删除成功')
        .then(() => {
          this.$refs.list.fetchData()
        })
    },
    handleUpsertEnd (onlyRefreshList) {
      this.$refs.list.fetchData()// 更新页面
      if (!onlyRefreshList) {
        this.isShowList = true
        this.mode = 'list'
        this.version = undefined
      }
    },
    goBack () {
      this.isShowList = true
      this.mode = 'list'
    }
  }
}
</script>
