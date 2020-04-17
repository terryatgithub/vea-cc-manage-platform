<template>
  <RemoteSelectorWrapper
    ref="wrapper"
    :title="title || '选择作者'"
    custom-class="resource-selector"
    :disabled="disabled"
    :is-live="isLive"
    @select-start="handleSelectStart">
    <template slot="content" slot-scope="{isShow}">
      <BaseSelector
        v-if="isLive ? true : isShow"
        ref="baseSelector"
        id-field="userId"
        :selection-type="selectionType"
        :table="table"
        :pagination="pagination"
        :selectEndOnDblClick="true"
        @pagination-change="fetchData"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <el-form slot="filter" @keypress.enter.native.prevent="handleFilterChange"  :inline="true" v-model="filter">
          <el-form-item >
            <el-input clearable v-model="filter.userId" placeholder="作者ID"></el-input>
          </el-form-item>
          <el-form-item >
            <el-input clearable v-model="filter.userName" placeholder="作者名称"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleFilterChange">查询</el-button>
          <el-button type="warning" @click="handleResetFilter">重置</el-button>
        </el-form>
      </BaseSelector>
    </template>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../RemoteSelectorWrapper'
import BaseSelector from '../BaseSelector'
export default {
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      table: {
        data: [],
        selected: [],
        header: [
          {
            label: '作者ID',
            prop: 'userId',
            width: 200
          },
          {
            label: '名称',
            prop: 'userName',
            'show-overflow-tooltip': true
          },
          {
            label: '作者头像',
            render: (h, { row }) => {
              const thumb = row.userThumb
              if (thumb) {
                return h('img', {
                  key: row.userId + thumb,
                  style: {
                    'border-radius': '25px'
                  },
                  attrs: {
                    width: '50px',
                    height: '50px',
                    referrerpolicy: 'no-referrer',
                    src: thumb
                  }
                })
              }
            }
          }
        ],
        selectionType: 'multiple',
        props: {
          'tooltip-effect': 'dark'
        }
      },
      selected: [],
      originSelected: []
    }
  },
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'category'],
  components: {
    RemoteSelectorWrapper,
    BaseSelector
  },
  methods: {
    handleSelectStart () {
      this.$emit('select-start')
      if (!this.isLive) {
        this.handleResetFilter()
      } else {
        this.fetchData()
      }
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd (data) {
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    genDefaultFilter () {
      return {
        userId: undefined,
        userName: undefined
      }
    },
    handleFilterChange () {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      this.$service.mediaGetAuthorList(filter).then(data => {
        this.table.data = data.rows
        this.pagination.total = data.total
      })
    }
  },
  created () {
  }
}
</script>

<style>

</style>
