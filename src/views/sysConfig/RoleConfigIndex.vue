<template>
  <div>
    <RoleConfigList v-show='isShowList' ref="list" @openAddPage="openAddPage"></RoleConfigList>
    <!--<RoleConfigAdd v-if='!isShowList' :editId="editId"  @openListPage="openListPage" @go-back="goBack"></RoleConfigAdd>-->
    <RoleConfigAdd v-if='!isShowList' :editData="editData"  @openListPage="openListPage" @go-back="goBack"></RoleConfigAdd>
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
      editData: undefined,
      index: undefined
    }
  },
  methods: {
    /**
       * 打开新增编辑页面
       */
    openAddPage (row) {
      this.editData = row
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
