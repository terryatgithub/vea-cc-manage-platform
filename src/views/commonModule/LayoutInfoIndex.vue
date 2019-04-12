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
      @open-generator-page="openGeneratorPage"
      :generatorLayoutData="generatorLayoutData"
    ></LayoutInfoAdd>
    <LayoutInfoGenerator 
     v-if="mode==='generator'" 
     @go-back="goBack"
     @generator-layout="generatorLayout">
     </LayoutInfoGenerator>
      <LayoutInfoReview
      v-if="mode==='review'"
      :reviewData="reviewData"
      @go-back="goBack"
      @go-edit-Page="goEditPage"
    ></LayoutInfoReview>
  </div>
</template>
<script>
import LayoutInfoAdd from './LayoutInfoAdd'
import LayoutInfoList from './LayoutInfoList'
import LayoutInfoGenerator from './LayoutInfoGenerator'
import LayoutInfoReview from './LayoutInfoReview'
export default {
  components: {
    LayoutInfoAdd,
    LayoutInfoList,
    LayoutInfoGenerator,
    LayoutInfoReview
  },
  data() {
    return {
      mode: "list",
      editData: {},
      reviewData: {},
      generatorLayoutData: {} //生成布局产生的布局对象
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