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
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.title}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.alias}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light a-href" @click='href'>{{detail.mediaUrl}}</div></el-col>
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
      <el-col :span="5"><div class="grid-content bg-purple-light img"><img :src = 'detail.posterVertical'/></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light img"><img :src = 'detail.posterHorizontal'/></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light img"><img :src = 'detail.posterSquare'/></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light img"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light img"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">来源</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">来源方媒资ID</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">类别</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">体裁</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">标签</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.supplier}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.mediaId}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.category}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.genres}}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">{{detail.tags}}</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">发行日期</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">发行年份</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">语言</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">国家与地区</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">时长</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.releaseDate}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.releaseYear}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.language}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.areas}}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">{{detail.duration}}</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">描述</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">简介</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">清晰度</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">IMDB ID</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">评分</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.description}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.briefDescription}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.resolution}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.imdbId}}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">{{detail.score}}</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">付费观看</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">导演</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">演员</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">总集数</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">已经播了几集</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.isPay}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.directors}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.actors}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.episodeTotal}}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">{{detail.updateTotal}}</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple">影片更新时间</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">在线状态</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">版权开始时间</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">版权失效时间</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">分级</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.scheduleUpdateTime}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.onLine}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.startTime}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.endTime}}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">{{detail.classification}}</div></el-col>
    </el-row>
    <el-row :gutter="2">
      <!-- <el-col :span="5"><div class="grid-content bg-purple">综艺ID</div></el-col> -->
      <el-col :span="5"><div class="grid-content bg-purple">季ID</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple">剧ID</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <el-row :gutter="2">
      <!-- <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col> -->
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.seasonId}}</div></el-col>
      <el-col :span="5"><div class="grid-content bg-purple-light">{{detail.seriesId}}</div></el-col>
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
    return {
      detail: {}
    }
  },
  methods: {
    detailById () {
      if (this.$route.query.mediaResourcesId) {
        this.$service.getMediaResourcesId({
          mediaResourcesId: this.$route.query.mediaResourcesId
        }).then(data => {
          if (data.code === 0) {
            this.detail = data.data
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      }
    },
    href () {
      window.location.href = this.detail.mediaUrl
    },
    goBack () {
      this.$router.push({
        path: 'mediaAssetsManager',
        query: {
          id: 0
        }
      })
    }
  },
  activated () {
    this.detailById()
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.a-href {
  color: #86aee7;
  cursor: pointer;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
.img {
  width: 100%;
  height: 90px;
  img {
    width: 150px;
    height: 90px;
  }
}
</style>
