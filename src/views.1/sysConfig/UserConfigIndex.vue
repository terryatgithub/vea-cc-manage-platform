<template>
  <div>
    <UserConfigList v-show='isShowList' ref="list" @open-add-page="openAddPage"></UserConfigList>
    <UserConfigAdd v-if='!isShowList' :editId="editId" @open-list-page="openListPage" @go-back="goBack"></UserConfigAdd>
  </div>
</template>
<script>
import UserConfigAdd from './UserConfigAdd'
import UserConfigList from './UserConfigList'
export default {
  components: {
    UserConfigAdd,
    UserConfigList
  },
  data () {
    return {
      isShowList: true,
      editId: null
    }
  },
  methods: {
    /**
     * 打开新增编辑页面
    */
    openAddPage (userId) {
      this.editId = userId
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
