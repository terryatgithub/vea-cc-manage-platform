<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
         <ButtonGroupForListPage
        pageName='cornerIconType'
        @add="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
        @batch-audit="batchAudit"
        >
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
</template>
<script>
import _ from 'gateschema'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import BaseList from '@/components/BaseList'
export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    return {
      resourceType: 'cornerIconType',
      materialTypes: {}, // 素材类型
      picDialogVisible: false, // 预览图片弹出框
      auditDialogVisible: false, // 审核弹出框
      auditForm: {
        idStr: null,
        auditFlag: '4',
        auditDesc: ''
      },
      auditFormRules: {
        auditDesc: [
          { required: true, message: '请输入意见说明', trigger: 'blur' }
        ],
        auditFlag: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      },
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'typeId',
            width: '70'
          },
          {
            label: '分类名称',
            width: '120',
            prop: 'typeName',
            sortable: true
          },
          {
            label: '角标位置',
            prop: 'typePosition',
            width: '110',
            sortable: true,
            render: (createElement, { row }) => {
              return this.$consts.cornerIconPositionText[row.typePosition]
            }
          },
          {
            label: '优先级(越小越靠前)',
            prop: 'typePriority',
            width: '150',
            sortable: true
          },
          {
            label: '修改人',
            prop: 'modifierName',
            width: '90'
          },
          {
            label: '创建时间',
            prop: 'createdDate',
            sortable: true
          },
          {
            label: '修改时间',
            prop: 'lastUpdateDate',
            sortable: true
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    batchAudit() {
      if (this.selected.length > 0) {
        this.auditDialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择再审核'
        })
      }
    },
    submitAudit() {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.auditForm.idStr = this.selected.join(',')
          this.$service
            .materialBatchAudit(this.auditForm, '审批成功')
            .then(data => {
              this.fetchData()
              this.auditDialogVisible = false
            })
        }
      })
    },
    handleChange(value, direction, movedKeys) {
      var str = []
      for (var i = 0; i < value.length; i++) {
        str.push(['roleIds', value[i]])
      }
      this.selectedRole = this.user.concat(str)
    },
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (this.$validateId(this.filter.typeId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    /**
     * 获取数据
     */
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getGlobalCornerIconTypePageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      typeId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      typeName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '角标名称'
      }),
      typePosition: _.o.enum(this.$consts.cornerIconPositionEnums).other('form', {
        component: 'Select',
        placeholder: '角标位置'
      })
    }).other('form', {
      cols: {
        item: 6,
        label: 0,
        wrapper: 20
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
    this.filterSchema = filterSchema
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped>
.pics img
  max-width: 350px
  max-height: 500px
.content
  >>> table .imgs
    cursor: pointer
.btns
  margin-bottom: 10px
.checkItemStyle
  margin: 10px
</style>
