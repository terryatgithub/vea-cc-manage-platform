<template>
  <el-row style="margin:auto">
    <el-col :span="6" :offset="9" class="login-form">
      <el-col class="login-logo">
        <img src="@/assets/logo.png">
      </el-col>
      <GateSchemaForm ref="loginForm" :schema="formSchema" v-model="user" @submit="handleLogin"></GateSchemaForm>
      <div id="verifyCode">
        <el-input v-model="user.valicode" placeholder="验证码"></el-input>
        <img :src="codeUrl" alt="验证码" @click="updateValicode">
      </div>
      <el-button class="login-form__btn" type="primary" @click="$refs.loginForm.handleSubmit()">登 录</el-button>
    </el-col>
    <div id="container" style="width:100%;height:700px;">
      <div id="anitOut"></div>
    </div>
  </el-row>
</template>
<script>
import { loginRedbg } from "../assets/loginRedbg.js";
import _ from "gateschema";
import { setTimeout } from 'timers';
const schema = _.map({
  username: _.required.$msg("请输入登录名").string.other("form", {
    placeholder: "登录名"
  }),
  password: _.required.$msg("请输入密码").string.other("form", {
    placeholder: "密码",
    type: "password"
  })
}).other("form", {
  cols: {
    label: 0,
    wrapper: 24
  }
});
export default {
  data() {
    return {
      user: {
        username: "yuanjunnan",
        password: "yuanjunnan@yjn@",
        valicode: ""
      },
      codeUrl: "captcha.jpg"
    };
  },
  components: {
  },
  computed: {
    formSchema() {
      return this.schema || schema;
    }
  },
  props: ["schema"],
  methods: {
    createCav() {
      if (
        !window.ActiveXObject &&
        !!document.createElement("canvas").getContext
      ) {
      }
    },
    handleLogin(err) {
      if (err.length === 0) {
        this.$login(this.user).then(data => {
          /**
           * 得到菜单路由
           */
            this.$router.push({
              path: this.$route.query.redirect || "/"
            });

        });
      }
    },
    updateValicode() {
      this.codeUrl += "?_=" + new Date().getTime();
    }
  },
  created: function() {
    loginRedbg();
  }
};
</script>
<style lang="stylus">
.login-form
  position: absolute
  top: 50%
  left: 50%
  margin-top: -180px
  margin-left: -238px
.login-form__btn
  width: 100%
.login-form .el-row
  margin: auto
.el-form .sf-item
  margin-bottom: 30px
.login-logo
  text-align: center
  padding-bottom: 40px
.login-logo img
  width: 80%
.login-form .el-input__inner
  height: 50px
  background-color: rgba(0, 0, 0, 0.2)
  border: 0
  padding: 0
  line-height: 50px
  text-indent: 20px
  font-size: 24px
  color: #eee
  outline: none
  border-radius: 8px
  -moz-border-radius: 8px
  -webkit-border-radius: 8px
  -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1) inset
  -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1) inset
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1) inset
.login-form .login-form__btn
  height: 50px
  background: #ffaa23
  border-color: #ffaa23
#verifyCode
  display: flex
  margin-bottom: 30px
  img
    margin-left: 10px
</style>

