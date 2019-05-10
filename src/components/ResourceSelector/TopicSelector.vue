 <template>
  <BaseSelector 
    ref="baseSelector"
    id-field="topicId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table" 
    :pagination="pagination"
    @pagination-change="fetchData"
    @filter-change="fetchData"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">
    <el-form slot="filter" :inline="true" v-model="filter" label-width="72px">
      <el-form-item label="专题类别">
        <el-select v-model="filter.leveltype">
          <el-option
            v-for="option in options"
            :key="option.label"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专题名称">
        <el-input v-model="filter.title"/>
      </el-form-item>
      <div style="text-align: center">
        <el-button size="small" type="primary" @click="fetchData">查询</el-button>
        <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
      </div>
    </el-form>
  </BaseSelector>
</template>
 
<script>
import BaseSelector from './BaseSelector'
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
      options: [
        { label: '大专题', value: 'parentTopic' },
        { label: '小专题', value: 'childTopic' }
      ],
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
            label: '专题名称',
            fixed: true,
            width: '220'
          },
          {
            prop: 'picture',
            label: '专题背景',
            render: (h, { row }) => {
              if (row.picture)
                return h('img', {
                  attrs: {
                    src: row.picture,
                    width: '110px',
                    height: '50px',
                    class: 'imgs'
                  }
                })
            },
            width: '120'
          },
          {
            prop: 'dataSign',
            label: '专题类别',
            width: '200',
            formatter: function(row) {
              if (row.dataSign === 'parentTopic') {
                return '大专题'
              } else if (row.dataSign === 'childTopic') {
                return '小专题'
              }
            }
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
  props: ['isLive', 'selectionType'],
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter() {
      return {
        resType: 'operation',
        dataType: 'topic',
        callback: 'result',
        levelType: undefined, // 专题类别
        title: undefined // 专题名称
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
      this.$service.getMediaVideoInfos(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  }
}
</script>
 
 <style lang='stylus' scoped>
</style>