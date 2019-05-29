<template>
  <RemoteSelectorWrapper 
    ref="wrapper"
    custom-class="resource-selector"
    @select-start="handleSelectStart">
    <template slot="content" slot-scope="{isShow}">
      <BaseSelector 
        v-if="isLive ? true : isShow"
        ref="baseSelector"
        id-field="pannelGroupId"
        :is-live="isLive"
        :selection-type="selectionType || 'single'"
        :table="table" 
        :filter="filter"
        :filter-schema="filterSchema"
        :pagination="pagination"
        @pagination-change="fetchData"
        @filter-change="fetchData"
        @filter-reset="handleResetFilter"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
      </BaseSelector>
    </template>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import _ from '../../utlis/gateschema'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper'
import BaseSelector from '../BaseSelector'
export default {
  data() {
    const panelStatusOptions = this.$consts.statusOptions.filter(item => {
      return [3, 4, 7].indexOf(item.value) > -1
    })
    const panelStatusOptionsIndexed = panelStatusOptions.reduce(
      (result, item) => {
        result[item.value] = item.label
        return result
      },
      {}
    )
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: {
      },
      filterSchema: null,
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'commonOnclickId',
            width: '70'
          },
          {
            label: '点击事件名称',
            prop: 'onlickName'
          },
          {
            label: '备注',
            prop: 'remark'
          },
          {
            label: '修改人',
            prop: 'modifierName'
          },
          {
            label: '修改时间',
            prop: 'lastUpdateDate',
            width: '170'
          }
        ],
        data: [],
        selected: []
      },
      selected: [],
      originSelected: []
    }
  },
  props: ['isLive', 'source', 'selectionType'],
  components: {
    RemoteSelectorWrapper,
    BaseSelector
  },
  methods: {
    handleSelectStart() {
      this.$emit('select-start')
      this.fetchData()
    },
    handleSelectCancel() {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd(data) {
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    getDefaultFilter() {
      return {
      }
    },
    handleResetFilter() {
      this.filter = this.getDefaultFilter()
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    fetchData() {
      const filter = this.parseFilter();
      this.$service.getClickData(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
  },
  created() {
    let filterSchema = _.map({
      commonOnclickId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      onlickName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '点击事件名称'
      })
    }).other('form', {
       cols: {
        item: 6,
        label: 0,
        wrapper: 20
      },
      layout: 'inline',
      footer: {
        cols: {
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
    this.fetchData()
  }
}
</script>

<style>

</style>
