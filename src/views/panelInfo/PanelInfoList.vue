<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper
      :pagination="pagination"
      @filter-change="fetchData">
      <el-form
        class="form el-row"
        v-form-autocomplete
        @submit.native="handleFilterChange"
        @reset.native="handleFilterReset"
        :model="filter"
        :inline="true"
        label-width="0px">
        <el-form-item label="" class="el-col-6">
         <el-select clearable filterable v-model="filter.pannelCategory" placeholder="业务分类">
           <el-option v-for="item in businessTypeOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="" class="el-col-6">
          <InputPositiveInt v-model="filter.pannelId" placeholder="ID" clearable name="pannelId" autocomplete="on"></InputPositiveInt>
        </el-form-item>
        <el-form-item label="" class="el-col-6">
          <el-input v-model="filter.pannelName" placeholder="版块名称" clearable name="pannelName" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="" class="el-col-6">
          <el-input v-model="filter.pannelTitle" placeholder="版块标题" clearable name="pannelTitle" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="" class="el-col-6">
          <el-input v-model="filter.tabName" placeholder="引用状态" clearable name="tabName" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="" class="el-col-6">
         <el-select clearable filterable v-model="filter.pannelResource" placeholder="内容源">
           <el-option v-for="item in $consts.sourceOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="" class="el-col-6">
         <el-select clearable filterable v-model="filter.pannelStatus" placeholder="状态">
           <el-option v-for="item in $consts.statusOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="" class="el-col-6">
         <el-select clearable filterable v-model="filter.pannelType" placeholder="版块类别">
           <el-option v-for="item in panelTypeOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="" class="el-col-6">
         <el-select clearable filterable v-model="filter.fillType" placeholder="版块内容来源">
           <el-option v-for="item in fillTypeOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item v-if="$consts.idPrefix !== '10'" label="" class="el-col-6">
         <el-select filterable v-model="filter.idPrefix" placeholder="数据来源">
           <el-option v-for="item in $consts.idPrefixOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-button type="primary" native-type="submit">查询</el-button>
          <el-button native-type="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <ButtonGroupForListPage
        pageName='panel'
        @add="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
        >
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
import _ from 'gateschema'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import InputPositiveInt from '@/components/InputPositiveInt'
import { isFrozen } from './frozen'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage,
    InputPositiveInt
  },

  props: {
    // 影片详情页中添加版块
    dataList: {
      type: Object
    }
  },

  data () {
    return {
      canAdd: false,
      resourceType: 'panelInfo',
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      businessTypeOptions: [],
      panelTypeOptions: [
        {
          label: '影视推荐版块',
          value: 6
        },
        {
          label: '定向版块',
          value: 7
        },
        {
          label: '常规版块',
          value: 1
        }
      ],
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'pannelGroupId'
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
                    this.handleRead(row)
                  }
                }
              }, row.pannelGroupRemark)
            }
          },
          {
            label: '布局',
            width: '150',
            prop: 'fullLayoutName'
          },
          {
            label: '业务分类',
            prop: 'categoryName'
          },
          {
            label: '内容源',
            prop: 'pannelResource',
            formatter: (row) => {
              return this.$consts.sourceText[row.pannelList[0].pannelResource]
            }
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'show-overflow-tooltip': true
          },
          {
            label: '版本/状态',
            prop: 'pannelStatus',
            width: '130',
            formatter: (row) => {
              const status = row.pannelStatus
              const currentVersion = row.currentVersion
              return currentVersion + '/' + this.$consts.statusText[status]
            }
          },
          {
            label: '版块内容来源',
            formatter: (row) => {
              return this.$consts.panelFillTypeText[row.pannelList[0].fillType]
            }
          },
          {
            label: '待审核副本',
            width: '100',
            render: (h, { row }) => {
              return h('el-button', {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: (event) => {
                    event.stopPropagation()
                    this.handleRead(row, row.duplicateVersion)
                  }
                }
              }, row.duplicateVersion)
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: '140',
            'show-overflow-tooltip': true
          },
          {
            label: '审核人',
            prop: 'auditor',
            width: '100'
          },
          {
            label: '更新人',
            width: '100',
            prop: 'userName'
          },
          {
            label: '操作',
            fixed: 'right',
            width: 180,
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
      },
      selected: [],
      fillTypeOptions: []
    }
  },

  watch: {
    selected: {
      handler (newVal, oldVal) {
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
    checkAction (row, action, cb) {
      const items = Array.isArray(row) ? row : [row]
      const frozenItem = items.find(isFrozen)
      if (['edit', 'delete', 'copy'].includes(action) && frozenItem) {
        return this.$message.error(`版块 ${frozenItem.pannelGroupRemark} 为保留版块，不能进行当前操作`)
      }
      cb()
    },
    handleOpenContentAuthManager (row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.pannelGroupId,
        menuElId: 'pannelInfo',
        type: 'pannel'
      })
    },
    genDefaultFilter () {
      return {
        idPrefix: this.$consts.idPrefix
      }
    },
    fetchData () {
      const filter = this.parseFilter()
      if (this.dataList) {
        this.$service.panelDataList(filter).then(data => {
          this.pagination.total = data.total
          this.table.data = data.rows
        })
      } else {
        this.$service.panelPageList(filter).then(data => {
          this.pagination.total = data.total
          this.table.data = data.rows
        })
      }
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
    handleFilterChange () {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    getBusinessType () {
      return this.$service.getDictType({ type: 'businessType' }).then(data => {
        this.businessTypeOptions = data.map(item => {
          return {
            label: item.dictCnName,
            value: item.dictId
          }
        })
      })
    },
    getFillType () {
      return this.$service.getMediaFillType().then(data => {
        this.fillTypeOptions = data.map(item => {
          return {
            label: item.dictCnName,
            value: item.dictEnName
          }
        })
      })
    },
    handleToggleCollect (row) {
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
  created () {
    this.getBusinessType()
    this.getFillType()
    this.fetchData()
    this.$service.getButtonGroupForPageList('panel').then(data => {
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
