<template>
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
      <el-button type="warning" @click="handleDeleteColumn">删除栏目</el-button>
    </el-form-item>

    <el-form-item>
      <el-button @click="handleEditMovies">编辑栏目影片</el-button>
    </el-form-item>

    <el-form-item>
      <!-- 图片展示区 -->
    </el-form-item>

    <el-form-item>
        <SelectResourceDialog :show="showSelectResourceDialog" @dlg-close="showSelectResourceDialog = false"/>
    </el-form-item>

    <el-form-item>
      <hr />
    </el-form-item>

  </el-form>
</template>

<script>
// 添加栏目的'栏目模板组件'

import SelectResourceDialog from "./ColumnResourceSelectDialog.vue";

export default {
  components: {
    SelectResourceDialog
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
      templateOptions: []
    };
  },

  methods: {
    handleSelectColumnResource() {
        this.showSelectResourceDialog = true
    },
    handleEditMovies() {},
    handleDeleteColumn() {},
    async validate() {
      let res = await this.$refs["columnTemplateForm"].validate();
      //@todo 子组件的校验问题
      console.log("sub res", res);
      return res;
    }
  }
}
</script>

<style lang="stylus" scoped>
.column
  .right
    float right
  .edit
    right 100px
  .delete
    right 10px
</style>
