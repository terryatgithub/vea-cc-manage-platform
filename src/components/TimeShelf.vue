<template>
  <div class="cc-time-shelf">
    <custom-dialog
      class="custom-dialog-wrapper"
      :options="dialog"
      :closefn="closeDlg"
      v-if="visible"
    >
      <div slot="dialogContent">
        <el-form ref="submitForm" :model="submitForm" :rules="submitRules" label-width="100px">
          <el-form-item label="是否定时">
            <el-radio-group v-model="submitForm.isTiming">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设定时间" v-if="submitForm.isTiming" prop="releaseTime">
            <el-date-picker
              v-model="submitForm.releaseTime"
              type="datetime"
              :clearable="false"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="dialogFooter" class="dialog-footer">
        <el-button type="primary" @click="judgeTask" size="small">确 定</el-button>
        <el-button size="small" @click="closeDlg">取 消</el-button>
      </div>
    </custom-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: {
        visible: true,
        title: '提交审核',
        size: 'small'
      },
      submitForm: {
        isTiming: 0,
        releaseTime: null
      },
      pickerOptions: {
        disabledDate: function(time) {
          // 限定时间为1-15天
          var oneDay = 24 * 60 * 60 * 1000
          var fifteenDays = oneDay * 15
          return (
            time.getTime() <= Date.now() - oneDay ||
            time.getTime() >= Date.now() + fifteenDays
          )
        }
      },
      submitRules: {
        releaseTime: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ]
      }
    }
  },
  props: ['visible'],
  methods: {
    judgeTask: function() {
      var _this = this
      this.$refs.submitForm.validate(function(valid) {
        if (valid) {
          var isTiming = _this.submitForm.isTiming
          if (isTiming) {
            // 设置了定时
            _this
              .ccAjax({
                url: $basePath + '/v1/timedTask/taskLimit.html'
              })
              .done(function(result) {
                if (result.code === '0') {
                  _this.submitTask()
                } else {
                  _this.$message({
                    type: 'error', // 删除成功时提示成功 删除失败时提示失败
                    message: result.msg
                  })
                }
              })
          } else {
            // 未设置定时
            _this.submitTask()
          }
        } else {
          return false
        }
      })
    },
    submitTask: function() {
      this.$emit('submit', {
        isTiming: this.submitForm.isTiming,
        releaseTime:
          this.submitForm.releaseTime &&
          this.submitForm.releaseTime.format('yyyy-MM-dd hh:mm:ss')
      })
    },
    closeDlg: function() {
      this.$emit('close')
    }
  }
}
</script>
