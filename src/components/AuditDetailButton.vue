<template>
  <div>
    <ActionList :actions="actions" :target="this"></ActionList>
    <el-dialog title="审核" :visible.sync="auditDialog" width="30%">
      <span>
        <el-form
          :model="auditForm"
          status-icon
          :rules="auditFormRule"
          ref="auditForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="审核意见" prop="auditFlag">
            <el-radio v-model="auditForm.auditFlag" label="4">通过</el-radio>
            <el-radio v-model="auditForm.auditFlag" label="5">打回</el-radio>
          </el-form-item>
          <el-form-item label="意见说明" prop="auditDesc">
            <el-input type="textarea" :rows="2" placeholder="请输入意见说明" v-model="auditForm.auditDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAuditMessage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ActionList } from 'admin-toolkit'
export default {
  components: {
    ActionList
  },
  props: {
    id: Number, //自增ID
    version: String, //版本
    type: String, //资源类型，block推荐位
    status: Number, // 获取权限按钮组的审核状态
    menuElId: String //菜单elId
  },
  data() {
    return {
      actions: {
        // audit: {
        //   type: 'primary',
        //   text: '审核'
        // },
        // unaudit: {
        //   text: '撤销审核'
        // }
      },
      auditDialog: false,
      auditForm: {
        auditFlag: '4' , //审核状态
        auditDesc: '' //审核描述
      },
      auditFormRule: {
        auditDesc: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitAuditMessage() {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.$service
            .auditTask({
              id: this.id,
              version: this.version,
              type: this.type,
              auditFlag: this.auditForm.auditFlag,
              auditDesc: this.auditForm.auditDesc
            })
            .then(data => {
              alert(data)
            })
        }
      })
    },
    getAuditDetailButton() {
      let params = {
        resourceId: this.id,
        version: this.version,
        type: this.type,
        status: this.status,
        menuElId: this.menuElId
      }
      this.$service.getAuditDetailButton(params).then(data => {
        let action = {}
        data.forEach(v => {
          if (v.runComm !== 'claim' && v.runComm !== 'unclaim') {
             action[v.runComm] = { text: v.runName , type: 'primary'}
          }
        })
        this.actions = action
      })
    },
    audit() {
      //审核
      this.auditDialog = true
    },
    unaudit() {
      if (window.confirm('真的要撤销审核吗？')) {
        this.$service
          .revokedAudit({
            id: this.id,
            version: this.version,
            type: this.type
          })
          .then(data => {
            alert(data)
          })
      }
    }
  },
  created() {
   this.getAuditDetailButton()
  }
}
</script>

