<template>
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
         @row-click="rowClick"
        @row-selection-change="rowClick"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
</template>

<script>
import _ from "gateschema";
import { ContentWrapper, Table, utils,RemoteSelect } from "admin-toolkit";
export default {
  components: {
    Table,
    ContentWrapper,
    RemoteSelect
  },
  props: {
    multi: {
      type: String,
      default: 'single'
    },
    params: Object
  },
  data() {
    return {
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {
        pageSize: 5
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: "ID",
            prop: "appId",
            width: "70"
          },
           {
            label: "应用名称",
            prop: "appName",
            width: "100"
          },
           {
            label: "应用包名",
            prop: "appPackageName",
          },
          {
            label: "图片",
            prop: "appImageUrl",
            render: (createElement, { row }) => {
              return createElement("img", {
                attrs: {
                  src: row.appImageUrl,
                  width: "50px",
                  height: "50px",
                  class: "imgs"
                }
              });
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: "multiple"
      }
    };
  },
  watch: {
    selected: function(value) {
      this.$emit('input', this.selected)
    }
  },
  methods: {
    // multipleSelect() {
    //   this.$emit("multiple-select",this.selected)
    // },
    rowClick(params) {
       if (this.multi === 'single') {
          this.$emit("row-click",params)
       }
    },
    selectCancel() {
       this.$emit('select-cancel')
    },
    handleChange(value, direction, movedKeys) {
      var str = [];
      for (var i = 0; i < value.length; i++) {
        str.push(["roleIds", value[i]]);
      }
      this.selectedRole = this.user.concat(str);
    },
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem);
      this.updateTableSelected();
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem;
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
      const newSelectedIndex = this.selected.map((e) => {
        return e.appId
      });
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.appId) > -1) {
          result.push(index);
        }
        return result;
      }, []);
    },
    handleFilterChange(type) {
      if(this.$isNumber(this.filter.appId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
    },
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
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter();
      Object.assign(filter, this.params)
      this.$service.getAppManagementList(filter).then(data => {
       // data =JSON.parse(data.replace("result(",'').replace(/\)$/,''))
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    }
  },
  created() {
     this.table.selectionType = this.multi
    let filterSchema = _.map({
      appId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      appName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '应用名称'
      }),
       appPackageName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '应用包名'
      }),

    }).other("form", {
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
  }
};
</script>
<style lang = 'stylus' scoped>
.btns
  margin-bottom: 10px
</style>
