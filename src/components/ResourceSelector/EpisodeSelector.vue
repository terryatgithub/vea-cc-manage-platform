<template>
  <remote-selector-wrapper
    ref="wrapper"
    title="选择单集"
    @select-start="handleSelectStart"
  >
    <BaseSelector 
      slot="content"
      ref="baseSelector"
      id-field="coocaaVId"
      :selection-type="selectionType"
      :table="table" 
      :pagination="pagination"
      @pagination-change="fetchData"
      @filter-reset="handleFilterReset"
      @select-cancel="handleSelectCancel"
      @select-end="handleSelectEnd">
      <el-form slot="filter" :inline="true" v-model="filter" label-width="72px">
        <el-form-item label="素材类型">
          <el-select v-model="filter.urlIsTrailer">
            <el-option
              v-for="option in episodeTypeEnums"
              :key="option.label"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单集名称">
          <el-input v-model="filter.urlTitle"/>
        </el-form-item>
        <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
        <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
      </el-form>
    </BaseSelector>
    <slot></slot>
  </remote-selector-wrapper>
</template>

<script>
import _ from "gateschema";
import BaseSelector from '../BaseSelector'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'

const episodeTypeEnums = [
  {
    label: '正片',
    value: '0'
  },
  {
    label: '非正片',
    value: '1'
  }
]
export default {
  components: {
    BaseSelector,
    RemoteSelectorWrapper
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
      episodeTypeEnums,
      table: {
        props: {},
        header: [
          {
            label: "集数名",
            prop: "urlCollection",
            width: "70"
          },
           {
            label: "单集ID",
            prop: "coocaaMId",
            width: "150"
          },
           {
            label: "单集名称",
            prop: "urlTitle",
          },
          {
            label: "图片",
            prop: "thumb",
            render: (createElement, { row }) => {
              return createElement("img", {
                attrs: {
                  src: row.thumb,
                  width: "50px",
                  height: "50px",
                  class: "imgs"
                }
              });
            }
          },
          {
            label: "素材类型",
            width: "120",
            prop: "urlIsTrailer",
            render: (createElement, {row}) => {
              return row.urlIsTrailer === '1'?'非正片': '正片'
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: "single"
      },
      selected: []
    }
  },
  props: ['selectionType', 'source', 'id'],
  watch: {
    'id': 'handleFilterReset'
  },
  methods: {
    handleSelectStart() {
      const baseSelector = this.$refs.baseSelector
      if (baseSelector) {
        baseSelector.clearSelected()
      }
      this.handleFilterReset()
    },
    handleSelectCancel() {
      this.$refs.wrapper.handleSelectCancel()
    },
    getDefaultFilter() {
      return {
        urlIsTrailer: undefined,
        urlTitle: undefined,
        source: this.source,
        id: this.id
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = {...this.efficientFilter}
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange() {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.efficientFilter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.table.data = []
      this.fetchData()
    },
    fetchData() {
      const filter = this.getFilter()
      this.$service.getSegmentList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows || []
      })
    },
    handleSelectEnd() {
      this.$refs.wrapper.handleSelectEnd()
      this.$emit('select-end', ...arguments)
    }
  },
  created() {
  }
}
</script>
 
<style lang='stylus' scoped>
</style>
