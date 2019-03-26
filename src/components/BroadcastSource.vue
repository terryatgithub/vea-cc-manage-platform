<template>
    <RemoteSelect ref="selector" :title="title" dialogClass="container" @select-end="confirmClick">
      <el-tabs value="first">
        <el-tab-pane label="轮播频道" name="first">
          <BroadcastFilter v-model="filterValue"></BroadcastFilter>
        </el-tab-pane>
      </el-tabs>
    </RemoteSelect>
</template>

<script>
import BroadcastFilter from './BroadcastFilter'
import _ from 'gateschema'
import { RemoteSelect, ContentWrapper, Table } from 'admin-toolkit'
import { filter } from 'minimatch';
export default {
  components: {
    RemoteSelect,
    ContentWrapper,
    Table,
    BroadcastFilter
  },

  props: ['title'],

  data() {
    return {
      filterValue: null
    }
  },

  methods: {
    confirmClick: function() {
      if(!this.filterValue){
        this.$refs.selector.showDialog = true
        this.$message('请选择一条记录')
      }
      this.$emit('input', this.filterValue)
    }
    
  }
}
</script>

<style lang='stylus' scoped>
.container{
  background-color red
}
.container >>> .content-list .filter-form .el-form{
  justify-content center
}

</style>