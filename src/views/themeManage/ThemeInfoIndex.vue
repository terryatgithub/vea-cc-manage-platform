<template>
  <div>
    <ThemeInfoList
      v-show="isShowList"
      ref="list"
      @open-add-page="openAddPage"
      @open-preview-page="openPreviewPage"
    />
    <ThemeInfoAdd
      v-if="!isShowList&&!isShowPreview"
      :editId="editId"
      :version="version"
      @open-list-page="openListPage"
      @go-back="goBack"
    />
    <ThemeInfoPreview
      v-if="!isShowList && isShowPreview"
      :themeInfo="themeInfo"
      @go-back="preGoBack"
      @open-list-page="openListPage"
      @open-add-page="openAddPage"
    />
  </div>
</template>

<script>
import ThemeInfoList from './ThemeInfoList'
import ThemeInfoAdd from './ThemeInfoAdd'
import ThemeInfoPreview from './ThemeInfoPreview'

export default {
  components: {
    ThemeInfoList,
    ThemeInfoAdd,
    ThemeInfoPreview
  },

  data() {
    return {
      isShowList: true,
      isShowPreview: false,
      editId: null,
      themeInfo: null,
      version: null
    }
  },

  methods: {
    /**
     * 打开新增编辑页面
     */
    openAddPage(editId, version) {
      this.editId = editId
      this.version = version
      this.isShowPreview = false
      this.isShowList = false
    },
    /**
     * 预览
     */
    openPreviewPage(themeInfo) {
      this.themeInfo = themeInfo
      this.isShowList = false
      this.isShowPreview = true
    },
    /**
     * 打开列表页面
     */
    openListPage() {
      this.isShowList = true
      this.$refs.list.fetchData() // 更新页面
    },
    /**
     * 新增编辑里面的返回事件
     */
    goBack() {
      this.isShowList = true
    },
    preGoBack() {
      this.isShowList = true
      this.isShowPreview = false
    }
  }
}
</script>

<style lang='stylus' scoped></style>
