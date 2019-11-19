 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="trailerId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    :select-end-on-dbl-click="true"
    @pagination-change="fetchData"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">

    <el-form slot="filter" :inline="true" v-model="filter" label-width="72px">
      <el-form-item label="渠道">
        <CommonSelector v-model="filter.partner" :disabled="disablePartner" :options="$consts.partnerOptions" />
      </el-form-item>
      <el-form-item label="内容源">
        <CommonSelector v-model="filter.sources" :options="sourceEnums" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="影片名" clearable v-model="filter.mTitle"/>
      </el-form-item>
      <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
      <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
    </el-form>
  </BaseSelector>
</template>

<script>
import BaseSelector from '../BaseSelector'
import CommonSelector from '@/components/CommonSelector'
export default {
  components: {
    BaseSelector,
    CommonSelector
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      sourceEnums: [],
      sourceText: {},
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
      filterSchema: null,
      table: {
        props: {},
        header: [
          {
            label: '预约ID',
            prop: 'trailerId'
          },
          {
            label: '预告片名',
            prop: 'trailerTitle'
          },
          {
            label: '内容源',
            render: (h, { row }) => {
              return this.sourceText[row.thirdSource]
            }
          },
          {
            label: '有正片',
            render: (h, { row }) => {
              return row.positiveId ? '是' : ''
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
  watch: {
    'filter.partner': 'onPartnerChange'
  },
  methods: {
    secondToTimeStr(seconds) {
      if (seconds) {
        const hour = Math.floor(seconds / 3600)
        const min = Math.floor((seconds - 3600 * hour) / 60)
        const sec = seconds - 3600 * hour - 60 * min
        return `${hour}小时${min}分${sec}秒`
      }
    },
    getDefaultFilter() {
      return {
        partner: this.$consts.sourceToPartner[this.source || this.$consts.partnerOptions[0].value],
        sources: '',
        resType: 'videoReservation',
        callback: 'result'
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = Object.assign({}, this.efficientFilter)
      filter.code = filter.id
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
      this.$service.getMediaVideoInfos(filter).then(result => {
        this.pagination.total = result.total
        // ??? 有些是 rows 有些是 list
        this.table.data = result.rows || result.list || []
      })
    },
    onPartnerChange() {
      const partner = this.filter.partner
      this.sourceEnums = []
      if (partner) {
        this.$service.getPartnerSource({ partnerName: partner }).then(data => {
          const sourceEnums = data.rows.reduce(function(result, item) {
            if (item.source_List) {
              result = result.concat(item.source_List
                // eslint-disable-next-line
                .map(({ source_code, source_title }) => ({ label: source_title, value: source_code })))
            }
            return result
          }, [])
          const defaultSelected = sourceEnums.find(function(item) {
            return item.value === partner
          }) || sourceEnums[0]
          if (defaultSelected) {
            this.filter.sources = defaultSelected.value
          }
          this.sourceEnums = sourceEnums
          this.sourceText = sourceEnums.reduce((result, item) => {
            result[item.value] = item.label
            return result
          }, {})
        })
      }
    }
  },
  created() {
    this.onPartnerChange()
  }
}
</script>

 <style lang='stylus' scoped>
</style>
