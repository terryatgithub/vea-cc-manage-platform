<template>
  <ContentCard>
    <div class="filter">
      <GateSchemaForm
        v-model="filter"
        :schema="filterSchema"
        ref="filterForm"
        @submit="handleSearch"
        @reset="handleFilterReset"
        class="search-form"
      />
      <div class="query-action-list">
        <el-button type="primary" @click="$refs.filterForm.handleSubmit()">
          查询
        </el-button>
        <el-button @click="$refs.filterForm.handleReset()">
          重置
        </el-button>
      </div>
    </div>
    <ActionList :actions="actions" class="action-button" :target="this"></ActionList>
    <ContentWrapper
      :pagination="pagination"
      @filter-change="fetchData"
      style="clear: both">
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      >
      </Table>
    </ContentWrapper>
    <!-- 查看用户 -->
    <el-dialog
      title="查看用户"
      :visible.sync="viewUserDialogVisible"
    >
      <el-table
        :data="userRoleData"
        border
      >
        <el-table-column label="用户ID" property="userId"></el-table-column>
        <el-table-column label="用户名" property="userName"></el-table-column>
        <el-table-column label="公司部门" property="deptName"></el-table-column>
        <el-table-column label="电子邮箱" property="email"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 查看用户窗口end -->
    <!-- 设置权限 -->
    <!--<el-dialog title="设置用户角色" :visible.sync="roleDialogVisible">-->
    <!--<span>-->
    <!--<el-transfer v-model="roleValue" :data="roleData" @change="handleChange"></el-transfer>-->
    <!--</span>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="roleDialogVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="roleDialogVisible = false;add()">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <!-- 设置权限窗口end --->

    <!-- 设置人群权限窗口 -->
    <!--<el-dialog title="数据权限设置" width="30%" :visible.sync="dataPermissionWinVisible">-->
    <!--<el-checkbox-group-->
    <!--v-show="!isLoading"-->
    <!--v-model="checkedDictItems">-->
    <!--<el-checkbox class="checkItemStyle"-->
    <!--v-for="{dictId, dictCnName} in DataPermissionItems"-->
    <!--:key="dictId"-->
    <!--:label="dictId">-->
    <!--{{ dictCnName }}-->
    <!--</el-checkbox>-->
    <!--</el-checkbox-group>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="dataPermissionWinVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="saveProfession">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <!-- 设置人群权限窗口end -->
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper
  },
  data: function () {
    return {
      filter: {},
      filterSchema: _.map({
        search: _.o
          .string.other('form', {
            label: '角色名称',
            placeholder: '请输入角色名称',
            cols: {
              item: 35,
              label: 8,
              wrapper: 15
            }
          })
      }).other('form', {
        layout: 'inline'
      }),
      pagination: {
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: '角色名称',
            prop: 'roleName'
          },
          {
            label: '排序号',
            prop: 'seq'
          },
          {
            label: '说明',
            prop: 'roleDesc'
          },
          {
            label: '创建人',
            prop: 'createUid'
          },
          {
            label: '创建时间',
            width: '180',
            prop: 'createDate'
          },
          {
            label: '修改人',
            prop: 'modifyUid'
          },
          {
            label: '修改时间',
            width: '180',
            prop: 'modifyDate'
          },
          {
            label: '操作',
            fixed: 'right',
            width: '350',
            render: utils.component.createOperationRender(this, {
              setAuth: '设置权限',
              setAuthOfCrowd: '设置人群权限',
              sysRoleView: '查看用户',
              editRole: '编辑'
            })
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      },
      viewUserDialogVisible: false,
      userRoleData: [],
      actions: {
        handleCreate: {
          type: 'primary',
          text: '新建'
        },
        handleBatchDelete: {
          text: '删除'
        }
      }

    }
  },
  methods: {
    parseFilter () {
      if (this.pagination) {
        this.filter.page = this.pagination.currentPage
        this.filter.size = this.pagination.pageSize
      }
      return this.filter
    },
    handleCreate () {
      this.$emit('openAddPage', null)
    },
    handleBatchDelete () {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      const roleId = this.selected.map(item => item.id).join(',')
      if (window.confirm('确定要删除吗')) {
        this.$service
          .deleteRole({ id: roleId }, '删除成功')
          .then(data => {
            this.fetchData()
          })
      }
    },
    editRole ({ row }) {
      this.$emit('openAddPage', row)
    },
    handleSearch () {},
    handleFilterReset () {},
    handleSubmit () {},
    handleReset () {},
    handleRowSelectionAdd (targetItem) {
      this.selected = this.selected.concat({
        id: targetItem.roleId
      })
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => item.id !== targetItem.roleId)
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
      const newSelectedIndex = this.selected.map(item => item.id)
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.roleId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    setAuth () {},
    setAuthOfCrowd () {},
    sysRoleView ({ row }) {
      this.viewUserDialogVisible = true
      let id = row.roleId
      this.$service.userRoleList({ roleId: id }).then((data) => {
        console.log(data)
        this.userRoleData = data
      })
    },
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getRoleList(filter).then((data) => {
        Object.assign(this.pagination, {
          currentPage: data.current,
          pageSize: data.size,
          total: data.total
        })
        this.table.data = data.rows
      })
    }
  },
  created () {
    this.fetchData()
  }

}
</script>
<style lang="stylus" scoped>
  .search-form
    float left
  .action-button
    margin 30px 0
  .query-action-list
    float left
    margin 0 20px
</style>
