<template>
  <div class="operate-box__head">
    <div class="operate-box__version" v-if="isShowHistory">
      <span>版本：</span>
      <el-select style="width:300px" v-model="currentVersion" @change="changeVersion">
        <el-option
          v-for="(item, index) in historyList"
          :key="index"
          :label="item.label"
          :value="item.value"
        >{{item.label}}</el-option>
      </el-select>
    </div>
    <div class="operate-box__status">{{statusName}}</div>
  </div>
</template>
<script>
export default {
  props: {
    id: Number,
    type: String,
    initialStatus: Number // 无历史版本的初始状态
  },

  data() {
    return {
      isShowHistory: true,
      historyList: [],
      currentVersion: ''
    }
  },

  computed: {
    statusName() {
      return this.$numToAuditStatus(
        this.currentVersion === ''
          ? this.initialStatus
          : parseInt(this.currentVersion.split('_')[1])
      )
    }
  },

  methods: {
    changeVersion(versionAndStatus) {
      versionAndStatus = versionAndStatus.split('_')
      this.$emit('change', {
        version: versionAndStatus[0],
        status: parseInt(versionAndStatus[1])
      })
    },
    getHistoryList() {
      return this.$service
        .getHistoryList({ id: this.id, type: this.type })
        .then(data => {
          if (data.total === 0) {
            this.isShowHistory = false
          } else {
            this.isShowHistory = true
            data.rows.forEach(row => {
              if (row.status === this.initialStatus) {
                this.currentVersion = row.version + '_' + row.status
              }
              let label =
                row.version +
                '/' +
                row.lastUpdateDate +
                '/' +
                row.modifierName +
                '/' +
                this.$numToAuditStatus(parseInt(row.status))
              this.historyList.push({
                label: label,
                value: row.version + '_' + row.status
              })
            })
          }
        })
    }
  },
  created() {
    this.getHistoryList().then(() => {
      this.$emit('getHistoryList', this.historyList)
    })
  }
}
</script>

<style lang='stylus' scoped>
.operate-box__head
  margin-bottom: 20px
.operate-box__status
  display: inline-block
  width: 120px
  height: 30px
  line-height: 30px
  padding: 0 5px
  background: #4fc71b
  color: #fff
  text-align: center
.operate-box__version
  display: inline-block
  margin-right: 10px
</style>