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
        <el-button type="success" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteData">删除</el-button>
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
import { Button } from 'element-ui'
import ButtonList from "./../../components/ButtonLIst";
import { ContentWrapper, Table, ActionList, utils } from "admin-toolkit";
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper
  },
  data() {
    let _this = this
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
                prop: 'homepageId'
            },
            {
                label: '首页名称',
                prop: 'homepageName',
                align: 'center',
                render: (h, { row }) => {
                  return h(Button, 
                    { 
                      ref: 'button',
                      props: {  },
                      domProps: {
                        innerHTML: row.homepageName
                      },
                      on: {
                        click: (value) => {
                          this.showData(row.homepageId, row.currentVersion)
                        }
                      }
                    })
                }
            },
             {
                label: '关联策略',
                prop: 'relationPolicyName',
                width: 300,
                render: (h, { row }) => {
                  let content = row.relationPolicyName
                  if(!content || content == '--'){
                    return '--';
                  }
                  let pList = content.split(',')
                  return h('div', 
                  {
                    style: {
                      whiteSpace: 'nowrap'
                    }
                  },
                  pList.map(function (item) {
                    return h(Button, 
                      { 
                        ref: 'button',
                        props: { },
                        attrs: {
                          title: '点击查看'
                        },
                        domProps: {
                          innerHTML: item
                        },
                        on: {
                          click: () => {
                            _this.openPolicyDialog(_this.$regParenthesesContent(item))
                          }
                        }
                      })
                  }))
                }
            },
            {
                label: '版本/状态',
                prop: 'homepageStatus',
                align: 'center',
                render: (h, { row }) => {
                  return h('span', 
                    { 
                      domProps: {
                        innerHTML: row.currentVersion + '/' + _this.$numToAuditStatus(row.homepageStatus)
                      }
                    })
                }
            },
            {
                  label: '待审核副本',
                  prop: 'duplicateVersion',
                  align: 'center',
                  render: (h, { row }) => {
                    if (row.duplicateVersion === '') {
                      return ''
                    } else {
                      return h(Button, 
                        { 
                          ref: 'button',
                          props: {  },
                          domProps: {
                            innerHTML: row.duplicateVersion
                          },
                          on: {
                            click: (value) => {
                              this.showData(row.homepageId, row.duplicateVersion)
                            }
                          }
                        })
                    }
                  }
            },
            {
                  label: '机型机芯',
                  prop: 'chipModel',
                  render: (h, { row }) => {
                    return h('span', 
                      { 
                        style: {
                          whiteSpace: 'nowrap'
                        },
                        domProps: {
                          innerHTML: row.chipModel
                        }
                      })
                  }
            },
            {
                  label: '更新时间',
                  prop: 'lastUpdateDate'
            },
            {
                  label: '更新人',
                  prop: 'modiferName' 
            },
            {
              label: '操作',
              width: '100',
              fixed: 'right',
              render: utils.component.createOperationRender(this, {
                editData: '复制'
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
    addData(){
        this.$emit("open-add-page", null)
    },
    /**
     * 编辑
     */
    editData(){
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page',this.selected[0])
      }
    },
    /**
     * 查看
     */
    showData(){
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page',this.selected[0])
      }
    },
    /**
     * 批量删除
     */
    deleteData() {
      if (this.$isAllowDelete(this.selected) && window.confirm("确定要删除吗")) {
        this.$service.homePageInfoDelete({ id: this.selected.join(",") }, "删除成功")
          .then(data => {
            this.fetchData();
          });
      }
    },
    /**
     * 查看关联策略
     */
    openPolicyDialog(arr) {
      console.log(arr[0])
    },
    handleCreate() {
      this.$router.push({ name: "prize-create" });
    },
    //表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.homepageId);
      this.updateTableSelected();
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.homepageId;
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
        if (newSelectedIndex.indexOf(item.homepageId) > -1) {
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
      this.$service.getHomePageInfoList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    },
    /**
     * 获取menuInfoTree
     */
    getSysMenuInfo () {
      return this.$service.getHomePageInfoMenu().then(data => {
        this.buttonList = data
      })
    }
  },
  created() {
    let filterSchema = _.map({
      homepageId: _.o.string.other("form", {
        component: "Input",
        placeholder: "ID",
        cols: {
          item: 3,
          label: 0
        }
      }),
      homepageName: _.o.string.other("form", {
        component: "Input",
        placeholder: "名称",
        cols: {
          item: 3,
          label: 0
        }
      }),
      homepageStatus: _.o.enum({
        请选择: '',
        下架:'0',
        上架:'1',
        草稿:'2',
        待审核:'3',
        审核通过:'4',
        审核不通过:'5'
      }).other("form", {
        component: "Select",
        placeholder: "状态",
        cols: {
          item: 3,
          label: 0
        },
      }),
      chipModel: _.o.string.other("form", {
        component: "Input",
        placeholder: "机型/机芯",
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