<template>
  <RemoteSelectorWrapper
    ref="selectorWrapper"
    title="批量审核下面所有素材(一次最多审核50个)"
    :pagination="pagination"
    @select-start="handleSelectStart">
    <el-button type="primary">一键审核</el-button>
    <div slot="filter">
      <el-form ref="auditForm" @keypress.enter.native.prevent="handleAudit" :inline="true" :model="auditForm" :rules="auditFormRules" label-width="80px">
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
      <div class="picture-item" slot="row" slot-scope="{row: item}">
        <div class="img-wrapper">
          <img :key="item.pictureUrl" class="list-img" :src="item.pictureUrl">
        </div>
        <div>{{item.pictureName}}</div>
        <div>
          {{ item.pictureId }} / {{ $consts.statusText[item.pictureStatus] }} / {{item.pictureResolution}}
        </div>
      </div>
    </CardList>
    <div slot="footer"></div>
  </RemoteSelectorWrapper>
</template>
<script>
import CardList from '@/components/CardList'
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
        pageSize: 50
      },
      filter: {
        pictureStatus: 3
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
      }
    }
  },
  methods: {
    handleSelectStart () {
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
          this.auditForm.idStr = this.table.data.map(({ pictureId }) => pictureId).join(',')
          this.$service
            .materialBatchAudit(this.auditForm, this.auditForm.auditFlag === '4' ? '审批成功' : '打回成功')
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
    getFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return { ...filter }
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.getResourceList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        if (data.rows.length === 0) {
          this.$message.warning('没有待审核素材')
          setTimeout(() => {
            this.handleCancel()
          }, 1000)
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.content-list >>> .card-list
  display flex
  flex-direction row
  flex-wrap wrap

.card-list  >>> .card-item__selection
  display none

.card-list >>> .card-item-wrapper:hover
  border 1px solid #444

.card-list >>> .card-item-wrapper
  width 17%
  height 256px
  border 1px solid #ccc
  margin 5px
  padding 10px
  cursor pointer

.img-wrapper img
  width 100%
  height 200px
</style>
