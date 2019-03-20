<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="160px">
          <el-form-item label="菜单编号" prop="menuId">
            <el-input v-model="form.menuId" placeholder="菜单编号"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="元素ID" prop="elid">
            <el-input v-model="form.elid" placeholder="元素ID"></el-input>
          </el-form-item>
          <el-form-item label="节点图标样式" prop="iconClass">
            <el-input v-model="form.iconClass" placeholder="节点图标样式"></el-input>
          </el-form-item>
          <el-form-item label="TAB页ID" prop="tabId">
            <el-input v-model="form.tabId" placeholder="TAB页ID"></el-input>
          </el-form-item>
          <el-form-item label="TAB页标题" prop="tabTitle">
            <el-input  v-model="form.tabTitle" placeholder="TAB页标题"></el-input>
          </el-form-item>
          <el-form-item label="TAB页图标样式" prop="tabIcon">
            <el-input  v-model="form.tabIcon" placeholder="TAB页图标样式"></el-input>
          </el-form-item>
          <el-form-item label="框架中打开URL" prop="iframeUrl">
            <el-input  v-model="form.iframeUrl" placeholder="框架中打开URL"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seq">
            <el-input  v-model="form.seq" placeholder="排序"></el-input>
          </el-form-item>
           <el-form-item label="打开模型0展开1TAB中打开2执行" prop="modle">
            <el-input  v-model="form.modle" placeholder="打开模型0展开1TAB中打开2执行："></el-input>
          </el-form-item>
          <el-form-item label="是否禁用" prop="disabled">
            <el-radio v-model="form.disabled" label="0">否</el-radio>
            <el-radio v-model="form.disabled" label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="菜单父编号" prop="pmid">
            <el-input  v-model="form.pmid" placeholder="菜单父编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitBtn">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </ContentCard>
</template>
<script>
export default {
  props: {
    editId: Number,
    default: null
  },
  //  prop: ['editId'],
  data() {
    return {
      title: null,
      dictEnNameList: null,
      departmentList: [],
      form: {
        menuId: null,
        menuName: null,
        elid: null,
        iconClass: null,
        tabId: null,
        tabTitle: null,
        tabIcon:null,
        iframeUrl:null,
        seq:null,
        modle:null,
        disabled:null,
        pmid:null
      },
      formRules: {
        //表单规则
        menuId: [{ required: true, message: "请输入菜单编号", trigger: "blur" }],
        menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        elid: [{ required: true, message: "请输入元素ID", trigger: "blur" }],
        // tabId: [{ required: true, message: "请输入TAB页ID", trigger: "blur" },],
        tabTitle: [{ required: true, message: "请输入TAB页标题", trigger: "blur"}]
      }
    };
  },
  methods: {
    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
            console.log(this.form)
        //   this.$service.userConfigSave(this.form, "保存成功").then(data => {
        //     this.$emit("openListPage");
        //   });
        }
      });
    },
    getEditData() {
      let obj = this;
      this.$service.editSysMenu({ id: this.editId }).then(data => {
          console.log(data)
        Object.keys(this.form).forEach(v => {
          if (v === "disabled") {
            this.form[v] = data[v]+'';
          } else {
            this.form[v] = data[v];
          }
        });
      });
    },
  },
  created() {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = "编辑";
      this.getEditData();
    } else {
      this.title = "新增";
    }
  }
};
</script>

