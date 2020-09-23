<template>
  <div>
    <el-table :data="sortListInUse" style="width: 100%" highlight-current-row>
      <el-table-column :prop="sortName" label="名称"></el-table-column>
      <el-table-column label="往前">
        <template v-slot:default="scope">
          <el-button @click="moveUp(scope)">
            <i class="el-icon-caret-top"></i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="往后">
        <template v-slot:default="scope">
          <el-button @click="moveDown(scope)">
            <i class="el-icon-caret-bottom"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="complete(true)">完成</el-button>
    <el-button @click="complete(false)">取消</el-button>
  </div>
</template>

<script>
export default {
  name: "InnerPageSortDialog",
  props: {
    sortName: "",
    sortList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      sortListInUse: Array.from(this.sortList)
    };
  },
  methods: {
    moveUp(scope) {
      let index = scope.$index;
      if (index === 0) {
        return;
      }
      let prev = this.sortListInUse.splice(index - 1, 1);
      this.sortListInUse.splice(index, 0, prev[0]);
    },
    moveDown(scope) {
      let index = scope.$index;
      if (index === this.sortListInUse.length - 1) {
        return;
      }
      let next = this.sortListInUse.splice(index, 1);
      this.sortListInUse.splice(index + 1, 0, next[0]);
    },
    complete(confirm) {
      if (confirm) {
        this.$emit("done-sort-list", confirm, this.sortListInUse);
      }
      this.$emit("done-sort-list");
    }
  }
};
</script>

<style lang="scss" scoped></style>
