<template>
  <div>
    <el-table :data="sortListInUse" style="width: 100%" highlight-current-row>
      <el-table-column prop="pageName" label="名称" v-if="sortListInUse.pageName"></el-table-column>
      <el-table-column prop="itemName" label="名称" v-if="!sortListInUse.pageName"></el-table-column>
      <el-table-column label="升序">
        <template slot-scope="scope">
          <el-button @click="moveUp(scope.$index, scope.row)">
            <i class="el-icon-caret-top"></i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="降序">
        <template slot-scope="scope">
          <el-button @click="moveDown(scope.$index, scope.row)">
            <i class="el-icon-caret-bottom"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="dialog-footer">
      <el-button type="primary" @click="create">
        完成
      </el-button>
      <el-button @click="cancel">
        取消
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InnerPageSortDialog',
  // props: {
  //   sortList: {
  //     type: Array,
  //     default: []
  //   }
  // },
  // watch: {
  //   sortList: function (newVal, oldVal) {
  //     console.log(newVal)
  //     debugger
  //   }
  //   // 'risId.random' (newVal, oldVal) {
  //   //   this.pushForm.ctmDevCtrId = this.risId.id
  //   //   this.$refs.pushForm.validateField('ctmDevCtrId')
  //   // }
  // },
  data () {
    return {
      sortListInUse: []
    }
  },
  methods: {
    moveUp (index, row) {
      if (index !== 0) {
        this.sortListInUse[index] = this.sortListInUse.splice(index - 1, 1, this.sortListInUse[index])[0]
      } else {
        this.$message({
          type: 'error',
          message: '不可再升序！'
        })
      }
    },
    moveDown (index, row) {
      if (index !== this.sortListInUse.length - 1) {
        this.sortListInUse[index] = this.sortListInUse.splice(index + 1, 1, this.sortListInUse[index])[0]
      } else {
        this.$message({
          type: 'error',
          message: '不可再降序！'
        })
      }
    },
    create () {
      this.$emit('done-sort-list', this.sortListInUse)
    },
    cancel () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>
