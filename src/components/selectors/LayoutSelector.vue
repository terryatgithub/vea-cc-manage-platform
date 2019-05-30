<template>
  <remote-selector-wrapper
    ref="wrapper"
    class="layout-selector"
    title="选择布局"
    @select-start="handleSelectStart"
  >
    <div slot="filter">
      <el-form :inline="true">
        <el-form-item label="布局ID">
          <el-input v-model="filter.layoutId"></el-input>
        </el-form-item>
        <el-form-item label="布局名称">
          <el-input v-model="filter.layoutName"></el-input>
        </el-form-item>
        <el-form-item label="布局分类">
          <el-select v-model="filter.layoutType" clearable>
            <el-option
              v-for="item in layoutTypeOptoins"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="布局标题">
          <el-select v-model="filter.layoutIsTitle" clearable>
            <el-option :value="0" label="不带标题"></el-option>
            <el-option :value="1" label="带标题"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="filter-form__actions">
        <el-button type="primary" @click="handleFilter">查询</el-button>
        <el-button type="warning" @click="handleResetFilter">重置</el-button>
      </div>
    </div>

    <div slot="item-list">
      <Table
        :data="table.data"
        :header="table.header"
        :selected="table.selected"
        :props="table.props"
        :selection-type="selectionType || table.selectionType"
        :select-on-row-click="true"
        @row-dblclick="handleRowDblClick"
        @row-selection-change="handleTableRowSelectionChange"
      ></Table>

      <!--拓展布局的个数-->
      <el-dialog title="请输入预置推荐位个数" :visible.sync="showBlockCountDialog" :append-to-body="true">
        <el-form
          ref="blockCountForm"
          @submit.native="emitSelectEnd"
          :model="formBlock"
          :rules="formBlockRules"
        >
          <el-form-item label="推荐位个数" prop="count">
            <el-input @keypress.prevent.stop v-model.number="formBlock.count" :placeholder="blockCountPlaceholder"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showBlockCountDialog = false">取 消</el-button>
          <el-button type="primary" @click="emitSelectEnd">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <el-pagination
      slot="pagination"
      @size-change="pagination.rows = $event"
      @current-change="pagination.page = $event"
      :current-page="pagination.page"
      :page-sizes="[15, 20, 30]"
      :page-size="pagination.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    ></el-pagination>

    <div slot="actions">
      <el-button type="primary" @click="handleSelectEnd">确定</el-button>
      <el-button @click="$refs.wrapper.handleSelectCancel()">取消</el-button>
    </div>
    <slot></slot>
  </remote-selector-wrapper>
</template>

<script>
import { Table } from 'admin-toolkit'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'

const layoutTypeOptoins = [
  {
    label: '主页6.0',
    value: 1
  },
  {
    label: '影视V2',
    value: 2
  }
]
const layoutTypeLabels = layoutTypeOptoins.reduce(
  (result, item) => (result[item.value] = item.label) && result,
  {}
)
const ID = 'layoutId'

export default {
  components: {
    Table,
    RemoteSelectorWrapper
  },
  data() {
    return {
      options: [],
      showBlockCountDialog: false,
      layoutTypeOptoins,
      layoutTypeLabels,
      selectedLayout: null,
      formBlock: {
        count: undefined
      },
      formBlockRules: {
        count: [
          { required: true, validator: this.validateNum, trigger: 'blur' }
        ]
      },
      pagination: {
        page: 1,
        rows: 15,
        total: 0
      },
      filter: this.getDefaultFilter(),
      table: {
        data: [],
        selected: [],
        header: [
          {
            label: 'ID',
            prop: 'layoutId'
          },
          {
            label: '名称',
            prop: 'layoutName',
            width: 200
          },
          {
            label: '分类',
            width: 200,
            render: (h, { row }) => {
              return layoutTypeLabels[row.layoutType]
            }
          },
          {
            label: '预览',
            render: h => {
              return ''
            }
          },
          {
            prop: 'createdDate',
            label: '创建时间',
            width: 190
          },
          {
            prop: 'modifierName',
            label: '更新人',
            width: 120
          }
        ],
        selectionType: 'single'
      },
      selected: []
    }
  },
  props: ['selectionType'],
  watch: {
    'pagination.page': 'fetchData',
    'pagination.rows': 'fetchData'
  },
  computed: {
    blockCountPlaceholder() {
      const selectedLayout = this.selectedLayout || {}
      const layoutJsonParsed = selectedLayout.layoutJsonParsed
      const length = layoutJsonParsed && layoutJsonParsed.contents.length
      if (length) {
        return '请输入大于或等于' + length + '的数'
      }
    }
  },
  methods: {
    validateNum(rule, value, callback) {
      var reg = /^[1-9]\d*$/
      const length = this.selectedLayout.layoutJsonParsed.contents.length
      if (!reg.test(value)) {
        callback(new Error('请输入个数'))
      } else if (value < length) {
        callback(new Error('请输入大于或等于' + length + '的数'))
      } else {
        callback()
      }
    },
    handleRowDblClick(row) {
      this.handleTableRowSelectionChange(row, this.table.data.indexOf(row))
      this.handleSelectEnd()
    },
    getDefaultFilter() {
      return {
        layoutStatus: this.$consts.status.accepted,
        layoutId: undefined,
        layoutName: undefined,
        layoutType: undefined,
        layoutIsTitle: undefined
      }
    },
    resetPageAndSelect() {
      this.selected = []
      this.table.selected = undefined
      this.pagination.page = 1
    },
    handleFilter() {
      this.resetPageAndSelect()
      this.fetchData()
    },
    handleResetFilter() {
      this.filter = this.getDefaultFilter()
      this.resetPageAndSelect()
      this.fetchData()
    },
    handleSelectStart() {
      this.formBlock = { count: undefined }
      this.handleResetFilter()
    },
    handleSelectEnd() {
      const selected = this.selected[0]
      if (selected) {
        const layoutJsonParsed = JSON.parse(selected.layoutJson)
        const type = layoutJsonParsed.type
        selected.layoutJsonParsed = layoutJsonParsed
        this.selectedLayout = selected
        if (type === 'Expander' || type === 'Lengthwise') {
          this.showBlockCountDialog = true
        } else {
          this.emitSelectEnd()
        }
      } else {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
      }
    },
    emitSelectEnd() {
      if (this.showBlockCountDialog) {
        this.$refs.blockCountForm.validate(
          function(result) {
            if (result) {
              this.showBlockCountDialog = false
              this.$refs.wrapper.handleSelectEnd()
              this.$emit(
                'select-end',
                this.selectedLayout,
                this.formBlock.count
              )
            }
          }.bind(this)
        )
      } else {
        this.$refs.wrapper.handleSelectEnd()
        this.$emit('select-end', this.selectedLayout, this.formBlock.count)
      }
    },
    fetchData() {
      const filter = JSON.parse(JSON.stringify(this.filter))
      const pagination = this.pagination
      filter.page = pagination.page
      filter.rows = pagination.rows
      this.$service.getLayoutInforPageList(filter).then(data => {
        this.table.data = data.rows
        this.pagination.total = data.total
        this.selected = []
        this.table.selected = undefined
      })
    },
    handleTableRowSelectionChange(item, index) {
      this.selected = [item]
      this.table.selected = index
    },
    handleTableRowSelectionAdd(targetItem) {
      this.selected = this.selected.concat(targetItem)
      this.updateTableSelected()
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected.map(item => item.id)
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item[idField]) > -1) {
          result.push(index)
        }
        return result
      }, [])
    }
  },
  created() {
    this.$service.getDictType({type: 'businessType'}).then(data => {
      this.panelCategoryOptions = data
      this.pannelCategoryOptionsIndexed = data.reduce(function(result, item) {
        result[item.dictId] = item.dictCnName
        return result
      }, {})
    })
  }
}
</script>