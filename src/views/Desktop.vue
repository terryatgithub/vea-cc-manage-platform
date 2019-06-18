<template>
  <div>
    <div v-if="mode===undefined">
      <h3 style="margin-top: 20px">待处理任务</h3>
      <div class="list">
        <div>
          <el-card class="box-card" style="cursor: pointer;">
            <div @click="goTo('myDrafts','我的草稿')">
              <img src="../assets/images/draft.png" class="cod-img">
              <div class="text-wrap">
                <span class="text">我的草稿</span>
                <span class="text-num">({{draftNum}})</span>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <el-card class="box-card" style="cursor: pointer;">
            <div @click="goTo('submitTask', '我提交的任务')">
              <img src="../assets/images/submit.png" class="cod-img">
              <div class="text-wrap">
                <span class="text">我提交的任务</span>
                <span class="text-num">({{submitNum}})</span>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <el-card class="box-card" style="cursor: pointer;">
            <div @click="goTo('reviewTask', '我的审核任务')">
              <img src="../assets/images/audit.png" class="cod-img">
              <div class="text-wrap">
                <span class="text">我的审核任务</span>
                <span class="text-num">({{auditNum}})</span>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <el-card class="box-card" style="cursor: pointer;">
            <div @click="goTo('movie', '下架影片')">
              <img src="../assets/images/movie.png" class="cod-img">
              <div class="text-wrap">
                <span class="text">下架影片</span>
                <span class="text-num">({{movieNum}})</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <ContentCard :title="title" @go-back="goBack" v-if="mode!==undefined&&mode!=='panelInfo'">
      <MyDraftsIndex v-if="mode==='myDrafts'"></MyDraftsIndex>
      <MySubmitTasksIndex v-if="mode==='submitTask'"></MySubmitTasksIndex>
      <MyReviewTasksIndex v-if="mode==='reviewTask'"></MyReviewTasksIndex>
      <DownMovie v-show="mode==='movie'" @read="read"></DownMovie>
    </ContentCard>
    <PanelInfo 
        v-if="mode==='panelInfo'"
      :id="id" 
      :panel-data-type="1"
      :init-mode="'read'"
      :version="version"
      class="PanelInfo"
      @go-back="mode='movie'">
    </PanelInfo>
  </div>
</template>
<script>
import MyDraftsIndex from './todoTask/MyDraftsIndex'
import ContentCard from '@/components/ContentCard'
import MySubmitTasksIndex from './todoTask/MySubmitTasksIndex'
import MyReviewTasksIndex from './todoTask/MyReviewTasksIndex'
import DownMovie from './DownMovie'
import PanelInfo from './panelInfo/PanelInfo'
export default {
  components: {
    MyDraftsIndex,
    ContentCard,
    MyReviewTasksIndex,
    MySubmitTasksIndex,
    DownMovie,
    PanelInfo
  },
  data() {
    return {
      draftNum: null,
      movieNum: null,
      auditNum: null,
      submitNum: null,
      mode: undefined,
      title: undefined,
      id: undefined,
      version: undefined
    }
  },
  methods: {
    read(id, version){
      this.mode = 'panelInfo'
      this.id = id
      this.version = version
    },
    goTo(mode, title) {
      this.mode = mode
      this.title = title
    },
    goBack() {
      this.mode = undefined
    }
  },
  created() {
    this.$service.getTotal('myDrafts').then(data => {
      this.draftNum = data
    })
    this.$service.getTotal('mySubmittedTasks').then(data => {
      this.submitNum = data
    })
    this.$service.getTotal('myAuditTasks').then(data => {
      this.auditNum = data
    })
    this.$service.getTotal('msn').then(data => {
      this.movieNum = data
    })
  }
}
</script>
<style lang="stylus" scoped>
.list
  display: flex
  >div
    margin-right: 10px
  .text-num
    color: red
img
  display: block
  margin: auto
.text-wrap
  margin-top: 15px
</style>


