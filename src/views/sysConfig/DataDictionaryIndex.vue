<template>
  <div>
    <DataDictionaryList v-show='isShowList' ref="list" @openAddPage="openAddPage"></DataDictionaryList>
    <DataDictionaryAdd v-if='!isShowList' :editId="editId" @openListPage="openListPage" @go-back="goBack"></DataDictionaryAdd>
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
      editId: null
    }
  },
  methods: {
    /** 
     * 打开新增编辑页面
    */
    openAddPage (dictId) {
       this.editId = dictId
       this.isShowList = false
    },
     /** 
     * 打开列表页面
    */
    openListPage () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
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
