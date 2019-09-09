<template>
  <RemoteSelectorWrapper
    ref="selectorWrapper"
    title="批量审核下面所有素材"
    :pagination="pagination"
    @select-start="handleSelectStart">
    <el-button type="primary">一键审核</el-button>
    <div slot="filter">
      <el-form ref="auditForm" @keypress.enter.native="handleAudit" :inline="true" :model="auditForm" :rules="auditFormRules" label-width="80px">
        <el-form-item label="审核意见" prop="auditFlag">
          <el-radio v-model="auditForm.auditFlag" label="4">通过</el-radio>
          <el-radio v-model="auditForm.auditFlag" label="5">打回</el-radio>
        </el-form-item>
        <el-form-item label="意见说明" prop="auditDesc">
          <el-input ref="auditDesc" autofocus style="width: 400px" v-model="auditForm.auditDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAudit">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <CardList
      slot="item-list"
      :data="table.data"
      :selected="table.selected"
      selection-type="none">
      <div class="img-item" slot="row" slot-scope="{row: item}">
        <img :key="item.imgUrl" :src="item.imgUrl" />
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
    <div slot="footer"></div>
  </RemoteSelectorWrapper>
</template>
<script>
import { CardList } from 'admin-toolkit'
import RemoteSelectorWrapper from './RemoteSelectorWrapper.vue'
export default {
  components: {
    CardList,
    RemoteSelectorWrapper
  },
  data () {
    return {
      table: {
        props: {},
        data: [],
        selected: undefined,
        selectionType: 'single'
      },
      pagination: {
        currentPage: 1,
        pageSize: 30
      },
      filter: {
        cornerStatus: 3
      },
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
      globalTypes: {
        test1: '1010',
        test2: '1011',
        付费属性: '101',
        排行榜: '103',
        教育角标: '105',
        策划类: '104',
        素材播出属性: '102'
      }, // 角标分类
      typePositionText: ['左上', '右上', '左下', '右下'],
    }
  },
  methods: {
    handleSelectStart() {
      this.fetchData()
      this.$nextTick(() => {
        const $auditForm = this.$refs.auditForm
        const $auditDesc = this.$refs.auditDesc
        if ($auditForm) {
          $auditForm.clearValidate()
          $auditDesc.focus()
        }
      })
    },
    handleAudit () {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.auditForm.idStr = this.table.data.map(({ cornerIconId }) => cornerIconId).join(',')
          this.$service
            .batchAudit(this.auditForm, '操作成功')
            .then(data => {
              this.$refs.selectorWrapper.handleSelectCancel()
              this.$emit('audit-end')
            })
        }
      })
    },
    handleCancel () {
      this.$refs.selectorWrapper.handleSelectCancel()
    },
    getFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return { ...filter }
    },
    fetchData() {
      const filter = this.getFilter()
      this.$service.getGlobalMgrList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        if (data.rows.length === 0) {
          this.$message.warning('没有待审核素材')
          this.handleCancel()
        }
      })
    },
  }
}
</script>
<style lang="stylus" scoped>
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
</style>