<template>
  <ContentCard>
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
          <ButtonGroupForListPage
        pageName='sysRole'
        @add="handleCreate"
        @edit="editData"
        @delete="handleBatchDelete"
        >
        </ButtonGroupForListPage>
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
    <el-dialog
      title="权限设置"
      :visible.sync="setAuthDialogVisible"
      class="auth-set-window"
    >
      <div class="auth-set-window__buttons">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllValue" @change="handleCheckAllChange">全选</el-checkbox>
        <el-button type="primary" class="button--position" @click="updateAuth()">保存修改</el-button>
        <el-button type="info" @click="setAuthDialogVisible = false">关闭</el-button>
      </div>
      <div class="auth-set-window__header">
          <span class="auth-set-window__header-item"
                v-for="(item,index) in headerItems"
                :key="index"
          >
             {{item}}
          </span>
      </div>
      <div class="auth-set-window__content">
            <el-tree
              :data="AuthList"
              node-key="menuId"
              default-expand-all
              expand-on-click-node
            >
          <span slot-scope="{ node, data }">
            <span class="tree-data tree-data--big-size">{{ data.title }}</span>
            <span
              v-for="(dataItem,index) in dataItems"
              class="tree-data"
              :key="index"
              @click.stop="()=>{}"
            >
              <el-checkbox
                 :value="data[dataItem] == 1 ? true : false"
                 :disabled="data[dataItem] == -1"
                 :key="data.menuId+index+Math.random()"
                 @input="data[dataItem] = $event ? '1' : '0'"
                 :runId="index+1"
              ></el-checkbox>
            </span>
          </span>
            </el-tree>
      </div>
    </el-dialog>
    <!-- 设置权限窗口end --->

    <!-- 设置人群权限窗口 -->
    <el-dialog
      title="数据权限设置"
      :visible.sync="showAuthOfCrowdDialog"
    >
      <div v-show="policies.length === 0">
        加载中...
      </div>
      <div
        v-for="policy in policies"
        :key="policy.value"
        class="crowd-selector"
      >
        <span
          :title="policy.label"
          class="crowd-selector__policy ellipsis"
        >
          {{policy.label}}
        </span>
        <div class="crowd-selector__crowd-list">
          <el-tag
            v-for="(crowd, key) in policy.crowds"
            :key="key"
            type="info"
            :title="crowd.label"
            :class="{
              'ellipsis': true,
              'crowd-selector__crowd': true,
              'crowd-selector__crowd--disabled': crowd.disable == 1}"
            @click.native="handleSelectCrowd(crowd)"
          >
            {{ crowd.label }}
          </el-tag>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAuthOfCrowdDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveAuth">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置人群权限窗口end -->
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
export default {
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data: function () {
    return {
      filter: {},
      filterSchema: _.map({
        roleName: _.o
          .string.other('form', {
            label: '角色名称',
            placeholder: '请输入角色名称',
            cols: {
              item: 6,
              label: 0,
              wrapper: 18
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
            prop: 'seq',
            sortable: true,
            render: (h, { row }) => {
              return h('el-input',
                {
                  props: {
                    value: row.seq,
                    type: 'text'
                  },
                  on: {
                    input: (value) => {
                      row.seq = value
                    },
                    blur: () => {
                      this.$service.updateSeq({ id: row.roleId, seq: row.seq })
                    }
                  }
                })
            }
          },
          {
            label: '说明',
            prop: 'roleDesc'
          },
          {
            label: '创建人',
            prop: 'creatorName'
          },
          {
            label: '创建时间',
            width: '180',
            sortable: true,
            prop: 'createDate'
          },
          {
            label: '修改人',
            prop: 'modifierName'
          },
          {
            label: '修改时间',
            width: '180',
            sortable: true,
            prop: 'modifyDate'
          },
          {
            label: '操作',
            fixed: 'right',
            width: '350',
            render: utils.component.createOperationRender(this, {
              setAuth: '设置权限',
              handleSetAuthOfCrowd: '设置人群权限',
              sysRoleView: '查看用户'
            })
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      },
      viewUserDialogVisible: false,
      userRoleData: [],
      showAuthOfCrowdDialog: false,
      policies: [],
      roleId: undefined,
      setAuthDialogVisible: false,
      AuthList: [],
      isIndeterminate: true,
      checkAllValue: false,
      headerItems: ['菜单名称', '浏览', '新增', '编辑', '删除', '搜索', '刷新', '打印', '导入', '导出', '审核', '认领', '撤销认领', '撤销审核', '上架', '创建副本', '批量审核'],
      dataItems: ['browser', 'add', 'edit', 'delete', 'search', 'refresh', 'print', 'inport', 'export', 'audit', 'claim', 'unclaim', 'unaudit', 'shelves', 'copy', 'batchAudit']
    }
  },
  methods: {
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleCreate () {
      this.$emit('open-add-page', null)
    },
    handleBatchDelete () {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service
          .deleteRole({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.handleAllRowSelectionRemove()
            this.fetchData()
          })
      })
    },
    editData() {
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page', this.selected[0])
      }
    },
    handleFilterChange (type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = {
        roleName: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleRowSelectionAdd (targetItem) {
      this.selected.push(targetItem.roleId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.roleId
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
        if (newSelectedIndex.indexOf(item.roleId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    handleCheckAllChange (val) {
      this.checkAllValue = val
      this.isIndeterminate = false
      const keys = this.dataItems
      function checkAll (data) {
        data.forEach((item) => {
          keys.forEach((key) => {
            if (item[key] !== '-1') {
              item[key] = val ? '1' : '0'
            }
          })
          if (item.children) {
            checkAll(item.children)
          }
        })
      }
      checkAll(this.AuthList)
    },
    updateAuth () {
      const self = this
      const roleId = this.roleId
      const keys = this.dataItems
      const menuIds = []
      function checkSelect (data) {
        data.forEach((item) => {
          keys.forEach((key, index) => {
            if (item[key] === '1') {
              menuIds.push({ 'menuId': item['menuId'], 'runId': (index + 1).toString() })
            }
          })
          if (item.children) {
            checkSelect(item.children)
          }
        })
      }
      checkSelect(this.AuthList)
      this.$service.saveAuthOfRole({
        roleId: roleId,
        mrs: JSON.stringify(menuIds)
      }, '设置成功').then(function () {
        self.setAuthDialogVisible = false
      })
    },
    setAuth ({ row }) {
      this.$service.getAuthList({ roleId: row.roleId }).then((data) => {
        console.log(data)
        this.setAuthDialogVisible = true
        this.AuthList = data
        this.roleId = row.roleId
      })
    },
    fetchPolicies (roleId) {
      this.$service.getTaglist({ roleId: roleId, type: 'crowdPolicy' }).then((data) => {
        this.policies = data
        data.forEach((item) => {
          this.$service.getTaglist({ id: item.value, roleId: roleId, type: 'crowd' })
            .then((crowds) => {
              console.log(crowds)
              this.$set(item, 'crowds', crowds)
            })
        })
      })
    },
    handleSelectCrowd (crowd) {
      crowd.disable = crowd.disable === 1 ? 0 : 1
    },
    handleSetAuthOfCrowd ({ row }) {
      this.showAuthOfCrowdDialog = true
      this.policies = []
      this.roleId = row.roleId
      this.fetchPolicies(row.roleId)
    },
    handleSaveAuth () {
      const self = this
      const roleId = this.roleId
      const crowdIds = []
      const policyIds = []
      const policies = this.policies
      policies.forEach(function (policyItem) {
        let disablePolicy = true
        policyItem.crowds.forEach(function (crowdItem) {
          if (crowdItem.disable === 1) {
            crowdIds.push(crowdItem.value)
          } else {
            disablePolicy = false
          }
        })
        if (disablePolicy !== false && policyItem.crowds.length > 0) {
          policyIds.push(policyItem.value)
        }
      })
      this.$service.setCrowdAuthOfRole({
        roleId: roleId,
        disableTagInfoList: [
          {
            type: 'crowd',
            tagIds: crowdIds
          },
          {
            type: 'crowdPolicy',
            tagIds: policyIds
          }
        ]
        // policyIds: policyIds,
        // crowdIds: crowdIds
      }, '设置成功').then(function () {
        self.showAuthOfCrowdDialog = false
      })
    },
    sysRoleView ({ row }) {
      this.viewUserDialogVisible = true
      let id = row.roleId
      this.$service.userRoleList({ roleId: id }).then((data) => {
        this.userRoleData = data
      })
    },
    fetchData () {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getRoleList(filter).then((data) => {
        this.pagination.total = data.total
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
    .crowd-selector
        min-height 35px
        margin-bottom 10px
    .crowd-selector__policy
        position absolute
        width 90px
        margin-left 8px
    .crowd-selector__crowd-list
        padding-left 90px
    .crowd-selector__crowd
        margin-left 10px
        cursor pointer
        width 140px
        margin-bottom 10px
        background-color rgba(64,158,255,0.1)
        color #409eff
    .crowd-selector__crowd--disabled
        color #fff
        background-color #bfc4cd
    .ellipsis
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        vertical-align middle
    .auth-set-window__header
        width 1300px
        margin-top 30px
    .auth-set-window__header-item
        display inline-block
        width 70px
        height 26px
        border 1px solid #ccc
        text-align center
        line-height 26px
        &:first-child
            width 120px
    .auth-set-window__content
        width 1300px
        height 500px
        overflow inherit
    .button--position
        margin-left 15px
    .tree-data
        display inline-block
        width 70px
        height 26px
        border 1px dashed #ccc
        text-align center
        line-height 26px
    .tree-data--big-size
        width 120px
    .auth-set-window__buttons
        margin -20px 0 20px 0
        position absolute
    .auth-set-window
        >>> .el-tree-node__content
                position relative
        >>> .el-dialog
                overflow-x scroll
        >>> .el-tree-node
               > .el-tree-node__children
                     overflow-x initial
                     margin-left -18px
        >>> .el-checkbox-group
                display inline-block
        >>> .el-dialog__body
                overflow inherit
        >>> .el-tree-node__expand-icon
                position absolute
</style>
