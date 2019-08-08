<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <!-- <ButtonGroupForListPage
        pageName='panel'
        @add="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
        >
        </ButtonGroupForListPage> -->
      <div style="margin: 5px 0 10px 0">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </div>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import BaseList from '@/components/BaseList'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import _ from 'gateschema'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
const ID = 'pannelGroupId'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage
  },
  props: {
  },
  data () {
    return {
      resourceType: 'panelRecommend',
      filter: this.genDefaultFilter(),
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      businessType: {},
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'panelGroupId'
          },
          {
            label: '名称',
            minWidth: '180',
            'show-overflow-tooltip': true,
            render: (createElement, { row }) => {
              return createElement('el-button', {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: (event) => {
                    event.stopPropagation()
                    this.handleRead(row, row.panelGroupVersion)
                  }
                }
              }, row.panelGroupName)
            }
          },
          {
            label: '版本',
            prop: 'panelGroupVersion'
          },
          {
            label: '内容源',
            prop: 'pannelResource',
            formatter: (row) => {
              return this.$consts.sourceText[row.source]
            }
          },
          {
            label: '可推荐',
            prop: 'pannelResource',
            formatter: (row) => {
              return row.flag ? '是' : '否'
            }
          },
          // {
          //   label: '待审核副本',
          //   width: '100',
          //   render: (h, { row }) => {
          //     return h('el-button', {
          //       attrs: {
          //         type: 'text'
          //       },
          //       on: {
          //         click: (event) => {
          //           event.stopPropagation()
          //           this.handleRead(row, row.duplicateVersion)
          //         }
          //       }
          //     }, row.duplicateVersion)
          //   }
          // },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: '140',
            'show-overflow-tooltip': true
          },
          // {
          //   label: '更新人',
          //   width: '100',
          //   prop: 'userName'
          // },
          {
            label: '操作',
            fixed: 'right',
            width: 180,
            render: (h, { row }) => {
              return h('el-button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: (event) => {
                    event.stopPropagation()
                    this.handleToggleRecommendFlag(row)
                  }
                }
              },  row.flag ? '不可推荐' : '可推荐')
            }
          }
        ],
        selected: [],
        selectionType: 'multiple'
      },
      selected: []
    }
  },

  watch: {
    selected: {
      handler(newVal, oldVal) {
        const table = this.table
        let rows = []
        table.data.map(tableRow => {
          if (newVal.indexOf(tableRow.pannelGroupId) > -1) {
            let row = {
              pannelGroupId: tableRow.pannelGroupId,
              pannelGroupRemark: tableRow.pannelGroupRemark,
              duplicateVersion: tableRow.duplicateVersion
            }
            rows.push(row)
          }
        })
        this.$emit('input', rows)
      }
    }
  },

  methods: {
    handleOpenContentAuthManager(row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.pannelGroupId,
        menuElId: 'pannelInfo',
        type: 'pannel'
      })
    },
    genDefaultFilter() {
      return {
        panelGroupId: undefined,
        panelGroupName: undefined,
        source: undefined
      }
    },
    handleToggleRecommendFlag(row) {
      const flag = row.flag ? 0 : 1
      this.$service.panelRecommendFlagUpsert({panelGroupId: row.panelGroupId, flag}, '设置成功').then(() => {
        row.flag = flag
      })
    },
    fetchData() {
      const filter = this.parseFilter()
      this.$service.panelRecommendList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (this.$validateId(this.filter.pannelId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    handleFilterReset() {
      console.log(this.dataList)
      if (this.dataList) {
        this.filter = Object.assign({}, this.dataList.filter)
        console.log(this.filter)
      } else {
        this.filter = this.genDefaultFilter()
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    getBusinessType() {
      return this.$service.getDictType({ type: 'businessType' }).then(data => {
        data.forEach((item) => {
          this.businessType[item.dictCnName] = item.dictId
        })
      })
    },
    handleToggleCollect(row) {
      if (row.collected) {
        this.$service.collectCancel({ type: 'pannel', data: { resourceId: row.pannelGroupId } }, '取消收藏成功')
          .then(() => {
            this.$set(row, 'collected', false)
          })
      } else {
        this.$service.collect({ type: 'pannel', data: { resourceId: row.pannelGroupId } }, '收藏成功')
          .then(() => {
            this.$set(row, 'collected', true)
          })
      }
    }
  },
  created() {
    this.$service.getDictType({ type: 'recommendStreamSign' }).then(data => {
      const panelGroupCategoryEnums = data.reduce((result, {dictCnName}) => {
        result[dictCnName] = dictCnName
        return result
      }, {})
      const filterSchema = _.map({
        panelGroupId: _.o.string.other('form', {
          placeholder: 'ID',
          component: 'Input',
          name: 'pannelId',
          autocomplete: 'on'
        }),
        panelGroupName: _.o.string.other('form', {
          placeholder: '版块名称',
          component: 'Input',
          name: 'pannelName',
          autocomplete: 'on'
        }),
        source: _.o.enum(this.$consts.sourceEnums).other('form', {
          placeholder: '内容源',
          component: 'Select'
        }),
        panelGroupCategory: _.o.enum(panelGroupCategoryEnums).other('form', {
          placeholder: '推荐流',
          component: 'Select'
        })
      })
      .other('form', {
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
    })
    this.fetchData()
  }
}
</script>

<style lang='stylus' scoped>
</style>
