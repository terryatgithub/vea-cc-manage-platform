<template>
  <ContentCard
    class="content"
    title="栏目详情"
    @go-back="completePicOperation(false)"
  >
    <el-form inline>
      <el-form-item label="栏目序号">{{ content.itemSeq }}</el-form-item>
      <el-form-item label="栏目名称">{{ content.itemName }}</el-form-item>
      <el-form-item label="影片数量上限">{{
        content.itemMediaMax
      }}</el-form-item>
      <el-form-item>
        <el-button @click="movieReplace(true)" :disabled="reachMaxNum"
          >添加影片</el-button
        >
      </el-form-item>
    </el-form>

    <div class="demo-image__lazy">
      <el-image
        v-for="(item, idx) in itemMediaListInUse"
        :key="item.mediaResourcesId"
        :src="item.mediaPic"
        lazy
        @click="showOperations(idx)"
      ></el-image>
    </div>
    <div>
      <el-button @click="completePicOperation(true)">完成</el-button>
      <el-button @click="completePicOperation(false)">取消</el-button>
    </div>

    <el-dialog :visible.sync="showOperationDialog" append-to-body>
      <el-button @click="movieToTop">置顶影片</el-button>
      <el-button @click="movieReplace(false)">替换影片</el-button>
      <el-button @click="movieRemove">删除影片</el-button>
    </el-dialog>

    <el-dialog
      :visible.sync="showChooseMovieDialog"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
    >
      <ChooseMovieDialog
        v-bind="$attrs"
        @done-movie-replace="handleReplaceMovie"
      />
    </el-dialog>
  </ContentCard>
</template>

<script>
// '栏目详情' 组件
import { ContentWrapper, Table } from "admin-toolkit";
import BaseList from "@/components/BaseList";
import ChooseMovieDialog from "./ChooseMovieDialog";

export default {
  name: "ColumnTemplateDetail",
  extends: BaseList,
  components: {
    ChooseMovieDialog,
    ContentWrapper,
    Table
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showOperationDialog: false,
      currentMovieIdx: -1,
      flagAddOrReplace: true, // flag: true 添加影片 false 删除影片
      showChooseMovieDialog: false,
      itemMediaListInUse: Array.from(this.content.itemMediaList) //实际操作的数组副本
    };
  },
  computed: {
    reachMaxNum: function() {
      return this.itemMediaListInUse.length >= this.content.itemMediaMax;
    }
  },
  methods: {
    handleReplaceMovie(...rest) {
      this.showChooseMovieDialog = false;
      if (!rest[0]) {
        return;
      }
      if (this.flagAddOrReplace) {
        this.itemMediaListInUse.unshift(rest[0]);
      } else {
        this.itemMediaListInUse.splice(this.currentMovieIdx, 1, rest[0]);
      }
    },
    completePicOperation(confirm) {
      if (confirm) {
        this.content.itemMediaList = this.itemMediaListInUse;
      }
      this.$emit("done-pic-operation", confirm);
    },
    movieToTop() {
      if (this.currentMovieIdx === -1) {
        return;
      }
      let top = this.itemMediaListInUse.splice(this.currentMovieIdx, 1);
      this.itemMediaListInUse.unshift(top[0]);
      this.currentMovieIdx = 0;
    },
    movieReplace(add) {
      //添加或替换影片
      this.flagAddOrReplace = add;
      this.showOperationDialog = false;
      this.showChooseMovieDialog = true;
    },
    async movieRemove() {
      if (this.currentMovieIdx === -1) {
        return;
      }
      try {
        let res = await this.$confirm("确定删除吗", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (res !== "confirm") {
          return;
        }
        this.itemMediaListInUse.splice(this.currentMovieIdx, 1);
        this.currentMovieIdx = -1;
        this.showOperationDialog = false;
      } catch (e) {
        console.warn(e);
      }
    },
    showOperations(idx) {
      console.log("点击影片: ", idx);
      this.showOperationDialog = true;
      this.currentMovieIdx = idx;
    }
  }
};
</script>

<style lang="stylus" scoped>
.demo-image__lazy
  width 100%
  max-height 50vh
  min-height 10vh
  display flex
  flex-wrap wrap
  overflow: scroll;
  .el-image
    display inline-flex
    align-items center
    flex-shrink 0
    margin 5px
    width 100px
    >>> .el-image__inner
      height auto
</style>
