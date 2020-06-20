<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <!-- 筛选部分 -->
      <el-form
        inline
        ref="form"
        class="form"
        v-form-autocomplete
        v-model="filter"
        @submit.native="handleFilterChange"
        @reset.native="handleFilterReset"
        label-width="90px">
        <el-form-item class="el-col-6">
          <InputPositiveInt clearable name="tabId" autocomplete="on" v-model="filter.tabId" placeholder="版面ID" />
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-input clearable name="tabName" autocomplete="on" v-model="filter.tabName" placeholder="版面标题"/>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select filterable v-model="filter.tabType" placeholder="版面属性" clearable>
            <el-option
              v-for="(item, index) in tabTypeOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select filterable v-model="filter.hasSubTab" clearable placeholder="是否二级tab">
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select filterable v-model="filter.tabCategory" placeholder="业务分类" clearable>
            <el-option
              v-for="(item, index) in businessType"
              :key="index"
              :label="item.dictCnName"
              :value="item.dictId"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select filterable v-model="filter.tabAppid" placeholder="AppId" clearable>
            <el-option
              v-for="item in appIdType"
              :key="item.dictEnName"
              :label="item.dictCnName"
              :value="item.dictEnName"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select filterable v-model="filter.tabStatus" placeholder="状态" clearable>
            <el-option
              v-for="item in tabStatusOption"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="$consts.idPrefix != '10'" class="el-col-6">
          <el-select filterable v-model="filter.idPrefix" placeholder="数据来源">
            <el-option value="10" label="酷开"></el-option>
            <el-option value="11" label="江苏广电"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item-submit">
          <el-button type="primary" native-type="submit">查询</el-button>
          <el-button native-type="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <ButtonGroupForListPage
        v-if="!listProps.isCollectionPage"
        pageName='tab'
        @add="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete">
      </ButtonGroupForListPage>
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
import { ContentWrapper, Table } from 'admin-toolkit'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage,
    InputPositiveInt
  },

  data () {
    return {
      canAdd: false,
      resourceType: 'tabInfo',
      selected: [],
      tabTypeOption: [
        { label: '第三方版面', value: '4' },
        { label: '专题版面', value: '2' },
        { label: '普通版面', value: '1' },
        { label: '分页专题版面', value: '13' },
        { label: '专题Tab版面', value: '14' }
      ],
      tabStatusOption:
      [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      businessType: [],
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      appIdType: [],
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'tabId'
          },
          {
            label: '名称',
            prop: 'tabName',
            'show-overflow-tooltip': true,
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row)
                    }
                  }
                },
                row.tabName
              )
            }
          },
          {
            label: '版面属性',
            prop: 'tabType',
            formatter: function (row) {
              const v = row.tabType
              return (
                {
                  '1': '普通版面',
                  '2': '专题版面',
                  '4': '第三方版面',
                  '5': '信号源版面',
                  '13': '分页专题版面',
                  '14': '专题Tab版面'
                }[v + ''] || '未知版面'
              )
            }
          },
          {
            label: '业务分类',
            prop: 'businessCategoryName'
          },
          {
            label: '内容源',
            prop: 'tabResource',
            formatter: (row) => {
              return this.$consts.sourceText[row.tabResource] || ''
            }
          },
          {
            label: 'AppId',
            prop: 'tabAppid',
            formatter: row => {
              return this.appIdType.map(item => {
                if (row.tabAppid.toString() === item.dictEnName) {
                  return item.dictCnName
                }
              })
            }
          },
          {
            label: '版本/状态',
            prop: 'tabStatus',
            formatter: row => {
              const status = row.tabStatus
              const currentVersion = row.currentVersion
              return (
                currentVersion +
                '/' +
                this.tabStatusOption
                  .map(function (item) {
                    if (status.toString() === item.value) {
                      return item.label
                    }
                  })
                  .join('')
              )
            }
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion',
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row, row.duplicateVersion)
                    }
                  }
                },
                row.duplicateVersion
              )
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: 140
          },
          {
            label: '审核人',
            prop: 'auditor',
            width: 100
          },
          {
            label: '更新人',
            prop: 'modifierName',
            width: 100
          },
          {
            label: '操作',
            width: 180,
            fixed: 'right',
            render: (h, { row }) => {
              return h('div', [
                this.canAdd && h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleCopy(row)
                    }
                  }
                }, '复制'),
                h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleToggleCollect(row)
                    }
                  }
                }, [
                  h('el-icon', { class: row.collected ? 'el-icon-star-on' : 'el-icon-star-off' }),
                  row.collected ? '取消' : '收藏'
                ]),
                (!!row.showContentAuthSettingBtn) && h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleOpenContentAuthManager(row)
                    }
                  }
                }, '内容权限')
              ])
            }
          }
        ],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  props: {
    listProps: {
      type: Object,
      default () {
        return {
          // 是否是 常用tab版面 页面
          isCollectionPage: false
        }
      }
    }
  },
  methods: {
    preventSubmit (event) {
      event.preventDefault()
    },
    handleOpenContentAuthManager (row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.tabId,
        type: 'tab',
        menuElId: 'tabInfo'
      })
    },
    genDefaultFilter () {
      return {
        idPrefix: this.$consts.idPrefix
      }
    },
    fetchData () {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      if (filter.tabId && !/^\d+$/.test(filter.tabId)) {
        return this.$message({
          type: 'error',
          message: 'ID 必须为正整数'
        })
      }
      if (this.listProps.isCollectionPage) {
        this.$service.collectionGetList({ type: 'tab', data: filter }).then(data => {
          this.pagination.total = data.total
          this.table.data = data.rows
        })
      } else {
        this.$service.tabInfoList(filter).then(data => {
          this.pagination.total = data.total
          this.table.data = data.rows
        })
      }
    },
    parseFilter () {
      const pagination = this.pagination
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange () {
      this.pagination.currentPage = 1
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    addTabInfo () {
      this.$emit('create')
    },
    editData () {
      const table = this.table
      const selected = this.table.selected
      const target = table.data[selected[0]]
      this.$emit('edit', target)
    },
    getBusinessType () {
      this.$service.getDictType({ type: 'businessType' }).then(data => {
        this.businessType = data
      })
    },
    handleToggleCollect (row) {
      if (row.collected) {
        this.$service.collectCancel({ type: 'tab', data: { resourceId: row.tabId } }, '取消收藏成功')
          .then(() => {
            this.$set(row, 'collected', false)
          })
      } else {
        this.$service.collect({ type: 'tab', data: { resourceId: row.tabId } }, '收藏成功')
          .then(() => {
            this.$set(row, 'collected', true)
          })
      }
    }
  },
  created () {
    this.$service.getDictType({ type: 'appIdType' }).then(data => {
      this.appIdType = data
      this.fetchData()
    })
    this.getBusinessType()
    this.$service.getButtonGroupForPageList('tab').then(data => {
      this.canAdd = data.some(item => item.runComm === 'add')
    })
  }
}
</script>

<style lang = 'stylus' scoped>
.form >>>.el-form-item__content
  width: 83.33333%
  .el-select
    width: 100%
.form >>>.el-form-item
  margin-right 0px
  margin-bottom 10px
.el-form-item-submit
  width: 200px
</style>
