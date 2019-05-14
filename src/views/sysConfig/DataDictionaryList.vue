<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
     <!-- <ButtonGroupForListPage
        pageName='dict'
        @add="addDict"
        @edit="editData"
        @delete="batchDel"
        >
        </ButtonGroupForListPage> -->
      <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addDict">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">删除</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">新增字典分类</el-button>
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
      <!--字典分类添加弹框-->
      <el-dialog title="添加字典分类" :visible.sync="dialogFormVisible">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm"
          :label-position="labelPosition"
        >
          <el-form-item label="字典分类名称" prop="dictCategoryCnName">
            <el-input v-model="ruleForm.dictCategoryCnName"></el-input>
          </el-form-item>
          <el-form-item label="字典分类值" prop="dictCategoryEnName">
            <el-input v-model="ruleForm.dictCategoryEnName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="float:right;" type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button style="float:right;margin-right:15px" @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--字典分类end-->
    </ContentWrapper>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import ButtonList from './../../components/ButtonLIst'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    return {
      dialogFormVisible: false, //字典分类弹框默认false
      labelPosition: 'right',
      ruleForm: {
        dictCategoryEnName: '',
        dictCategoryCnName: ''
      },
      rules: {
        dictCategoryCnName: [
          { required: true, message: '请输入字典分类名称', trigger: 'blur' }
        ],
        dictCategoryEnName: [
          { required: true, message: '请输入字典分类值', trigger: 'blur' }
        ]
      }, //弹框表单验证
      formLabelWidth: '120px',
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      selectedRows: {},
      dictCategories: {},
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'dictId',
            width: '70'
          },
          {
            label: '字典名称',
            'min-width': '90',
            prop: 'dictCnName',
            sortable: true
          },
          {
            label: '字典值',
            prop: 'dictEnName',
            width: '110',
            sortable: true
          },
          {
            label: '字典分类',
            prop: 'dictCategory',
            'min-width': '160'
            //  render: (createElement, { row }) => {
            //   return row.dictCategory
            // }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    /**
     * 新增字典
     */
    addDict() {
      this.$emit('open-add-page', null)
    },
    /**
     * 修改字典
     */
    editData() {
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page', this.selectedRows[this.selected[0]])
      }
    },
    /**
     * 批量删除
     */
    batchDel() {
      // const id = this.selected[0]
      if (this.selected.length == 0) {
        this.$message('请选择一条数据')
      }
      if (this.selected.length == 1) {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$service
            .DeleteDict({ id: this.selected[0] }, '删除成功')
            .then(data => {
              this.handleAllRowSelectionRemove()
              this.fetchData()
            })
        })
      }
      if (this.selected.length > 1) {
        this.$message('只能选择一条数据')
      }
    },
    /**
     * 得到数据字典分类
     */
    getDictCategoryList() {
      return this.$service.getDictCategoryList().then(data => {
        data.forEach(element => {
          this.dictCategories[element.label] = element.value
        })
      })
    },
    /**
     * 新增数据字典分类
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const dictCategoryObj = {
            dictCategoryCnName: this.ruleForm.dictCategoryCnName,
            dictCategoryEnName: this.ruleForm.dictCategoryEnName
          }
          console.log(dictCategoryObj)
          this.$service
            .SaveDictCategory(dictCategoryObj, '保存成功')
            .then(data => {
              this.dialogFormVisible = false
              this.$refs[formName].resetFields()
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    handleCreate() {
      this.$router.push({ name: 'prize-create' })
    },
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.dictId)
      let id = targetItem.dictId
      this.selectedRows[id] = targetItem
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.dictId
      })
      delete this.selectedRows[targetItem.dictId]
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
        if (newSelectedIndex.indexOf(item.dictId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    handleFilterChange(type) {
      if (type === 'filter') {
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
      console.log(filter)
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getDictList(filter).then(data => {
        console.log(data)
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      dictId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '字典ID'
      }),
      dictCnName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '字典名称'
      }),
      dictEnName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '字典值'
      }),
      dictCategory: _.o.enum(this.dictCategories).other('form', {
        component: 'Select',
        placeholder: '字典分类',
      })
    }).other('form', {
       cols: {
        item: 5,
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
    this.getDictCategoryList().then(() => {
      this.filterSchema = filterSchema
    })
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
}
</style>



