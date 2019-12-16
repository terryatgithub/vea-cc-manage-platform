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
    :select-end-on-dbl-click="true"
    @pagination-change="fetchData"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">
  </BaseSelector>
</template>

<script>
import _ from 'gateschema'
import BaseSelector from '../BaseSelector'
export default {
  components: {
    BaseSelector
  },
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.genDefaultFilter(),
      filterSchema: null,
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'appId',
            width: '70'
          },
          {
            label: '应用名称',
            prop: 'appName',
            width: '100'
          },
          {
            label: '应用包名',
            prop: 'appPackageName'
          },
          {
            label: '图片',
            prop: 'appImageUrl',
            render: (createElement, { row }) => {
              return createElement('img', {
                key: row.appImageUrl,
                attrs: {
                  src: row.appImageUrl,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                }
              })
            }
          }
        ],
        data: []
      }
    }
  },
  computed: {
    selected () {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  props: ['isLive', 'selectionType'],
  methods: {
    genDefaultFilter () {
      return {
        appId: undefined,
        appName: undefined,
        appPackageName: undefined
      }
    },
    getFilter () {
      const pagination = this.pagination
      const filter = Object.assign({}, this.filter)
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange (filter) {
      this.filter = filter
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.getAppManagementList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created () {
    let filterSchema = _.map({
      appId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
        component: 'Input',
        placeholder: '应用ID',
        label: ' '
      }),
      appName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '应用名称',
        label: ' '
      }),
      appPackageName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '应用包名',
        label: ' '
      })
    }).other('form', {
      cols: {
        item: 4,
        label: 1,
        wrapper: 23
      },
      layout: 'inline',
      footer: {
        cols: {
          item: 3,
          label: 1,
          wrapper: 23
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
