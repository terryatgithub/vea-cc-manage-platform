<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addData">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="deleteData">批量删除</el-button>
      </div>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import ButtonList from './../../components/ButtonLIst'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper
  },
  data() {
    return {
      businessTypes: {}, //业务分类
      pannelResources: {
        腾讯: 'o_tencent',
        爱奇艺: 'o_iqiyi',
        优朋: 'o_voole'
      },
      pannelStatuses: {
        下架: 0,
        上架: 1,
        草稿: 2,
        待审核: 3,
        审核通过: 4,
        审核不通过: 5
      },
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'pannelGroupId',
            width: '90'
          },
          {
            label: '名称',
            prop: 'pannelGroupRemark',
            width: '100'
          },
          {
            label: '业务分类',
            prop: 'categoryName',
            width: '90'
          },
          {
            label: '内容源',
            prop: 'pannelList',
            width: '90',
            render: (createElement, { row }) => {
              if (row.pannelList.length <0) {
                return ''
              } else {
                switch (row.pannelList[0].pannelResource) {
                  case 'o_tencent':
                    return '腾讯'
                    break
                  case 'o_iqiyi':
                    return '爱奇艺'
                    break
                  case 'o_voole':
                    return '优朋'
                    break
                }
              }
            }
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'min-width': '90'
          },
          {
            label: '版本/状态',
            prop: 'pannelStatus',
            width: '90',
            render: (createElement, { row }) => {
              switch (row.pannelStatus) {
                case 0:
                  return '下架'
                  break
                case 1:
                  return '上架'
                  break
                case 2:
                  return '草稿'
                  break
                case 3:
                  return '待审核'
                  break
                case 4:
                  return '审核通过'
                  break
                case 5:
                  return '审核不通过'
                  break
              }
            }
          },
          {
            label: '当前版本',
            prop: 'currentVersion',
            width: '70'
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion',
            width: '90'
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate'
          },
          {
            label: '操作',
            fixed: 'right',
            render: utils.component.createOperationRender(this, {
              preview: '预览'
            })
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    /**获取列表数据 */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getMarkPanelList(filter).then(data => {
        console.log(data)
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
        filter.idPrefix = '10'
        filter.pannelType = '8'
      }
      return filter
    },
    /**新增 */
    addData() {
      this.$emit('open-add-page', null)
    },
    /**编辑 */
    editData() {
      if (this.selected.length == 0) {
        this.$message('请选择一条数据')
      } else if (this.selected.length > 1) {
        this.$message('只能选择一条数据')
      } else {
        console.log(this.selected)
        this.$emit('open-add-page', this.selected[0])
      }
    },
    /**批量删除 */
    deleteData() {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      if (window.confirm('确定要删除吗')) {
        this.$service
          .deleteMarkPanel({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.fetchData()
          })
      }
    },
    /**预览 */
    preview({ row }) {
      this.$emit('open-view-page', row.pannelGroupId)
    },
    /**获取业务分类 */
    getBusinessType() {
      return this.$service.getBusinessType().then(data => {
        data.forEach(element => {
          this.businessTypes[element.dictCnName] = element.dictId
        })
        console.log(this.businessTypes)
      })
    },
    /**表格操作 */
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.pannelGroupId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.pannelGroupId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.pannelGroupId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    //查询
    handleFilterChange(type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    //重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    }
  },
  created() {
    let filterSchema = _.map({
      pannelGroupId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pannelGroupRemark: _.o.string.other('form', {
        component: 'Input',
        placeholder: '名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
      categoryName: _.o.enum(this.businessTypes).other('form', {
        component: 'Select',
        placeholder: '业务分类',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pannelResource: _.o.enum(this.pannelResources).other('form', {
        component: 'Select',
        placeholder: '内容源',
        cols: {
          item: 3,
          label: 0
        }
      }),
      fullTabName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '引用状态',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pannelStatus: _.o.enum(this.pannelStatuses).other('form', {
        component: 'Select',
        placeholder: '状态',
        cols: {
          item: 3,
          label: 0
        }
      })
    }).other('form', {
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
    this.fetchData()
    this.getBusinessType().then(() => {
      this.filterSchema = filterSchema
    })
  }
}
</script>

<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
}
</style>