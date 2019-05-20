<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px" class="el-form-add">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="form.userName" placeholder="用户名称" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="所在部门" prop="deptId">
            <el-select v-model="form.deptId" placeholder="所在部门">
              <el-option
                v-for="item in departmentList"
                :key="item.deptId+''"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录账号" prop="loginName">
            <el-input v-model="form.loginName" placeholder="登录账号" maxlength="50">></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="loginPwd" v-if="isShowloginPwd">
            <el-input v-model="form.loginPwd" placeholder="密码" maxlength="50">></el-input>
          </el-form-item>
          <el-form-item label="邮件地址" prop="email">
            <el-input type="email" v-model="form.email" placeholder="邮件地址"></el-input>
          </el-form-item>
          <el-form-item label="是否可用" prop="disabled">
            <el-radio v-model="form.disabled" label="0">是</el-radio>
            <el-radio v-model="form.disabled" label="1">否</el-radio>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item label="数据权限" prop="dicts">
            <el-form-item>
              <el-checkbox-group v-model="form.dicts">
                <el-checkbox
                  v-for="item in dictEnNameList"
                  :key="item.dictId"
                  :label="item.dictId"
                >{{item.dictCnName}}</el-checkbox>
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
  props: {
    editId: Number,
    default: null
  },
  //  prop: ['editId'],
  data () {
    return {
      title: null,
      dictEnNameList: null,
      departmentList: [],
      isShowloginPwd: true,
      form: {
        userName: null,
        deptId: null,
        loginName: null,
        loginPwd: null,
        email: null,
        disabled: null,
        remark: null,
        superAdmin: 0,
        dicts: []
      },
      formRules: {
        // 表单规则
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        loginPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮件地址', trigger: 'blur' },
          { type: 'email', message: '邮件地址格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    userConfigBusinessType () {
      this.$service.getDictType({type: 'businessType'}).then(data => {
        this.dictEnNameList = data
      })
    },
    submitBtn () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
          // 处理dicts数组
          this.form.dicts = this.form.dicts.join(',')
          
          this.$service.userConfigSave(this.form, '保存成功').then(data => {
            this.$emit('open-list-page')
          })
        }
      })
    },
    getEditData () {
      let obj = this
      this.$service.userConfigEdit({ id: this.editId }).then(data => {
        console.log(data)
        Object.keys(this.form).forEach(v => {
          if (v === 'disabled') {
            this.form[v] = data[v] + ''
          } else {
            this.form[v] = data[v]
          }
        })
      })
    },
    getDepts () {
      return this.$service.getDepts().then(data => {
        this.departmentList = data
        console.log(data)
        data.forEach((item) => { console.log(item.deptName + item.deptId) })
      })
    }
  },
  created () {
    this.userConfigBusinessType()
    this.getDepts()
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.isShowloginPwd = false
      this.form.userId = this.editId
      this.getEditData()
    } else {
      this.title = '新增'
    }
  }
}
</script>
