<template>
  <div>
    <GlobalPictureList 
      v-show="isShowList" 
      ref="list" 
      @edit="handleEdit" 
      @add="handleEdit"
    />
    <GlobalPictureUpsert
      v-if="!isShowList"
      :edit-id="editId"
      @show-list="handleShowList"
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
      editId: null
    };
  },
  methods: {
    /**
     * 打开新增编辑页面
     */
    handleEdit(id) {
      this.editId = id;
      this.isShowList = false;
    },
    /**
     * 打开列表页面
     */
    handleShowList() {
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