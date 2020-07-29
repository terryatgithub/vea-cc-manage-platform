<template>
  <ContentCard title="媒资信息查看" @go-back="goBack">
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">媒资名</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">别名</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">视频地址</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">竖版海报</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">横版海报</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">方形海报</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">来源</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">来源方媒资ID</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">类别</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">体裁</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">标签</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">发行日期</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">发行年份</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">语言</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">国家与地区</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">时长</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">描述</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">简介</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">清晰度</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">IMDB ID</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">评分</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">付费观看</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">导演</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">演员</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">总集数</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">已经播了几集</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">影片更新时间</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">在线状态</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">版权开始时间</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">版权失效时间</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">分级</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">综艺ID</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">季ID</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">剧ID</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
  </ContentCard>
</template>
<script>
import ContentCard from '@/components/ContentCard'
export default {
  components: {
    ContentCard
  },
  data () {
    return {}
  },
  methods: {
    goBack () {
      this.$router.push({
        path: 'mediaAssetsManager',
        query: {
          id: 0
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
    margin-bottom: 2px;
    &:last-child {
    margin-bottom: 0;
    }
}
.el-col {
    border-radius: 4px;
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
    background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 18px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
