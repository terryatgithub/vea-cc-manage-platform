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
          pageName="cornerIcon"
          @add="handleCreate"
          @edit="handleEdit"
          @delete="handleDelete"
          @batch-audit="batchAudit"
        >
        </ButtonGroupForListPage>
        <GlobalIconBatchAudit @audit-end="fetchData" />
        <el-button type="primary" @click="handleAllRowSelectionChange(checkAll = !checkAll)">全选/全不选</el-button>
      </div>
      <!-- <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addData">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="deleteData">删除</el-button>
        <el-button type="primary" icon="el-icon-edit-outline" @click="batchHandle">批量审核</el-button>
        <el-button type="primary" @click="changePriority">调整优先级</el-button>
      </div>-->
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
          <img :key="item.imgUrl" :src="item.imgUrl" />
          <a class="img-preview" @click.stop="reviewPic(item)">预览</a>
          <div class="img-detail">
            <span>角标id：{{ item.cornerIconId }}</span>
            <span>角标标题：{{ item.cornerIconName }} </span>
            <span>角标分类：{{ item.cornerIconType.typeName }}</span>
            <span>角标类别：{{ item.attributeCode }} </span>
            <span>角标位置：{{ typePositionText[item.cornerIconType.typePosition] }}</span>
          </div>
          <div class="img-info">
            <span class="img-title">{{ item.cornerIconName }}</span>
            <span class="img-status">{{ $consts.statusText[item.cornerStatus] }}</span>
          </div>
        </div>
      </CardList>
    </ContentWrapper>
    <!-- 预览图片 -->
    <el-dialog title="预览图片" :visible.sync="picDialogVisible" width="30%">
      <span class="pics">
        <img :src="reviewPicUrl" alt="图片" style="width:400px">
      </span>
    </el-dialog>
    <!--批量审核-->
    <el-dialog title="审核" :visible.sync="auditDialogVisible" :before-close="handleDialogClose">
      <GlobalIconAudit @auditForm="handleDoBatchAudit" @cancle="cancle" ref="auditForm"></GlobalIconAudit>
    </el-dialog>
    <!--调整优先级-->
    <el-dialog title="调整优先级" :visible.sync="dialogLevelVisible">
      <!-- <GlobelIconLevel @level="handleLevel"></GlobelIconLevel> -->
      <GlobelIconLevel></GlobelIconLevel>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLevelVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogLevelVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import ButtonList from './../../components/ButtonLIst'
import GlobalIconAudit from './GlobalIconAudit'
import GlobelIconLevel from './GlobelIconLevel'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import GlobalIconBatchAudit from '@/components/GlobalIconBatchAudit'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
import BaseList from '@/components/BaseList'
import { CardList } from 'admin-toolkit'
export default {
  extends: BaseList,
  components: {
    CardList,
    ActionList,
    Table,
    ContentWrapper,
    GlobalIconAudit,
    GlobelIconLevel,
    ButtonGroupForListPage,
    GlobalIconBatchAudit
  },
  data() {
    return {
      resourceType: 'cornerIcon',
      checkAll: false,
      globalTypes: {
        test1: '1010',
        test2: '1011',
        付费属性: '101',
        排行榜: '103',
        教育角标: '105',
        策划类: '104',
        素材播出属性: '102'
      }, // 角标分类
      attributeTypes: {}, // 角标类别
      auditDialogVisible: false,
      dialogLevelVisible: false,
      typePositions: {
        左上: 0,
        右上: 1,
        左下: 3,
        右下: 2
      },
      typePositionText: ['左上', '右上', '左下', '右下'],
      picDialogVisible: false, // 预览图片弹出框
      reviewPicUrl: null,
      filter: this.genDefaultFilter(),
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'cornerIconId'
          },
          {
            label: '角标名称',
            prop: 'cornerIconName',
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleRead(row)
                    }
                  }
                },
                row.cornerIconName
              )
            }
          },
          {
            label: '图片',
            prop: 'imgUrl',
            render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  src: row.imgUrl,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                },
                on: {
                  click: (event) => {
                    event.stopPropagation()
                    this.reviewPic(row)
                  }
                }
              })
            }
          },
          {
            label: '审核状态',
            prop: 'cornerStatus',
            render: (createElement, { row }) => {
              return this.$consts.statusText[row.cornerStatus]
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    genDefaultFilter() {
      return {
        idPrefix: this.$consts.idPrefix
      }
    },
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getGlobalMgrList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        this.checkAll = false
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    // 批量审核
    batchAudit() {
      if (this.selected.length === 0) {
        return this.$message.error('请选择再审批')
      }
      const waiting = this.$consts.status.waiting
      const length = this.selected.filter(item => item.cornerStatus === waiting).length
      if (length === 0) {
        return this.$message.error('选中的素材里没有待审核素材')
      }
      this.auditForm = {
        idStr: null,
        auditFlag: '4',
        auditDesc: ''
      }
      this.auditDialogVisible = true
    },
    handleDoBatchAudit(data) {
      const waiting = this.$consts.status.waiting
      data.idStr = this.selected
        .filter(item => item.cornerStatus === waiting)
        .map(({ cornerIconId }) => cornerIconId )
        .join(',')
      this.$service
        .batchAudit(data, '审核成功')
        .then(data => {
          this.fetchData()
          this.$refs.auditForm.cancle()
          this.auditDialogVisible = false
        })
    },
    // 取消事件
    cancle(data) {
      this.auditDialogVisible = data
    },
    handleDialogClose() {
      this.$refs.auditForm.cancle()
    },
    changePriority() {
      this.dialogLevelVisible = true
    },
    // 查询
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (this.$validateId(this.filter.cornerIconId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    // 重置
    handleFilterReset() {
      this.filter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    // 角标分类
    getCornerTypes() {
      return this.$service.getCornerTypes().then(data => {
        data.forEach(element => {
          this.globalTypes[element.typeName] = element.typeId
        })
        console.log(this.globalTypes)
      })
    },
    // 角标类别
    getIconAttributes() {
      return this.$service.getIconAttributes().then(data => {
        data.attributes.forEach(element => {
          this.attributeTypes[element.attributeName] = element.attributeCode
        })
        console.log(this.attributeTypes)
      })
    },
    reviewPic(row) {
      this.reviewPicUrl = row.imgUrl
      this.picDialogVisible = true
    }
  },
  created() {
    let filterSchema = _.map({
      cornerIconName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '角标名称  '
      }),
      cornerIconId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      typeId: _.o.enum(this.globalTypes).other('form', {
        component: 'Select',
        placeholder: '角标分类'
      }),
      typePosition: _.o.enum(this.typePositions).other('form', {
        component: 'Select',
        placeholder: '角标位置'
      }),
      attributeCode: _.o.enum(this.attributeTypes).other('form', {
        component: 'Select',
        placeholder: '角标类别'
      }),
      cornerStatus: _.o.enum(this.$consts.statusEnums).other('form', {
        component: 'Select',
        placeholder: '审核状态'
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

    if (this.$consts.idPrefix != '10') {
      filterSchema.map({
        idPrefix: _.o.enum({
          '酷开': '10',
          '江苏广电': '11'
        }).other('form', {
          component: 'Select',
          placeholder: '数据来源'
        })
      })
    }
    this.fetchData()
    this.getCornerTypes().then(() => {
      this.getIconAttributes().then(() => {
        this.filterSchema = filterSchema
      })
    }) // 获取角标分类

    // 角标类别
  }
}
</script>

<style lang='stylus' scoped>
.btns
  margin-bottom 10px
.img-item
  position relative
  width 202px
  height 202px
  border 1px solid #ccc
  margin 0 10px 10px 0
  img
    max-width 100%
    max-height 100%
  .img-list
    width 1070px
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
