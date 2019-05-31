<template>
  <div class="remote-selector-wrapper">
    <div @click="handleSelectStart">
      <slot>
        <Button :disabled="disabled">
          {{ title }}
        </Button>
      </slot>
    </div>
    <Dialog
      class="remote-selector-dialog"
      :custom-class="customClass"
      :show-close="showClose"
      :fullscreen="fullscreen"
      :visible.sync="showDialog"
      :append-to-body="true">
      <div slot="title">
        <slot name="title"> {{ title }}</slot>
      </div>
      <slot name="content" :is-show="showDialog">
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
                  <Button type="primary" @click="handleSelectEnd" v-if="!hideSubmit">  
                    确定
                  </Button>
                  <Button @click="handleSelectCancel">  
                    取消
                  </Button>
              </slot>
            </div>
          </div>
        </div>
      </slot>
    </Dialog>
  </div>
</template>
<script>
import { Button, Tag, Dialog } from 'element-ui'
export default {
  components: {
    Button,
    Dialog,
    Tag
  },
  props: {
    title: {
      type: String,
      default () {
        return '选择'
      }
    },
    hideSubmit: {
       type: Boolean
    },
    fullscreen: {
      type: Boolean,
      default() {
        return true
      }
    },
    filter: Object,
    filterSchema: Object,
    pagination: Object,
    customClass: String,
    showClose: {
      type: Boolean,
      default() {
        return true
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data () {
    return {
      showDialog: false,
      showContent: false
    }
  },
  methods: {
    handleSelectStart () {
      if (!this.disabled) {
        this.showDialog = true
        this.$emit('select-start')
      }
    },
    handleSelectEnd () {
      this.showDialog = false
      this.$emit('select-end')
    },
    handleSelectCancel () {
      this.showDialog = false
      this.$emit('select-cancel')
    },
    handleFilter (err) {
      if (!err || err.length === 0) {
        this.$emit('filter-change')
      }
    },
    handlePageSizeChange (size) {
      this.$set(this.pagination, 'pageSize', size)
      this.$emit('pagination-change')
    },
    handlePageChange (page) {
      this.$set(this.pagination, 'currentPage', page)
      this.$emit('pagination-change')
    },
    handleResetFilterForm () {
      this.$emit('filter-reset')
    },
    emitFilterChange (type) {
      this.$emit('filter-change', type)
    }
  },
  created() {
  }
}
</script>
<style lang="stylus" scoped>
.remote-selector-wrapper
  display inline-block
.remote-selector-dialog >>> .el-dialog
  display flex
  flex-direction column
.remote-selector-dialog >>> .el-dialog__header
  padding-top 10px
.remote-selector-dialog >>> .el-dialog__headerbtn
  top 10px
.remote-selector-dialog >>> .el-dialog__body
  padding 0 20px
  overflow hidden
  flex 1
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
  padding 10px 0
.remote-selector-main__pagination
  display inline-block
.remote-selector-main__actions
  display inline-block
  float right
</style>
