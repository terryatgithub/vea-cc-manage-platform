<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper
      :filter="filter"
      @filter-change="fetchData"
      :pagination="pagination"
    >
        <el-form :inline="true"
        ref="form"
        class="form"
        v-form-autocomplete
        v-model="filter"
            @submit.native.prevent="handleFilterChange"
            @reset.native.prevent="handleFilterReset">
            <el-form-item>
                <el-input type="number" clearable v-model="filter.id" placeholder="推荐流ID" title="id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input clearable v-model="filter.recName" placeholder="推荐流名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select  v-model="filter.source" placeholder="内容源" clearable>
                    <el-option
                    v-for="(item,index) in sourceOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select  v-model="defalutScene"
                 multiple placeholder="适用场景" style="margin-left: 20px;width:200px;" clearable>
                    <el-option
                    v-for="item in sceneOption"
                    :key="item.dictEnName"
                    :label="item.dictCnName"
                    :value="item.dictEnName"
                    />
                </el-select>
            </el-form-item>
            <!-- <el-form-item>
                <el-select  v-model="filter.openStatus" placeholder="可用状态" clearable>
                    <el-option value="1" label="开启">开启</el-option>
                    <el-option value="0" label="关闭">关闭</el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item class="el-form-item-submit">
                <el-button type="primary" native-type="submit">查询</el-button>
                <el-button native-type="reset">重置</el-button>
            </el-form-item>
        </el-form>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
      />
       <!-- <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      /> -->
    </ContentWrapper>

  </ContentCard>
</template>
<script>
// import _ from 'gateschema'
import BaseList from '@/components/BaseList'
import { ContentWrapper, Table } from 'admin-toolkit'
// import ButtonGroupForListPage from './../../components/ButtonGroupForListPage'
// const typeOption = {
//   normal: '普通', child: '少儿', movie: '电影', series: '电视剧'
// }

export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper
    // ButtonGroupForListPage
  },
  data () {
    return {
      notContainBtns: ['audit', 'batchAudit'],
      resourceType: 'broadcastBlock',
      filter: this.genDefaultFilter(),
      filterSchema: null,
      sourceOption: this.$consts.sourceOptionsWithEmpty,
      sceneOption: [],
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: '推荐流ID',
            prop: 'id',
            // sortable: true,
            width: '120px',
            fixed: 'left'
          },
          {
            label: '推荐流名称',
            prop: 'recName',
            fixed: 'left',
            width: '180px',
            render: (h, { row }) => {
              return h(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.handleRead(row)
                    }
                  }
                },
                row.recName
              )
            }
          },
          {
            label: '内容源',
            prop: 'source',
            render: (h, { row }) => {
              return this.$consts.sourceTextWithNone[row.source]
            }
          },
          {
            label: '适用场景',
            prop: 'scene',
            width: '200px',
            render: (h, { row }) => {
              var scene = this.handleScene(row)
              return h('div', {}, scene)
              // return scene
            }
          },
          {
            label: '推荐流业务来源',
            prop: 'platformName'
            // render: (h, { row }) => {
            //   return this.$consts.sourceTextWithNone[row.source]
            // }
          },
          {
            label: '操作',
            fixed: 'right',
            render: (h, { row }) => {
              return h('div')
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      },
      defalutScene: [],
      sceneNames: []
    }
  },
  methods: {
    genDefaultFilter () {
      return {
        page: 1,
        rows: 10,
        scene: '',
        defalutScene: []
      }
    },
    handleFilterReset () {
      this.defalutScene = []
      this.filter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterChange () {
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
        filter.scene = this.defalutScene.join(',')
      }
      return filter
    },
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getNewMediaAutomationList(filter).then(data => {
        this.pagination.total = data.total
        data.rows = data.rows.map(item => {
          // item.picSize = item.picSize.join(',')
          return item
        })
        this.table.data = data.rows
      })
    },
    keyAndValueExchage (obj) {
      return Object.keys(obj).reduce((result, key) => {
        result[obj[key]] = key
        return result
      }, {})
    },
    fetchMediaSence () {
      this.$service.getMediaSence().then(res => {
        this.sceneOption = res
        // this.sceneNames = this.sceneOption.map(item => {
        //   return item.dictCnName
        // })
      })
    },
    handleScene (row) {
      let sceneNames = [] // this.sceneNames = [] 错误 render不能操作dom?
      row.scene.split(',').map(item => {
        this.sceneOption.map(element => {
          if (item === element.dictEnName) {
            sceneNames.push(element.dictCnName)
          }
        })
      })
      return (sceneNames.join(','))
    }
  },
  mounted () {
    this.fetchMediaSence()
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped>
.pics img
  max-width 350px
  max-height 500px
.content
  >>> table .imgs
    cursor pointer
.btns
  margin-bottom 10px
.checkItemStyle
  margin 10px
</style>
