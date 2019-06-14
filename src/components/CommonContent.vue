<template>
  <div class="common-content">
    <template v-if="mode !== 'read'">
      <div v-if="mode === 'copy'">
        <VersionList 
          type="resourceInfo.type" 
          :status="resourceInfo.status"
          :version="resourceInfo.version" 
          :version-list="versionList"
          @select-version="$emit('select-version', $event)"
        />
        <slot name="copy-confirm">
          <div>
            <el-button type="primary" @click="$emit('copy')">确认复制</el-button>
          </div>
        </slot>
      </div>
      <div v-else>
        <slot name="auditAndDraft">
          <el-button type="primary" @click="$emit('submit-audit')">提交审核</el-button>
          <el-button type="warning" @click="$emit('save-draft')">保存草稿</el-button>
        </slot>
      </div>
      <ReleaseTimeSetter 
        v-if="showReleaseTimeSetter" 
        @cancel="showReleaseTimeSetter = false"
        @submit="handleSubmitWithReleaseTime"
      />
      <slot />
    </template>
    <template v-else>
        <content-auth-manager 
          v-if="resourceInfo.id && resourceInfo.menuElId" 
          :resource-id="resourceInfo.id" 
          :menu-elid="resourceInfo.menuElId"
          :resource-type="resourceInfo.type"/>
        <div>
          <div class="release-info" v-if="releaseTime">
            该版块为定时任务，审核通过后将于 {{ releaseTime }} 上线
          </div>
          <VersionList 
            type="resourceInfo.type" 
            :status="resourceInfo.status"
            :version="resourceInfo.version" 
            :version-list="versionList"
            @select-version="$emit('select-version', $event)"
          />

          <ContentButtonGroup 
            v-if="resourceInfo.id"
            :resource-info="resourceInfo" 
            :options="buttonGroupOptions"
            @copy="$emit('replicate')"
            @edit="$emit('edit')"
            @unaudit="handleUnAudit"
            @audit="handleAuditStart"
            @shelves="handleShelves"
            @delete="handleDelete"
            @cancel-timing="handleCancelTiming"
          />

          <!-- <cc-button-group
              :url="urls.tools"
              :params="buttonGroupParams"
              :options="{isAllowCopy: isAllowCopy, isAllowCancelTiming: false}"
              @edit="handleEdit"
              @delete="handleDelete"
              @audit="showAuditDialog = true"
              @unaudit="handleUnAudit"
              @copy="handleCreateReplica"
              @shelves="handleShelves"
          >
          </cc-button-group> -->
        </div>
        <slot></slot>
        <AuditHistory :data="auditHistoryList" />
        <el-dialog title="审核" :visible.sync="showAuditDialog">
          <el-form
            :model="auditForm"
            status-icon
            :rules="auditFormRule"
            ref="auditForm"
            label-width="100">
            <el-form-item label="审核意见" prop="auditFlag">
              <el-radio v-model="auditForm.auditFlag" label="4">通过</el-radio>
              <el-radio v-model="auditForm.auditFlag" label="5">打回</el-radio>
            </el-form-item>
            <el-form-item label="意见说明" prop="auditDesc">
              <el-input type="textarea" :rows="2" placeholder="请输入意见说明" v-model="auditForm.auditDesc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showAuditDialog = false">取 消</el-button>
            <el-button type="primary" @click="handleAuditEnd">确 定</el-button>
          </div>
        </el-dialog>

    </template>

  </div>
</template>

<script>
import VersionList from '@/components/VersionList'
import AuditHistory from '@/components/AuditHistory'
import ContentButtonGroup from '@/components/ContentButtonGroup'
import ReleaseTimeSetter from '@/components/ReleaseTimeSetter'
import ContentAuthManager from '@/components/ContentAuthManager'
export default {
  components: {
    ContentAuthManager,
    VersionList,
    ContentButtonGroup,
    AuditHistory,
    ReleaseTimeSetter
  },
  data() {
    return {
      showReleaseTimeSetter: false,
      showAuditDialog: false,
      releaseTime: undefined,
      versionList: [],
      auditHistoryList: [],
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
  props: {
    mode: String,
    resourceInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    validateMethod: {
      type: Function
    },
  },
  watch: {
    resourceInfo: 'handleResourceChange'
  },
  computed: {
    buttonGroupOptions() {
      const { draft, waiting, rejected, processing, waiting2 } = this.$consts.status
      const isAllowCopy = !this.versionList.some(function(item) {
        const status = item.row.status
        return status === draft || status === waiting || status === rejected
      })
      const currentVersionStatus = this.resourceInfo.status
      const isAllowCancelTiming = currentVersionStatus === processing
      const isNeedSecondAudit = currentVersionStatus === waiting2
      return {
        isAllowCopy,
        isNeedSecondAudit,
        isAllowCancelTiming,
      }
    }
  },
  methods: {
    handleSubmitWithReleaseTime(releaseTimeInfo) {
      this.showReleaseTimeSetter = false
      this.$emit('submit-audit', releaseTimeInfo)
    },
    handleDelete() {
      const { type, id, version } = this.resourceInfo
      this.$confirm('确认删除该版本吗?', '提示').then(() => {
        this.$service.deleteVersion({type,id,version}, '删除成功').then(() => {
          if (this.versionList.length === 0) {
             this.$emit('delete') // 当只有草稿一个版本时
          } else {
            const nextVersion = this.versionList.find((item) => {
              return item.value !== version
            }).value
            this.$emit('select-version', nextVersion)
          }
        })
      }).catch(() => {})
    },
    handleAuditStart() {
      this.showAuditDialog = true
    },
    handleAuditEnd() {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          const { id, version, type } = this.resourceInfo
          const { auditFlag, auditDesc } = this.auditForm
          this.$service.auditTask({
              id,
              version,
              type,
              auditFlag,
              auditDesc
          }, parseInt(auditFlag) === 4 ? '审核成功' : '打回成功')
            .then(data => {
               this.auditDialog = false
               this.$emit('audit')
            })
        }
      })
    },
    handleUnAudit() {
      const {id, version, type} = this.resourceInfo
      this.$confirm('您确定要撤销审核吗?', '提示')
        .then(() => {
          this.$service.revokeAudit({id, version, type}, '撤销审核成功').then(() => {
            this.$emit('unaudit')
          })
        })
        .catch(function() {})
    },
    handleShelves() {
      const { type, id, version } = this.resourceInfo
      this.$service.putOnShelves({ id, version, type }, '上架成功').then(() => {
        this.$emit('shelves')
      })
    },
    getHistoryList: function() {
      const { type, id, version } = this.resourceInfo
      if (id && version) {
        // 一些没版本的资源没有历史列表
        this.$service.getVersionList({ id, type }).then((result) => {
          this.versionList = result
        })
      } else {
        this.versionList = []
      }
    },
    getAuditHistoryList() {
      const { type, id, version } = this.resourceInfo
      if (id && version) {
        // 一些没版本的资源没有历史列表
        this.$service.getAuditHistoryList({ id, type, version }).then((result) => {
          this.auditHistoryList = result
        })
      } else {
        this.auditHistoryList = []
      }
    },
    getReleaseTime() {
      this.releaseTime = undefined
      const { type, id, version, status } = this.resourceInfo
      const { processing, waiting } = this.$consts.status
      if (id && version) {
        if (status === processing || status === waiting) {
          this.$service.getTimedTaskInfo({ id, type, version }).then((result) => {
            this.releaseTime = result.releaseTime
          })
        }
      }
    },
    handleCancelTiming() {
      this.$confirm('您确定取消定时吗?', '提示')
        .then(() => {
          const { type, id, version, status } = this.resourceInfo
          this.$service.timedTaskCancel({ id, type, version }).then((result) => {
            this.$emit('cancel-timing')
          })
        })
        .catch(() => {

        })
    },
    handleResourceChange() {
      this.getHistoryList()
      this.getAuditHistoryList()
      this.getReleaseTime()
    }
  },
  created() {
  }

}

</script>
<style lang="stylus" scoped>
.common-content >>> .selectItem .el-select
   width 450px 
.release-info
  margin-bottom 5px
  color #ccc
  font-size 14px
.common-content 
    >>> .el-input__inner,
    >>> .el-select
        max-width 450px
    >>> .el-input + .el-checkbox
    >>> .el-select + .el-checkbox
      margin-left 10px

</style>
