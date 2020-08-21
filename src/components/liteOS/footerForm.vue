<template>
  <div>
    <el-form ref="footerForm" :model="footerForm" class="footerEdit">
      <el-form-item label="指定设备">
        <el-input
          placeholder="DeviceID,多个用逗号隔开"
          v-model="footerForm.DeviceID"
          clearable
          maxlength="99"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="success" @click="create">
        确认
      </el-button>
      <el-button @click="cancel">
        取消
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      footerForm: {
        DeviceID: ''
      }
    }
  },
  methods: {
    create () {
      this.$emit('create', this.footerForm.DeviceID)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss">
.footerEdit {
  border-bottom: 2px solid #e4e7ed;
  .el-form-item {
    .el-form-item__label {
      width: 90px;
      text-align: left;
    }
    .el-form-item__content {
      width: 200px;
      display: inline-block;
    }
  }
}
</style>
