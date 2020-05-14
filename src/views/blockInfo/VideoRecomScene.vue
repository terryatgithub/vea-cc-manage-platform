<template>
    <ContentCard class="content">
        <template>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="主板上板块填充" name="first" disabled></el-tab-pane>
                <el-tab-pane label="主页上推荐位填充" name="second" disabled></el-tab-pane>
                <el-tab-pane label="影片相关推荐" name="third"></el-tab-pane>
                <el-tab-pane label="搜索页猜你想找" name="fourth"></el-tab-pane>
            </el-tabs>
        </template>
        <template>
            <el-button type="primary">添加推荐流与人群 常规运营-用推荐流填充-选择推荐流</el-button>
        </template>
    </ContentCard>
</template>
<script>
// import _ from 'gateschema'
// import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    // Table,
    // ContentWrapper
  },
  data () {
    return {
      activeName: ''
    }
  },
  methods: {
    handleClick () {}
  }
}
</script>
