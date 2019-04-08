<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
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
    <!-- 预览图片 -->
    <el-dialog title="预览图片" :visible.sync="picDialogVisible" width="30%">
      <span class="pics"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="picDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="picDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览图片 --->
    <!-- 审核 -->
    <el-dialog title="预览图片" :visible.sync="auditDialogVisible" width="30%">
      <span>
        <el-form ref="addForm" :model="addForm" :rules="auditFormRules" label-width="80px">
          <el-form-item label="审核意见" prop="auditFlag">
            <el-radio v-model="addForm.auditFlag" label="4">通过</el-radio>
            <el-radio v-model="addForm.auditFlag" label="5">打回</el-radio>
          </el-form-item>
          <el-form-item label="意见说明" prop="auditDesc">
            <el-input type="textarea" v-model="addForm.auditDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核 --->
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper
  },
  data() {
    return {
      materialTypes: {}, //素材类型
      typePosition: {
        //状态
        左上: 0,
        右上: 1,
        右下: 2,
        左下: 3
      },
      picDialogVisible: false, //预览图片弹出框
      auditDialogVisible: false, //审核弹出框
      addForm: {
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
            sortable: true
          },
          {
            label: '优先级(越小越靠前)',
            prop: 'typePriority',
            width: '110',
            sortable: true
          },
          {
            label: '修改人',
            prop: 'modifierUser',
            width: '90',
            render: (createElement, { row }) => {
              return row.userName
            }
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
    /**
     * 新增用户
     */
    addItem() {
      this.$emit('open-add-page', null)
    },
    handleChange(value, direction, movedKeys) {
      var str = []
      for (var i = 0; i < value.length; i++) {
        str.push(['roleIds', value[i]])
      }
      this.selectedRole = this.user.concat(str)
    },
    editData() {
      if( this.$isAllowEdit(this.selected)) {
         this.$emit('open-add-page',this.selected[0])
      }
    },
    /**
     * 批量删除
     */
    batchDel() {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      if (window.confirm('确定要删除吗')) {
        this.$service
          .globalCornerIconTypeBatchDel(
            { id: this.selected.join(',') },
            '删除成功'
          )
          .then(data => {
            this.fetchData()
          })
      }
    },
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.typeId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.typeId
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
        if (newSelectedIndex.indexOf(item.typeId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    handleFilterChange(type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
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
        placeholder: '角标分类ID',
        cols: {
          item: 3,
          label: 0
        }
      }),
      typeName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '角标名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pictureCategory: _.o.enum(this.typePosition).other('form', {
        component: 'Select',
        placeholder: '角标位置',
        cols: {
          item: 3,
          label: 0
        }
      })
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
