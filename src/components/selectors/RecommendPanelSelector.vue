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
        id-field="panelGroupId"
        :selection-type="selectionType"
        :table="table"
        :pagination="pagination"
        @pagination-change="fetchData"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <el-form slot="filter" :inline="true" v-model="filter">
          <el-form-item >
            <el-input v-model="filter.panelGroupId" placeholder="版块ID"></el-input>
          </el-form-item>
          <el-form-item >
            <el-input v-model="filter.panelGroupName" placeholder="版块名称"></el-input>
          </el-form-item>
          <el-form-item >
            <el-input v-model="filter.panelGroupTitle" placeholder="版块组标题"></el-input>
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
      options: [],
      panelCategoryOptions: [],
      pannelCategoryOptionsIndexed: {},
      panelStatusOptions,
      panelStatusOptionsIndexed,
      parentTypeOptions: [
        {
          label: '分组版块',
          value: 'group'
        },
        {
          label: '功能版块',
          value: 'function'
        }
      ],
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
            label: 'ID',
            prop: 'panelGroupId',
            width: 200
          },
          {
            label: '名称',
            prop: 'panelGroupName',
            'show-overflow-tooltip': true
          },
          {
            label: '版块组标题',
            prop: 'panelGroupTitle',
            'show-overflow-tooltip': true
          },
          {
            prop: 'lastUpdateDate',
            label: '更新时间',
            width: 190
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
        panelGroupId: undefined,
        panelGroupName: undefined,
        panelGroupTitle: undefined,
        panelGroupCategory: undefined,
        source: undefined,
        flag: 1
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
      if (this.category) {
        filter.panelGroupCategory = this.category
      }
      if (this.source) {
        filter.source = this.source
      }
      this.$service.panelRecommendList(filter).then(data => {
        this.table.data = data.rows
        this.pagination.total = data.total
      })
    }
  },
  created () {
    this.$service.getDictType({ type: 'businessType' }).then(data => {
      this.panelCategoryOptions = data.map(item => {
        return {
          label: item.dictCnName,
          value: item.dictId,
          disabled: item.disabled
        }
      })
      this.pannelCategoryOptionsIndexed = this.panelCategoryOptions.reduce((result, item) => {
        result[item.value] = item.label
        return result
      }, {})
    })
  }
}
</script>

<style>

</style>
