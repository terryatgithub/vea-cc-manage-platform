<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
     <ButtonGroupForListPage
        pageName='sysUser'
        @add="addUser"
        @edit="editData"
        @delete="batchDel">
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
      />
    </ContentWrapper>

    <!-- 设置角色窗口 -->
    <el-dialog title="设置用户角色" :visible.sync="roleDialogVisible">
      <span>
        <el-transfer v-model="roleValue" :data="roleData" :titles="['待选角色','已选角色']" @change="handleChange"></el-transfer>
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
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data () {
    return {
      canEdit: false,
      depts: {}, // 部门
      roleData: [], // 全部数据
      roleValue: [], // 右边数据
      data1: [], // 弹框数据
      user: [],
      setRolesId: [],
      roleDataSelected: null,
      roleDialogVisible: false, // 角色管理窗口开关
      currentUserId: null,
      dataPermissionWinVisible: false, // 数据权限窗口开关
      DataPermissionItems: {}, // 数据权限设置项
      checkedDictItems: [], // 勾选的数据权限项
      isLoading: false, // 数据权限设置窗口数据获取
      selectedRole: [],
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
            width: '70',
            sortable: true
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
            prop: 'deptName',
            'min-width': '90'
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
            prop: 'disabled',
            formatter: function (row) {
              if (row.disabled === 0) {
                return '否'
              } else if (row.disabled === 1) {
                return '是'
              }
            }
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
            render: (h, { row }) => {
              if (this.canEdit) {
                const setRole = h('el-button', {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.setRole({ row })
                    }
                  }
                }, '设置角色')
                const setData = h('el-button', {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.setData({ row })
                    }
                  }
                }, '数据权限')
                return h('div', [setRole, setData])
              }
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
    addUser () {
      this.$emit('open-add-page', null)
    },
    handleRead ({ row }) {},
    setRole ({ row }) {
      const object = { userId: row.userId }
      var data2 = []
      var data3 = []
      this.roleDialogVisible = true
      this.user = row.userId
      this.roleData = []
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
        if (str.indexOf(value[i]) === -1) {
          str.push(value[i])
        }
        // str.push(['roleIds', value[i]])
      }
      const select = str.join(',')
      this.setRolesId = select
      // this.selectedRole = this.user.concat(str)
    },
    // 弹框确定事件
    add () {
      const userId = this.user
      const roleIds = this.setRolesId
      this.$service.saveUserRoles({ userId: userId, roleIds: roleIds }, '保存成功').then(() => {
        this.roleDialogVisible = false
        this.fetchData()
      })
    },
    editData () {
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page', this.selected[0])
      }
    },
    /**
     * 批量删除
     */
    batchDel () {
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
          .userConfigDelete({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.fetchData()
            this.handleAllRowSelectionRemove()
          })
      })
    },
    handleRowSelectionAdd (targetItem) {
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
    handleFilterChange (type, filter) {
      if (filter) {
        this.filter = filter
      }
      if (type === 'query') {
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
      this.pagination.currentPage = 1
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
      this.handleAllRowSelectionRemove()
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
      await this.userConfigBusinessType()
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

      //   return this.$service.getDictCheckedByUserId().then((data) => {
      //   this.checkedDictItems = data
      // })
    },
    // 数据权限项
    userConfigBusinessType () {
      return this.$service.getDictType({ type: 'businessType' }).then(data => {
        this.DataPermissionItems = data
      })
    },
    // 保存用户数据权限
    saveProfession () {
      const dictIdGroupStr = this.checkedDictItems.join(',')
      this.$service.saveProfession({ userId: this.currentUserId, dicts: dictIdGroupStr }, '保存成功').then(() => {
        this.dataPermissionWinVisible = false
      })
    }
  },
  created () {
    let filterSchema = _.map({
      userName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '用户名称'
      }),
      deptId: _.o.enum(this.depts).other('form', {
        component: 'Select',
        placeholder: '所在部门'
      }),
      loginName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '登录账号'
      }),
      email: _.o.string.other('form', {
        component: 'Input',
        placeholder: '电子邮箱'
      }),
      loginIp: _.o.string.other('form', {
        component: 'Input',
        placeholder: '最后登录IP'
      }),
      disabled: _.o.enum({ 否: '0', 是: '1' }).other('form', {
        component: 'Select',
        placeholder: '是否禁用'
      })
    })
      .other('form', {
        cols: {
          item: 6,
          label: 0,
          wrapper: 20
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
    this.getDepts().then(() => {
      this.filterSchema = filterSchema
    })
    this.fetchData()
    this.$service.getButtonGroupForPageList('sysUser').then(data => {
      this.canEdit = data.some(item => item.runComm === 'edit')
    })
  } }
</script>
<style lang = 'stylus' scoped>
.btns
  margin-bottom 10px
.checkItemStyle
  margin 10px
</style>
