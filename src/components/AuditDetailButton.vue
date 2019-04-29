<template>
  <div>
    <ActionList :actions="actions" :target="this" class="actions"></ActionList>
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
        <el-button type="primary" @click="submitAuditMessage">确 定</el-button>
         <el-button @click="auditDialog = false">取 消</el-button>
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
    version: {
      type: String,
      default: ''
    }, //版本
    type: String, //资源类型，block推荐位
    status: Number, // 获取权限按钮组的审核状态
    menuElId: String, //菜单elId
    notContainBtn: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    version: function(newV, oldV) {
      this.getAuditDetailButton()
    }
  },
  data() {
    return {
      actions: {},
      auditDialog: false,
      auditForm: {
        auditFlag: '4', //审核状态
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
            .auditTask(
              {
                id: this.id,
                version: this.version,
                type: this.type,
                auditFlag: this.auditForm.auditFlag,
                auditDesc: this.auditForm.auditDesc
              },
              '保存成功'
            )
            .then(data => {
              this.auditDialog = false
              this.$emit('open-list-page')
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
      let p1 = this.$service.getHistoryList({ id: this.id, type: this.type }) //要实时查看是否显示创建副本按钮
      let p2 = this.$service.getAuditDetailButton(params)
      Promise.all([p1,p2]).then((result)=> {
        let data1 = result[0].rows
        let hasCopy = true
        data1 === null ? data1 = [] : ''
        data1.forEach((e) => {
          if (parseInt(e.status) === 2 || parseInt(e.status) === 3) {
                hasCopy = false
                return false
          }
        })
        if(!hasCopy) {
          this.notContainBtn.push('copy');//不能创建副本
        }
        let data2 = result[1]
        let action = {}
        data2.forEach(v => {
          if (this.notContainBtn.indexOf(v.runComm) < 0) {
            action[v.runComm] = { text: v.runName, type: 'primary' }
          }
        })
        this.actions = action
      }) 
    },
    edit() {
      this.$emit('go-edit-Page')
    },
    delete() {
      this.$emit('delete-item')
    },
    audit() {
      //审核
      this.auditDialog = true
    },
    unaudit() {
      if (window.confirm('真的要撤销审核吗？')) {
        this.$service
          .revokedAudit(
            {
              id: this.id,
              version: this.version,
              type: this.type
            },
            '撤销成功'
          )
          .then(data => {
            this.auditDialog = false
          })
      }
    },
    // 创建副本
    copy() {
      this.$emit('copy')
    },
    // 上架
    shelves() {
      let params = {
        id: this.id,
        version: this.version,
        type: this.type
      }
      this.$service.putShelves(params, '上架成功').then(() => {
        this.$emit('open-list-page')
      })
    }
  },
  created() {
    this.getAuditDetailButton()
  }
}
</script>
<style lang="stylus" scoped>
.actions
  justify-content: center
</style>


