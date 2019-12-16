<template>
  <div>
    <template v-for="(item, index) in buttons">
      <el-button
        v-if="item.runComm !== 'copy' || options.isAllowCopy"
        :key="index"
        :disabled="item.runComm === 'claim' || item.runComm === 'unclaim'"
        :type="warningButtons.indexOf(item.runComm) > -1 ? 'warning' : 'primary'"
        @click="$emit(item.runComm)"
      >
        {{ item.runName }}
      </el-button>
    </template>
    <el-button type="warning" @click="$emit('second-audit')" v-if="options.isNeedSecondAudit">
        二次审核
    </el-button>
    <el-button type="warning" @click="$emit('cancel-timing')" v-if="options.isAllowCancelTiming">
        取消定时
    </el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      buttons: [],
      warningButtons: ['delete', 'unclaim', 'unaudit', 'copy']
    }
  },
  props: ['resourceInfo', 'options'],
  methods: {
    getButtons () {
      const idPrefix = this.$consts.idPrefix
      const { id, version, type, status, menuElId } = this.resourceInfo
      if (idPrefix !== '10' && id.toString().substr(0, 2) !== idPrefix) {
        // 非现网环境 && 前缀不符的情况下，不返回任何权限按钮
        return
      }
      const params = {
        resourceId: id,
        version,
        type,
        status,
        menuElId
      }
      this.$service.getAuditDetailButton(params).then(data => {
        this.buttons = data
      })
    }
  },
  created () {
    this.$watch('resourceInfo', this.getButtons, {
      immediate: true
    })
  }
}
</script>

<style>

</style>
