<template>
  <ContentCard class="content">
    <ab-list-layout :pagination="pagination">
      <div slot="filter">
        <DataForm :model="filter" :inline="true">
          <FormEnum
            placeholder="是否有教育业务"
            v-model="filter.hasEdu"
            :options="zeroOneOptions"
            clearable>
          </FormEnum>
          <FormEnum
            placeholder="是否运营干预"
            v-model="filter.hasIntervene"
            :options="zeroOneOptions"
            clearable>
          </FormEnum>
          <FormString v-model="filter.pannelStatus" placeholder="版块状态"/>
          <FormString v-model="filter.pannelName" placeholder="版块名称"/>
          <FormString v-model="filter.pannelId" placeholder="版块ID"/>
          <FormEnum
            placeholder="版块内容源"
            v-model="filter.pannelResource"
            :options="$consts.sourceOptions"
            clearable>
          </FormEnum>
          <br/>
          <FormEnum
            type="radio"
            label="影片数量"
            v-model="filter.filmNumSelect"
            :options="filmNumOptions"/>
        </DataForm>
      </div>
      <div slot="actions">
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" plain @click="handleResetFilter">重置</el-button>
      </div>
      <Table
        slot="table"
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange" />
    </ab-list-layout>
  </ContentCard>
</template>

<script>
import { components } from 'admin-base'
import { Table, DataForm, Enum, String as FormString } from 'admin-toolkit'
import { cloneDeep } from 'lodash'

const filmNumOptions = [
  {
    label: '未定义',
    value: undefined
  },
  {
    label: '10部及以下',
    value: 1
  },
  {
    label: '11~30',
    value: 2
  },
  {
    label: '31~100',
    value: 3
  },
  {
    label: '100以上',
    value: 4
  }
]
const zeroOneOptions = [
  {
    label: '否',
    value: 0
  },
  {
    label: '是',
    value: 1
  }
]
export default {
  extends: components.ResourceBaseList,
  components: {
    Table,
    DataForm,
    FormEnum: Enum,
    FormString
  },
  props: {
    idField: {
      default: 'pannelGroupId'
    }
  },
  data () {
    return {
      resourceType: 'ruleCreatePanel',
      filter: this.getDefaultFilter(),
      pagination: {
        currentPage: 1
      },
      selected: [],
      table: {
        props: {},
        selected: [],
        selectionType: 'multiple',
        header: [
          {
            prop: 'pannelGroupId',
            label: '版块ID'
          },
          {
            label: '版块名称',
            'show-overflow-tooltip': true,
            render: (createElement, { row }) => {
              return createElement('el-button', {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: (event) => {
                    event.stopPropagation()
                    this.handleRead(row)
                  }
                }
              }, row.pannelGroupRemark)
            }
          },
          {
            prop: 'pannelStatus',
            label: '版块状态',
            formatter: (row) => {
              const status = row.pannelStatus
              const currentVersion = row.currentVersion
              return currentVersion + '/' + this.$consts.statusText[status]
            }
          },
          {
            label: '是否运营干预',
            formatter: (row) => {
              const hasIntervene = row.pannelList[0] ? row.pannelList[0].hasIntervene : undefined
              return ['否', '是'][hasIntervene]
            }
          },
          {
            label: '筛选规则',
            render: (h, { row }) => {
              const mediaRuleDesc = row.pannelList[0] ? row.pannelList[0].mediaRuleDesc : undefined
              return h('div', {
                style: { 'white-space': 'pre' }
              }, mediaRuleDesc)
            }
          },
          {
            label: '筛选影片数量',
            formatter: (row) => {
              const mediaFilmNum = row.pannelList[0] ? row.pannelList[0].mediaFilmNum : undefined
              return mediaFilmNum
            }
          }
        ],
        data: [
        ]
      },
      filmNumOptions,
      zeroOneOptions,
      fillTypeOptions: []
    }
  },

  methods: {
    fetchData () {
      const filter = cloneDeep(this.parseFilter())
      const { mediaFilmNumStart, mediaFilmNumEnd } = this.parseFilmNum(filter.filmNumSelect)
      delete filter.filmNumSelect
      filter.mediaFilmNumStart = mediaFilmNumStart
      filter.mediaFilmNumEnd = mediaFilmNumEnd
      this.$service.panelPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    parseFilmNum (val) {
      let mediaFilmNumStart, mediaFilmNumEnd
      switch (val) {
        case 1:
          mediaFilmNumEnd = 10; break
        case 2:
          mediaFilmNumStart = 11; mediaFilmNumEnd = 30; break
        case 3:
          mediaFilmNumStart = 31; mediaFilmNumEnd = 100; break
        case 4:
          mediaFilmNumStart = 100; break
        default:
          break
      }
      return { mediaFilmNumStart, mediaFilmNumEnd }
    },
    getDefaultFilter () {
      return {
        idPrefix: this.$consts.idPrefix,
        fillType: 3,
        hasEdu: undefined,
        hasIntervene: undefined,
        pannelStatus: undefined,
        pannelName: undefined,
        pannelId: undefined,
        pannelResource: undefined,
        filmNumSelect: undefined
      }
    },
    handleResetFilter () {
      this.filter = this.getDefaultFilter()
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  }

}
</script>

<style lang='stylus' scoped>
</style>
