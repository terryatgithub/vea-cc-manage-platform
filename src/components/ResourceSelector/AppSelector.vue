 <template>
  <BaseSelector 
    ref="baseSelector"
    id-field="appId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table" 
    :pagination="pagination"
    :filter="filter"
    :filter-schema="filterSchema"
    @pagination-change="fetchData"
    @filter-change="fetchData"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">
  </BaseSelector>
</template>
 
<script>
import _ from "gateschema";
import BaseSelector from '../BaseSelector'
export default {
  components: {
    BaseSelector
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.getDefaultFilter(),
      filterSchema: null,
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
        data: []
      }
    }
  },
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  props: ['isLive', 'selectionType'],
  methods: {
    getDefaultFilter() {
      return {
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = Object.assign({}, this.filter)
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      const filter = this.getFilter()
      this.$service.getAppManagementList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    }
  },
  created() {
    let filterSchema = _.map({
      id: _.o.number.other('form', {
        component: 'Input',
        placeholder: '轮播入口ID',
        label: '轮播入口ID'
      }),
      title: _.o.string.other('form', {
        component: 'Input',
        placeholder: '轮播入口名称',
        label: '轮播入口名称'
      })
    }).other('form', {
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
    this.filterSchema = filterSchema
  }
}
</script>
 
 <style lang='stylus' scoped>
</style>