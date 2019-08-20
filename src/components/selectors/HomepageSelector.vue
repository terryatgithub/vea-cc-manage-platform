<template>
  <RemoteSelectorWrapper
    ref="wrapper"
    :title="title"
    custom-class="resource-selector"
    :disabled="disabled"
    :is-live="isLive"
    @select-start="handleSelectStart">
    <template slot="content" slot-scope="{isShow}">
      <BaseSelector
        v-if="isLive ? true : isShow"
        ref="baseSelector"
        id-field="homepageId"
        :selection-type="selectionType"
        :table="table"
        :filter="filter"
        :filterSchema="filterSchema"
        :pagination="pagination"
        @pagination-change="fetchData"
        @filter-change="handleFilterChange"
        @filter-reset="handleResetFilter"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
      </BaseSelector>
    </template>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../SelectorWrapper'
import BaseSelector from '../BaseSelector'
import _ from 'gateschema'
export default {
  data() {
    return {
      options: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.genDefaultFilter(),
      filterSchema: null,
      table: {
        data: [],
        selected: [],
        header: [
          {
            label: 'ID',
            prop: 'homepageId',
            width: '100'
          },
          {
            label: '名称',
            width: '130',
            prop: 'homepageName',
            sortable: true
          },
          {
            label: '关联版面名称',
            prop: 'relationTabName',
            render: (h, { row }) => {
              let content = row.relationTabName
              if (content.length > 40) { content = content.substring(0, 40) + '...' }
              return h('div', {
                attrs: {
                  title: row.relationTabName
                }
              }, content)
            }
          },
          {
            label: '首页模式',
            prop: 'homepageModel',
            render: (h, { row }) => {
              if (row.homepageModel === 'child') {
                return '儿童模式'
              } else {
                return '标准模式'
              }
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: 150,
            sortable: true
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
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'category', 'homepageModel'],
  components: {
    RemoteSelectorWrapper,
    BaseSelector
  },
  methods: {
    handleSelectStart() {
      this.$emit('select-start')
      if (!this.isLive) {
        this.handleResetFilter()
      } else {
        this.fetchData()
      }
    },
    handleSelectCancel() {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd(data) {
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    genDefaultFilter() {
      return {
        homepageModel: this.homepageModel
      }
    },
    handleFilterChange(filter) {
      this.filter = JSON.parse(JSON.stringify(filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter() {
      this.filter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      const filter = JSON.parse(JSON.stringify(this.filter))
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      this.$service.getHomePageModelPageList(filter).then(data => {
        this.table.data = data.rows
        this.pagination.total = data.total
      })
    }
  },
  created() {
    let filterSchema = _.map({
      homepageId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      homepageName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '名称'
      })
    }).other('form', {
      cols: {
        item: 6,
        label: 0,
        wrapper: 22
      },
      layout: 'inline',
      footer: {
        cols: {
          item: 6,
          label: 0,
          wrapper: 24
        },
        showSubmit: true,
        submitText: '查询',
        showReset: true,
        resetText: '重置'
      }
    })
    this.filterSchema = filterSchema
  }
}
</script>

<style>

</style>
