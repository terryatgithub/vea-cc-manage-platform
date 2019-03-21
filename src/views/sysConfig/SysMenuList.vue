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
        <el-button type="primary" icon="el-icon-plus" @click="addMenu" >新增</el-button>
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
      <!--设置操作-->
      <el-dialog title="设置操作" :visible.sync="setDialogVisible">
         <span>
        <el-transfer v-model="svalue" :data="sdata" :titles="['待选操作','已选操作']" @change="handleChange"></el-transfer>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDialogVisible = false;setSave()">确 定</el-button>
      </span>
      </el-dialog>
      <!--设置操作end-->
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
      svalue: [], //弹框右边数据
      sdata: [], //弹框全部数据
      allData:[], //弹框全部数据
      setMenu: [], //弹框对象
      selectMenu: [],
      selected: [],
      table: {
        props: {},
        header: [
            {
                label: '菜单编号',
                prop: 'menuId'
            },
            {
                label: '菜单名称',
                  prop: 'menuName'
            },
             {
                  label: '元素ID',
                  prop: 'elid'
            },
            {
                  label: '节点图标样式',
                  prop: 'iconClass'
            },
            {
                  label: '标签页编号',
                  prop: 'tabId'
            },
            {
                  label: '标签页标题',
                  prop: 'tabTitle'
            },
            {
                  label: '标签页图标',
                  prop: 'tabIcon'
            },
            {
                  label: '页面URL',
                  prop: 'iframeUrl' 
            },
            {
                  label: '排序',
                  prop: 'seq', 
            },
            {
                  label: '模式',
                  prop: 'modle'
            },  
            {
                  label: '启用',
                  prop: 'disabled'
            },
            {
                  label: '上级菜单',
                  prop: 'pmid' 
            },
            {
                  label: "操作",
                  fixed: "right",
                  render: utils.component.createOperationRender(this, {
                    editData: '编辑',
                    setData: "设置操作"
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
    /**
     * 新增
     */
    addMenu(){
        this.$emit("openAddPage", null)
    },
    /**
     * 编辑
     */
    editData({row}){
        this.$emit("openAddPage", row.menuId);
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
        // this.$service
        //   .userConfigDelete({ id: this.selected.join(",") }, "删除成功")
        //   .then(data => {
        //     this.fetchData();
        //   });
      }
    },
    handleCreate() {
      this.$router.push({ name: "prize-create" });
    },
    //表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.menuId);
      this.updateTableSelected();
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.menuId;
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
        if (newSelectedIndex.indexOf(item.menuId) > -1) {
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
      this.$service.getSysMenuList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    },
    /**
     * 设施操作
     */
    setData({row}){
      this.setDialogVisible = true
      const MenuObj = { menuId:row.menuId}
      this.setMenu.push(['menuId',row.menuId])
      var data1 = []
      this.$service.getNotMenuByRunId(MenuObj).then(data => {
        this.allData = data
        this.$service.getMenuByRunId(MenuObj).then(data => {
          if (data != null){
            this.allData = this.allData.concat(data) //拼接数组
          }
          //创建全部数组
          for(let i =0;i<this.allData.length; i++){
            data1.push({
              key: this.allData[i].runId,
              label: this.allData[i].runName
            })
          }
          for (let j=0;j< data.length;j++){
            this.svalue.push(data[j].runId)
          }
          this.sdata = data1
        })
      })
    },
    //选中操作
    handleChange (value, direction, movedKeys) {
      var str = []
      for (var i = 0; i < value.length; i++) {
        str.push(['runIds', value[i]])
      }
      this.selectMenu = this.setMenu.concat(str)
      console.log(this.selectMenu)
    },
    //弹框保存事件
    setSave () {
      this.$service.saveMenuRun(this.selectMenu,"保存成功")
    }
  },
  created() {
    let filterSchema = _.map({
      menuName: _.o.string.other("form", {
        placeholder: "菜单名称",
        cols: {
          item: 3,
          label: 0
        }
      }),
      elid: _.o.string.other("form", {
        component: "Input",
        placeholder: "元素ID",
        cols: {
          item: 3,
          label: 0
        }
      }),
      elid: _.o.string.other("form", {
        component: "Input",
        placeholder: "元素ID",
        cols: {
          item: 3,
          label: 0
        }
      }),
      tabId: _.o.string.other("form", {
        component: "Input",
        placeholder: "标签页编号",
        cols: {
          item: 3,
          label: 0
        }
      }),
       iframeUrl: _.o.string.other("form", {
        component: "Input",
        placeholder: "页面URL",
        cols: {
          item: 3,
          label: 0
        }
      }),
       modle: _.o.string.other("form", {
        component: "Input",
        placeholder: "模式",
        cols: {
          item: 3,
          label: 0
        }
      }),
       pmid: _.o.string.other("form", {
        component: "Input",
        placeholder: "上级菜单",
        cols: {
          item: 3,
          label: 0
        }
      }),
      disabled: _.o.enum({ 否: "0",  是: "1"}).other("form", {
          component: "Select",
          placeholder: "是否禁用",
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
  }
};
</script>
<style lang = 'stylus' scoped>
.btns
  margin-bottom 10px
</style>



