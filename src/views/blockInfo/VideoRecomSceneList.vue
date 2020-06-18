<template>
    <ContentCard class="content">
      <ContentWrapper
      :filter="filter"
      @filter-change="fetchData"
      :pagination="pagination">
        <template>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="主页上版块填充" name="1" disabled></el-tab-pane>
                <el-tab-pane label="主页上推荐位填充" name="2" disabled></el-tab-pane>
                <el-tab-pane label="影片相关推荐" name="3"></el-tab-pane>
                <el-tab-pane label="搜索页猜你想找" name="4"></el-tab-pane>
            </el-tabs>
        </template>
        <template>
            <el-button style="margin-bottom: 10px" type="primary" @click="$emit('create', activeName)">添加推荐流与人群</el-button>
            <!--  常规运营-用推荐流填充-选择推荐流 -->
            <!-- 批量填充的banner 点进去 精细化定向内容 关联定向人群-->
        </template>
        <!-- <ButtonGroupForListPage
        pageName='tab'
        @add="handleCreate"
        @delete="handleDelete"
        > -->
        <!-- </ButtonGroupForListPage> -->
        <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
      />
      </ContentWrapper>
    </ContentCard>
</template>
<script>
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper
  },
  props: [
    'contentType',
    'mode',
    // 'contentForm',
    'data',
    'source',
    // 'pannel',
    'pannelGroupId',
    'hideTitleOptions',
    'checkCrowd',
    'isInterveneBlock'
  ],
  data () {
    return {
      filter: this.genDefaultFilter(),
      showCrowdSelector: false,
      activeName: '4',
      dialogFormVisible: false,
      form: {},
      firstPanel: {},
      contentForm: {
        pannelResource: 'o_tencent',
        dmpRegistryInfo: '',
        recStreamPanelRls: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      table: {
        props: {},
        data: [],
        header: [
          {
            label: '推荐流名称',
            prop: 'recStreamName'
          },
          {
            label: '人群ID',
            width: '150',
            prop: 'dmpCrowdId'
          },
          {
            label: '优先级',
            prop: 'priority',
            render: (h, { row }) => {
              return h('el-input', {
                style: { width: '100px' },
                props: {
                  value: row.priority
                },
                on: {
                  input: (value) => {
                    row.priority = value
                  },
                  blur: (value) => {
                    this.handleUpdatePriority(row)
                  }
                }
              })
            }
          },
          {
            label: '操作',
            fixed: 'right',
            width: 180,
            render: (h, { row }) => {
              return h('div', [
                h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleDel(row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    handleUpdatePriority (row) {
      let params = {}
      params.id = row.id
      params.priority = row.priority
      var reg = /^\+?[1-9]\d*$/
      if (!reg.test(params.priority)) return this.$message.error('只能输入数字')
      this.$service.dmpUpdatePriority(params).then(res => {
        if (res.success) {
          this.fetchData()
        }
      })
    },
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getMediaSceneList(filter).then(data => {
        this.pagination.total = data.total
        // data.rows = data.rows.map(item => {
        //   item.picSize = item.picSize.join(',')
        //   return item
        // })
        this.table.data = data.rows
      })
    },
    handleClick (type) {
      this.fetchData()
    },
    handleSelectBlockRecStreamEnd (selected) {
      const { recId, recName, recCategory, flag: recFlag } = selected[0]
      this.firstPanel.recStreamPanelRls = {
        recId,
        recName,
        recCategory,
        recFlag
      }
    },
    genDefaultFilter () {
      return {
        page: 1,
        rows: 10
      }
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
        filter.scene = this.activeName
      }
      return filter
    },
    handleSelectCrowdStart () {
      this.showCrowdSelector = true
    },
    handleSelectCrowdCancel () {
      this.showCrowdSelector = false
    },
    handleSelectCrowdEnd (policy, crowd) {
      this.$set(this.contentForm, 'dmpRegistryInfo', {
        dmpPolicyId: policy.value,
        dmpCrowdId: crowd.value,
        dmpPolicyName: policy.label,
        dmpCrowdName: crowd.label
      })
      this.$sendEvent({
        type: 'create_block_dmp',
        payload: {
          type: 'common'
        }
      })
      this.showCrowdSelector = false
    },
    handleDel (row) {
      this.$service.removeMediaDmp({ id: row.id }, '删除成功').then(res => {
        // 当为第11条的时候跳回第一页
        if (this.table.data.length === 1) {
          this.pagination.currentPage = this.pagination.currentPage - 1
        }
        this.fetchData()
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
