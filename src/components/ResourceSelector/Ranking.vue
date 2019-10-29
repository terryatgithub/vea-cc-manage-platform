 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="id"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    :select-end-on-dbl-click="true"
    @pagination-change="fetchData"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">
  </BaseSelector>
</template>

<script>
import BaseSelector from '../BaseSelector'
export default {
  components: {
    BaseSelector
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 50
      },
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: 'id',
            label: 'ID',
            fixed: true,
            width: '100'
          },
          {
            prop: 'title',
            label: '排行榜',
            fixed: true
          }
        ],
        selected: [],
        selectionType: 'single'
      }
    }
  },
  props: ['isLive', 'selectionType', 'source'],
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter() {
      return {
        resType: 'operation',
        dataType: 'coocaaRanking',
        levelType: 'childRanking',
        partner: this.$consts.sourceToPartner[this.source],
        callback: 'result',
        levelType: undefined, // 专题类别
        title: undefined // 专题名称
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = Object.assign({}, this.efficientFilter)
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange() {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.efficientFilter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      const filter = this.getFilter()
      this.$service.getMediaVideoInfos(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows || []
      })
    }
  }
}
</script>

 <style lang='stylus' scoped>
</style>
