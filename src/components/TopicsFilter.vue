/***********************************************************************************************
 *@name   : TopicFilter(改编自ccTopicFilter)
 *@desc   : 直播筛选器
 ***********************************************************************************************/
 <template>
  <ContentWrapper :pagination="pagination" @filter-change="search">
    <el-collapse value="1">
      <el-collapse-item title="查询条件" name="1">
        <el-form :inline="true" v-model="searchForm" label-width="72px">
          <el-form-item label="专题类别">
            <el-select v-model="searchForm.levelType">
              <el-option
                v-for="option in options"
                :key="option.label"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专题名称">
            <el-input v-model="searchForm.title"/>
          </el-form-item>
          <div style="text-align: center">
            <el-button size="small" type="primary" @click="search">查询</el-button>
            <el-button size="small" type="warning" @click="reset">重置</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- Table部分 -->
    <Table
      :props="table.props"
      :header="table.header"
      :data="table.data"
      :selected="table.selected"
      :selection-type="table.selectionType"
      @row-selection-change="handleRowChange"
    />
    <!-- Table部分end -->
  </ContentWrapper>
</template>
 
 <script>
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    ContentWrapper,
    Table
  },

  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      searchForm: {
        resType: 'operation',
        dataType: 'topic',
        callback: 'result',
        levelType: '', // 专题类别
        title: '' // 专题名称
      },
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
              if(row.picture)
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
        selected: {},
        selectionType: 'single'
      },
      selected: undefined
    }
  },

  watch: {
    selected: function(value) {
      this.$emit('input', value)
    }
  },

  methods: {
    reset() {
      this.searchForm = {
        resType: 'operation',
        dataType: 'topic',
        callback: 'result',
        levelType: '', // 专题类别
        title: '' // 专题名称
      }
      this.table.data = []
    },
    search(type) {
      if (type !== 'pagination') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getMediaVideoInfos(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { searchForm, pagination } = this
      if (pagination) {
        searchForm.page = pagination.currentPage
        searchForm.rows = pagination.pageSize
      }
      let rs = {}
      Object.keys(searchForm).map(function(item) {
        if (searchForm[item]) {
          rs[item] = searchForm[item]
        }
      })
      return rs
    },
    handleRowChange(row, index) {
      this.table.selected = index
      this.selected = row
    }
  },
  created() {}
}
</script>
 
 <style lang='stylus' scoped>
</style>