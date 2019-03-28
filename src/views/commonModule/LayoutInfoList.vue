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
        <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">删除</el-button>
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
import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper
  },
  data() {
    return {
      layoutType: {
        '主页6.0': 1,
        '影视V2': 2
      },
      layoutIsTitle: {
        带标题: 1,
        不带标题: 0
      },
      layoutStatus: {
        上架: 1,
        下架: 0,
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
            prop: 'layoutId',
            width: '70'
          },
          {
            label: '名称',
            width: '170',
            prop: 'layoutName',
            sortable: true,
            render: (createElement, { row }) => {
              return createElement('el-button', {
                attrs:{
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.openReview(row.layoutId)
                  }
                }
              },row.layoutName)
            }
          },
          {
            label: '分类',
            prop: 'layoutType',
            width: '80',
            render: (createElement, { row }) => {
              if (row.layoutType === 1) {
                return '主页6.0'
              } else {
                return '影视V2'
              }
            }
          },
          {
            label: '布局标题',
            prop: 'layoutIsTitle',
            width: '80',
            render: (createElement, { row }) => {
              if (row.layoutIsTitle === 1) {
                return '带标题'
              } else {
                return '不带标题'
              }
            }
          },
          {
            label: '扩展方式',
            prop: 'layoutFlag',
            width: '80',
            render: (createElement, { row }) => {
              if (typeof row.layoutFlag === 'undefined') {
                return '无'
              } else {
                switch(row.layoutFlag) {
                  case 0:
                    return '横向扩展11'
                    break
                  case 1:
                    return '纵向扩展22'
                    break
                }
              }
            }
          },
          {
            label: '间距',
            prop: 'space',
            width: 70,
            sortable:true
          },
          {
            label: '高度',
            prop: 'height',
             width: 70,
            sortable: true
          },
           {
            label: '宽度',
            prop: 'width',
            width: 70,
            sortable: true
          },
            {
            label: '状态',
            prop: 'layoutStatus',
            width: 70,
            render: (createElement, {row}) => {
               let content='';
						switch(row.layoutStatus){
							case 0:
								content='下架';
								break;
							case 1:
								content='上架';
								break;
							case 2:
								content='草稿';
								break;
							case 3:
								content='待审核';
								break;
							case 4:
								content='已审核';
								break;
							case 5:
								content='审核不通过';
								break;
						}
						return content
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
            render :(createElement, {row}) => {
               return row.modifierName
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    /**
     * 新增用户
     */
    addItem() {
      this.$emit('open-add-page', null)
    },
    openReview(layoutId) {
      
    },
    editData() {
      if( this.$isAllowEdit(this.selected)) {
         this.$emit('open-add-page',this.selected[0])
      }
    },
    /**
     * 批量删除
     */
    batchDel() {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      if (window.confirm('确定要删除吗')) {
        this.$service
          .getLayoutInforBatchDel(
            { id: this.selected.join(',') },
            '删除成功'
          )
          .then(data => {
            this.fetchData()
          })
      }
    },
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.layoutId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.layoutId
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
        if (newSelectedIndex.indexOf(item.layoutId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    handleFilterChange(type) {
      if (type === 'filter') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getLayoutInforPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      layoutName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '布局名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
         layoutType: _.o.enum(this.layoutType).other('form', {
        component: 'Select',
        placeholder: '布局分类',
        cols: {
          item: 3,
          label: 0
        }
      }),
          layoutIsTitle: _.o.enum(this.layoutIsTitle).other('form', {
        component: 'Select',
        placeholder: '布局标题',
        cols: {
          item: 3,
          label: 0
        }
      }),
      layoutStatus: _.o.enum(this.layoutStatus).other('form', {
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
    this.filterSchema = filterSchema
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped>
.pics img
  max-width: 350px
  max-height: 500px
.content
  >>> table .imgs
    cursor: pointer
.btns
  margin-bottom: 10px
.checkItemStyle
  margin: 10px
</style>
