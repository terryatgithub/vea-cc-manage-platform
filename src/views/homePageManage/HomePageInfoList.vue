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
        pageName="homepage"
        @add="addData"
        @edit="editData"
        @delete="deleteData"
      ></ButtonGroupForListPage>
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
import ButtonGroupForListPage from './../../components/ButtonGroupForListPage'
// import ButtonList from "./../../components/ButtonLIst";
import { ContentWrapper, Table, ActionList, utils } from "admin-toolkit";
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper,
    ButtonGroupForListPage
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
        props: {
          'row-key': 'homepageId'
        },
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
                      props: {
                        type: 'text'
                      },
                      on: {
                        click: () => {
                          this.handleRead(row)
                        }
                      }
                    }, row.homepageName)
                }
            },
             {
                label: '关联策略',
                prop: 'relationPolicyName',
                width: 300,
                render: (h, { row }) => {
                  const relationPolicyName = row.relationPolicyName
                  if (relationPolicyName.length > 20) {
                    return relationPolicyName.slice(0, 20) + '...'
                  } 
                  return relationPolicyName
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
                  const statusText = this.$consts.statusText
                  return h('span', `${row.currentVersion}/${statusText[row.homepageStatus]}`)
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
                          props: {
                            type: 'text'
                          },
                          on: {
                            click: (value) => {
                              this.handleRead(row, row.duplicateVersion)
                            }
                          }
                        }, row.duplicateVersion)
                    }
                  }
            },
            // {
            //       label: '机型机芯',
            //       prop: 'chipModel',
            // },
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
                handleCopy: '复制'
              })
            }
        ],
        data: [],
        selected: [],
        selectionType: "multiple"
      }
    };
  },
  computed: {
  },
  methods: {
    handleCopy({ row }) {
      this.$emit('copy', row)
    },
    addData(){
        this.$emit("create")
    },
    editData(){
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('edit', this.selected[0])
      }
    },
    handleRead(item, version) {
      this.$emit('read', item, version)
    },
    deleteData() {
      if (this.$isAllowDelete(this.selected) && window.confirm("确定要删除吗")) {
        this.$service.homePageInfoDelete({ 
          id: this.selected.map(item => item.homepageId).join(',') 
        }, "删除成功").then(this.fetchData);
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
      this.selected.push(targetItem);
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
      const idField = 'homepageId'
      const table = this.table;
      const newSelectedIndex = this.selected.reduce((result, item) => (result[item[idField]] = true, result), {});
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex[item[idField]]) {
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
        this.updateTableSelected()
      });
    },
    /**
     * 获取menuInfoTree
     */
    // getSysMenuInfo () {
    //   return this.$service.getHomePageInfoMenu().then(data => {
    //     this.buttonList = data
    //   })
    // }
  },
  created() {
    const filterSchema = _.map({
      homepageId: _.o.string.other("form", {
        component: "Input",
        placeholder: "ID"
      }),
      homepageName: _.o.string.other("form", {
        component: "Input",
        placeholder: "名称"
      }),
      homepageStatus: _.o.enum({
        下架:'0',
        上架:'1',
        草稿:'2',
        待审核:'3',
        审核通过:'4',
        审核不通过:'5'
      }).other("form", {
        component: "Select",
        placeholder: "状态"
      }),
      chipModel: _.o.string.other("form", {
        component: "Input",
        placeholder: "机型/机芯"
      })
    })
      .other("form", {
         cols: {
        item: 5,
        label: 0,
        wrapper: 20
      },
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
    //this.getSysMenuInfo();
  }
};
</script>
<style lang = 'stylus' scoped>
.btns
  margin-bottom 10px
  display flex
  flex-direction row
</style>