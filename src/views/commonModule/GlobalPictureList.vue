<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <div class="control-button-group">
        <ButtonGroupForListPage
          class="auth-button-group"
          pageName="poster"
          @add="handleCreate"
          @edit="handleEdit"
          @delete="handleDelete"
          @batch-audit="batchAudit"
        ></ButtonGroupForListPage>
        <el-button type="primary" @click="handleAllRowSelectionChange(checkAll = !checkAll)">全选/全不选</el-button> 
      </div>
      <CardList
        class="img-list"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
      >
        <div class="img-item" slot="row" slot-scope="{row: item}" @click.stop="handleRead(item)">
          <img :src="item.pictureUrl" referrerpolicy="no-referrer" />
          <a class="img-preview" @click.stop="reviewPic(item)">预览</a>
          <div class="img-detail">
            <span>素材id：{{ item.pictureId }}</span>
            <span>素材标题: {{ item.pictureName }}</span>
            <span>素材类型：{{ item.materialTypes ? item.materialTypes[0].dictCnName : '' }}</span>
            <span>分辨率：{{ item.pictureResolution }}</span>
          </div>
          <div class="img-info">
            <span class="img-title">{{ item.pictureName }}</span>
            <span class="img-status">{{ $consts.statusText[item.pictureStatus] }}</span>
          </div>
        </div>
      </CardList>
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
    <el-dialog title="审核"  :visible="auditDialogVisible" width="30%">
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
import BaseList from '@/components/BaseList'
import { CardList } from 'admin-toolkit'
export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage,
    CardList
  },
  data() {
    return {
      resourceType: 'picture',
      checkAll: false,
      materialTypes: {}, // 素材类型
      // pictureStatus: {
      //   //状态
      //   可用: 1,
      //   待审核: 2,
      //   审核不通过: 3,
      //   不可用: 0
      // },
      picDialogVisible: false, // 预览图片弹出框
      auditDialogVisible: false, // 审核弹出框
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
      status: [], // 选中数据的状态
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'pictureId',
            width: '90'
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
                  class: 'imgs',
                  'referrerpolicy': 'no-referrer'
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
    submitAudit() {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.auditForm.idStr = this.selected.map(({pictureId}) => pictureId).join(',')
          this.$service
            .materialBatchAudit(this.auditForm, this.auditForm.auditFlag === '4' ? '审批成功' : '打回成功')
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
    /**
     * 批量审核
     */
    batchAudit() {
      if (this.selected.length === 0) {
        this.$message('请选择再审批')
        return
      }
      let error = ''
      this.status.forEach((item, index) => {
        if (item === 4) {
          if (error === '') {
            error += 'ID=' + this.selected[index]
          } else {
            error += ','
            error += 'ID=' + this.selected[index]
          }
        }
      })
      if (error !== '') {
        this.$message({
          type: 'error',
          message: error + ' 已经审核通过了，不需要再审核'
        })
        return false
      }
      this.auditForm = {
        idStr: null,
        auditFlag: '4',
        auditDesc: ''
      }
      this.auditDialogVisible = true
    },
    reviewPic(row) {
      this.reviewPicUrl = row.pictureUrl
      this.picDialogVisible = true
    },
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (this.$validateId(this.filter.pictureId)) {
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
      this.$service.getMaterialPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        this.checkAll = false
      })
    },
    /**
     * 得到部门列表
     */
    getMaterialTypes() {
      return this.$service.getDictType({ type: 'materialType' }).then(data => {
        data.forEach(element => {
          this.materialTypes[element.dictCnName] = element.dictId
        })
      })
    }
  },
  created() {
    let filterSchema = _.map({
      pictureId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      pictureName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '素材名称'
      }),
      pictureCategory: _.o.enum(this.materialTypes).other('form', {
        component: 'Select',
        placeholder: '素材类别'
      }),
      pictureResolution: _.o.string.other('form', {
        component: 'Input',
        placeholder: '分辨率'
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
<style lang='stylus' scoped>
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

<style lang='stylus' scoped>
.btns
  margin-bottom 10px
.img-list
  width 1070px
.img-item
  position relative
  width 202px
  height 202px
  border 1px solid #ccc
  margin 0 10px 10px 0
  img
    max-width 100%
    max-height 100%
  .img-detail
    position absolute
    bottom 20px
    text-align center
    opacity 0.8
    background #f5f5f5
    width 100%
    display none
    span
      display block
  &:hover
    .img-detail
      display block
  .img-info
    position absolute
    bottom 0
    height 20px
    width 100%
    background #000
    color #fff
    opacity 0.8
  .img-title
    display inline-block
    overflow hidden
    width 130px
    text-overflow ellipsis
    white-space nowrap
  .img-status
    float right
  .img-preview
    position absolute
    top 0
    right 0
    cursor pointer
    height 20px
    border 1px solid #ccc
    color #444
    background #fff
    padding 0px 5px
.auth-button-group
  display inline-block
  margin-right 10px
</style>
