<template>
    <remote-selector-wrapper
        class="cc-tab-selector"
        title="选择版面"
        @select-start="handleSelectStart"
        @select-end="handleSelectEnd"
    >    
        <div slot="filter">
            <el-form :inline="true">
                <el-form-item label="版面ID">
                    <el-input v-model="filter.tabId"></el-input>
                </el-form-item>
                <el-form-item label="版面名称">
                    <el-input v-model="filter.tabName"></el-input>
                </el-form-item>
                <el-form-item label="版面分类">
                    <el-select v-model="filter.tabCategory" :clearable="true">    
                        <el-option 
                            v-for="(item, index) in tabCategoryOptions" 
                            :key="index" 
                            :value="item.dictId"
                            :label="item.dictCnName"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="版面属性" :clearable="true">
                    <el-select v-model="filter.tabType">    
                        <el-option 
                            v-for="(item, index) in tabTypeOptions" 
                            :key="index" 
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="审核状态" >
                    <el-select 
                        v-model="filter.tabStatusArray" 
                        :clearable="true" 
                    >    
                        <el-option 
                            v-for="(item, index) in tabStatusOptions" 
                            :key="index" 
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item v-if="source === undefined" label="内容源" >
                    <SourceSelector v-model="filter.tabResource" />
                </el-form-item>

                <el-form-item v-show="$consts.idPrefix != 10" label="数据来源">
                    <el-select v-model="filter.idPrefix">
                        <el-option label="酷开" value="10"></el-option>
                        <el-option label="江苏广电" value="11"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="handleFilterChange">查询</el-button>
            <el-button @click="handleFilterReset">重置</el-button>
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
        />

        <el-pagination
            slot="pagination"
            @size-change="pagination.pageSize = $event"
            @current-change="pagination.currentPage = $event"
            :current-page="pagination.currentPage"
            :page-sizes="[15, 20, 30]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </remote-selector-wrapper>
</template>

<script>
import { Table } from 'admin-toolkit'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
import SourceSelector from '../SourceSelector'
export default {
  components: {
    Table,
    RemoteSelectorWrapper,
    SourceSelector
  },
  data() {
      return {
          tabTypeOptions: [
              {
                  label: '普通版面',
                  value: '1'
              },
              {
                  label: '专题版面',
                  value: '2'
              }
          ],
          tabTypeIndexed: {
              '1': '普通版面',
              '2': '专题版面'
          },
          tabCategoryOptions: [],
          tabCategoryOptionsIndexed: {},
          tabStatusOptions: [
              {
                  label: '待审核',
                  value: 3
              },
              {
                  label: '审核通过',
                  value: 4
              }
          ],
          tabResourceOptions: [
              {
                  label: '腾讯',
                  value: 'o_tencent'
              },
              {
                  label: '爱奇艺',
                  value: 'o_iqiyi'
              },
          ],
          tabStatusOptionsIndexed: {
              3: '待审核',
              4: '审核通过',
          },
          pagination: {
              currentPage: 1,
              pageSize: 15,
              total: undefined,
          },
          filter: this.getDefaultFilter(), 
          table: {
              data: [],
              selected: [],
              header: [
                  {
                      label: 'ID',
                      prop: 'tabId',
                      width: 120,
                  }, 
                  {
                      label: "名称",
                      prop: "tabName",
                      'show-overflow-tooltip': true,
                      width: 200
                  },
                  {
                      label: '版面属性',
                      width: 120,
                      render: function(h, scope) {
                        return this.tabTypeIndexed[scope.row.tabType] 
                      }.bind(this)
                  },
                  {
                      label: '版面分类',
                      width: 150,
                      render: function(h, scope) {
                          return this.tabCategoryOptionsIndexed[scope.row.tabCategory] 
                      }.bind(this)
                  },
                  {
                      label: '状态',
                      render: function(h, scope) {
                          return  this.tabStatusOptionsIndexed[scope.row.tabStatus] 
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
          selected: []
      }
  },
  props: ['isLive', 'initSelected', 'source', 'hasSubTab', 'selectionType'],
  watch: {
    'initSelected': 'setSelected',
    'pagination.currentPage': 'fetchData',
    'pagination.pageSize': 'fetchData',
    'table.data': 'updateTableSelected'
  },
  methods: {
    setSelected() {
        this.selected = this.initSelected || []
    },
    handleSelectStart() {
        this.$emit('select-start')
        if (!this.isLive) {
          // 如果每次选择都重新获取数
          this.table.data = []
          this.selected = []
          this.table.selected = []
          this.handleFilterReset()
        }
    },
    handleSelectEnd() {
      this.$emit('select-end', this.selected.slice())
    },
    getDefaultFilter() {
      return {
        idPrefix: this.$consts.idPrefix,
        tabId: undefined,
        tabName: undefined,
        tabCategory: undefined,
        tabType: undefined,
        tabStatusArray: undefined,
        tabResource: undefined
      }
    },
    handleFilterChange(type) {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.handleFilterChange()
    },
    getFilter() {
      const filter = JSON.parse(JSON.stringify(this.filter))
      const pagination = this.pagination
      filter.page = pagination.currentPage 
      filter.rows = pagination.pageSize
      if (!filter.tabStatusArray) {
          filter.tabStatusArray = '3,4'
      }
      if (this.hasSubTab !== undefined) {
          filter.hasSubTab = this.hasSubTab
      }
      if (this.source) {
          // 如果有传入内容源，则强制使用传入的
          filter.tabResource = this.source
      }
      return filter
    },
    fetchData() {
        this.$service.tabInfoList(this.getFilter()).then((data) => {
          this.table.data = data.rows
          this.pagination.total = data.total
        })
    },
    handleTableRowSelectionChange(item, index) {
        this.selected = [{
            id: item.tabId,
            label: item.tabName,
            data: item
        }]
        this.table.selected = index
    },
    handleTableRowSelectionAdd(targetItem) {
        this.selected = this.selected.concat({
            id: targetItem.tabId,
            label: targetItem.tabName,
            data: targetItem
        })
        this.updateTableSelected()
    },
    handleTableRowSelectionRemove(targetItem) {
        this.selected = this.selected.filter((item) => {
            return item.id !== targetItem.tabId
        })        
        this.updateTableSelected()
    },
    handleTableAllRowSelectionChange(value) {
        if (value) {
          this.table.data.forEach(this.handleTableRowSelectionAdd)
        } else {
          this.table.data.forEach(this.handleTableRowSelectionRemove)
        }
    },
    updateTableSelected() {
        const table = this.table
        const newSelectedIndex = this.selected.map(item => item.id)
        table.selected = table.data.reduce((result, item, index)=> {
            if (newSelectedIndex.indexOf(item.tabId) > -1) {
                result.push(index)
            }
            return result
        }, [])
    },
  },
  created() {
    this.$service.getBusinessType().then((data) => {
      this.tabCategoryOptions = data
      this.tabCategoryOptionsIndexed = data.reduce((result, item) => {
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