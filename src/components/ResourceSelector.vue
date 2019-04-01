<template>
  <RemoteSelect
    ref="selector" 
    :title="title" 
    customClass="container" 
    @select-end="confirmClick"
    :showSelection="false"
    :showClearSelectionBtn="false"
  >
    <el-tabs v-model="currentTab">
      <el-tab-pane label="影视中心" name="vedio">
        <MovieFilter
          :muti="muti"
          v-model="selectAll.vedio"
          :partner="pannelResourceNew"
          :disable-partner="disablePartner"
          @partnerChange="pannelResourceNew=$event"
        ></MovieFilter>
      </el-tab-pane>
      <el-tab-pane label="教育中心" name="edu">
        <EduFilter 
           :muti="muti"
           v-model="selectAll.edu"
        ></EduFilter>
      </el-tab-pane>
      <el-tab-pane label="直播资源" name="live">
        <LiveFilter 
           :muti="muti"
           v-model="selectAll.live"
        ></LiveFilter>
      </el-tab-pane>
      <el-tab-pane label="专题资源" name="topics">
        <TopicsFilter 
           :muti="muti"
           v-model="selectAll.topics"
        ></TopicsFilter>
      </el-tab-pane>
      <el-tab-pane label="轮播频道" name="broadcast">
        <BroadcastFilter 
          :muti="muti"
          v-model="selectAll.broadcast"
        ></BroadcastFilter>
      </el-tab-pane>
    </el-tabs>
  </RemoteSelect>
</template>

<script>
import MovieFilter from './MovieFilter'
import BroadcastFilter from './BroadcastFilter'
import EduFilter from './EduFilter'
import LiveFilter from './LiveFilter'
import TopicsFilter from './TopicsFilter'
import _ from 'gateschema'
import { RemoteSelect, ContentWrapper, Table } from 'admin-toolkit'
import { filter } from 'minimatch';
export default {
  components: {
    RemoteSelect,
    ContentWrapper,
    Table,
    BroadcastFilter,
    MovieFilter,
    EduFilter,
    LiveFilter,
    TopicsFilter
  },

  props: {
    title: String,
    muti: String
  },

  watch: {
  },

  data() {
    return {
      currentTab: 'vedio',
      disablePartner: true,
      selectAll: {},
      selected: null,
      pannelResourceNew: ''
    }
  },

  methods: {
    confirmClick: function() {
      if(!this.selectAll){
        this.$refs.selector.showDialog = true
        this.$message('请选择一条记录')
      }
      if(this.muti === 'single'){
        const { currentTab, selectAll } = this
        this.selected = selectAll[currentTab]
        this.$emit('input', this.selected)
      }else{
        this.$emit('input', this.selectAll)
      }
    }
    
  },
  created() {

  },
  mounted: function () {
    switch (this.pannelResource) {
        case 'o_tencent':
            this.pannelResourceNew = 'tencent';
            this.disablePartner = true
            break;
        case 'o_iqiyi':
            this.pannelResourceNew = 'yinhe';
            this.disablePartner = true
            break;
        case 'o_voole':
            this.pannelResourceNew = 'voole';
            this.disablePartner = true
            break;
        default:
            this.pannelResourceNew = 'tencent';
            this.disablePartner = false
    }
  },
}
</script>

<style lang='stylus' scoped>
.container >>> .content-list .filter-form .el-form, .content-list
  justify-content center
</style>