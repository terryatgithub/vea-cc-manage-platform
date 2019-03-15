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
        <el-button type="primary" icon="el-icon-plus">新增</el-button>
        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete">批量删除</el-button>
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
    <!-- <el-dialog title="用户角色管理" :visible.sync="roleDialogVisible" width="30%">
      <span>
         <el-transfer v-model="value1" :data="data"></el-transfer>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 数据权限窗口 -->
    <el-dialog title="数据权限设置" width="30%" :visible.sync="dataPermissionWinVisible">
      <el-checkbox-group
      v-show="!isLoading"
      v-model="checkedDictItems">
        <el-checkbox class="checkItemStyle"
          v-for="{dictId, dictCnName} in DataPermissionItems" :key="dictId" :label="dictCnName">
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataPermissionWinVisible = false">取 消</el-button>
        <el-button type="primary" @click="dataPermissionWinVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 数据权限窗口 -->

  </ContentCard>
</template>
<script>
import _ from "gateschema";
import ButtonList from "./../../components/ButtonLIst";
import { ContentWrapper, Table, ActionList, utils } from "admin-toolkit";
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper
  },
  data() {
    return {
      depts: {},//部门
      roleData: null,
      roleDataSelected: null,
      roleDialogVisible: false,//角色管理窗口开关
      dataPermissionWinVisible: false,//数据权限窗口开关
      DataPermissionItems: {},//数据权限设置项
      checkedDictItems: [],//勾选的数据权限项
      isLoading: false,//数据权限设置窗口数据获取
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
            label: "ID",
            prop: "userId",
            width: "70"
          },
          {
            label: "用户名称",
            "min-width": "120",
            prop: "userName",
            sortable: true
          },
          {
            label: "登录账号",
            prop: "loginName",
            width: "110",
            sortable: true
          },
          {
            label: "所在部门",
            prop: "deptId",
            "min-width": "90",
            render: (createElement, { row }) => {
              return row.sysDept.deptName;
            }
          },
          {
            label: "电子邮箱",
            prop: "email",
            "min-width": "160"
            // sortable: 'custom'
          },
          {
            label: "登录IP",
            prop: "loginIp",
            width: "130"
          },
          {
            label: "登录次数",
            prop: "loginCount"
          },
          {
            label: "最后登录时间",
            prop: "loginTime",
            width: "170"
          },
          {
            label: "是否禁用",
            prop: "disabled"
          },
          {
            label: "创建时间",
            prop: "dateCreate",
            width: "170",
            sortable: true
          },
          {
            label: "修改时间",
            prop: "dateModify",
            width: "170",
            sortable: true
          },
          {
            label: "备注",
            prop: "remark",
            "min-width": "170"
          },
          {
            label: "操作",
            width: "150",
            fixed: "right",
            render: utils.component.createOperationRender(this, {
              setRole: "设置角色",
              setData: "数据权限"
            })
          }
        ],
        data: [],
        selected: [],
        selectionType: "multiple"
      }
    };
  },
  methods: {
    handleRead({ row }) {},
    setRole({ row }) {
      this.getNotRolesByUserId(row.userId).then((data) => {
          this.roleData = data 
      })
    },
    setData({ row }) {
      //businessType
      this.userConfigBusinessType(row.userId);
      //user checked id
      this.checkedDictItems = [];
      this.getDictCheckedByUserId(row.userId);
      this.isLoading = true;
      this.dataPermissionWinVisible = true;
    },
    handleCreate() {
      this.$router.push({ name: "prize-create" });
    },
    handleRowSelectionAdd(targetItem) {
      this.selected = this.selected.concat({
        id: targetItem.userId
      });
      this.updateTableSelected();
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(
        item => item.id !== targetItem.userId
      );
      this.updateTableSelected();
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd);
      } else {
        this.selected = [];
        this.table.selected = [];
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = [];
      this.table.selected = [];
    },
    updateTableSelected() {
      const table = this.table;
      const newSelectedIndex = this.selected.map(item => item.id);
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.userId) > -1) {
          result.push(index);
        }
        return result;
      }, []);
    },
    handleFilterChange(type) {
      if (type === "filter") {
        if (this.pagination) {
          this.pagination.currentPage = 1;
        }
      }
      this.fetchData();
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      };
      this.fetchData();
    },
    parseFilter() {
      const { filter, pagination } = this;
      if (pagination) {
        filter.page = pagination.currentPage;
        filter.rows = pagination.pageSize;
      }
      return filter;
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter();
      this.$service.userConfigPageList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    },
    /**
     * 得到部门列表
     */
    getDepts() {
      return this.$service.getDepts().then(data => {
        data.forEach(element => {
          this.depts[element.deptName] = element.deptId;
        });
      });
    },
    getNotRolesByUserId(userId) {
       this.$service.getNotRolesByUserId({userId: userId}).then(data => {
        data.forEach(element => {
          this.depts[element.deptName] = element.deptId;
        });
      });
    },
    //获取用户数据权限
    getDictCheckedByUserId(userId) {
      this.$service.getDictCheckedByUserId({userId: userId}).then((data) => {
        const DataPermissionItemsIndexed = this.DataPermissionItemsIndexed
        this.checkedDictItems = (data || [])
          .filter(item => DataPermissionItemsIndexed[item])
          .map(dictId => DataPermissionItemsIndexed[dictId].dictCnName)
        this.isLoading = false;
      });
    },
    //数据权限项
    userConfigBusinessType(userId) {
      this.$service.userConfigBusinessType({userId: userId}).then(data =>{
        this.DataPermissionItems = data;
        this.DataPermissionItemsIndexed = data.reduce((result, item) => {
          result[item.dictId] = item
          return result
        }, {})
      })
    }
  },
  created() {
    let filterSchema = _.map({
      userName: _.o.string.other("form", {
        placeholder: "用户名称",
        cols: {
          item: 3,
          label: 0
        }
      }),
      deptId: _.o.enum(this.depts).other("form", {
        component: "Select",
        placeholder: "所在部门",
        cols: {
          item: 3,
          label: 0
        }
      }),
      loginName: _.o.string.format("email").other("form", {
        component: "Input",
        placeholder: "登录账号",
        cols: {
          item: 3,
          label: 0
        }
      }),
      email: _.o.string.other("form", {
        component: "Input",
        placeholder: "电子邮箱",
        cols: {
          item: 3,
          label: 0
        }
      }),
      loginIp: _.o.string.other("form", {
        component: "Input",
        placeholder: "最后登录IP",
        cols: {
          item: 3,
          label: 0
        }
      }),
      disabled: _.o
        .enum({
          否: "0",
          是: "1"
        })
        .other("form", {
          component: "Select",
          placeholder: "是否禁用",
          cols: {
            item: 3,
            label: 0
          }
        })
    }).other("form", {
      layout: "inline",
      footer: {
        cols: {
          label: 0,
          wrapper: 24
        },
        showSubmit: true,
        submitText: "查询",
        showReset: true,
        resetText: "重置"
      }
    });
    this.getDepts().then(() => {
      this.filterSchema = filterSchema;
    });
    this.fetchData();
  }
};
</script>
<style lang = 'stylus' scoped>
.btns
  margin-bottom 10px
.checkItemStyle
  margin 10px
</style>



