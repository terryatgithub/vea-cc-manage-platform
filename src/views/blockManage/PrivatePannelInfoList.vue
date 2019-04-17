<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <div v-if="dataList === undefined " class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addTabInfo">新增</el-button>
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
  </ContentCard>
</template>

<script>
import { ContentWrapper, Table } from 'admin-toolkit'
import _ from 'gateschema'
export default {
  components: {
    ContentWrapper,
    Table
  },
  props: {
    dataList: {
      type: Object
    }
  },
  data() {
    return {
      pannelStatusOption: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      pannelCategories: {},
      pannelStatus: {},
      pannelResources: {
        腾讯: 'o_tencent',
        爱奇艺: 'o_iqiyi',
        优朋: 'o_voole'
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
            width: '100',
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.openReview(row)
                    }
                  }
                },
                row.pannelGroupRemark
              )
            }
          },
          {
            label: '业务分类',
            prop: 'categoryName',
            width: '90'
          },
          {
            label: '引用状态',
            prop: 'fullTabName'
          },

          {
            label: '版本/状态',
            prop: 'pannelStatus',
            formatter: row => {
              const status = row.pannelStatus
              const currentVersion = row.currentVersion
              return (
                currentVersion +
                '/' +
                this.pannelStatusOption
                  .map(function(item) {
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
            width: '90',
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.openReview(row)
                    }
                  }
                },
                row.duplicateVersion
              )
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate'
          },
          {
            label: '审核人',
            prop: 'auditor'
          },
          {
            label: '更新人',
            prop: 'userName'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    //初始化表格‘
    fetchData() {
      const filter = this.parseFilter()
      if (this.dataList) {
        this.$service.privatePannelInfo(filter).then(data => {
          this.pagination.total = data.total
          this.table.data = data.rows
        })
      } else {
        this.$service.privatePannelInfo(filter).then(data => {
          this.pagination.total = data.total
          this.table.data = data.rows
        })
      }
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    //新增
    addTabInfo() {
      this.$emit('open-add-page', null)
    },
    //编辑
    editData() {
      var that = this
      if(that.selected.length==0) {
        that.$message('请选择一条数据')
      } else if (that.selected.length >1){
        that.$message('只能选择一条数据')
      } else {
        for (var j = 0; j < that.table.data.length; j++) {
            if (that.selected[0] == that.table.data[j].pannelGroupId) {
              if (that.table.data[j].pannelStatus == 2) {
             that.$emit('open-add-page', that.selected[0])
              } else {
                that.$message('该状态不允许编辑')
              }
            }
          }
      }
    },
    //删除
    batchDel() {
      debugger
      var that = this
      if(that.selected.length ==0 ) {
        that.$message('未选中记录')
      } else {
        const ids = that.selected
        for(var i=0;i<ids.length;i++) {
          for(var j=0;j<that.table.data.length;j++) {
            if(ids[i] == that.table.data[j].pannelGroupId) {
              //待审核不能删除
              if(that.table.data[j].pannelStatus==3) {
                that.$message('待审核状态下不允许删除')
              } else {
                that.$service.remove({id: ids.join(',')}, '删除成功').then(data => {
                  that.fetchData()
                })
              }
            }
          }
        }
      }
    },
    openReview(row) {
      this.$emit('open-view-page',row)
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
    handleFilterReset() {
      if (this.dataList) {
        this.filter = Object.assign({}, this.dataList.filter)
        console.log(this.filter)
      } else {
        this.filter = {
          sort: undefined,
          order: undefined
        }
      }
      this.fetchData()
    },
    //获取业务分类
    getDictType() {
      return this.$service.getDictType().then(data => {
        data.forEach(element => {
          this.pannelCategories[element.label] = element.id
        })
      })
    },
    //表格操作
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
    }
  },
  created() {
    this.pannelStatus = this.pannelStatusOption.reduce((result, item) => {
      result[item.label] = item.value
      return result
    }, {})
    let filterSchema = _.map({
      pannelId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pannelName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pannelTitle: _.o.string.other('form', {
        component: 'Input',
        placeholder: '标题',
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
      pannelCategory: _.o.enum(this.pannelCategories).other('form', {
        component: 'Select',
        placeholder: '业务分类',
        cols: {
          item: 3,
          label: 0
        }
      }),
      tabName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '引用状态',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pannelStatus: _.o.enum(this.pannelStatus).other('form', {
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
    const dataList = this.dataList
    if (dataList) {
      this.filter = Object.assign({}, dataList.filter)
      this.table = dataList.table
    }
 
    this.getDictType().then(() => {
      this.filterSchema = filterSchema
    })
       this.fetchData()
  }
}
</script>
<style lang="stylus" scoped>
.btns {
   margin-bottom: 10px;
}
</style>