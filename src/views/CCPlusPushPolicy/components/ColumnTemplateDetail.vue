<template>
  <ContentCard class="content" title="栏目详情" @go-back="$router.back()">
    <el-form inline>
      <el-form-item label="栏目序号">{{ details.id }}</el-form-item>
      <el-form-item label="栏目名称">{{ details.name }}</el-form-item>
      <el-form-item label="影片列表数量">{{ details.movieNum }}</el-form-item>
      <el-form-item>
        <el-button @click="movieReplace">添加影片</el-button>
      </el-form-item>
      <el-form-item>
        <div class="demo-image__lazy">
          <el-image
            v-for="(url, idx) in urls"
            :key="url"
            :src="url"
            lazy
            @click="showOperations(idx)"
          ></el-image>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="showOperationDialog">
      <el-button @click="movieToTop">置顶影片</el-button>
      <el-button @click="movieReplace">替换影片</el-button>
      <el-button @click="movieRemove">删除影片</el-button>
    </el-dialog>

    <el-dialog :visible.sync="showChooseMovieDialog">
      <ChooseMovieDialog />
      <span slot="footer">
        <el-button @click="showChooseMovieDialog=false">取消</el-button>
        <el-button @click="showChooseMovieDialog=false">确定</el-button>
      </span>
    </el-dialog>
  </ContentCard>
</template>

<script>
// '栏目详情' 组件
import { ContentWrapper, Table } from "admin-toolkit";
import BaseList from "@/components/BaseList";
import ChooseMovieDialog from "./ChooseMovieDialog";

export default {
  extends: BaseList,
  components: {
    ChooseMovieDialog
  },
  props: {
    id: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      details: {
        id: 3,
        name: "Action Movie",
        movieNum: 12
      },
      urls: [
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
        "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
        "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
        "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
        "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
        "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
        "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg"
      ],
      showOperationDialog: false,
      currentMovieIdx: undefined,
      showChooseMovieDialog: false
    };
  },
  created() {
    //get all pic
    this.details;
  },
  methods: {
    movieToTop() {},
    movieReplace() {
      //添加或替换影片
      this.showOperationDialog = false
      this.showChooseMovieDialog = true
    },
    movieRemove() {},
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
  height 420px
  overflow auto
  .el-image
    display inline-block
    width 100px
    margin 5px
</style>
