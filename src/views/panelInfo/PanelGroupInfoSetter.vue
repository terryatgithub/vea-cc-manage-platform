<template>
  <div>
    <el-dialog
        title="设置版块组信息"
        :visible.sync="showDialog"
        :close-on-click-modal="true"
        @close="handleSetCancel">
        <el-form @keypress.enter.native.stop.prevent="handleSetEnd" ref="form" label-width="140px" :model="info" :rules="rules">
          <el-form-item label="标题" prop="title">
            <el-input :disabled="mode === 'read'"  v-model="info.title" clearable />
          </el-form-item>
          <template v-if="focusConfig === 'timeSlot'">
            <el-form-item label="时间段" class="time-slot" prop="startTime">
              <el-form-item label="">
                <el-date-picker
                  class="start-time"
                  :disabled="mode === 'read'"
                  v-model="info.startTime"
                  type="datetime">
                </el-date-picker>
              </el-form-item>
              -
              <el-form-item label="">
                <el-date-picker
                  class="end-time"
                  :disabled="mode === 'read'"
                  v-model="info.endTime"
                  type="datetime">
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="" prop="panelIsFocus">
              <el-checkbox :disabled="mode === 'read'" :value="!!info.panelIsFocus" @input="info.panelIsFocus = $event ? 1 : 0">空时间段默认落焦</el-checkbox>
            </el-form-item>
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleSetCancel">取 消</el-button>
          <el-button type="primary" @click="handleSetEnd">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showDialog: true,
      timeSlotError: '',
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题'
          }
        ],
        startTime: [
          {
            validator: this.timeSlotValidator.bind(this)
          }
        ]
      }
    }
  },
  props: ['mode', 'info', 'panelList', 'focusConfig'],
  methods: {
    handleSetCancel () {
      this.$emit('set-cancel')
    },
    handleSetEnd () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('set-end')
        } else {
          this.$message({
            type: 'error',
            message: '请把表单填写完整'
          })
        }
      })
    },
    timeSlotValidator (rule, _, cb) {
      const panelList = this.panelList
      const info = this.info
      const currentIndex = info.index
      let length = panelList.length
      let duplicatedIndex
      let duplicatedSlot
      const currentStart = info.startTime
      const currentEnd = info.endTime
      if (currentStart && currentEnd) {
        if (currentStart >= currentEnd) {
          return cb(Error('开始时间必须小于结束时间'))
        }
        while (--length >= 0) {
          if (length !== currentIndex) {
            const panel = panelList[length]
            const start = panel.startTime
            const end = panel.endTime
            if (start && (
              (currentStart <= start && currentEnd >= start) ||
              (start <= currentStart && end >= currentStart)
            )) {
              duplicatedIndex = length
              duplicatedSlot = start.toISOString() + '-' + end.toISOString()
              break
            }
          }
        }
      } else {
        if (currentStart && !currentEnd) {
          return cb(Error('请设置结束时间'))
        }
        if (currentEnd && !currentStart) {
          return cb(Error('请设置开始时间'))
        }
        if (info.panelIsFocus !== 1) {
          return cb(Error('时间段和空时间段默认落焦至少设置一个'))
        }
      }

      if (duplicatedIndex !== undefined) {
        cb(Error('与第 ' + (duplicatedIndex + 1) + ' 个分组的时间段 ' + duplicatedSlot + ' 重合'))
      } else {
        cb()
      }
    }
  }
}
</script>
<style scoped>
.time-slot .el-form-item {
  display: inline-block;
}
.time-slot .el-date-editor.el-input {
  width: 220px
}
</style>
