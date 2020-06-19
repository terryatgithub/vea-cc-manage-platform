<template>
  <PageWrapper>
    <PageContentWrapper v-show="activePage === 'desktop'">
      <ContentCard class="content">
        <h2>待处理任务</h2>
        <div class="list">
          <div>
            <el-card class="box-card" style="cursor: pointer;">
              <div @click="goTo('myDrafts')">
                <img src="../../assets/images/draft.png" class="cod-img">
                <div class="text-wrap">
                  <span class="text">我的草稿</span>
                  <span class="text-num">({{draftNum}})</span>
                </div>
              </div>
            </el-card>
          </div>
          <div>
            <el-card class="box-card" style="cursor: pointer;">
              <div @click="goTo('mySubmitTasks')">
                <img src="../../assets/images/submit.png" class="cod-img">
                <div class="text-wrap">
                  <span class="text">我提交的任务</span>
                  <span class="text-num">({{submitNum}})</span>
                </div>
              </div>
            </el-card>
          </div>
          <div>
            <el-card class="box-card" style="cursor: pointer;">
              <div @click="goTo('myReviewTasks')">
                <img src="../../assets/images/audit.png" class="cod-img">
                <div class="text-wrap">
                  <span class="text">我的审核任务</span>
                  <span class="text-num">({{auditNum}})</span>
                </div>
              </div>
            </el-card>
          </div>
          <div>
            <el-card class="box-card" style="cursor: pointer;">
              <div @click="goTo('msn')">
                <img src="../../assets/images/movie.png" class="cod-img">
                <div class="text-wrap">
                  <span class="text">下架影片</span>
                  <span class="text-num">({{movieNum}})</span>
                </div>
              </div>
            </el-card>
          </div>
          <div>
            <el-card class="box-card" style="cursor: pointer;">
              <div @click="goTo('search')">
                <img src="../../assets/images/search.png" class="cod-img search">
                <div class="text-wrap">
                  <span class="text"> 内容引用检索</span>
                  <span class="text-num">({{movieNum}})</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>

      </ContentCard>
      <ContentCard v-if="$consts.idPrefix == '11'" style="margin-top: 20px">
        <div >
          <h2>
            江苏有线
            <span style="float:right; font-weight: normal" v-show="isAutoSync !== undefined">
              是否自动同步酷开数据 <el-switch :value="isAutoSync" @input="handleSetAutoSync($event)"></el-switch>
            </span>
          </h2>
          <div v-if="isAutoSync === false && dataSyncGeneral">
            <el-row class="data-sync-list">
                <el-col :span="24" class="data-sync-list__item" @click.native="handleViewDataList('panel-list')">
                    <span>常规运营版块</span>
                    <span class="data-sync-list__num">{{dataSyncGeneral.normalPanel.total}}</span>
                </el-col>
                <el-col :span="24" class="data-sync-list__item" @click.native="handleViewDataList('album-list')">
                    <span>业务专辑版块</span>
                    <span class="data-sync-list__num">{{dataSyncGeneral.albumPanel.total}}</span>
                </el-col>
                <el-col :span="24" class="data-sync-list__item" @click.native="handleViewDataList('tab-list')">
                    <span>TAB版面</span>
                    <span class="data-sync-list__num">{{dataSyncGeneral.otherTab.total}}</span>
                </el-col>
                <el-col :span="24" class="data-sync-list__item" @click.native="handleViewDataList('film-list')">
                    <span>影视详情页版面</span>
                    <span class="data-sync-list__num">{{ dataSyncGeneral.filmDetailTab.total }}</span>
                </el-col>
            </el-row>
          </div>
        </div>
      </ContentCard>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'panel-list'">
      <keep-alive>
        <PanelList @read="handleReadPanel" @go-back="goBack" />
      </keep-alive>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'tab-list'">
      <keep-alive>
        <TabList @read="handleReadTab" @go-back="goBack" />
      </keep-alive>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'album-list'">
      <keep-alive>
        <AlbumList @read="handleReadPanel" @go-back="goBack" />
      </keep-alive>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'film-list'">
      <keep-alive>
        <FilmPageList @read="handleReadFilm" @go-back="goBack"></FilmPageList>
      </keep-alive>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'panel-read'">
      <PanelInfo
        :id="panelPreview.id"
        :panel-data-type="panelPreview.dataType"
        :init-mode="'read'"
        :version="panelPreview.version"
        @upsert-end="goBack(panelPreview.dataType == 3 ? 'album-list' : 'panel-list')"
        @go-back="goBack(panelPreview.dataType == 3 ? 'album-list' : 'panel-list')">
      </PanelInfo>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'tab-read'">
      <TabInfo
        :id="tabPreview.id"
        :init-mode="'read'"
        :version="tabPreview.version"
        @upsert-end="goBack('tab-list')"
        @go-back="goBack('tab-list')">
      </TabInfo>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'film-read'">
      <TabInfo
        :id="filmPreview.id"
        :init-mode="'read'"
        :version="filmPreview.version"
        @upsert-end="goBack('tab-list')"
        @go-back="goBack('tab-list')">
      </TabInfo>
    </PageContentWrapper>
  </PageWrapper>
</template>
<script>
import ContentCard from '@/components/ContentCard'
import PanelInfo from '../panelInfo/PanelInfo'
import TabInfo from '../tabInfo/TabInfo'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import PanelList from './dataSync/Panel'
import AlbumList from './dataSync/Album'
import TabList from './dataSync/Tab'
import FilmPageList from './dataSync/FilmPage'
export default {
  components: {
    ContentCard,
    PanelList,
    AlbumList,
    TabList,
    FilmPageList,
    PanelInfo,
    TabInfo,
    PageWrapper,
    PageContentWrapper
  },
  data () {
    return {
      activePage: 'desktop',
      draftNum: null,
      movieNum: null,
      auditNum: null,
      submitNum: null,
      searchNum: null,
      mode: undefined,
      title: undefined,
      id: undefined,
      version: undefined,
      isAutoSync: undefined,
      dataSyncGeneral: null,
      panelPreview: {
        id: undefined,
        version: undefined,
        dataType: undefined
      },
      tabPreview: {
        id: undefined,
        version: undefined
      },
      filmPreview: {
        id: undefined,
        version: undefined
      }
    }
  },
  watch: {
    isAutoSync: 'handleAutoSyncChange'
  },
  methods: {
    handleViewDataList (type) {
      this.activePage = type
    },
    handleSetAutoSync (val) {
      const message = val
        ? '开启同步后，酷开数据将会自动更新至该平台，确认开启？'
        : '关闭同步后，您需要进行手动确认才可同步酷开数据，确认关闭？'
      this.$confirm(message, '提示').then(() => {
        this.$service.desktopUpdateDataSyncInfo({
          enableManualOn: val
        }).then(() => {
          this.isAutoSync = val
        })
      }).catch((e) => {
        console.log(e)
      })
    },
    handleAutoSyncChange () {
      if (!this.isAutoSync) {
        this.getDataSyncGeneral()
      }
    },
    handleReadPanel (panel) {
      this.panelPreview = {
        id: panel.pannelGroupId,
        version: panel.currentVersion,
        dataType: panel.pannelType
      }
      this.activePage = 'panel-read'
    },
    handleReadTab (tab) {
      this.tabPreview = {
        id: tab.tabId,
        version: tab.currentVersion
      }
      this.activePage = 'tab-read'
    },
    handleReadFilm (film) {
      this.filmPreview = {
        id: film.tabId,
        version: film.currentVersion
      }
      this.activePage = 'film-read'
    },
    goTo (routeName) {
      return this.$router.push({ name: routeName })
    },
    goBack (page) {
      this.activePage = page || 'desktop'
    },
    getDataSyncGeneral () {
      this.$service.desktopGetDataSyncGeneral().then((data) => {
        this.dataSyncGeneral = data
      })
    }
  },
  created () {
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
    this.$service.getTotal('msn').then(data => {
      this.searchNum = data
    })
    if (this.$consts.idPrefix !== '10') {
      this.$service.desktopGetDataSyncInfo().then((data) => {
        this.isAutoSync = data.isOn
      })
    }
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

.data-sync-list
  border 1px solid #f2f2f2
.data-sync-list__item
  cursor pointer
  padding 10px
  border-bottom 1px solid #f2f2f2
  &:last-child
    border none
  &:hover
    color #2d8cf0
.data-sync-list__num
  float right
.search
  width 64px
  height 64px
</style>
