<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <!-- <div class="btns" >
        <el-button type="primary"  v-for="(item, seq) in buttonList" :key="seq" @click="click(seq)">{{item.runName}}</el-button>
      </div> -->
      <div class="btns" >
        <el-button type="primary" icon="el-icon-plus" @click="addData" >新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="deleteData">删除</el-button>
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
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      setDialogVisible: false, //弹框默认关闭
      selected: [],
      buttonList:[],
      table: {
        props: {},
        header: [
            {
                label: 'ID',
                prop: 'commonOnclickId'
            },
            {
                label: '点击事件名称',
                prop: 'onlickName'
            },
             {
                label: '备注',
                prop: 'remark'
            },
            {
                label: '应用包名',
                prop: 'packagename'
            },
            {
                label: '应用版本号',
                prop: 'versioncode'
            },
            {
                label: '启动动作',
                prop: 'dowhat'
            },
            {
                label: '启动方式',
                prop: 'bywhat'
            },
            {
                label: '启动参数',
                prop: 'byvalue' 
            },
            {
                label: '扩展参数',
                prop: 'params', 
            },
            {
                label: '异常处理',
                prop: 'exception'
            },  
            {
                label: '创建人',
                prop: 'createrName'
            },
            {
                label: '创建时间',
                prop: 'createdDate' 
            },
            {
                label: "修改人",
                fixed: "modifierName"
            },
            {
                label: "修改时间",
                fixed: "lastUpdateDate"
            }
        ],
        data: [],
        selected: [],
        selectionType: "multiple"
      }
    };
  },
  methods: {
    // click (index) {
    //   const methodsMap = ['addData', 'editData', 'deleteData', 'selectData', 'handleFilterReset', 'printData', 'importData', 'exportData', 'dealData']
    //   const method = methodsMap[index]
    //   if (index == null) {
    //     return this.$message({
    //       type: 'error',
    //       message: '点击失败'
    //     })
    //   }
    //   if(index === 1){
    //     if (this.selected.length==0) {
    //        this.$message('请选择一条数据')
    //     }
    //     else if(this.selected.length >1){
    //        this.$message('只能选择一条数据')
    //     }
    //     else{
    //       this[method](this.selected[0])
    //     }
    //   } else {
    //     this[method]()
    //   }

    // },
    /**
     * 新增
     */
    addData(){
        this.$emit("open-add-page", null)
    },
    /**
     * 编辑
     */
    editData(){
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page', this.selected[0])
      }
    },
    /**
     * 批量删除
     */
    deleteData() {
      if (this.selected.length === 0) {
        this.$message("请选择再删除");
        return;
      }
      if (window.confirm("确定要删除吗")) {
        this.$service.commonOnclickInfoDelete({ id: this.selected.join(",") }, "删除成功")
          .then(data => {
            this.fetchData();
          });
      }
    },
    handleCreate() {
      this.$router.push({ name: "prize-create" });
    },
    //表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.commonOnclickId);
      this.updateTableSelected();
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.commonOnclickId;
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
        if (newSelectedIndex.indexOf(item.commonOnclickId) > -1) {
          result.push(index);
        }
        return result;
      }, []);
    },
    //查询
    handleFilterChange(type) {
      if (type === "filter") {
        if (this.pagination) {
          this.pagination.currentPage = 1;
        }
      }
      this.fetchData();
    },
    //重置
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
      this.$service.getCommonOnclickInfoList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    },
    /**
     * 获取menuInfoTree
     */
    getSysMenuInfo () {
      return this.$service.getCommonOnclickInfoMenu().then(data => {
        this.buttonList = data
      })
    }
  },
  created() {
    let filterSchema = _.map({
      commonOnclickId: _.o.string.other("form", {
        component: "Input",
        placeholder: "ID",
        cols: {
          item: 3,
          label: 0
        }
      }),
      onlickName: _.o.string.other("form", {
        component: "Input",
        placeholder: "点击事件名",
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
    this.filterSchema = filterSchema;
    this.fetchData();
    this.getSysMenuInfo();
  }
};
</script>
<style lang = 'stylus' scoped>
.btns
  margin-bottom 10px
  display flex
  flex-direction row
</style>