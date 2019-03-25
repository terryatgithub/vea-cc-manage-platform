<template>
  <div>
    <GlobalPictureList v-show="isShowList" ref="list" @openAddPage="openAddPage"></GlobalPictureList>
    <GlobalPictureAdd
      v-if="!isShowList"
      :editId="editId"
      @openListPage="openListPage"
      @go-back="goBack"
    ></GlobalPictureAdd>
  </div>
</template>
<script>
import GlobalPictureAdd from "./GlobalPictureAdd";
import GlobalPictureList from "./GlobalPictureList";
export default {
  components: {
    GlobalPictureAdd,
    GlobalPictureList
  },
  data() {
    return {
      isShowList: true,
      editId: null
    };
  },
  methods: {
    /**
     * 打开新增编辑页面
     */
    openAddPage(userId) {
      this.editId = userId;
      this.isShowList = false;
    },
    /**
     * 打开列表页面
     */
    openListPage() {
      this.isShowList = true;
      this.$refs.list.fetchData(); // 更新页面
    },
    /**
     * 新增编辑里面的返回事件
     */
    goBack() {
      this.isShowList = true;
    }
  }
};
</script>