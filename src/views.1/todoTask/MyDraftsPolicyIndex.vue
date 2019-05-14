<template>
  <div>
    <MyDraftsPolicy 
      v-show="isShowList" 
      ref="list" 
      @read="handleRead"
     >
     </MyDraftsPolicy>
     <PolicyManagePreview 
    v-if='!isShowList' 
    :editId="id" 
    :version='version'
    @upsert-end="handleUpsertEnd" 
    @go-back="goBack"> 
    </PolicyManagePreview>
  </div>
</template>
<script>
 import PolicyManagePreview from  './../homePageManage/PolicyManagePreview.vue' //常规运营
 import MyDraftsPolicy from './MyDraftsPolicy.vue'
 // pannelType 1 为 常规运营 8 为功能版块 3 为业务专辑 9 专属影院
export default {
  components: {
    MyDraftsPolicy,
    PolicyManagePreview
  },
  data() {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined,
      pannelType: undefined
    };
  },
  methods: {
    handleUpsertEnd () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
      this.mode = 'list'
      this.version = undefined
    },
    handleRead(row) {
      this.id = row.policyId
      this.mode = 'read'
      this.version = row.currentVersion
      this.isShowList = false
    },
    /**
     * 新增编辑里面的返回事件
    */
    goBack () {
     this.isShowList = true
     this.mode = 'list'
     this.version = undefined
    }
  }
}
</script>
<!--声明语言，并且添加scoped-->
<style lang="stylus" scoped>
</style>
