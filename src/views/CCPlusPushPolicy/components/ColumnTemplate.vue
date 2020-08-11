<template>
  <div>
    <el-form label-width="90px" :model="content" ref="columnTemplateForm">
      <el-form-item label="栏目模板:">
        <el-select v-model="content.columnTemplate" placeholder="请选择">
          <el-option
            v-for="item in templateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label-width="0" style="margin-left:90px;">
        <el-button @click="handleSelectColumnResource">栏目资源选择</el-button>
      </el-form-item>

      <el-form-item label="栏目ID:">
        {{ content.columnId }}
      </el-form-item>

      <el-form-item label="栏目序号:" :prop="serialNo" :rules="rules">
        <el-input placeholder="" clearable v-model="content.serialNo" />
      </el-form-item>

      <el-form-item
        label="栏目名称:"
        :prop="columnName"
        :rules="{
          required: true,
          message: '请输入栏目名称',
          trigger: 'blur'
        }"
      >
        <el-input placeholder="" clearable v-model="content.columnName" />
      </el-form-item>

      <el-form-item
        label="影片列表数量:"
        label-width="120px"
        :prop="moviesNum"
        :rules="{
          required: true,
          message: '请输入影片数量',
          trigger: 'blur'
        }"
      >
        <el-input placeholder="" clearable v-model="content.moviesNum" />
      </el-form-item>

      <el-form-item class="right delete">
        <el-button type="warning" @click="handleDeleteColumn"
          >删除栏目</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-button @click="handleEditMovies">编辑栏目影片</el-button>
      </el-form-item>

      <el-form-item>
        <!-- 图片展示区 -->
        <div class="demo-image__lazy">
          <el-image v-for="url in urls" :key="url" :src="url" lazy></el-image>
        </div>
      </el-form-item>

      <el-form-item>
        <hr />
      </el-form-item>
    </el-form>

    <el-dialog
      :visible.sync="showSelectResourceDialog"
      title="栏目资源选择(可多选)(可反选)"
      :before-close="handleClose"
    >
      <ColumnResourceSelectDialog />
      <span slot="footer">
        <el-button @click="closeColumnResourceSelectDialog(false)"
          >取消</el-button
        >
        <el-button @click="closeColumnResourceSelectDialog(true)"
          >完成</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 添加栏目的'栏目模板'组件

import ColumnResourceSelectDialog from "./ColumnResourceSelectDialog.vue";
export default {
  components: {
    ColumnResourceSelectDialog
  },
  props: {
    prop: "",
    rules: Object,
    content: {
      type: Object,
      required: true,
      default: () => ({
        columnTemplate: "媒资模板A: 混排",
        columnId: 122121,
        serialNo: 11,
        columnName: "",
        moviesNum: "12"
      })
    }
  },
  data() {
    return {
      showSelectResourceDialog: false,
      templateOptions: [],
      urls: [
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
        "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
        "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
        "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg"
      ]
    };
  },
  computed: {
    noMore() {
      return this.count > 20;
    },
    diabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    closeColumnResourceSelectDialog(confirm, event) {
      this.showSelectResourceDialog = false
      console.log("close: ", confirm, event);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          this.closeColumnResourceSelectDialog(false);
          done();
        })
        .catch(() => {});
    },
    load() {
      this.loading = true;
      setTimeout(() => {
        this.count += 2;
        this.loading = false;
      }, 2000);
    },
    handleSelectColumnResource() {
      this.showSelectResourceDialog = true;
    },
    handleEditMovies() {
      this.$router.push({
        path: "ColumnTemplateDetail",
        query: {
          id: 1 //row.tabId
        }
      });
    },
    handleDeleteColumn() {},
    async validate() {
      let res = await this.$refs["columnTemplateForm"].validate();
      //@todo 子组件的校验问题
      console.log("sub res", res);
      return res;
    }
  }
};
</script>

<style lang="stylus" scoped>
.column
  .right
    float right
  .edit
    right 100px
  .delete
    right 10px
.demo-image__lazy
  height 100px
  width 100%
  overflow auto
  .el-image
    margin 5px
    width 100px
</style>
