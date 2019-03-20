<template>
  <div>
    <UserConfigList v-show='isShowList' ref="list" @openAddPage="openAddPage"></UserConfigList>
    <UserConfigAdd v-if='!isShowList' :editId="editId" @openListPage="openListPage" @go-back="goBack"></UserConfigAdd>
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
<<<<<<< HEAD
       this.editId = userId
       this.isShowList = false
=======
      this.editId = userId
      debugger
      this.isShowList = false
>>>>>>> 2f7a89ec69ebb40f5583337752369cb0e931c649
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
