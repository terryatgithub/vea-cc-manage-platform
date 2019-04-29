<template>
  <el-dialog
    :visible.sync="showDialog" 
  >
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
                value-format="yyyy-MM-dd hh:mm:ss"
            >
            </el-date-picker>
        </el-form-item>
    </el-form>
    <div slot="footer">
        <el-button type="primary" @click="judgeTask" size="small">确 定</el-button>
        <el-button size="small" @click="$emit('cancel')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
    data: function () {
        return {
            showDialog: true,
            submitForm: {
                isTiming: 0,
                releaseTime: undefined
            },
            pickerOptions: {
                disabledDate: function (time) { // 限定时间为1-15天
                    var oneDay = 24 * 60 * 60 * 1000;
                    var fifteenDays = oneDay * 15;
                    return time.getTime() <= Date.now() - oneDay || time.getTime() >= Date.now() + fifteenDays;
                }
            },
            submitRules: {
                releaseTime: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        judgeTask() {
            this.$refs.submitForm.validate((valid) => {
                if (valid) {
                    const isTiming = this.submitForm.isTiming
                    if (isTiming) { // 设置了定时
                        this.$service.getTimedTaskLimit().then(this.submitTask)
                    } else { // 未设置定时
                        this.submitTask()
                    }
                } 
            })
        },
        submitTask() {
          this.$emit('submit', {
            isTiming: this.submitForm.isTiming,
            releaseTime: this.submitForm.releaseTime 
          })
        }
    }
}
</script>