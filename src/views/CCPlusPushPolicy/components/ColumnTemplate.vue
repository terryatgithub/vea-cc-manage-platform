<template>
  <div>
    <el-form
      label-width="90px"
      :model="content"
      ref="columnTemplateForm"
      :rules="rules"
    >
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

      <!-- <el-form-item label="栏目ID:">
        {{ content.columnId }}
      </el-form-item> -->

      <el-form-item label="栏目序号:" prop="serialNo">
        <el-input placeholder="" clearable v-model.number="content.serialNo" />
      </el-form-item>

      <el-form-item
        label="栏目名称:"
        prop="columnName"
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
        prop="moviesNum"
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

      <!-- 图片展示区 -->
      <el-form-item>
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
      :show-close="false"
    >
      <!-- :before-close="handleClose" -->
      <ColumnResourceSelectDialog @get-select-resource="getSelectResource" />
      <!-- <span slot="footer">
        <el-button @click="closeColumnResourceSelectDialog(false)"
          >取消</el-button
        >
        <el-button @click="closeColumnResourceSelectDialog(true)"
          >完成</el-button
        >
      </span> -->
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
      required: true,
      default: () => ({
        columnTemplate: 0,
        columnId: 0,
        serialNo: 0, //@todo v-for key用这个，可能会有啥问题吗？
        columnName: "",
        moviesNum: "99"
      })
    }
  },
  data() {
    // const checkColumnSerialNo = (rule, value, callback) => {
    //   //校验模板栏目序列号
    //   console.log("check no...");
    //   if (!value) {
    //     return callback(new Error("请输入栏目序号!"));
    //   }
    //   this.form.columns.forEach(col => {
    //     if (col.serialNo === value) {
    //       return callback(new Error("模板序号不能重复，请重新设置"));
    //     }
    //   });
    // }
    return {
      rules: {
        serialNo: [
          { required: true, message: "请输入栏目序号", trigger: "blur" }
          // { validator: checkColumnSerialNo, trigger: ["blur", "change"] }
        ]
      },
      showSelectResourceDialog: false,
      templateOptions: [
        { label: "模板A 媒资混排", value: 0 },
        { label: "模板B 媒资竖图", value: 1 },
        { label: "模板C 媒资横图", value: 2 },
        { label: "模板D 媒资方图", value: 3 }
      ],
      urls: [
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
        "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
        "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
        "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg"
      ],
      columnResource: null //栏目资源标签
    };
  },
  methods: {
    getSelectResource(...rest) {
      // 获取选择的资源类型
      this.showSelectResourceDialog = false;
      if(rest[0]) {
        this.columnResource = rest[0];
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
        query: {
          id: 1 //row.tabId
        }
      });
    },
    handleDeleteColumn() {},
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
  display flex
  overflow-x auto
  .el-image
    flex-shrink 0
    margin 5px
    width 100px
</style>
