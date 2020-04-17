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
        :filter-schema="null"
        :pagination="pagination"
        :select-end-on-dbl-click="true"
        @pagination-change="fetchData"
        @filter-change="handleFilterChange"
        @filter-reset="handleResetFilter"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <el-form
          slot="filter"
          :model="filter"
          label-width="80px"
          :inline="true"
          @reset.native.prevent="handleResetFilter"
          @submit.native.prevent="handleFilterChange">
          <el-form-item label="">
            <InputPositiveInt clearable placeholder="ID" v-model="filter.commonOnclickId"></InputPositiveInt>
          </el-form-item>
          <el-form-item label="">
            <el-input clearable v-model.trim="filter.onlickName" placeholder="点击事件名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">查询</el-button>
            <el-button native-type="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </BaseSelector>
    </template>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../RemoteSelectorWrapper'
import BaseSelector from '../BaseSelector'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    InputPositiveInt,
    RemoteSelectorWrapper,
    BaseSelector
  },
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
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
  methods: {
    handleSelectStart () {
      this.$emit('select-start')
      this.fetchData()
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd (data) {
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    getDefaultFilter () {
      return {
        commonOnclickId: undefined,
        onlickName: undefined
      }
    },
    handleFilterChange () {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter () {
      this.filter = this.getDefaultFilter()
      this.efficientFilter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter () {
      const { pagination } = this
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getClickData(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style>

</style>
