<template>
  <el-row style="margin:auto">
    <el-col :span="6" :offset="9" class="login-form">
      <div class="log_center">
        <div class="log_bj">
          <div class="log_logo">
            <img v-if="$consts.idPrefix == '11'" src="@/assets/logo-jscn.png">
            <img v-else src="@/assets/logo-coocaa.png">
            <span>内容运营平台</span>
          </div>
          <div class="log-box">
            <div id="accout">
              <el-row>
                <el-col :span="11">
                  <el-button :class="{active:isNormalActive}" @click="changAccoutType('normal')">普通账号</el-button>
                </el-col>
                <el-col :span="11" :offset="2">
                  <el-button :class="{active:isDomainActive}" @click="changAccoutType('domain')">域账号</el-button>
                </el-col>
              </el-row>
            </div>
            <GateSchemaForm @keypress.enter.native="$refs.loginForm.handleSubmit()" ref="loginForm" :schema="formSchema" v-model="user" @submit="handleLogin"></GateSchemaForm>
            <!-- <div id="verifyCode">
              <el-input v-model="user.valicode" placeholder="验证码" @keyup.native="keyupSubmit"></el-input>
              <img :src="codeUrl" alt="验证码" @click="updateValicode">
            </div> -->
            <el-button class="login-form__btn" type="primary" @click="$refs.loginForm.handleSubmit()">登 录</el-button>
          </div>
        </div>
      </div>
    </el-col>
    <div id="container" style="width:100%;height:700px;">
      <div id="anitOut"></div>
    </div>
  </el-row>
</template>
<script>
import { loginRedbg } from '../assets/loginRedbg.js'
import _ from 'gateschema'
const schema = _.map({
  username: _.required.$msg('请输入登录名').string.other('form', {
    placeholder: '登录名'
  }),
  password: _.required.$msg('请输入密码').string.other('form', {
    placeholder: '密码',
    type: 'password'
  })
}).other('form', {
  cols: {
    label: 0,
    wrapper: 24
  }
})
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
        // valicode: ''
      },
      codeUrl: 'captcha.jpg',
      isNormalActive: true,
      isDomainActive: false
    }
  },
  components: {},
  computed: {
    formSchema () {
      return this.schema || schema
    }
  },
  props: ['schema'],
  methods: {
    keyupSubmit (event) {
      if (event.keyCode === 13) {
        this.$refs.loginForm.handleSubmit()
      }
    },
    changAccoutType (type) {
      if (type === 'normal') {
        this.isNormalActive = true
        this.isDomainActive = false
      } else {
        this.isNormalActive = false
        this.isDomainActive = true
      }
    },
    createCav () {
      if (
        !window.ActiveXObject &&
        !!document.createElement('canvas').getContext
      ) {
      }
    },
    handleLogin (err) {
      if (err.length === 0) {
        if (this.isDomainActive) {
          this.user.ldapName = this.user.username
          delete this.user.username
        } else {
          delete this.user.ldapName
        }
        if (window.localStorage) {
          window.localStorage.setItem(
            'loginType',
            this.isDomainActive ? 'domain' : 'normal'
          )
        }
        this.$login(this.user).then(
          data => {
            console.log('redirect=' + this.$route.query.redirect)
            this.$router.push({
              path: this.$route.query.redirect || '/desktop'
            })
          },
          () => {
            if (this.isDomainActive) {
              this.user.username = this.user.ldapName
            }
          }
        )
      }
    },
    updateValicode () {
      this.codeUrl += '?_=' + new Date().getTime()
    }
  },
  created: function () {
    loginRedbg()
    const loginType = window.localStorage.getItem('loginType')
    this.changAccoutType(loginType === 'domain' ? 'domain' : 'normal')
  }
}
</script>
<style lang="stylus" scoped>
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
  background: #ea5d0f
  border-color: #ea5d0f
  font-size: 20px
#verifyCode
  display: flex
  margin-bottom: 30px
  img
    margin-left: 10px
#accout
  margin-bottom: 20px
#accout
  >>> .el-button
    width: 100%
#accout .active
  color: red
.log_center
  width 430px
  height 270px
  position fixed
  left 50%
  top 50%
  display inline-block
  margin-top -250px
  margin-left -200px
  z-index 2
.log_logo
  width 100%
  text-align center
  margin-bottom 30px
.log_logo img
  width 80%
.log_logo span
  display block
  color #000
  font-size 18px
  line-height 40px
.log_bj
  width 430px
  background #fff
  border-radius 9px
  opacity 0.9
  padding-top 30px
  padding-bottom 30px
.log-box
  padding 0 30px
</style>
