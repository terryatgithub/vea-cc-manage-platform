<template>
  <RemoteSelect
    ref="selector" 
    :title="title" 
    customClass="container" 
    @select-end="confirmClick"
    :showSelection="false"
    :showClearSelectionBtn="false"
  >
    <el-tabs value="vedio">
      <el-tab-pane label="影视中心" name="vedio">
        <MovieFilter 
          v-model="selectAll.vedio"
          :partner="pannelResourceNew"
          :disable-partner="disablePartner"
          @partnerChange="pannelResourceNew=$event"
        ></MovieFilter>
      </el-tab-pane>
      <el-tab-pane label="轮播频道" name="broadcast">
        <BroadcastFilter 
          v-model="selectAll.broadcast"
        ></BroadcastFilter>
      </el-tab-pane>
    </el-tabs>
  </RemoteSelect>
</template>

<script>
import MovieFilter from './MovieFilter'
import BroadcastFilter from './BroadcastFilter'
import _ from 'gateschema'
import { RemoteSelect, ContentWrapper, Table } from 'admin-toolkit'
import { filter } from 'minimatch';
export default {
  components: {
    RemoteSelect,
    ContentWrapper,
    Table,
    BroadcastFilter,
    MovieFilter
  },

  props: ['title'],

  data() {
    return {
      disablePartner: true,
      selectAll: {},
      selected: null,
      pannelResourceNew: ''
    }
  },

  methods: {
    confirmClick: function() {
      if(!this.filterValue){
        this.$refs.selector.showDialog = true
        this.$message('请选择一条记录')
      }
      this.$emit('input', this.selected)
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