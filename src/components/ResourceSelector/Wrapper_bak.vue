<template>
  <div class="remote-selector-main">
    <div class="remote-selector-main__filter">
      <slot name="filter">
        <GateSchemaForm 
          v-if="filterSchema"
          :schema="filterSchema"
          v-model="filter"
          @submit="handleFilter"
          @reset="handleResetFilterForm"
        />
      </slot>
    </div>
    <div class="remote-selector-main__content">
      <slot name="item-list"></slot>
    </div>
    <div class="remote-selector-main__footer">
      <div class="remote-selector-main__pagination">
        <slot name="pagination">
          <el-pagination
              v-if="pagination"
              @size-change="handlePageSizeChange"
              @current-change="handlePageChange"
              :current-page="pagination.currentPage"
              :page-sizes="[15, 20, 30, 50, 100, 200]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total">
          </el-pagination>
        </slot>
      </div>
      <div class="remote-selector-main__actions">
        <slot name="actions">
            <Button type="primary" @click="handleSelectEnd">  
              确定
            </Button>
            <Button @click="handleSelectCancel">  
              取消
            </Button>
        </slot>
      </div>
    </div>
  <div>
</template>

<script>
export default {
  props: ['filter', 'filterSchema', 'pagination']
}
</script>

<style lang="stylus" scoped>
.remote-selector-main 
  height 100%
  display flex
  flex-direction column
.remote-selector-main__content
  overflow auto
  margin 10px 0
  border-top 1px solid #EBEEF5 
  border-bottom 1px solid #EBEEF5 
  flex 1
.remote-selector-main__footer
  height 35px
.remote-selector-main__pagination
  display inline-block
.remote-selector-main__actions
  display inline-block
  float right
</style>
