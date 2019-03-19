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
        <el-button type="primary" icon="el-icon-plus" @click="addDict">新增</el-button>
        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" >新增字典分类</el-button>
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
      depts: {}, //部门
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
            prop: "dictId",
            width: "70"
          },
          {
            label: "字典名称",
            "min-width": "90",
            prop: "dictCnName",
            sortable: true
          },
          {
            label: "字典值",
            prop: "dictEnName",
            width: "110",
            sortable: true
          },
          {
            label: "字典分类",
            prop: "dictCategory",
            "min-width": "160"
            // sortable: 'custom'
          },
          // {
          //   label: "所在部门",
          //   prop: "deptId",
          //   "min-width": "90",
          //   render: (createElement, { row }) => {
          //     return row.sysDept.deptName;
          //   }
          // },
          
        ],
        data: [],
        selected: [],
        selectionType: "multiple"
      }
    };
  },
  methods: {
    /**
     * 新增字典
     */
    addDict() {
      this.$emit("openAddPage", null);
    },
    editData({ row }) {
      this.$emit("openAddPage", row.dictId);
    },
    /**
     * 批量删除
     */
    batchDel() {
      if (this.selected.length === 0) {
        this.$message("请选择再删除");
        return;
      }
      if (window.confirm("确定要删除吗")) {
        this.$service
          .userConfigDelete({ id: this.selected.join(",") }, "删除成功")
          .then(data => {
            this.fetchData();
          });
      }
    },
    handleCreate() {
      this.$router.push({ name: "prize-create" });
    },
    handleRowSelectionAdd(targetItem) {
      // this.selected = this.selected.concat({
      //   id: targetItem.userId
      // });
      this.selected.push(targetItem.dictId);
      this.updateTableSelected();
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.dictId;
      });
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
      const newSelectedIndex = this.selected;
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.dictId) > -1) {
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
      console.log(filter);
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter();
      this.$service.getDictList(filter).then(data => {
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
    }
  },
  created() {
    let filterSchema = _.map({
      dictId: _.o.string.other("form", {
        component: "Input",
        placeholder: "字典ID",
        cols: {
          item: 3,
          label: 0
        }
      }),
      dictCnName: _.o.string.other("form", {
        component: "Input",
        placeholder: "字典名称",
        cols: {
          item: 3,
          label: 0
        }
      }),
      dictEnName: _.o.string.other("form", {
        component: "Input",
        placeholder: "字典值",
        cols: {
          item: 3,
          label: 0
        }
      }),
      dictCategory: _.o.enum(this.depts).other("form", {
        component: "Select",
        placeholder: "字典分类",
        cols: {
          item: 3,
          label: 0
        }
      })
      })
      .other("form", {
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
  margin-bottom: 10px
</style>



