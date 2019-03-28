<template>
  <div>
    <RoleConfigList v-show='isShowList' ref="list" @open-add-page="openAddPage"></RoleConfigList>
    <RoleConfigAdd v-if='!isShowList' :editId="editId"  @open-list-page="openListPage" @go-back="goBack"></RoleConfigAdd>
  </div>
</template>
<script>
import RoleConfigAdd from './RoleConfigAdd'
import RoleConfigList from './RoleConfigList'
export default {
  components: {
    RoleConfigAdd,
    RoleConfigList
  },
  data () {
    return {
      isShowList: true,
      editId: undefined,
      index: undefined
    }
  },
  methods: {
    /**
       * 打开新增编辑页面
       */
    openAddPage (id) {
      this.editId = id
      this.isShowList = false
    },
    /**
       * 打开列表页面
       */
    openListPage () {
      this.isShowList = true
      this.$refs.list.fetchData()// 更新页面
    },
    /**
       * 新增编辑里面的返回事件
       */
    goBack () {
      this.isShowList = true
    }
  }
}
</script>
