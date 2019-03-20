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

    <!-- 设置角色窗口 -->
    <el-dialog title="设置用户角色" :visible.sync="roleDialogVisible">
      <span>
        <el-transfer v-model="roleValue" :data="roleData" @change="handleChange"></el-transfer>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleDialogVisible = false;add()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置角色窗口end --->

    <!-- 数据权限窗口 -->
    <el-dialog title="数据权限设置" width="30%" :visible.sync="dataPermissionWinVisible">
      <el-checkbox-group
      v-show="!isLoading"
      v-model="checkedDictItems">
        <el-checkbox class="checkItemStyle"
          v-for="{dictId, dictCnName} in DataPermissionItems"
          :key="dictId"
          :label="dictId">
          {{ dictCnName }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataPermissionWinVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProfession">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 数据权限窗口end -->

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
      depts: {}, // 部门
      roleData: [],
      roleValue: [],
      data1: [],
      roleDataSelected: null,
      roleDialogVisible: false, // 角色管理窗口开关
      currentUserId: null,
      dataPermissionWinVisible: false, // 数据权限窗口开关
      DataPermissionItems: {}, // 数据权限设置项
      checkedDictItems: [], // 勾选的数据权限项
      isLoading: false, // 数据权限设置窗口数据获取
      selectedRole: [],
      user: [],
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
            prop: 'userId',
            width: '70'
          },
          {
            label: '用户名称',
            'min-width': '120',
            prop: 'userName',
            sortable: true
          },
          {
            label: '登录账号',
            prop: 'loginName',
            width: '110',
            sortable: true
          },
          {
            label: '所在部门',
            prop: 'deptId',
            'min-width': '90',
            render: (createElement, { row }) => {
              return row.sysDept.deptName
            }
          },
          {
            label: '电子邮箱',
            prop: 'email',
            'min-width': '160'
            // sortable: 'custom'
          },
          {
            label: '登录IP',
            prop: 'loginIp',
            width: '130'
          },
          {
            label: '登录次数',
            prop: 'loginCount'
          },
          {
            label: '最后登录时间',
            prop: 'loginTime',
            width: '170'
          },
          {
            label: '是否禁用',
            prop: 'disabled'
          },
          {
            label: '创建时间',
            prop: 'dateCreate',
            width: '170',
            sortable: true
          },
          {
            label: '修改时间',
            prop: 'dateModify',
            width: '170',
            sortable: true
          },
          {
            label: '备注',
            prop: 'remark',
            'min-width': '170'
          },
          {
            label: '操作',
            width: '200',
            fixed: 'right',
            render: utils.component.createOperationRender(this, {
              setRole: '设置角色',
              setData: '数据权限',
              editData: '编辑'
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
    /**
     * 新增用户
     */
    addUser () {
      this.$emit('openAddPage', null)
    },
    handleRead ({ row }) {},
    setRole ({ row }) {
      const userId = row.userId
      const object = { userId: userId }
      var data2 = []
      var data3 = []
      this.roleDialogVisible = true
      this.user.push(['userId', userId])
      this.$service.getNotRolesByUserId(object).then(data => {
        this.data1 = data
        this.$service.getRolesByUserId(object).then(data => {
          if (data != null) {
            this.data1 = this.data1.concat(data)
          }
          for (let i = 0; i < this.data1.length; i++) {
            data2.push({
              key: this.data1[i].roleId,
              label: this.data1[i].roleName
            })
          }
          for (let j = 0; j < data.length; j++) {
            data3.push(data[j].roleId)
          }
          this.roleData = data2
          this.roleValue = data3
        })
      })
    },
    handleChange (value, direction, movedKeys) {
      var str = []
      for (var i = 0; i < value.length; i++) {
        str.push(['roleIds', value[i]])
      }
      this.selectedRole = this.user.concat(str)
      console.log(this.selectedRole)
    },
    // 弹框确定事件
    add () {
      const obj = this.selectedRole
      this.$service.saveUserRoles(obj, '保存成功')
    },
    setData ({ row }) {},
    editData ({ row }) {
      debugger
      this.$emit('openAddPage', row.userId)
    },
    /**
     * 批量删除
     */
    batchDel () {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      if (window.confirm('确定要删除吗')) {
        this.$service
          .userConfigDelete({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.fetchData()
          })
      }
    },
    handleCreate () {
      this.$router.push({ name: 'prize-create' })
    },
    handleRowSelectionAdd (targetItem) {
      // this.selected = this.selected.concat({
      //   id: targetItem.userId
      // });
      this.selected.push(targetItem.userId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.userId
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
        if (newSelectedIndex.indexOf(item.userId) > -1) {
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
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      this.$service.userConfigPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    /**
     * 得到部门列表
     */
    getDepts () {
      return this.$service.getDepts().then(data => {
        data.forEach(element => {
          this.depts[element.deptName] = element.deptId
        })
      })
    },
    getNotRolesByUserId (userId) {
      this.$service.getNotRolesByUserId({ userId: userId }).then(data => {
        data.forEach(element => {
          this.depts[element.deptName] = element.deptId
        })
      })
    },
    /**
     * 数据权限按钮
     */
    async setData ({ row }) {
      this.currentUserId = row.userId
      // businessType
      await this.userConfigBusinessType(row.userId)
      // user checked id
      this.checkedDictItems = []
      this.isLoading = true
      await this.getDictCheckedByUserId(row.userId)
      this.isLoading = false
      this.dataPermissionWinVisible = true
    },
    // 获取用户数据权限
    getDictCheckedByUserId (userId) {
      return this.$service.getDictCheckedByUserId({ userId: userId }).then((data) => {
        this.checkedDictItems = data
      })
    },
    // 数据权限项
    userConfigBusinessType (userId) {
      return this.$service.userConfigBusinessType({ userId: userId }).then(data => {
        this.DataPermissionItems = data
      })
    },
    // 保存用户数据权限
    saveProfession () {
      const dictIdGroupStr = this.checkedDictItems.join(',')
      this.$service.saveProfession({ userId: this.currentUserId, dicts: dictIdGroupStr }, '保存成功')
      this.dataPermissionWinVisible = false
    }
  },
  created () {
    let filterSchema = _.map({
      userName: _.o.string.other('form', {
        placeholder: '用户名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
      deptId: _.o.enum(this.depts).other('form', {
        component: 'Select',
        placeholder: '所在部门',
        cols: {
          item: 3,
          label: 0
        }
      }),
      loginName: _.o.string.format('email').other('form', {
        component: 'Input',
        placeholder: '登录账号',
        cols: {
          item: 3,
          label: 0
        }
      }),
      email: _.o.string.other('form', {
        component: 'Input',
        placeholder: '电子邮箱',
        cols: {
          item: 3,
          label: 0
        }
      }),
      loginIp: _.o.string.other('form', {
        component: 'Input',
        placeholder: '最后登录IP',
        cols: {
          item: 3,
          label: 0
        }
      }),
      disabled: _.o.enum({ 否: '0', 是: '1' }).other('form', {
        component: 'Select',
        placeholder: '是否禁用',
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
    this.getDepts().then(() => {
      this.filterSchema = filterSchema
    })
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
