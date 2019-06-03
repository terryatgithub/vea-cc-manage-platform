 <template>
  <BaseSelector 
    ref="baseSelector"
    id-field="id"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table" 
    :pagination="pagination"
    :filter="filter"
    :filter-schema="filterSchema"
    @pagination-change="fetchData"
    @filter-change="handleFilterChange"
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
            label: '轮播入口ID',
            prop: 'id',
            sortable: true
          },
          {
            label: '轮播入口名称',
            prop: 'title'
          }
        ],
        data: []
      }
    }
  },
  props: ['isLive', 'selectionType'],
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter() {
      return {
        id: undefined,
        title: undefined,
        resType: 'operation',
        dataType: 'rotate',
        levelType: 'rotateSta',
        callback: 'result',
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = Object.assign({}, this.filter)
      filter.code = filter.id
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange(filter) {
      this.filter = filter
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      const filter = this.getFilter()
      this.$service.getMediaVideoInfos(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows || []
      })
    }
  },
  created() {
    const filterSchema = _.map({
      id: _.o.number.other('form', {
        component: 'Input',
        placeholder: '轮播入口ID',
        label: ' '
      }),
      title: _.o.string.other('form', {
        component: 'Input',
        placeholder: '轮播入口名称',
        label: ' '
      })
    }).other('form', {
       cols: {
        item: 3,
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