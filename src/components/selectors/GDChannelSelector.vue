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
        :id-field="getId"
        :selection-type="selectionType"
        :table="table"
        :filter="filter"
        :filterSchema="filterSchema"
        :pagination="pagination"
        :select-end-on-dbl-click="true"
        @pagination-change="fetchData"
        @filter-change="handleFilterChange"
        @filter-reset="handleResetFilter"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <div slot="filter">
          <el-form :inline="true" :model="filter" @keypress.enter.native.prevent="handleFilterChange">
            <el-form-item >
              <el-select
                placeholder="省份"
                v-model="filter.provincesCode"
                filterable
                clearable>
                <el-option
                  v-for="item in provinceOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="filter.ccChannelTitle" clearable placeholder="聚合频道名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilterChange">查询</el-button>
              <el-button @click="handleResetFilter">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </BaseSelector>

      <GDScheduleSelector ref="gdChannelSelector" :provincesCode="currentProvincesCode" :channelId="currentChannelId">
        <span></span>
      </GDScheduleSelector>

    </template>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../SelectorWrapper'
import BaseSelector from '../BaseSelector'
import GDScheduleSelector from './GDScheduleSelector'
export default {
  data () {
    return {
      provinceOptions: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.genDefaultFilter(),
      effectiveFilter: this.genDefaultFilter(),
      filterSchema: null,
      table: {
        data: [],
        selected: [],
        header: [
          {
            label: '聚合频道ID',
            prop: 'ccChannelId'
          },
          {
            label: '聚合频道名',
            prop: 'ccChannelTitle'
          },
          {
            label: '聚合之中的省份',
            prop: 'provincesName'
          },
          // {
          //   prop: 'segment',
          //   label: '已选集数',
          //   type: 'specialBut',
          //   width: '105',
          //   mouseStyle: 'hover',
          //   fixed: 'right',
          //   render: (h, { row }) => {
          //     const coocaaVId = row.coocaaVId
          //     const selectedEpisodes = this.selectedEpisodes
          //     if (selectedEpisodes[coocaaVId]) {
          //       return h('el-button', {
          //         attrs: {
          //           type: 'primary',
          //           text: '已选集数',
          //           value: '已选集数',
          //           title: selectedEpisodes[coocaaVId].urlTitle
          //         } }, '已选集数')
          //     }
          //   }
          // },
          {
            prop: 'but',
            label: '操作',
            width: '105',
            fixed: 'right',
            render: (h, { row }) => {
              return h('el-button', {
                on: {
                  'click': (event) => {
                    event.stopPropagation()
                    this.handleSelectChannel(row)
                  }

                }
              }, '选择节目')
            }
          }
        ],
        selectionType: 'single',
        props: {
          'tooltip-effect': 'dark'
        }
      },
      currentChannelId: undefined,
      currentProvincesCode: undefined
    }
  },
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'initSelected', 'hasSchedule'],
  computed: {
  },
  components: {
    RemoteSelectorWrapper,
    BaseSelector,
    GDScheduleSelector
  },
  methods: {
    getId (item) {
      return item.ccChannelId
    },
    genDefaultFilter () {
      return {
        ccChannelTitle: '',
        provincesCode: ''
      }
    },
    handleSelectStart () {
      this.$emit('select-start')
      if (!this.isLive) {
        this.handleResetFilter()
      } else {
        this.fetchData()
      }
      const initSelected = this.initSelected
      if (initSelected) {
        this.$nextTick(() => {
          const $baseSelector = this.$refs.baseSelector
          $baseSelector.selected = initSelected.filter(item => this.getId(item))
          $baseSelector.updateTableSelected()
        })
      }
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd (data) {
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    handleSelectChannel (row) {
      this.currentChannelId = row.ccChannelId
      this.currentProvincesCode = row.provincesCode
      this.$nextTick(() => {
        this.$refs.gdChannelSelector.$refs.wrapper.handleSelectStart()
      })
    },
    handleRowSelectionRemove (item) {
      this.$refs.baseSelector.handleTableRowSelectionRemove(item)
    },
    handleFilterChange () {
      this.effectiveFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter () {
      this.filter = this.genDefaultFilter()
      this.effectiveFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      const filter = JSON.parse(JSON.stringify(this.effectiveFilter))
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      this.$service.mediaGetGDChannelList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    getProvinceOptions () {
      this.$service.mediaGetChannelProvinceOptions().then(result => {
        this.provinceOptions = result
      })
    }
  },
  created () {
    this.getProvinceOptions()
    if (this.hasSchedule === undefined) {
      this.table.header.splice(this.table.header.length - 1, 1)
    }
  }
}
</script>

<style lang="stylus" scoped>
.selected-item
  margin-right 10px
</style>
