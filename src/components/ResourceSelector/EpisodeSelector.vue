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
      :select-end-on-dbl-click="true"
      @pagination-change="fetchData"
      @filter-reset="handleFilterReset"
      @select-cancel="handleSelectCancel"
      @select-end="handleSelectEnd">
      <el-form slot="filter" :inline="true" v-model="filter" label-width="72px">
        <el-form-item label="素材类型">
          <el-select filterable v-model="filter.urlIsTrailer" clearable>
            <el-option
              v-for="option in episodeTypeEnums"
              :key="option.label"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单集名称">
          <el-input clearable v-model="filter.urlTitle"/>
        </el-form-item>
        <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
        <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
      </el-form>
    </BaseSelector>
    <slot></slot>
  </remote-selector-wrapper>
</template>

<script>
import BaseSelector from '../BaseSelector'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'

const episodeTypeEnums = [
  {
    label: '正片',
    value: '0'
  },
  {
    label: '预告',
    value: '1'
  },
  {
    label: '短视频',
    value: '6'
  }
]
const episodeTypeText = {
  '0': '正片',
  '1': '预告',
  '6': '短视频'
}
export default {
  components: {
    BaseSelector,
    RemoteSelectorWrapper
  },
  data () {
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
            label: '集数名',
            prop: 'urlCollection',
            width: '70'
          },
          {
            label: '单集ID',
            prop: 'coocaaMId',
            width: '150'
          },
          {
            label: '单集名称',
            prop: 'urlTitle'
          },
          {
            label: '图片',
            prop: 'thumb',
            render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  referrerpolicy: 'no-referrer',
                  width: '50px',
                  height: '50px',
                  class: 'imgs',
                  src: row.thumb
                }
              })
            }
          },
          {
            label: '素材类型',
            width: '120',
            prop: 'urlIsTrailer',
            render: (createElement, { row }) => {
              return episodeTypeText[row.urlIsTrailer]
            }
          },
          {
            label: '时长',
            width: 120,
            render: (h, { row }) => {
              return this.secondToTimeStr(row.duration)
            }
          },
          {
            label: '跳转播放',
            width: 100,
            render: (h, { row }) => {
              const source = this.source
              if (source === 'tencent' || source === 'yinhe') {
                const url = source === 'tencent'
                  ? `https://v.qq.com/x/cover/${row.coocaaMId}/${row.thirdVuId}.html`
                  : `http://so.iqiyi.com/so/q_${row.urlTitle}`
                return h('a', {
                  class: 'link',
                  attrs: {
                    target: '_blank',
                    href: url
                  }
                }, '跳转')
              }
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'single'
      },
      selected: []
    }
  },
  props: {
    selectionType: {
      type: String,
      default () {
        return 'single'
      }
    },
    source: String,
    id: [String, Number]
  },
  // props: ['selectionType', 'source', 'id'],
  methods: {
    secondToTimeStr (seconds) {
      if (seconds) {
        const hour = Math.floor(seconds / 3600)
        const min = Math.floor((seconds - 3600 * hour) / 60)
        const sec = seconds - 3600 * hour - 60 * min
        return `${hour}小时${min}分${sec}秒`
      }
    },
    handleSelectStart () {
      const baseSelector = this.$refs.baseSelector
      if (baseSelector) {
        baseSelector.clearSelected()
      }
      this.handleFilterReset()
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    getDefaultFilter () {
      return {
        urlIsTrailer: undefined,
        urlTitle: undefined,
        source: this.source,
        id: this.id
      }
    },
    getFilter () {
      const pagination = this.pagination
      const filter = { ...this.efficientFilter }
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange () {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.getDefaultFilter()
      this.efficientFilter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.table.data = []
      this.fetchData()
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.getSegmentList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows || []
      })
    },
    handleSelectEnd () {
      this.$refs.wrapper.handleSelectEnd()
      this.$emit('select-end', ...arguments)
    }
  },
  created () {
  }
}
</script>

<style lang='stylus' scoped>
</style>
