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
        <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
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

    <!-- 大图预览 -->
    <el-dialog title="大图预览" :visible.sync="onclickPictureVisible" width="70%">
      <img :src="URL" width="100%"/>
    </el-dialog>
    <!-- 大图预览end -->
  </ContentCard>
</template>

<script>
import { Button } from 'element-ui'
import { ContentWrapper, Table } from 'admin-toolkit'
import _ from 'gateschema'

export default {
  components: {
    ContentWrapper,
    Table
  },

  data () {
    return {
      URL: '',
      onclickPictureVisible: false,
      filterSchema: null,
      filter: {
        sort: undefined,
        order: undefined
      },
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      selected: [],
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'themeId',
            sortable: true
          },
          {
            label: '主题名称',
            prop: 'themeName',
            sortable: true,
            render: (h, {row}) => {
              return h( Button,
                {
                  props: {
                    type: 'success',
                  },
                  on: {
                    click: () => this.themeInfoPreview(row.themeId)
                  }
                }, row.themeName
              )
            }
          },
          {
            label: '主题品牌',
            prop: 'themeBrand',
            sortable: true,
            formatter: function(row) {
              if (row.themeBrand === 'Coocaa'){
                  return '创维酷开'
              }else if(row.themeBrand === 'Other'){
                  return '全部'
              }
            }
          },
          {
            label: '系统默认',
            prop: 'systemDefault',
            sortable: true,
            formatter: function(row) {
              var systemDefault = ['否', '是']
              return systemDefault[row.systemDefault]
            }
          },
          {
            label: '状态',
            prop: 'themeStatus',
            sortable: true,
            formatter: function(row) {
              var status = ['下架', '上架', '草稿', '待审核', '审核通过', '审核不通过']
              return status[row.themeStatus]
            }
          },
          {
            label: '主题当前版本',
            prop: 'currentVersion',
            sortable: true
          },
          {
            label: '主题预览图',
            prop: 'previewImgUrl',
            sortable: true,
            render: (h, {row}) => {
              if(!row.previewImgUrl) return
              return h('img', {
                attrs: {
                  src: row.previewImgUrl,
                  width: "100px",
                  height: "45px",
                  class: "imgs"
                },
                on: {
                  click: () => {
                    this.URL = row.previewImgUrl
                    this.onclickPictureVisible = true
                  }
                }
              })
            }
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion',
            sortable: true,
            render: (h, {row}) => {
              if(!row.duplicateVersion) return
              return h( Button,
                {
                  props: {
                    type: 'success',
                  },
                  on: {
                    click: () => this.duplicatePreview(row.themeId, row.currentVersion)
                  }
                }, row.duplicateVersion
              )
            }
          },
          {
            label: '原价(元)',
            prop: 'price',
            sortable: true,
            formatter: function(row) {
              return row.chargeType ? row.price : '免费'
            }
          },
          {
            label: '折扣价(元)',
            prop: 'discountPrice',
            sortable: true,
            formatter: function(row) {
              return row.chargeType ? row.discountPrice : '免费'
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            sortable: true
          },
          {
            label: '更新人',
            prop: 'modifierName',
            sortable: true
          }
        ],
        selected: [],
        selectionType: 'multiple'
      }
    };
  },

  methods: {
    fetchData() {
      const filter = this.parseFilter()
      this.$service.themeInfoPageList(filter).then(data => {
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
    handleFilterChange(type) {
      if (type !== 'pagination') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {}
      this.fetchData()
    },
    // 按钮操作
    addUser() {
      this.$emit('open-add-page')
    },
    editData() {
      const selected = this.selected
      if(selected.length !== 1) {
        this.$message('只能选择一条数据')
        return false
      }
      const data = this.table.data
      const status = data.find(item => {
        return item.themeId === selected[0]
      }).themeStatus
      if(status === 4) {
        this.$alert('审核通过的数据无法编辑！', '操作提示')
        return false
      }
      this.$emit('open-add-page', selected[0])
    },
    batchDel() {
      const selected = this.selected.join(',')
      this.$service.themeInfoRemove({id: selected})
    },
    /**
     * 行选择操作
     */
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.themeId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.themeId
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
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.themeId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    // 预览主题
    themeInfoPreview(id) {
      this.$service.themeInfoDetail({ id }).then(data => {
        this.$emit('open-preview-page', data)
      })
    },
    // 副本
    duplicatePreview(id, version) {
      this.$service.themeInfoDetail({ id, version }).then(data => {
        this.$emit('open-preview-page', data)
      })
    }
  },
  created() {
    let filterSchema = _.map({
      themeId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '主题ID'
      }),
      themeName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '主题名称'
      }),
      currentVersion: _.o.string.other('form', {
        component: 'Input',
        placeholder: '当前版本'
      }),
      themeStatus: _.o.enum({'待审核': '3', '审核通过': '4', '审核不通过': '5'}).other('form', {
        component: 'Select',
        placeholder: '状态'
      })
    }).other('form', {
      cols: {
        item: 3,
        label: 0
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
    this.fetchData()
  }

}
</script>

<style lang='stylus' scoped>
.content >>> .el-table .cell
  display flex
  justify-content center
  align-items center
  height 50px
</style>