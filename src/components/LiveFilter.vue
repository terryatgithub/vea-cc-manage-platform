/***********************************************************************************************
 *@name   : LiveFilter(改编自ccLiveFilter)
 *@desc   : 直播筛选器
 ***********************************************************************************************/
 <template>
  <ContentWrapper :pagination="pagination" @filter-change="search">
    <el-collapse value="1">
      <el-collapse-item title="查询条件" name="1">
        <el-form :inline="true" v-model="searchForm" label-width="72px">
          <el-form-item label="内容源">
            <el-select v-model="searchForm.source">
              <el-option
                v-for="option in options.source"
                :key="option.label"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源类型">
            <el-select v-model="searchForm.nodeType">
              <el-option
                v-for="option in options.nodeType"
                :key="option.label"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容类型">
            <el-select v-model="searchForm.cateid">
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
            <el-input v-model="searchForm.title"></el-input>
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
        @row-click="rowClick"
      @row-selection-add="handleRowSelectionAdd"
      @row-selection-remove="handleRowSelectionRemove"
      @all-row-selection-change="handleAllRowSelectionChange"
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
  props: ['multi'],
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 5
      },
      selected: [], // 列表选中项
      searchForm: {
        callbackparam: 'result',
        source: 'tencent', // 内容源
        nodeType: 'live', // 资源类型
        cateid: '', // 内容类型
        title: '' // 内容搜索
      },
      options: {
        source: [
          { label: '腾讯', value: 'tencent' },
          { label: '爱奇艺', value: 'yinhe' }
        ],
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

  watch: {
    selected: function(value) {
      this.$emit('input', this.selected)
    }
  },

  methods: {
     rowClick(params) {
       debugger;
       if (this.multi === 'single') {
         this.$emit("row-click",params)
       }
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
      this.$service.queryLiveVideoResult(filter).then(data => {
        data = JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
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
        return e.vId
      });
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.vId) > -1) {
          result.push(index);
        }
        return result;
      }, []);
    },
    reset() {
      this.searchForm = {
        callbackparam: 'result',
        source: 'tencent', // 内容源
        nodeType: 'live', // 资源类型
        cateid: '', // 内容类型
        title: '' // 内容搜索
      }
      this.table.data = []
    }
  },
  created() {
    this.table.selectionType = this.multi
  }
}
</script>
 
 <style lang='stylus' scoped>
</style>