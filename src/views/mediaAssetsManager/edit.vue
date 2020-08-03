<template>
  <div>
    <el-form :inline="true" :model="formInline" class="form-inline">
      <el-form-item class="">
        <el-input v-model="formInline.user" placeholder="请输入应用名"></el-input>
      </el-form-item>
      <el-form-item class="">
        <el-select v-model="formInline.region" placeholder="请选择应用类型">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
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
    >
      <el-table-column
        width="50">
        <template slot-scope="scope">
          <el-radio :label='scope.row.id' v-model='radio'>&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        property="id"
        label="应用ID"
        width="80">
      </el-table-column>
      <el-table-column
        property="name"
        label="应用名"
        width="150">
      </el-table-column>
      <el-table-column
        property="type"
        label="类型"
        width="100">
      </el-table-column>
      <el-table-column
        property="address"
        label="备注">
      </el-table-column>
      <el-table-column
        property="api"
        label="api">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">
        取消
      </el-button>
      <el-button type="primary" @click="create">
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      tableData: [{
        id: 0,
        type: '内容',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 1,
        type: '娱乐',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 2,
        type: '娱乐',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 3,
        type: '内容',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 4,
        type: '内容',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 5,
        type: '内容',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 6,
        type: '内容',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 7,
        type: '内容',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 8,
        type: '内容',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }, {
        id: 9,
        type: '内容',
        name: '王小虎',
        address: '上海市普陀区',
        api: 'xxxx'
      }],
      currentRow: null,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示10条数据
      radio: null // 如果使用单选框，定义一个model值
    }
  },
  methods: {
    cancel () {

    },
    create () {

    },
    onSubmit () {
      console.log('submit!')
    },
    // 列表特定操作时可调用，如取消选择
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    // 列表选中时触发
    handleCurrentChange (val) {
      this.currentRow = val
      this.radio = val.id
    }
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
  .el-button {
    width: 90px;
  }
}
</style>
