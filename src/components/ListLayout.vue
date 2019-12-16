<template>
  <div>
    <slot name="top"></slot>
    <div class="list-layout-filter-form">
      <slot name="filter"></slot>
    </div>

    <div v-if="$slots.actions" class="list-layout-actions">
      <slot name="actions"></slot>
    </div>

    <div class="list-layout-table">
      <slot name="table"></slot>
    </div>

    <div class="list-layout-pagination">
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
    <slot name="bottom"></slot>
  </div>
</template>

<script>
export default {
  props: ['pagination'],
  methods: {
    handlePageSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
      this.$emit('pagingation-change')
    },
    handlePageChange (page) {
      this.pagination.currentPage = page
      this.$emit('pagingation-change')
    }
  }
}
</script>

<style lang="stylus" scoped>
.list-layout-actions
  margin-bottom 20px
.list-layout-pagination
  margin-top 20px
  >>> .el-pagination
    display flex
    flex-diraction row
  >>> .el-pagination__total
    margin-right auto
</style>
