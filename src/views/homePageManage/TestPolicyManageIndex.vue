<template>
  <div>
    <TestPolicyManageList
      v-show='isShowList'
      ref="list"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <TestPolicyManageInfo
      v-if='!isShowList'
      :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack">
    </TestPolicyManageInfo>
  </div>
</template>
<script>
import TestPolicyManageInfo from './TestPolicyManageInfo'
import TestPolicyManageList from './TestPolicyManageList'
export default {
  components: {
    TestPolicyManageInfo,
    TestPolicyManageList
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
      this.id = item.policyId
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(item, version) {
      this.id = item.policyId
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleDelete(selected) {
      this.$service
        .policyConfRemove({
          id: selected.map(item => item.policyId).join(',')
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
      this.version = undefined
    }
  }
}
</script>
