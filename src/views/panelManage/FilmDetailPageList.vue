<template>
  <ContentCard class="content">
    <ContentWrapper
        :pagination="pagination"
        @filter-change="handleFilterChange"
      >
      <el-form :model="filter" inline label-width="90px">
        <el-form-item label="板面ID">
          <el-input v-model="filter.tabId"/>
        </el-form-item>
        <el-form-item label="版面标题">
          <el-input v-model="filter.tabName"/>
        </el-form-item>
        <el-form-item label="内容源">
          <el-select v-model="filter.source" clearable @change="pannelValue=[];filter.channel=''">
            <el-option value="qq" label="腾讯"/>
            <el-option value="iqiyi" label="爱奇艺"/>
            <el-option value="voole" label="优朋"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.tabStatus" clearable>
            <el-option v-for="item in tabStatusOption" :key="item.label" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="业务分类">
          <el-select v-model="filter.category" clearable>
            <el-option value="0" label="影视"/>
            <el-option value="1" label="教育"/>
          </el-select>
        </el-form-item>
        <el-form-item label="频道">
          <el-cascader
          :value="pannelValue"
          :options="channelOptions"
          expand-trigger="hover"
          clearable
          @change="handleChannelChange"
          />
        </el-form-item>
        <el-form-item label="产品包">
          <el-select v-model="filter.product" clearable>
            <el-option v-for="(item, index) in productOptions" :key="index" :label="item.source_name" :value="item.source_sign"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilterChange">查询</el-button>
          <el-button icon="el-icon-delete" @click="handleFilterReset">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addFilmDetail">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
      </div>

      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from 'gateschema'
import { ContentWrapper, Table } from 'admin-toolkit' 
export default {
  components: {
    ContentWrapper,
    Table
  },

  data () {
    return {
      pannelValue: [],
      filter: {},
      filterSchema: null,
      pagination: {
        currentPage: 1
      },
      tabStatusOption: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      productOptions: [], // 产品包筛选条件
      channelOptions: [],
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: 'tabId',
            label: 'ID',
            sortable: true
          },
          {
            prop: 'tabName',
            label: '版面名称',
            sortable: true
          },
          {
            prop: 'priority',
            label: '优先级',
            sortable: true
          },
          {
            prop: 'category',
            label: '业务分类',
            sortable: true,
            formatter: row => {
              return row.category === '0' ? '影视' : row.category === '1' ? '教育' : ''
            }
          },
          {
            prop: 'source',
            label: '内容源',
            sortable: true,
            formatter: row => {
              if(row.category == 0) {
                switch(row.source){
                  case 'qq': return '腾讯'
                  case 'iqiyi': return '爱奇艺'
                  case 'voole': return '优朋'
                }
              }else {
                return ''
              }
            }
          },
          {
            prop: 'tabStatus',
            label: '版本/状态',
            sortable: true,
            formatter: row => {
              return row.currentVersion + '/' + ['下架','上架','草稿','待审核','审核通过','审核不通过'][row.currentStatus]
            }
          },
          {
            prop: 'duplicateVersion',
            label: '待审核副本',
            sortable: true
          },
          {
            prop: 'lastUpdateDate',
            label: '更新时间',
            sortable: true
          },
          {
            prop: 'currentOperator',
            label: '更新人',
            sortable: true
          },
          {
            prop: 'auditor',
            label: '审核人',
            sortable: true
          },
        ],
        selected: [],
        selectionType: 'multiple'
      },
      selected: []
    };
  },

  methods: {
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.filmDetailPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    // 表单筛选
    handleFilterChange(type) {
      if (type !== 'pagination') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {}
      this.pannelValue = []
      this.fetchData()
    },
    // 按钮操作
    addFilmDetail() {
      this.$emit("open-add-page")
    },
    editData() {

    },
    batchDel() {

    },
    /**
     * 行选择操作
     */
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.tabId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.tabId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.tabId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    //服务
    getMediaResourceInfo() {
      return this.$service.getMediaResourceInfo().then(data => {
        var movieData = JSON.parse(decodeURI(data.slice(5,-1)))
        var videoItemModels = movieData.videoItemModels
        // 产品包
        var productList = videoItemModels.reduce((result, item) => {
          result.push(item.productList)
          return result
        }, [])
        var productItems = [].concat.apply([], productList);
        this.productOptions = productItems

        //频道->爱奇艺channelOptions
        // videoItemModels[0].categoryList
        var channelQiyi = {
          label: '爱奇艺',
          value: 'iqiyi',
          children: []
        }
        channelQiyi.children = videoItemModels[0].categoryList.reduce((result, item)=> {
          return result.concat({label: item.category_name, value: item.category_id})
        }, [])
        var channelTent = {
          label: '腾讯',
          value: 'qq',
          children: []
        }
        channelTent.children = videoItemModels[1].categoryList.reduce((result, item)=> {
          return result.concat({label: item.category_name, value: item.category_id})
        }, [])
        this.channelOptions.push(channelQiyi)
        this.channelOptions.push(channelTent)
      })
    },

    handleChannelChange(value) {
      this.filter.source = ''
      this.filter.source = value[0]
      this.filter.channel = value[1]
    }

  },
  created() {
    this.getMediaResourceInfo().then(() => {
    })
    // this.filterSchema = filterSchema
    this.fetchData()
  }

}
</script>

<style lang='stylus' scoped>
.content >>> .content-list .filter-form .el-form
  display inline
.content >>> .content-list .filter-form .sf-item__label
  width 100px
  margin 0 10px
  text-align center
  border 1px solid #ddd
  border-radius: 5px
.content >>> .content-list .filter-form .sf-item--inline
  margin 0
.content >>> .el-table .cell
  display flex
  justify-content center
  align-items center
  height 40px
.btns
  margin 20px auto
</style>