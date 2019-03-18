<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="用户名称">
            <el-input v-model="form.userName" placeholder="用户名称"></el-input>
          </el-form-item>
          <el-form-item label="所在部门">
            <el-select v-model="form.deptId" placeholder="所在部门">
              <el-option
                v-for="item in departmentList"
                :key="item.deptId+''"
                :label="item.deptName"
                :value="item.deptId+''"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input v-model="form.loginName" placeholder="登录账号"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input show-password v-model="form.loginPwd" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="邮件地址">
            <el-input type="email" v-model="form.email" placeholder="邮件地址"></el-input>
          </el-form-item>
          <el-form-item label="是否可用">
            <el-radio v-model="form.disabled" label="0">是</el-radio>
            <el-radio v-model="form.disabled" label="1">否</el-radio>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item label="数据权限">
            <el-form-item>
              <el-checkbox-group v-model="form.dictIds">
                <el-checkbox
                  v-for="item in dictEnNameList"
                  :label="item.dictCnName"
                  :key="item.dictId"
                  :value="item.dictId"
                >
                  <!-- {{item.dictCnName}} -->
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
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
        userName: null,
        deptId: null,
        loginName: null,
        loginPwd: null,
        email: null,
        disabled: null,
        remark: null,
        dictIds: []
      },
      formRules: {//表单规则
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "请输入登录账号", trigger: "blur" }
        ],
        loginPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮件地址", trigger: "blur" }]
      }
    };
  },
  methods: {
    userConfigBusinessType() {
      this.$service.userConfigBusinessType().then(data => {
        this.dictEnNameList = data;
      });
    },
    submitBtn() {
        this.$refs.form.validate(valid => {
          debugger;
          if (valid) {
            this.$service.userConfigSave(this.form).then((data) => {
               debugger;
            })
          }
        });
    },
    getEditData() {
      this.$service.userConfigEdit({ id: this.editId }).then(data => {
        // this.dictEnNameList = data
      });
    },
    getDepts() {
      return this.$service.getDepts().then(data => {
        this.departmentList = data;
      });
    }
  },
  created() {
    this.userConfigBusinessType();
    this.getDepts();
    if (this.editId !== null) {
      this.getEditData();
    }
  }
};
</script>

