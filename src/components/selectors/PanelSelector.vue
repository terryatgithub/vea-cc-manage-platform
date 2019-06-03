<template>
  <RemoteSelectorWrapper 
    ref="wrapper"
    title="选择版块"
    custom-class="resource-selector"
    @select-start="handleSelectStart">
    <template slot="content" slot-scope="{isShow}">
      <BaseSelector 
        v-if="isLive ? true : isShow"
        ref="baseSelector"
        id-field="pannelGroupId"
        :is-live="isLive"
        :selection-type="selectionType"
        :table="table" 
        :pagination="pagination"
        @pagination-change="fetchData"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <el-form slot="filter" :inline="true" v-model="filter">
          <el-form-item>
            <el-select v-model="filter.pannelType" placeholder="类型">
              <el-option :value="1" label="内容版块"></el-option>
              <el-option :value="3" label="专辑版块"></el-option>
              <el-option :value="5" label="专属影院版块"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-input v-model="filter.pannelId" placeholder="版块ID"></el-input>
          </el-form-item>
          <el-form-item >
            <el-input v-model="filter.pannelName" placeholder="版块名称"></el-input>
          </el-form-item>
          <el-form-item >
            <el-select v-model="filter.pannelCategory" placeholder="业务分类">
              <el-option
                v-for="(item, index) in panelCategoryOptions"
                :key="index"
                :disabled="item.disabled"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="filter.pannelStatus" placeholder="状态">
              <el-option
                v-for="(item, index) in $consts.statusOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="filter.parentType" placeholder="版块组类型">
              <el-option
                v-for="(item, index) in parentTypeOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="filter.idPrefix" placeholder="数据来源">
              <el-option label="酷开" value="10"></el-option>
              <el-option label="江苏广电" value="11"></el-option>
            </el-select>
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
            prop: 'pannelGroupId'
          },
          {
            label: '名称',
            prop: 'pannelGroupRemark',
            'show-overflow-tooltip': true,
            width: 200
          },
          {
            label: '业务分类',
            width: 100,
            render: function(h, scope) {
              return this.pannelCategoryOptionsIndexed[scope.row.pannelCategory]
            }.bind(this)
          },
          {
            label: '布局',
            width: 200,
            prop: 'fullLayoutName',
            'show-overflow-tooltip': true
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'show-overflow-tooltip': true
          },
          {
            label: '状态',
            render: function(h, scope) {
              return this.$consts.statusText[scope.row.pannelStatus]
            }.bind(this)
          },
          {
            prop: 'lastUpdateDate',
            label: '更新时间',
            width: 190
          },
          {
            prop: 'userName',
            label: '更新人',
            width: 120
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
    genDefaultFilter() {
      return {
        idPrefix: this.$consts.idPrefix,
        pannelType: 1,
        panelId: undefined,
        pannelName: undefined,
        pannelCategory: undefined,
        pannelStatus: undefined,
        parentType: undefined,
        pannelResource: undefined,
        resourceIsNull: true
      }
    },
    handleFilterChange() {
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter() {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      if (!filter.pannelStatus) {
        filter.multiStatus = '3,4'
      }
      filter.pannelResource = this.source
      this.$service.panelPageList(filter).then(data => {
        this.table.data = data.rows
        this.pagination.total = data.total
      })
    },
  },
  created() {
    this.$service.getDictType({type: 'businessType'}).then(data => {
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
