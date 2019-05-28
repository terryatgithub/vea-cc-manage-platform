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
        pageName='onclickInfo' 
        @add="addData"
        @edit="editData"
        @delete="deleteData"
        >
        </ButtonGroupForListPage>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-change="rowClick"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from "gateschema";
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import ButtonList from "./../../components/ButtonLIst";
import { ContentWrapper, Table, ActionList, utils } from "admin-toolkit";
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper,
    ButtonGroupForListPage
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
      selected: undefined,
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
                prop: 'modifierName'
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
        selected: undefined,
        selectionType: "single"
      }
    };
  },
  methods: {
    rowClick(row ,index) {
      this.table.selected = index
      this.selected = row.commonOnclickId
    },
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
        this.$emit('open-add-page', this.selected)
    },
    /**
     * 批量删除
     */
    deleteData() {
      if (window.confirm("确定要删除吗")) {
        this.$service.commonOnclickInfoDelete({ id: this.selected }, "删除成功")
          .then(data => {
            this.fetchData();
          });
      }
    },
    //查询
  handleFilterChange(type) {
      if(this.$validateId(this.filter.commonOnclickId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
    },
    //重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      };
      this.pagination.currentPage = 1
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
      this.selected = undefined
      this.table.selected = undefined
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
        placeholder: "ID"
      }),
      onlickName: _.o.string.other("form", {
        component: "Input",
        placeholder: "点击事件名",
      })
    })
      .other("form", {
         cols: {
        item: 6,
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