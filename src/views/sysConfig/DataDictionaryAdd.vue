<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="字典名称" prop="dictCnName">
            <el-input v-model="form.dictCnName" placeholder="字典名称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="所在部门" prop="deptId">
            <el-select v-model="form.deptId" placeholder="所在部门">
              <el-option
                v-for="item in departmentList"
                :key="item.deptId+''"
                :label="item.deptName"
                :value="item.deptId+''"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="字典值" prop="dictEnName">
            <el-input v-model="form.dictEnName" placeholder="字典值"></el-input>
          </el-form-item>
          <!-- <el-form-item label="字典分类" prop="dictCategory">
              <el-select v-model="form.deptId" placeholder="字典分类">
              <el-option
                v-for="item in departmentList"
                :key="item.deptId+''"
                :label="item.deptName"
                :value="item.deptId+''"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="字典分类">
            <el-select v-model="form.dictCategory" placeholder="字典分类">
              <el-option label="分类一" value="value1"></el-option>
              <el-option label="分类二" value="value2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- <el-button @click="cancelAdd">返回</el-button> -->
            <el-button type="primary" @click="submitBtn">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </ContentCard>
</template>
<script>
export default {
  prop: {
    editId: Number,
    default: null
  },
  data() {
    return {
      title: null,
      dictEnNameList: null,
      departmentList: [],
      form: {
        dictCnName: null,
        deptId: null,
        dictEnName: null,
        dictIds: []
      },
      formRules: {
        //表单规则
        dictCnName: [
          { required: true, message: "请输入字典名称", trigger: "blur" }
        ],
        dictEnName: [
          { required: true, message: "请输入字典值", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
         this.$service.SaveDictionary(this.form, "保存成功").then((data)=>{
            this.$emit("openListPage");
         })
        }
      });
    },
    //回显数据
    getEditData() {
      let obj = this;
      // this.$service.UpdateDictionary({ id: this.editId }).then(data => {
      //   Object.keys(this.form).forEach(v => {
      //     this.form[v] = data[v];
      //   });
      // });
    },
  },
  created() {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.getEditData();
    } else {
      this.title = '新增'
    }
  }
};
</script>

