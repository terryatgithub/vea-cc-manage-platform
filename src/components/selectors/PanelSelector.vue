
<template>
    <remote-selector-wrapper
        class="cc-tab-selector"
        title="选择板块"
        @select-start="fetchData"
        @select-end="handleSelectEnd"
    >    
      <div slot="filter">
          <el-form :inline="true">
              <el-form-item label="类型">
                  <el-select v-model="filter.pannelType">
                      <el-option :value="1" label="内容板块">
                      </el-option>
                      <el-option :value="3" label="专辑板块">
                      </el-option>
                      <el-option :value="5" label="专属影院板块">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="板块ID">
                  <el-input v-model="filter.pannelId"></el-input>
              </el-form-item>
              <el-form-item label="板块名称">
                  <el-input v-model="filter.pannelName"></el-input>
              </el-form-item>
              <el-form-item label="业务分类">
                  <el-select v-model="filter.pannelCategory">    
                      <el-option 
                          v-for="(item, index) in panelCategoryOptions" 
                          :key="index" 
                          :value="item.dictId"
                          :label="item.dictCnName"
                      />
                  </el-select>
              </el-form-item>

              <el-form-item label="状态" >
                  <el-select 
                      v-model="filter.pannelStatus" 
                  >    
                      <el-option 
                          v-for="(item, index) in panelStatusOptions" 
                          :key="index" 
                          :value="item.value"
                          :label="item.label"
                      />
                  </el-select>
              </el-form-item>

              <el-form-item label="板块组类型">
                  <el-select v-model="filter.parentType">    
                      <el-option 
                          v-for="(item, index) in parentTypeOptions" 
                          :key="index" 
                          :value="item.value"
                          :label="item.label"
                      />
                  </el-select>
              </el-form-item>

              <el-form-item label="数据来源">
                  <el-select v-model="filter.idPrefix">
                      <el-option label="酷开" value="10"></el-option>
                      <el-option label="江苏广电" value="11"></el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <div class="filter-form__actions">
              <el-button type="primary" @click="fetchData">查询</el-button>
              <el-button type="warning" @click="handleResetFilter">重置</el-button>
          </div>
      </div>

      <Table
        slot="item-list"
        :data="table.data"
        :header="table.header"
        :selected="table.selected"
        :props="table.props"
        :selection-type="selectionType || table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleTableRowSelectionAdd"
        @row-selection-remove="handleTableRowSelectionRemove"
        @row-selection-change="handleTableRowSelectionChange"
        @all-row-selection-change="handleTableAllRowSelectionChange"
      >
      </Table>

      <el-pagination
        slot="pagination"
        @size-change="pagination.rows = $event"
        @current-change="pagination.page = $event"
        :current-page="pagination.page"
        :page-sizes="[15, 20, 30]"
        :page-size="pagination.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </remote-selector-wrapper>
</template>

<script>
import { Table } from 'admin-toolkit'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
export default {
  components: {
    Table,
    RemoteSelectorWrapper
  },
  data() {
    const panelStatusOptions = this.$consts.statusOptions.filter((item) => {
      return [3,4,7].indexOf(item.value) > -1
    })
    const panelStatusOptionsIndexed = panelStatusOptions.reduce((result, item) => {
      result[item.value] = item.label
      return result
    }, {})
      return {
          options: [],
          panelCategoryOptions: [],
          pannelCategoryOptionsIndexed: {},
          panelStatusOptions,
          panelStatusOptionsIndexed,
          parentTypeOptions: [
              {
                  label: '分组板块',
                  value: 'group'
              },
              {
                  label: '功能板块',
                  value: 'function'
              }
          ],
          pagination: {
              page: 1,
              rows: 15,
              total: 0
          },
          filter: {
              idPrefix: window.$idPrefix,
              pannelType: 1,
              panelId: undefined,
              pannelName: undefined,
              pannelCategory: undefined,
              pannelStatus: undefined,
              parentType: undefined,
              pannelResource: undefined,
              resourceIsNull: true,
          },
          table: {
              data: [],
              selected: [],
              header: [
                  {
                      label: 'ID',
                      prop: 'pannelGroupId',
                  }, 
                  {
                      label: "名称",
                      prop: "pannelGroupRemark",
                      'show-overflow-tooltip': true,
                      width: 200
                  },
                  {
                      label: '业务分类',
                      width: 100,
                      render: function(h, scope) {
                          return this.pannelCategoryOptionsIndexed[scope.row.pannelCategory] 
                      }.bind(this)
                  },
                  {
                      label: '布局',
                      width: 200,
                      prop: "fullLayoutName",
                      'show-overflow-tooltip': true,
                  },
                  {
                      label: "引用状态",
                      prop: "fullTabName",
                      'show-overflow-tooltip': true,
                  },
                  {
                      label: '状态',
                      render: function(h, scope) {
                          return  this.panelStatusOptionsIndexed[scope.row.pannelStatus] 
                      }.bind(this)
                  }, 
                  {
                      prop: "lastUpdateDate",
                      label: "更新时间",
                      width: 190
                  },
                  {
                      prop: "userName",
                      label: "更新人",
                      width: 120
                  }
              ],
              selectionType: 'multiple',
              props: {
                  'tooltip-effect': "dark"
              }
          },
          selected: [],
          originSelected: []
      }
  },
  props: ['source', 'selectionType'],
  watch: {
      'pagination.page': 'fetchData',
      'pagination.rows': 'fetchData',
  },
  methods: {
    handleResetFilter() {
        this.filter = {
            idPrefix: window.$idPrefix,
            pannelType: 1,
            panelId: undefined,
            pannelName: undefined,
            pannelCategory: undefined,
            pannelStatus: undefined,
            parentType: undefined,
            pannelResource: undefined,
            resourceIsNull: true,
        }
        this.fetchData()
    },
    handleShadowDragStart() {
        setTimeout(function() {
            this.isDragging = true
        }.bind(this), 0)
    },
    handleShadowDragEnd() {
        this.isDragging = false
    },
    handleClose() {
        this.selected = this.originSelected.slice()
        this.updateTableSelected()
        this.$emit('select-cancel')
    },
    handleSelectEnd() {
        this.$emit('select-end', this.selected.slice())
    },
    fetchData() {
        const filter = JSON.parse(JSON.stringify(this.filter))
        const pagination = this.pagination
        filter.page = pagination.page 
        filter.rows = pagination.rows
        if (!filter.pannelStatus) {
            filter.multiStatus = '3,4'
        }
        filter.pannelResource = this.source
        this.$service.panelPageList(filter).then((data) => {
          this.table.data = data.rows
          this.pagination.total = data.total
        })
    },
    handleTableRowSelectionChange(item, index) {
        this.selected = [{
            id: item.pannelGroupId,
            label: item.pannelGroupRemark,
            data: item
        }]
        this.table.selected = index
    },
    handleTableRowSelectionAdd(targetItem) {
        this.selected = this.selected.concat({
            id: targetItem.pannelGroupId,
            label: targetItem.pannelGroupRemark,
            data: targetItem
        })
        this.updateTableSelected()
    },
    handleTableRowSelectionRemove(targetItem) {
        this.selected = this.selected.filter((item) => {
            return item.id !== targetItem.pannelGroupId
        })        
        this.updateTableSelected()
    },
    updateTableSelected() {
        const table = this.table
        const newSelectedIndex = this.selected.map(item => item.id)
        table.selected = table.data.reduce((result, item, index)=> {
            if (newSelectedIndex.indexOf(item.pannelGroupId) > -1) {
            result.push(index)
            }
            return result
        }, [])
    },
    handleRemoteSelectClear() {
        this.selected = []
        this.table.selected = []
    },
    handleTableAllRowSelectionChange(value) {
        if (value) {
            this.table.data.forEach(this.handleTableRowSelectionAdd)
        } else {
            this.handleRemoteSelectClear()
        }
    }
  },
  created() {
    this.$service.getBusinessType().then((data) => {
      this.panelCategoryOptions = data
      this.pannelCategoryOptionsIndexed = data.reduce(function(result, item) {
          result[item.dictId] = item.dictCnName
          return result
      }, {})
    })
  }
}
</script>
<style>
.cc-tab-selector .el-input {
    max-width: unset;
}
</style>