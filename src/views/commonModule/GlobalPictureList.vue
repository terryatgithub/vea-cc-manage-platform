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
        pageName="poster"
        @add="addItem"
        @edit="editData"
        @delete="batchDel"
        @batchAudit="batchAudit"
      ></ButtonGroupForListPage>
      <!-- <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDel">删除</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchAudit">批量审核</el-button>
      </div>-->
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
      <span class="pics">
        <img :src="reviewPicUrl" alt="图片" max-width="500">
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="picDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="picDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览图片 --->
    <!-- 审核 -->
    <el-dialog title="预览图片" v-if="auditDialogVisible" width="30%">
      <span>
        <el-form ref="auditForm" :model="auditForm" :rules="auditFormRules" label-width="80px">
          <el-form-item label="审核意见" prop="auditFlag">
            <el-radio v-model="auditForm.auditFlag" label="4">通过</el-radio>
            <el-radio v-model="auditForm.auditFlag" label="5">打回</el-radio>
          </el-form-item>
          <el-form-item label="意见说明" prop="auditDesc">
            <el-input type="textarea" v-model="auditForm.auditDesc"></el-input>
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
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'

import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    return {
      materialTypes: {}, //素材类型
      // pictureStatus: {
      //   //状态
      //   可用: 1,
      //   待审核: 2,
      //   审核不通过: 3,
      //   不可用: 0
      // },
      picDialogVisible: false, //预览图片弹出框
      auditDialogVisible: false, //审核弹出框
      reviewPicUrl: null,
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
            prop: 'pictureId',
            width: '70'
          },
          {
            label: 'ID',
            prop: 'pictureUrl',
            width: '70',
            render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  src: row.pictureUrl,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                },
                on: {
                  click: () => {
                    this.reviewPic(row)
                  }
                }
              })
            }
          },
          {
            label: '素材名称',
            width: '120',
            prop: 'pictureName',
            sortable: true,
            render: (createElement, { row }) => {
              return createElement(
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
                row.pictureName
              )
            }
          },
          {
            label: '分辨率',
            prop: 'pictureResolution',
            width: '110',
            sortable: true
          },
          {
            label: '状态',
            prop: 'pictureStatus',
            width: '90',
            render: (createElement, { row }) => {
              return this.$numToAuditStatus(row.pictureStatus)
              // switch (row.pictureStatus) {
              //   case 0:
              //     return "不可用";
              //     break;
              //   case 1:
              //     return "可用";
              //     break;
              //   case 2:
              //     return "待审核";
              //     break;
              //   case 3:
              //     return "审核不通过";
              //     break;
              // }
            }
          },
          {
            label: '素材类型',
            prop: 'materialTypes',
            width: '70',
            render: (createElement, { row }) => {
              return row.materialTypes.length > 0
                ? row.materialTypes[0].dictCnName
                : ''
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
    handleRead(row) {
      this.$emit('read', row)
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
    /**
     * 新增用户
     */
    addItem() {
      this.$emit('open-add-page')
    },
    handleChange(value, direction, movedKeys) {
      var str = []
      for (var i = 0; i < value.length; i++) {
        str.push(['roleIds', value[i]])
      }
      this.selectedRole = this.user.concat(str)
    },
    /**
     * 批量审核
     */
    batchAudit() {
      if (this.selected.length === 0) {
        this.$message('请选择再审批')
        return
      }
      this.auditDialogVisible = true
      //  if (window.confirm("确定要审批吗")) {

      // }
    },

    reviewPic(row) {
      this.reviewPicUrl = row.pictureUrl
      this.picDialogVisible = true
    },
    editData() {
      if (this.$isAllowEdit(this.selected)) {
        this.table.data.forEach(e => {
          if (e['pictureId'] === this.selected[0]) {
            if (e.pictureStatus !== 4) {
              this.$emit('open-add-page', this.selected[0])
            } else {
              this.$message({
                type: 'error',
                message: '审核通过的的数据不能编辑'
              })
            }
            return
          }
        })
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
          .materialBatchDelete({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.fetchData()
          })
      }
    },
    handleRowSelectionAdd(targetItem) {
      // this.selected = this.selected.concat({
      //   id: targetItem.userId
      // });
      this.selected.push(targetItem.pictureId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.pictureId
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
        if (newSelectedIndex.indexOf(item.pictureId) > -1) {
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
    },
    /**
     * 获取数据
     */
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getMaterialPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    /**
     * 得到部门列表
     */
    getMaterialTypes() {
      return this.$service.getMaterialTypes().then(data => {
        data.forEach(element => {
          this.materialTypes[element.label] = element.id
        })
      })
    }
  },
  created() {
    let filterSchema = _.map({
      pictureId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '素材ID'
      }),
      pictureName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '素材名称'
      }),
      pictureCategory: _.o.enum(this.materialTypes).other('form', {
        component: 'Select',
        placeholder: '素材类别'
      }),
      pictureStatus: _.o.enum(this.$baseStatus()).other('form', {
        component: 'Select',
        placeholder: '审核状态'
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
    this.getMaterialTypes().then(() => {
      this.filterSchema = filterSchema
    })
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
