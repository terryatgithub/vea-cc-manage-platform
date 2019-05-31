<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <!-- 筛选部分 -->
      <el-form inline ref="form" v-model="filter" label-width="0px" class="form">
        <el-form-item class="el-col-6">
          <el-input v-model="filter.pluginId" placeholder="ID"/>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-input v-model="filter.pluginName" placeholder="功能名称"/>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select v-model="filter.pluginParentType" placeholder="父功能分类" @change="getPluginType">
            <el-option
              v-for="(item, index) in parentTypes"
              :key="index"
              :label="item.dictCnName"
              :value="item.dictEnName"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select v-model="filter.pluginType" placeholder="功能分类">
            <el-option
              v-for="(item, index) in pluginType"
              :key="index"
              :label="item.dictCnName"
              :value="item.dictEnName"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select v-model="filter.pluginStatus" placeholder="状态">
            <el-option
              v-for="(item, index) in pictureStatus"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-col-6">
          <el-select v-model="filter.source" placeholder="内容源">
            <el-option value>请选择</el-option>
            <el-option
              v-for="(item, index) in source"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item-submit">
          <el-button type="primary" @click="handleFilterChange">查询</el-button>
          <el-button @click="handleFilterReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div></div>
      <!-- 筛选部分end -->
      <ButtonGroupForListPage
        pageName="multiFunctionBlock"
        @add="addData"
        @edit="editData"
        @delete="batchDel"
      ></ButtonGroupForListPage>
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
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    return {
      pluginType: [],
      parentTypes: [],
      childTypes: {}, //功能分类
      pictureStatus: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      source: [
        { label: '无', value: 0 },
        { label: '腾讯', value: 1 },
        { label: '爱奇艺', value: 2 },
        { label: '优酷', value: 3 }
      ],
      filter: {},
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
            prop: 'pluginName',
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.previewData(row)
                    }
                  }
                },
                row.pluginName
              )
            }
          },
          {
            label: '内容源',
            prop: 'source',
            render: (createElement, { row }) => {
              switch (row.source) {
                case 0:
                  return '无'
                  break
                case 1:
                  return '腾讯'
                  break
                case 2:
                  return '爱奇艺'
                  break
                 case 3:
                  return '优酷'
                  break
              }
            }
          },
          {
            label: '状态',
            prop: 'pluginStatus',
            render: (createElement, { row }) => {
              switch (row.pluginStatus) {
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
            label: '更新时间',
            prop: 'lastUpdateDate'
          }
          // {
          //   label: '操作',
          //   fixed: 'right',
          //   render: utils.component.createOperationRender(this, {
          //     previewData: '预览'
          //   })
          // }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    getPluginType() {
      this.$service
        .getPluginType({ pluginParentType: this.filter.pluginParentType })
        .then(data => {
          this.pluginType = data
        })
    },
    //获取table数据
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getMultiBlockList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    //获取功能父分类
    getPluginParentTypes() {
      this.$service.getPluginParentTypes().then(data => {
        this.parentTypes = data
      })
    },
    // //数据字典查询
    // getPluginTypes() {
    //   this.$service.getPluginTypes().then(data => {
    //     console.log(data)
    //     if (data.code == 0) {
    //       data.forEach(element => {
    //         this.childTypes[element.label] = element.id
    //       })
    //     }
    //   })
    // },
    //新增
    addData() {
      this.$emit('open-add-page', null)
    },
    /**
     * 编辑
     */
    editData() {
      if (this.$isAllowEdit(this.selected)) {
          this.$emit('open-add-page', this.selected[0])
        }
    },
    //预览
    previewData(row) {
      this.$emit('open-view-page', row.pluginId)
    },
    //删除
    batchDel() {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      } else if (this.selected.length > 1) {
        this.$message('只能选择一条数据')
      } else {
        if (window.confirm('确定要删除吗')) {
          this.$service
            .removeMulti({ id: this.selected[0] }, '删除成功')
            .then(data => {
              this.fetchData()
            })
        }
      }
    },
    // handleCreate() {
    //   this.$router.push({ name: 'prize-create' })
    // },
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.pluginId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.pluginId
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
        if (newSelectedIndex.indexOf(item.pluginId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
   handleFilterChange(type) {
      if(this.$validateId(this.filter.pluginId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    }
  },
  created() {
    this.getPluginParentTypes()
    // this.getPluginTypes()
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped>
.checkItemStyle
  margin: 10px
.form >>>.el-form-item__content
  width: 83.33333%
  .el-select
    width: 100%
.form >>>.el-form-item
  margin-right: 0px
.el-form-item-submit
  width: 200px
</style>
