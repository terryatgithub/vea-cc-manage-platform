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
        <el-button type="primary" icon="el-icon-plus"  @click="addData">新增</el-button>
         <el-button type="primary" icon="el-icon-edit"  @click="editData">编辑</el-button>
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
  data () {
    return {
      parentTypes: {}, //父功能名称
      childTypes: {}, //功能分类
      pictureStatus: {
        下架: 0,
        上架: 1,
        草稿: 2,
        待审核: 3,
        审核通过: 4,
        审核不通过: 5
      },
      source: {
        无: 0,
        腾讯: 1,
        爱奇艺: 2
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
            prop: 'pluginId',
            width: '70'
          },
          {
            label: '功能名称',
            prop: 'pluginName'
          },
          {
            label: '父功能',
            prop: 'pluginParentType'
          },
          {
            label: '内容源',
            prop: 'source',
            render: (createElement, {row}) => {
                switch (row.source) {
                    case 0:
                     return '无'
                     break;
                    case 1:
                     return '腾讯'
                     break;
                    case 2:
                     return '爱奇艺'
                     break;
                }
            }
          },
          {
            label: '状态',
            prop: 'pluginStatus',
            render: (createElement, {row}) => {
                switch (row.pluginStatus) {
                    case 0:
                     return '下架'
                     break;
                    case 1:
                     return '上架'
                     break;
                    case 2:
                     return '草稿'
                     break;
                    case 3:
                     return '待审核'
                     break;
                    case 4:
                     return '审核通过'
                     break;
                    case 5:
                     return '审核不通过'
                     break;
                }
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate'
          },
          {
            label: '操作',
            fixed: 'right',
            render: utils.component.createOperationRender(this, {
              previewData: '预览'
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
    //获取table数据
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getMultiBlockList(filter).then(data => {
        console.log(data)
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    //获取功能父分类
    getPluginParentTypes() {
      this.$service.getPluginParentTypes().then(data =>{
        console.log(data)
        data.forEach(element => {
          this.parentTypes[element.label] = element.value
        })
      })
    },
     //数据字典查询
    getPluginTypes() {
      this.$service.getPluginTypes().then(data => {
        console.log(data)
        if (data.code == 0) {
          data.forEach(element => {
            this.childTypes[element.label] = element.id
          })
        }
      })
    },
    //新增
    addData () {
      this.$emit('open-add-page', null)
    },
    /**
     * 编辑
     */
    editData({row}) {
      if (this.selected.length == 0) {
        this.$message('请选择一条数据')
      }
      else if (this.selected.length >1) {
        this.$message('只能选择一条')
      }
      else {
        this.$emit('open-add-page', this.selected[0])
      }
    },
    //预览
    previewData({row}) {
      this.$emit('open-view-page', row.pluginId)
    },
    //删除
    batchDel () {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      else if (this.selected.length > 1) {
        this.$message('只能选择一条数据')
      }
      else {
        if (window.confirm('确定要删除吗')) {
          this.$service.removeMulti({id: this.selected[0]}, '删除成功').then(data => {
            this.fetchData()
          })
        }
      }
    },
    handleCreate () {
      this.$router.push({ name: 'prize-create' })
    },
    handleRowSelectionAdd (targetItem) {
      this.selected.push(targetItem.pluginId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.pluginId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange (value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    handleAllRowSelectionRemove () {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected () {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.pluginId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    handleFilterChange (type) {
      if (type === 'filter') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
},
  created () {
    let filterSchema = _.map({
      pluginId: _.o.string.other("form", {
        component: "Input",
        placeholder: 'ID',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pluginName: _.o.string.other("form", {
        component: "Input",
        placeholder: '功能名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pluginParentType: _.o.enum(this.parentTypes).other('form', {
        component: 'Select',
        placeholder: '父功能名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pluginStatus: _.o.enum(this.pictureStatus).other('form', {
        component: 'Select',
        placeholder: '状态',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pluginType: _.o.enum(this.depts).other('form', {
        component: 'Select',
        placeholder: '功能分类',
        cols: {
          item: 3,
          label: 0
        }
      }),
      source: _.o.enum(this.source).other('form', {
        component: 'Select',
        placeholder: '内容源',
        cols: {
          item: 3,
          label: 0
        }
      })
      })
      .other('form', {
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
    this.getPluginParentTypes()
    this.getPluginTypes()
    this.filterSchema = filterSchema
    this.fetchData()
  }
  }
</script>
<style lang = 'stylus' scoped>
.btns
  margin-bottom 10px
.checkItemStyle
  margin 10px
</style>
