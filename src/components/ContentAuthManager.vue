<template>
  <div class="content-auth-manager">
    <el-button 
      type="primary"
      v-show="showManageButton" 
      @click="handleOpenAuthManagement"
    >
      内容权限管理
    </el-button>
    <el-dialog
      class="content-auth-manager__dialog"
      title="权限设置"
      :visible.sync="showManagementDialog"
      width="80vw">
      <div class="content-auth-list">
        <div class="actions">
          <el-button type="primary" @click="handleSave">
            保存
          </el-button>
          <el-button type="warning" @click="showManagementDialog = false">
            关闭
          </el-button>
        </div>
        <el-autocomplete
          class="user-search-input"
          v-model="keyword"
          placeholder="用户名称、账号、邮箱"
          :fetch-suggestions="handleSearch" 
          @select="handleAddUser"
        >
        </el-autocomplete>
        <Table :header="table.header" :data="table.data">
        </Table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Table } from 'admin-toolkit'
export default {
  components: {
    Table
  },
  data() {
    return {
      showManagementDialog: false,
      showManageButton: false,
      keyword: '',
      currentUserId: undefined,
      ownerId: undefined,
      table: {
        data: [
        ],
        header: [
          {
            label: '登录账号',
            prop: 'loginName'
          },
          {
            label: '公司部门',
            prop: 'deptName'
          },
          {
            label: '电子邮件',
            prop: 'email'
          },
          {
            label: '查看',
            render: function(h, params) {
              return h('el-checkbox', {
                props: {
                  disabled: this.isDisableRow(params.row),
                  value: !!params.row.browser
                },
                on: {
                  input: function(val) {
                    params.row.browser = val ? 1 : 0
                  }.bind(this)
                }
              })
            }.bind(this)
          },
          {
            label: '编辑',
            render: function(h, params) {
              return h('el-checkbox', {
                props: {
                  disabled: this.isDisableRow(params.row),
                  value: !!params.row.edit
                },
                on: {
                  input: function(val) {
                    params.row.edit = val ? 1 : 0
                  }
                }
              })
            }.bind(this)
          },
          {
            label: '删除',
            render: function(h, params) {
              return h('el-checkbox', {
                props: {
                  disabled: this.isDisableRow(params.row),
                  value: !!params.row.delete
                },
                on: {
                  input: function(val) {
                    params.row.delete = val ? 1 : 0
                  }
                }
              })
            }.bind(this)
          }
        ]
      }
    }
  },
  props: ['resourceId', 'resourceType', 'menuElid'],
  methods: {
    isDisableRow(row) {
      return this.currentUserId === this.ownerId && row.userId === this.currentUserId
    },
    handleOpenAuthManagement() {
      this.getUsers()
      this.showManagementDialog = true
    },
    handleAddUser(selected) {
      const user = selected.row
      this.keyword = ''
      this.table.data.push({
        userId: user.userId,
        loginName: user.loginName,
        deptName: user.deptName,
        email: user.email,
        browser: 1,
        edit: 0,
        delete: 0
      })
    },
    handleSearch(keyword, cb) {
      if (keyword) {
        this.$service
          .userConfigPageList({keyword: keyword})
          .then(function(data) {
            const userExistsIndexed = this.table.data.reduce(function(result, item) {
              result[item.userId] = true
              return result
            }, {})
            const users = data.rows.map(function(item) {
              return {
                userId: item.userId,
                value: item.loginName + '(' + item.email + ')',
                row: item
              }
            }).filter(function(item) {
              return !userExistsIndexed[item.userId]
            })
            cb(users)
          }.bind(this))
          .catch(function() {
            cb()
          })
      }
    },
    getUsers() {
      // 从服务器获取用户列表
      this.$service.getResourceContentAuthList({
        resourceId: this.resourceId,
        resourceType: this.resourceType,
        menuElid: this.menuElid
      }).then(function(data) {
        this.currentUserId = data.currentUserId
        this.ownerId = data.ownerId
        this.table.data = data.userContentAuthList
      }.bind(this))
    },
    updateUserAuth(row, type, val) {
      const originVal = row[type]
      row[type] = val
      const data = {
        resourceId: this.resourceId,
        resourceType: this.resourceType,
        userContentAuthList: [
          {
            userId: row.userId,
            browser: row.browser,
            edit: row.edit,
            delete: row.delete
          }
        ]
      }
      this.$service.upsertResourceContentAuthList(data, '保存成功').catch(function(){
        row[type] = originVal
      })
    },
    handleSave() {
      const userContentAuthList = this.table.data.reduce(function(result, item) {
        if (item.browser || item.edit || item.delete) {
          result.push({
            userId: item.userId,
            browser: item.browser,
            edit: item.edit,
            delete: item.delete
          })
        }
        return result
      }, [])
      const data = {
        resourceId: this.resourceId,
        resourceType: this.resourceType,
        userContentAuthList: userContentAuthList
      }
      this.$service.upsertResourceContentAuthList(data, '保存成功')
    }
  },
  created() {
    if (this.resourceId) {
      this.$service.getUserContentAuth({
        resourceId: this.resourceId,
        resourceType: this.resourceType,
        menuElid: this.menuElid
      }).then(function(data) {
        if (data.enableContentAuth && data.contentAuth.contentAuthSetting) {
          this.showManageButton = true
        } 
      }.bind(this))
    }
  }
}
</script>
<style scoped>
.content-auth-manager {
  float: right;
  margin-right: 10px;
}
.content-auth-manager__dialog .user-search-input >>> .el-input {
  margin: 10px 0;
  width: 400px;
  max-width: unset;
}
.content-auth-manager__dialog .content-auth-list .actions {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
</style>