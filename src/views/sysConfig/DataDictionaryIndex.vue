<template>
  <div>
    <DataDictionaryList v-show='isShowList' ref="list" @open-add-page="openAddPage"></DataDictionaryList>
    <DataDictionaryAdd v-if='!isShowList' :editData="editData"  @open-list-page="openListPage" @go-back="goBack"></DataDictionaryAdd>
  </div>
</template>
<script>
import DataDictionaryList from './DataDictionaryList'
import DataDictionaryAdd from './DataDictionaryAdd'
export default {
  components: {
    DataDictionaryList,
    DataDictionaryAdd
  },
  data () {
    return {
      isShowList: true,
      editData: null
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
