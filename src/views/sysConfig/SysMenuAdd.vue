<template>
<div>
  <ContentCard :title="title" @go-back="$emit('go-back')" v-if="!showIcon">
    <!--新增编辑界面-->
    <el-button type="primary" @click="submitBtn">保存</el-button>
    <div class="form-legend-header">
      <i class="el-icon-edit">基本信息</i>
    </div>
    <el-form :model="form" :rules="formRules" ref="form" label-width="160px" class="el-form-add">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="form.menuName" placeholder="菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="元素ID" prop="elid">
        <el-input v-model="form.elid" placeholder="元素ID"></el-input>
      </el-form-item>
      <el-form-item label="图标样式" prop="iconClass">
        <el-input v-model="form.iconClass" placeholder="图标样式" ></el-input>
        <el-button type="primary" plain @click="selectIcon" class="marginL">选择图标</el-button>
      </el-form-item>
      <el-form-item label="标签ID" prop="tabId">
        <el-input v-model="form.tabId" placeholder="标签ID"></el-input>
      </el-form-item>
      <el-form-item label="标签名称" prop="tabTitle">
        <el-input v-model="form.tabTitle" placeholder="标签名称"></el-input>
      </el-form-item>
      <el-form-item label="标签图标" prop="tabIcon">
        <el-input v-model="form.tabIcon" placeholder="标签图标"></el-input>
      </el-form-item>
      <el-form-item label="跳转地址URL" prop="iframeUrl">
        <el-input v-model="form.iframeUrl" placeholder="跳转地址URL"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seq">
        <el-input v-model="form.seq" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="菜单目录" prop="modle">
        <!-- <el-input v-model="form.modle"></el-input> -->
        <el-radio v-model="form.modle" :label="0">收起</el-radio>
        <el-radio v-model="form.modle" :label="1">展开</el-radio>
        <el-radio v-model="form.modle" :label="3">媒资菜单</el-radio>
      </el-form-item>
      <el-form-item label="是否禁用" prop="disabled">
        <el-radio v-model="form.disabled" label="0">否</el-radio>
        <el-radio v-model="form.disabled" label="1">是</el-radio>
      </el-form-item>
      <el-form-item label="菜单父ID" prop="pmid">
        <el-input v-model="form.pmid" placeholder="菜单父ID"></el-input>
      </el-form-item>
    </el-form>
  </ContentCard>
   <IconSelect v-if="showIcon" @get-icon="getIcon" title="选择图标" :isUseInitialIcon="true" @go-back="goBack"></IconSelect>
  </div>
</template>
<script>
import { IconSelect } from 'admin-toolkit'
export default {
  props: {
    editId: Number,
    default: null
  },
  components: {
    IconSelect
  },
  //  prop: ['editId'],
  data () {
    return {
      title: null,
      showIcon: false,
      form: {
        // menuId: null,
        menuName: null,
        elid: null,
        iconClass: null,
        tabId: null,
        tabTitle: null,
        tabIcon: null,
        iframeUrl: null,
        seq: null,
        modle: null,
        disabled: null,
        pmid: null,
        menuId: undefined
      },
      formRules: {
        // 表单规则
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        elid: [{ required: true, message: '请输入元素ID', trigger: 'blur' }],
        iconClass: [
          { required: true, message: '请输入图标样式', trigger: 'blur' }
        ],
        tabId: [{ required: false, message: '请输入标签ID', trigger: 'blur' }],
        tabTitle: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        tabIcon: [
          { required: true, message: '请输入标签图标样式', trigger: 'blur' }
        ],
        iframeUrl: [
          { required: true, message: '跳转地址URL', trigger: 'blur' }
        ],
        disabled: [{ required: true, message: '禁用', trigger: 'blur' }],
        seq: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        modle: [{ required: true, message: '请选择菜单目录', trigger: 'blur' }],
        pmid: [{ required: true, message: '请输入父菜单ID', trigger: 'blur' }]
      }
    }
  },
  methods: {
    selectIcon () {
      this.showIcon = true
    },
    goBack () {
      this.showIcon = false
    },
    getIcon (iconName, name) {
      this.form.iconClass = iconName
      this.showIcon = false
    },
    submitBtn () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service
            .saveSysMenu({ jsonStr: JSON.stringify(this.form) }, '保存成功')
            .then(() => {
              this.$emit('open-list-page')
            })
        }
      })
    },
    getEditData () {
      this.$service.editSysMenu({ id: this.editId }).then(data => {
        Object.keys(this.form).forEach(v => {
          if (v === 'disabled') {
            this.form[v] = data[v] + ''
          } else {
            this.form[v] = data[v]
          }
        })
      })
    }
  },
  created () {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.form.menuId = this.editId
      this.getEditData()
    } else {
      this.title = '新增'
    }
  }
}
</script>
