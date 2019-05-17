<template>
  <div>
    <GlobalPictureList 
      v-show="isShowList" 
      ref="list" 
      @open-add-page="openAddPage"
      @read="handleRead"
    />
    <GlobalPictureUpsert
      v-if="!isShowList"
      :edit-id="editId"
      :initMode="mode"
      @show-list="openListPage"
      @go-back="goBack"
    />
  </div>
</template>
<script>
import GlobalPictureUpsert from "./GlobalPictureUpsert";
import GlobalPictureList from "./GlobalPictureList";
export default {
  components: {
    GlobalPictureUpsert,
    GlobalPictureList
  },
  data() {
    return {
      isShowList: true,
      editId: null,
      mode: undefined
    };
  },
  methods: {
    // /**
    //  * 打开新增编辑页面
    //  */
    // handleEdit(id) {
    //   this.editId = id;
    //   this.isShowList = false;
    // },
    // /**
    //  * 打开列表页面
    //  */
    // handleShowList() {
    //   this.isShowList = true;
    //   this.$refs.list.fetchData(); // 更新页面
    // },
    /**
     * 新增编辑里面的返回事件
     */
    goBack() {
      this.isShowList = true;
    },
      /**
     * 打开新增编辑页面
     */
    openAddPage(id) {
      this.editId = id
      this.isShowList = false
      this.mode = 'create'
    },
    handleRead(row){
      this.editId = row.pictureId
      this.mode = 'read'
      this.isShowList = false
    },
    /**
     * 打开列表页面
     */
    openListPage() {
      this.isShowList = true
      this.$refs.list.fetchData() // 更新页面
    }
  }
};
</script>