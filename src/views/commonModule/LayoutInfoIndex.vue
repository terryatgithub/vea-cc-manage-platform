<template>
  <div>
    <LayoutInfoList 
    v-show="mode==='list'" 
    ref="list" 
    @open-add-page="openAddPage"
    @open-review-page="openReviewPage"
    >
    </LayoutInfoList>
    <LayoutInfoAdd
      v-if="mode==='add'"
      :editData="editData"
      @open-list-page="openListPage"
      @go-back="goBack"
    ></LayoutInfoAdd>
      <LayoutInfoReview
      v-if="mode==='review'"
      :reviewData="reviewData"
      @open-list-page="openListPage"
      @go-edit-Page="goEditPage"
      @go-back="goBack"
    ></LayoutInfoReview>
  </div>
</template>
<script>
import LayoutInfoAdd from './LayoutInfoAdd'
import LayoutInfoList from './LayoutInfoList'
import LayoutInfoReview from './LayoutInfoReview'
export default {
  components: {
    LayoutInfoAdd,
    LayoutInfoList,
    LayoutInfoReview
  },
  data() {
    return {
      mode: "list",
      editData: {},
      reviewData: {}
    }
  },
  methods: {
    /**
     * 打开新增编辑页面
     */
    openAddPage(row) {
      this.editData = row
      this.mode = 'add'
    },
    goEditPage() {
       this.editData = this.reviewData 
       this.mode = 'add'
    },
    openReviewPage(row){
       this.reviewData = row
       this.mode = 'review'
    },
    /**
     * 打开列表页面
     */
    openListPage() {
      this.mode = 'list'
      this.generatorLayoutData = {}
      this.$refs.list.fetchData() // 更新页面
    },
    /**
     * 新增编辑里面的返回事件
     */
    goBack(mode) {
      this.mode = mode
    },
    openGeneratorPage(){
      this.mode='generator'
    },
    generatorLayout(obj){
       this.generatorLayoutData = obj
       this.mode = 'add'
    }
  }
}
</script>