<template>
  <div class="column-template-wrapper">
    <el-form
      label-width="90px"
      :model="content"
      ref="columnTemplateForm"
      :rules="rules"
    >
      <el-form-item label="栏目模板:">
        <el-select v-model="content.template" placeholder="请选择">
          <el-option
            v-for="item in templateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label-width="0" style="margin-left:90px;">
        <el-button @click="handleSelectColumnResource" type="primary" plain
          >新增栏目资源</el-button
        >
      </el-form-item>

      <!-- <el-form-item label="栏目ID:">
        {{ content.releaseItemId }}
      </el-form-item> -->

      <el-form-item label="栏目序号:" prop="itemSeq">
        <el-input placeholder="" clearable v-model.number="content.itemSeq" />
      </el-form-item>

      <el-form-item
        label="栏目名称:"
        prop="itemName"
        :rules="{
          required: true,
          message: '请输入栏目名称',
          trigger: 'blur'
        }"
      >
        <el-input placeholder="" clearable v-model="content.itemName" />
      </el-form-item>

      <el-form-item
        label="影片列表数量:"
        label-width="120px"
        prop="itemMediaMax"
        :rules="{
          required: true,
          message: '请输入影片数量',
          trigger: 'blur'
        }"
      >
        <el-input placeholder="" clearable v-model="content.itemMediaMax" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleEditMovies" type="primary" plain
          >编辑栏目影片</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-button type="danger" plain @click="handleDeleteColumn"
          >删除栏目</el-button
        >
      </el-form-item>

      <!-- 图片展示区 -->
      <el-form-item>
        <div class="demo-image__lazy">
          <el-image
            v-for="item in content.itemMediaList"
            :key="item.mediaResourcesId	"
            :src="item.posterUrl"
            lazy
          ></el-image>
        </div>
      </el-form-item>

      <el-form-item>
        <hr />
      </el-form-item>
    </el-form>

    <el-dialog
      :visible.sync="showSelectResourceDialog"
      title="栏目资源选择(可多选)(可反选)"
      :show-close="false"
    >
      <ColumnResourceSelectDialog @get-select-resource="getSelectResource" />
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
    content: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rules: {
        itemSeq: [
          { required: true, message: "请输入栏目序号", trigger: "blur" }
        ]
      },
      showSelectResourceDialog: false,
      templateOptions: [
        { label: "模板A 媒资混排", value: 'A' },
        { label: "模板B 媒资竖图", value: 'B' },
        { label: "模板C 媒资横图", value: 'C' },
        { label: "模板D 媒资方图", value: 'D' }
      ],
      columnResourceSelections: null, //栏目资源标签选择项
    };
  },
  methods: {
    async getSelectResource(...rest) {
      // 获取选择的资源类型
      this.showSelectResourceDialog = false;
      if (!rest[0]) {
        return;
      }
      this.columnResourceSelections = rest[0];
      let res = await this.$service.queryCCPlusMediaResourceNew({
        page: 1,
        size: 100,
        templateType: this.content.template,
        supplier: this.columnResourceSelections.source.join(','),
        category: this.columnResourceSelections.category.join(','),
        tag: this.columnResourceSelections.tag.join(','),
      });
      if (res.code === 0) {
        //@todo 这里要根据模板类型，设置对应图片
        this.content.itemMediaList = res.data.results;
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(() => {
    //       this.closeColumnResourceSelectDialog(false);
    //       done();
    //     })
    //     .catch(() => {});
    // },
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
        //@todo 带海报参数过去，直接带对象可以吗？
        query: {
          id: 1 //row.tabId
        }
      });
    },
    handleDeleteColumn() {
      this.$confirm("确认删除该模板吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("remove-column", this.content);
        })
        .catch(() => {});
    },
    async validate() {
      //@todo 子组件的校验问题
      let res = await this.$refs["columnTemplateForm"].validate();
      console.log("sub res", res);
      return res;
    }
  }
};
</script>

<style lang="stylus" scoped>
.column-template-wrapper
  background lightgray
.el-form
  display flex
  flex-wrap wrap
  .el-form-item
    margin 5px

.demo-image__lazy
  height 100px
  width 100%
  display flex
  overflow-x auto
  .el-image
    flex-shrink 0
    margin 5px
    width 100px
</style>
