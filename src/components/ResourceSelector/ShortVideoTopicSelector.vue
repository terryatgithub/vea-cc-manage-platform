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
import _ from 'gateschema'
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
            label: '话题ID',
            prop: 'id'
          },
          {
            label: '话题名',
            prop: 'topicName'
          },
          {
            label: '话题类型',
            prop: 'type',
            render: (h, {row}) => {
              return this.$consts.topicTypesText[row.type]
            }
          },
          {
            label: '内容源',
            prop: 'source',
            render: (h, {row}) => {
              return this.$consts.sourceText[row.source]
            }
          }
        ],
        data: []
      }
    }
  },
  props: ['isLive', 'selectionType', 'source', 'disablePartner'],
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter() {
      return {
        type: undefined,
        topicName: undefined,
        source: this.source,
        status: this.$consts.status.accepted
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
      this.$service.topicGetList(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows || []
      })
    }
  },
  created() {
    const filterSchema = _.map({
      topicName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '话题名',
        label: ' '
      }),
      type: _.o.enum(this.$consts.topicTypesEnum).other('form', {
        component: 'Select',
        placeholder: '话题类型',
        label: ' ',
        clearable: true
      }),
      source: _.o.enum(this.$consts.sourceEnums).other('form', {
        component: 'Select',
        placeholder: '内容源',
        label: ' ',
        clearable: true,
        disabled: this.disablePartner
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
