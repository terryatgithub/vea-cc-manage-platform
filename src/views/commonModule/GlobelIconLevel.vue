<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <el-table :data="tab.pannelList" border style="margin-top: 20px; max-width: 80%">
      <el-table-column prop="cornerIconId" label="版块ID"></el-table-column>
      <el-table-column prop="cornerIconName" label="版块名称" ></el-table-column>
      <el-table-column label="图片" prop >
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" width="70px">
        </template>
      </el-table-column>
      <el-table-column prop label="优先级" width="100">
        <template slot-scope="scope">
          <OrderInput
            :key="Math.random().toString()"
            :value="scope.$index + 1"
            @input="handleChangePannelOrderStart(scope.$index,$event)"
            @blur="handleChangePannelOrderEnd(scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    </ContentWrapper>
    <!-- 预览图片 -->
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import ButtonList from './../../components/ButtonLIst'
import OrderInput from './OrderInput'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
export default {
  components: {
    ActionList,
    Table,
     OrderInput,
    ContentWrapper,
  },
  data() {
    return {
      tab: {
        cornerIconId: undefined,
        cornerIconName: undefined,
        imgUrl: undefined,
        pannelList: []
      },
      globalTypes: {
        test1: '1010',
        test2: '1011',
        付费属性: '101',
        排行榜: '103',
        教育角标: '105',
        策划类: '104',
        素材播出属性: '102'
      }, //角标分类
      attributeTypes: {}, //角标类别
      dialogPLVisible: false,
      dialogLevelVisible: false,
      typePositions: {
        左上: 0,
        右上: 1,
        左下: 3,
        右下: 2
      },
      reviewPicUrl: null,
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
    }
  },
  methods: {
    //初始化表格
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getGlobalMgrList(filter).then(data => {
        console.log(data)
        this.pagination.total = data.total
          this.tab.pannelList = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
         filter.idPrefix = '10' //10:酷开数据;11:其他地方。默认酷开
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
     handleChangePannelOrderStart(currentPannelIndex, order) {
      if (order !== '') {
        order = parseInt(order)
        const pannelList = this.tab.pannelList
        if (isNaN(order) || order > pannelList.length || order <= 0) {
          this.currentPannelIndex = undefined
          this.$message({
            type: 'error',
            message: '序号必须大于0且不能大于总数量'
          })
          this.tab.pannelList = pannelList.slice()
        } else {
          this.currentPannelIndex = currentPannelIndex
          this.currentPannelOrder = order
        }
      }
    },
    handleChangePannelOrderEnd(pannelIndex) {
      if (this.currentPannelIndex === pannelIndex) {
        const newIndex = this.currentPannelOrder - 1
        const oldIndex = pannelIndex
        const pannelList = this.tab.pannelList
        const item = pannelList[oldIndex]
        pannelList.splice(oldIndex, 1)
        this.tab.pannelList = [].concat(
          pannelList.slice(0, newIndex),
          item,
          pannelList.slice(newIndex)
        )
        this.currentPannelIndex = undefined
        this.currentPannelOrder = undefined
      }
    },
    //查询
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter}
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    //重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    //表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.cornerIconId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.cornerIconId
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
    handleAllRowSelectionRemove() {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.cornerIconId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    //角标分类
    getCornerTypes() {
      return this.$service.getCornerTypes().then(data => {
        data.forEach(element => {
          this.globalTypes[element.typeName] = element.typeId
        })
        console.log(this.globalTypes)
      })
    },
    //角标类别
    getIconAttributes() {
      return this.$service.getIconAttributes().then(data => {
        data.attributes.forEach(element => {
          this.attributeTypes[element.attributeName] = element.attributeCode
        })
        console.log(this.attributeTypes)
      })
    },
  },
  created() {
    let filterSchema = _.map({
      typeId: _.o.enum(this.globalTypes).other('form', {
        component: 'Select',
        placeholder: '角标分类',
        cols: {
          item: 3,
          label: 0
        }
      }),
    }).other('form', {
      layout: 'inline',
      footer: {
        cols: {
          label: 0,
          wrapper: 24
        },
        showSubmit: true,
        submitText: '查询',
        showReset: true,
        resetText: '重置'
      }
    })
    this.fetchData()
    this.getCornerTypes().then(() => {
      this.getIconAttributes().then(() => {
        this.filterSchema = filterSchema
      })
    }) //获取角标分类
    
    //角标类别
  }
}
</script>

<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
}
</style>
