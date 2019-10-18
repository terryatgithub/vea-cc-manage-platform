 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="vId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    :select-end-on-dbl-click="true"
    @pagination-change="fetchData"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">
    <el-form slot="filter" :inline="true" v-model="filter" label-width="72px">
      <el-form-item label="内容源">
        <SourceSelector v-model="filter.source" :freeze="source ? true : false" />
      </el-form-item>
      <el-form-item label="资源类型">
        <el-select v-model="filter.nodeType">
          <el-option
            v-for="option in options.nodeType"
            :key="option.label"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容类型">
        <el-select v-model="filter.cateid">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="option in options.cateid"
            :key="option.label"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容搜索">
        <el-input v-model="filter.title"></el-input>
      </el-form-item>
      <div style="text-align: center">
        <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
        <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
      </div>
    </el-form>
  </BaseSelector>
</template>

<script>
import BaseSelector from '../BaseSelector'
import SourceSelector from '@/components/SourceSelector'
export default {
  components: {
    BaseSelector,
    SourceSelector
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
      options: {
        nodeType: [
          { label: '直播', value: 'live' },
          { label: '录播', value: 'res' }
        ],
        cateid: [
          { label: '足球', value: '1' },
          { label: '篮球', value: '2' },
          { label: '综合类型', value: '3' },
          { label: '非对阵类', value: '4' }
        ]
      },
      table: {
        props: {},
        data: [],
        selected: [],
        header: [
          {
            prop: 'vId',
            label: 'ID',
            fixed: true,
            width: '100'
          },
          {
            prop: 'thirdId',
            label: '第三方ID',
            fixed: true,
            width: '100'
          },
          {
            prop: 'title',
            label: '标题',
            fixed: true,
            width: '220'
          },
          {
            prop: 'subTitle',
            label: '副标题',
            width: '120'
          },
          {
            prop: 'cateid',
            label: '内容类别',
            width: '120'
          },
          {
            prop: 'thumb',
            label: '海报',
            render: (h, { row }) => {
              return h('img', {
                key: row.thumb,
                attrs: {
                  src: row.thumb,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                }
              })
            },
            width: '120'
          },
          {
            prop: 'startTime',
            label: '开始时间',
            width: '200'
          },
          {
            prop: 'endTime',
            label: '结束时间',
            width: '200'
          },
          {
            prop: 'createdDate',
            label: '创建时间',
            width: '200'
          },
          {
            prop: 'lastUpdateDate',
            label: '更新时间',
            width: '200'
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
        callbackparam: 'result',
        source: this.source || this.$consts.sourceOptions[0].value, // 内容源
        nodeType: 'live', // 资源类型
        cateid: '', // 内容类型
        title: '' // 内容搜索
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = Object.assign({}, this.efficientFilter)
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      if (filter.source) {
        filter.source = this.$consts.sourceToPartner[filter.source]
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
      this.$service.queryLiveVideoResult(filter).then(data => {
        data = JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  }
}
</script>

 <style lang='stylus' scoped>
</style>
