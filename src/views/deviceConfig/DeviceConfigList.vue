<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentCard ref="contentCard"  class="content">
        <ContentWrapper
          :filter="filter"
          :filterSchema="filterSchema"
          :pagination="pagination"
          @filter-change="handleFilterChange"
          @filter-reset="handleFilterReset"
        >
          <a class="el-button el-button--primary el-button--small export-btn" target="_blank" :href="exportUrl">
            导出当前数据
          </a>
          <ButtonGroupForListPage
            pageName="deviceConfig"
            @edit="handleEdit">
          </ButtonGroupForListPage>
          <Table
            :props="table.props"
            :header="table.header"
            :data="table.data"
            :selected="table.selected"
            :selection-type="table.selectionType"
            :select-on-row-click="true"
            @row-selection-add="handleRowSelectionAdd"
            @row-selection-remove="handleRowSelectionRemove"
            @all-row-selection-change="handleAllRowSelectionChange"
          />
        </ContentWrapper>
      </ContentCard>
      <el-dialog
        :visible.sync="showEditDialog">
        <el-form
          v-if="editingRow"
          ref="form"
          label-width="120px"
          :model="editingRow"
          :rules="rules">
          <el-form-item label="机型">
            {{ editingRow.model }}
          </el-form-item>
          <el-form-item label="机芯">
            {{ editingRow.chip }}
          </el-form-item>
          <el-form-item label="内存大小" prop="ramSize">
            <el-input v-model.trim="editingRow.ramSize" />
          </el-form-item>
          <el-form-item label="是否自动播放" prop="autoPlay">
            <el-radio-group v-model="editingRow.autoPlay">
              <el-radio :label="0">
                否
              </el-radio>
              <el-radio :label="1">
                是
              </el-radio>
              <el-radio :label="2">
                客户端判断
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import _ from 'gateschema'
import { ContentWrapper, Table } from 'admin-toolkit'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import BaseList from '@/components/BaseList'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'

export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    PageWrapper,
    PageContentWrapper,
    ButtonGroupForListPage
  },
  data () {
    return {
      resourceType: 'deviceConfig',
      activePage: 'deviceConfig_list',
      showEditDialog: false,
      editingRow: null,
      filter: {
        model: undefined,
        chip: undefined,
        ramSize: undefined,
        autoPlay: undefined
      },
      autoPlayText: {
        0: '否',
        1: '是',
        2: '客户端判断'
      },
      autoPlayEnums: {
        '否': 0,
        '是': 1,
        '客户端判断': 2
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      rules: {
        ramSize: [
          {
            required: true,
            message: '请输入内存大小'
          },
          {
            validator: (rule, val, cb) => {
              if (!/\d+[mMgGtT]/.test(val)) {
                return cb(new Error('内存大小格式不正确，应为类似 768m, 2g 这样的格式'))
              }
              cb()
            }
          }
        ],
        autoPlay: [
          {
            required: true,
            message: '请选择播放设置'
          }
        ]
      },
      table: {
        props: {
        },
        header: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '机型',
            prop: 'model'
          },
          {
            label: '机芯',
            prop: 'chip'
          },
          {
            label: '内存大小',
            prop: 'ramSize'
          },
          {
            label: '自动播放',
            prop: 'autoPlay',
            width: 140,
            render: (h, { row }) => {
              return this.autoPlayText[row.autoPlay]
            }
          },
          {
            label: '修改时间',
            prop: 'lastUpdateDate'
          },
          {
            label: '修改人',
            prop: 'modifierName'
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  computed: {
    exportUrl () {
      const { model = '', chip = '', ramSize = '', autoPlay = '' } = this.filter
      return `api/v1/deviceConfig/download.html?model=${model}&chip=${chip}&ramSize=${ramSize}&autoPlay=${autoPlay}`
    }
  },
  methods: {
    handleFilterChange (type, filter) {
      if (filter) { this.filter = filter }
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    // 重置
    handleFilterReset () {
      this.filter = {}
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleEdit () {
      const table = this.table
      const selected = table.selected
      if (selected.length === 0) {
        return this.$message.error('请选择一条数据')
      }
      if (selected.length > 1) {
        return this.$message.error('只能选择一条数据进行编辑')
      }
      this.showEditDialog = true
      this.editingRow = JSON.parse(JSON.stringify(table.data[selected[0]]))
    },
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$service.deviceConfigUpsert(this.editingRow, '保存成功').then(data => {
            this.showEditDialog = false
            this.editingRow = null
            this.fetchData()
          })
        } else {
          this.$message.error('请把表单填写完整')
        }
      })
    },
    /**
     * 获取数据
     */
    fetchData () {
      const filter = this.parseFilter()
      this.$service.deviceConfigGetList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created () {
    this.filterSchema = _.map({
      model: _.o.string.other('form', {
        component: 'Input',
        placeholder: '机型',
        label: ' ',
        clearable: true
      }),
      ramSize: _.o.string.other('form', {
        component: 'Input',
        placeholder: '内存大小,如4g',
        label: ' ',
        clearable: true
      }),
      autoPlay: _.o.enum(this.autoPlayEnums).other('form', {
        component: 'Select',
        placeholder: '是否自动播放',
        label: ' ',
        clearable: true
      })
    }).other('form', {
      cols: {
        item: 3,
        label: 0,
        wrapper: 23
      },
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
  }
}
</script>
<style lang='stylus' scoped>
.export-btn
  position absolute
  top 40px
  right 10px
  text-decoration none
</style>
