<template>
  <div>
    <el-form :inline="true" :model="formInline" class="form-inline">
      <el-form-item class="" label="海报名">
        <el-input v-model="formInline.materialName" placeholder="请输入海报名" clearable maxlength="99"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style='width: 100%;overflow: auto'
      height='300'
      v-el-table-infinite-scroll="load"
    >
      <el-table-column
        width="50">
        <template slot-scope="scope">
          <el-radio :label='scope.row.materialId' v-model='radio'>&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        property="materialId"
        label="海报ID"
        width="80">
      </el-table-column>
      <el-table-column
        property="materialName"
        label="海报名"
        width="120">
      </el-table-column>
      <el-table-column
        label="图片"
        width="120">
        <template slot-scope="scope">
          <img :src='scope.row.materialPosterPic' style='width: 110px;height:80px;' />
        </template>
      </el-table-column>
      <el-table-column
        property="materialRemark"
        label="备注">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="notarize">
        确认
      </el-button>
      <el-button @click="cancel">
        取消
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formInline: {
        materialName: ''
      },
      tableData: [],
      currentRow: null,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示10条数据
      radio: null, // 如果使用单选框，定义一个model值
      isLoad: false
    }
  },
  methods: {
    fetchData () {
      const params = {
        page: this.currentPage,
        size: this.pageSize,
        materialState: 1,
        materialName: this.formInline.materialName
      }
      this.$service.queryPosterManageListPage(params).then(data => {
        if (data.code === 0) {
          this.currentPage !== 1
            ? this.tableData = this.tableData.concat(data.data.results)
            : this.tableData = data.data.results
          if (this.tableData.length < data.data.total) {
            this.isLoad = true
          } else {
            this.isLoad = false
          }
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 滚动加载
    load () {
      if (this.isLoad) {
        this.currentPage += 1
        this.fetchData()
      }
    },
    cancel () {
      this.radio = null
      this.$emit('close')
    },
    notarize () {
      if (this.radio) {
        this.$emit('posterSure', this.currentRow.materialId, this.currentRow.materialName, this.currentRow.materialPosterPic)
      } else {
        this.$message({
          type: 'error',
          message: '请选择一项！'
        })
      }
    },
    onSubmit () {
      this.currentPage = 1
      this.$refs.singleTable.bodyWrapper.scrollTop = 0
      this.fetchData()
    },
    // 列表特定操作时可调用，如取消选择
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    // 列表选中时触发
    handleCurrentChange (val) {
      this.currentRow = Object.assign({}, val)
      this.radio = val.materialId
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style lang="scss">
.form-inline {
  display: flex;
  .el-form-item {
    flex-grow: 1;
    margin-right: 15px!important;
  }
}
.dialog-footer {
  margin-top: 20px;
  text-align: center;
  .el-button {
    width: 90px;
    margin: 0 25px;
  }
}
</style>
