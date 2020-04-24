<template>
  <remote-selector-wrapper
    ref="wrapper"
    customClass="layout-selector--global"
    :disabled="disabled"
    :title="title || '选择布局'"
    @select-start="handleSelectStart"
  >
    <div slot="filter">
      <el-form @submit.native.prevent="handleFilter" @reset.native.prevent="handleResetFilter" :inline="true">
        <el-form-item label="布局ID">
          <InputPositiveInt v-model="filter.layoutId" clearable></InputPositiveInt>
        </el-form-item>
        <el-form-item label="布局名称">
          <el-input v-model="filter.layoutName" clearable></el-input>
        </el-form-item>
        <el-form-item label="布局分类">
          <el-select v-model="filter.layoutType" clearable filterable>
            <el-option
              v-for="item in layoutTypeOptions"
              :key="item.dictId"
              :value="item.dictId"
              :label="item.dictCnName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="布局标题">
          <el-select v-model="filter.layoutIsTitle" clearable filterable>
            <el-option :value="0" label="不带标题"></el-option>
            <el-option :value="1" label="带标题"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" native-type="submit">查询</el-button>
        <el-button type="warning" native-type="reset">重置</el-button>
      </el-form>
    </div>
    <div slot="item-list" class="item-list--table">
      <Table
        :data="table.data"
        :header="table.header"
        :selected="table.selected"
        :props="table.props"
        :selection-type="selectionType || table.selectionType"
        :select-on-row-click="true"
        @row-dblclick="handleRowDblClick"
        @row-selection-change="handleTableRowSelectionChange">
      </Table>
    </div>
    <div slot="after-item-list" class="item-list--common">
      <el-tag
        class="common-layout-item"
        v-for="item in videoCommonLayouts"
        @click="handleSelectCommonLayout(item.value)"
        :key="item.value">
        {{ item.label }}({{ item.value }})
      </el-tag>
      <hr class="common-layout-divide" />
      <el-tag
        class="common-layout-item"
        v-for="item in eduCommonLayouts"
        @click="handleSelectCommonLayout(item.value)"
        :key="item.value">
        {{ item.label }}({{ item.value }})
      </el-tag>
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
      <!--拓展布局的个数-->
      <el-dialog title="请输入预置推荐位个数" :visible.sync="showBlockCountDialog" :append-to-body="true">
        <el-form
          ref="blockCountForm"
          @keypress.native.enter.prevent="emitSelectEnd"
          :model="formBlock"
          :rules="formBlockRules"
        >
          <el-form-item label="推荐位个数" prop="count">
            <el-input ref="blockCount" @keypress.prevent.stop v-model.number="formBlock.count" clearable :placeholder="blockCountPlaceholder"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showBlockCountDialog = false">取 消</el-button>
          <el-button type="primary" @click="emitSelectEnd">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="showPreviewDialog" :append-to-body="true">
        <LayoutRead :content="previewContent" :content-width="600">
        </LayoutRead>
      </el-dialog>
    </div>

    <slot></slot>
  </remote-selector-wrapper>
</template>

<script>
import { Table } from 'admin-toolkit'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
import LayoutRead from '@/components/LayoutBlock'
import InputPositiveInt from '@/components/InputPositiveInt'

const idField = 'layoutId'

export default {
  components: {
    Table,
    RemoteSelectorWrapper,
    LayoutRead,
    InputPositiveInt
  },
  data () {
    return {
      options: [],
      showPreviewDialog: false,
      previewContent: [],
      showBlockCountDialog: false,
      layoutTypeOptions: [],
      layoutTypeText: {},
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
              return this.layoutTypeText[row.layoutType]
            }
          },
          {
            label: '预览',
            render: (h, { row }) => {
              return <div>
                <el-button
                  type="text"
                  onClick={(event) => {
                    event.stopPropagation()
                    this.handlePreview(row, 'v8')
                  }}>
                    预览
                </el-button>
                <el-button
                  type="text"
                  onClick={(event) => {
                    event.stopPropagation()
                    this.handlePreview(row, 'v6')
                  }}>
                    预览6.0
                </el-button>
              </div>
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
      selected: [],
      videoCommonLayouts: null,
      eduCommonLayouts: null
    }
  },
  props: ['title', 'selectionType', 'disabled'],
  watch: {
    'pagination.page': 'fetchData',
    'pagination.rows': 'fetchData'
  },
  computed: {
    // eslint-disable-next-line
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
    handlePreview (row, version) {
      this.showPreviewDialog = true
      const layoutJson = version === 'v6' ? row.layoutJson : row.layoutJson8
      this.previewContent = JSON.parse(layoutJson).contents
    },
    validateNum (rule, value, callback) {
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
    handleRowDblClick (row) {
      this.handleTableRowSelectionChange(row, this.table.data.indexOf(row))
      this.handleSelectEnd()
    },
    getDefaultFilter () {
      return {
        layoutStatus: this.$consts.status.accepted,
        layoutId: undefined,
        layoutName: undefined,
        layoutType: undefined,
        layoutIsTitle: undefined
      }
    },
    resetPageAndSelect () {
      this.selected = []
      this.table.selected = undefined
      this.pagination.page = 1
    },
    handleFilter () {
      this.resetPageAndSelect()
      this.fetchData()
    },
    handleResetFilter () {
      this.filter = this.getDefaultFilter()
      this.resetPageAndSelect()
      this.fetchData()
    },
    handleSelectStart () {
      this.formBlock = { count: undefined }
      this.handleResetFilter()
      this.getCommonLayouts()
    },
    handleSelectCommonLayout (id) {
      this.$service.getLayoutInforById({ id }).then((layout) => {
        if (layout.layoutStatus !== this.$consts.status.accepted) {
          return this.$message.error('当前布局不存在或不是审核通过状态, 请选择另外一个')
        }
        this.doSelectEnd(layout)
      }).catch((e) => {
        this.$message.error('获取布局信息失败，请重新选择')
      })
    },
    handleSelectEnd () {
      const selected = this.selected[0]
      if (selected) {
        this.doSelectEnd(selected)
      } else {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
      }
    },
    resetBlockForm () {
      const blockCountForm = this.$refs.blockCountForm
      if (blockCountForm) {
        blockCountForm.clearValidate()
        this.formBlock.count = undefined
      }
    },
    doSelectEnd (selected) {
      const layoutJsonParsed = JSON.parse(selected.layoutJson8)
      const type = layoutJsonParsed.type
      selected.layoutJsonParsed = layoutJsonParsed
      this.selectedLayout = selected
      if (type === 'Expander' || type === 'Lengthwise') {
        this.showBlockCountDialog = true
        this.resetBlockForm()
        this.$nextTick(() => {
          this.$refs.blockCount.focus()
        })
      } else {
        this.emitSelectEnd()
      }
    },
    emitSelectEnd () {
      if (this.showBlockCountDialog) {
        this.$refs.blockCountForm.validate(
          function (result) {
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
    fetchData () {
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
    getCommonLayouts () {
      const { videoCommonLayouts, eduCommonLayouts } = this
      if (!(videoCommonLayouts && eduCommonLayouts)) {
        this.$service.getDictType({ type: 'videoCommonLayout' }).then(data => {
          this.videoCommonLayouts = data.map(item => {
            return {
              label: item.dictCnName,
              value: item.dictEnName
            }
          })
        })
        this.$service.getDictType({ type: 'eduCommonLayout' }).then(data => {
          this.eduCommonLayouts = data.map(item => {
            return {
              label: item.dictCnName,
              value: item.dictEnName
            }
          })
        })
      }
    },
    handleTableRowSelectionChange (item, index) {
      this.selected = [item]
      this.table.selected = index
    },
    handleTableRowSelectionAdd (targetItem) {
      this.selected = this.selected.concat(targetItem)
      this.updateTableSelected()
    },
    updateTableSelected () {
      const table = this.table
      const newSelectedIndex = this.selected.map(item => item.id)
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item[idField]) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    fetchLayoutTypeOptions () {
      this.$service.getDictType({ type: 'layoutType' }).then(layoutTypeOptions => {
        this.layoutTypeOptions = layoutTypeOptions
        this.layoutTypeText = layoutTypeOptions.reduce((result, item) => {
          result[item.dictId] = item.dictCnName
          return result
        }, {})
      })
    }
  },
  created () {
    this.fetchLayoutTypeOptions()
    this.$service.getDictType({ type: 'businessType' }).then(data => {
      this.panelCategoryOptions = data
      this.pannelCategoryOptionsIndexed = data.reduce(function (result, item) {
        result[item.dictId] = item.dictCnName
        return result
      }, {})
    })
  }
}
</script>
<style lang="stylus" scoped>
.item-list--table
  margin-right 230px
  height 100%
  overflow auto
.item-list--common
  position absolute
  top 0
  right 0
  width 230px
  height 100%
  border-right 1px solid #ebeef5
  border-left 1px solid #ebeef5
  box-sizing border-box
  overflow auto
.common-layout-divide
  border-top 1px solid #ebeef5
.common-layout-item
  margin 5px
  cursor pointer
</style>
