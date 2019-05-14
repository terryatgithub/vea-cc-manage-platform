<template>
  <div>
    <!-- <MyDraftsTab 
     v-show="isShowList" 
     ref="list" 
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
     >
     </MyDraftsTab> -->
    <FilmDetailPageAdd
      v-if="!isShow"
      :editId="editId"
      :initMode="mode"
      :duplicateVersionVersion = "version"
      @open-list-page="handleUpsertEnd"
      @go-back="goBack"
    />
  </div>
</template>
<script>
import FilmDetailPageAdd from  './../panelManage/FilmDetailPageAdd'
// import MyDraftsTab from './MyDraftsTab'
export default {
  components: {
    FilmDetailPageAdd
   // MyDraftsTab,
  },
  data() {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined
    };
  },
  methods: {
    handleUpsertEnd () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
      this.mode = 'list'
      this.version = undefined
    },
    handleCreate() {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit(id) {
      this.id = id
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(id, version) {
      this.id = id
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleCopy(id) {
      this.id = id
      this.mode = 'copy'
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
