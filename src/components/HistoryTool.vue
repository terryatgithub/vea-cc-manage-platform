<template>
  <div class="operate-box">
    <div class="operate-box__head">
      <div class="operate-box__version" v-if="isShowHistory">
        <span>版本： </span>
        <el-select style="width:300px" v-model="currentVersion" @change="changeVersion">
          <el-option v-for="(item, index) in historyList" :key="index" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="operate-box__status">{{statusName}}</div> 
    </div>
    <!-- <el-button v-if="status === 0" type="primary">上架</el-button>
    <el-button v-if="status === 2 || status === 3 || status === 5" type="primary">审核</el-button>
    <el-button v-else type="warning">创建副本</el-button> -->
    <AuditDetailButton v-if="typeof(status)!== 'undefined'" :id="id" :type="type" :status="status" :menuElId="menuElid"/>
  </div>
</template>

<script>
import AuditDetailButton from './AuditDetailButton'
export default {
  components: {
    AuditDetailButton
  },

  props: {
    id: Number,
    type: String,
    initialStatus: Number, // 无历史版本的初始状态
    menuElid: String // 参见wiki菜单elid说明
  },

  data () {
    return {
      isShowHistory: true,
      historyList: [],
      currentVersion: '',
      statusOption: ['下架', '上架', '草稿', '待审核', '审核通过', '审核不通过'],
      status: undefined
    };
  },

  computed: {
    statusName() {
      if(this.historyList.length !== 0) {
        let label = this.historyList.find(item => {
          return item.value === this.currentVersion
        }).label
        let statusName = label.split("/")[3]
        this.status = this.statusOption.indexOf(statusName)
        return statusName
      }
      return this.statusOption[this.initialStatus]
    }
  },

  methods: {
    changeVersion(version) {
      this.$emit('change', version)
    }
  },
  created() {
    let historyList = this.historyList
    this.$service.getHistoryList({ id: this.id, type: this.type }).then(data => {
      if(data.total === 0){
        this.isShowHistory = false
        this.status = this.initialStatus
      }else {
        this.currentVersion = data.rows.find(item => {
          return item.status === this.initialStatus
        }).version
        data.rows.forEach(row => {
          let label = row.version + '/' + row.lastUpdateDate + '/' + row.modifierName + '/' + this.statusOption[row.status]
          historyList.push({'label': label, 'value': row.version})
        })
      }
    })
  }

}
</script>

<style lang='stylus' scoped>
.operate-box
  width 100%
  height 100px
  float fixed
  background-color #fff
.operate-box__head
  margin-bottom 20px
.operate-box__status
  display inline-block
  width 120px
  height 30px
  line-height 30px
  padding 0 5px
  background #4fc71b
  color #fff
  text-align center
.operate-box__version
  display: inline-block
  margin-right 10px
</style>