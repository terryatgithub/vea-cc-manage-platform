<template>
  <ContentCard :title="title" @go-back="$emit('cancel')">
    <el-collapse class="wrapper-collapse" v-model="activeNames" >
        <el-collapse-item title="通用内容" name="normal">
            <el-row class="addedContents-wrapper" :gutter="8">
              <el-col 
                v-for="(content, index) in normalContentList"
                :span="3" 
                :key="index">
                  <el-card
                    :class="{activeContent: activeType === 'normal' && index === activeIndex}"
                    :body-style="{ padding: '0px' }"
                    @click.native="handleActivate('normal', index)">
                    <i 
                      v-if="normalContentList.length > 1" 
                      class="remove-handle el-icon-close"
                      @click.stop.prevent="handleRemoveContent(index, 'normal')">
                    </i>
                    <img :src="content.pictureUrl" referrerpolicy="no-referrer">
                  </el-card>
              </el-col>
            </el-row>
            <BlockForm 
              v-if="activeType === 'normal'"
              ref="normalBlockForm"
              @click.stop=""
              @cover-type-change="handleCoverTypeChange"
              :mode="mode" 
              content-type='normal'
              :data="data" 
              :pannel="pannel" 
              :content-form="contentForm" 
              :hide-title-options="hideTitleOptions" />
        </el-collapse-item>
        <el-collapse-item title="精细化定向内容" name="specific">
            <el-row class="addedContents-wrapper" :gutter="8">
              <el-col 
                v-for="(content, index) in specificContentList"
                :span="3" 
                :key="index">
                  <el-card
                    :class="{activeContent: activeType === 'specific' && index === activeIndex}"
                    :body-style="{ padding: '0px' }"
                    @click.native="handleActivate('specific', index)">
                    <i 
                      class="remove-handle el-icon-close"
                      @click.stop.prevent="handleRemoveContent(index, 'specific')">
                    </i>
                    <img :src="content.pictureUrl" referrerpolicy="no-referrer">
                  </el-card>
              </el-col>
              <el-col :span="3">
                  <el-card @click.native="handleAddContent('specific')">
                      <i class="el-icon-plus">添加资源</i>
                  </el-card>
              </el-col>
            </el-row>
            <BlockForm 
              v-if="activeType === 'specific'"
              ref="specficBlockForm"
              @click.stop=""
              @cover-type-change="handleCoverTypeChange"
              content-type='specific'
              :mode="mode" 
              :data="data" 
              :pannel="pannel" 
              :content-form="contentForm" 
              :hide-title-options="hideTitleOptions" />
        </el-collapse-item>
    </el-collapse>
  </ContentCard>
</template>

<script>
import BlockForm from './BlockForm'
export default {
  components: {
    BlockForm
  },
  data() {
    return {
      activeNames: ['normal', 'specific'],
      activeType: 'normal',
      activeIndex: 0,
      normalContentList: [this.getDefaultContentForm()],
      specificContentList: [],
    }
  },
  props: ['mode', 'data', 'pannel', 'hideTitleOptions'],
  computed: {
    title() {
      if (this.mode === 'read') {
        return '推荐位内容查看'
      }
      return '推荐位内容设置'
    },
    isMall() {
      return this.data.blockInfo.type === 'Mall'
    },
    contentForm() {
      return this[this.activeType + 'ContentList'][this.activeIndex]
    }
  },
  methods: {
    getDefaultContentForm() {
      return {
        // 如果是购物，默认是 custom 类型
        coverType: this.isMall ? 'custom' : 'media',
        title: '',
        showTitle: 0,
        subTitle: '',
        showSubTitle: 0,
        singleSubTitle: '',
        pictureUrl: '',
        alternativePictureUrl: '',
        extraValue1: '',
        extraValue5: '',
        singleId: '',
        vContentId: '',
        resourceType: 0,
        cornerList: [{}, {}],
        blockResourceType: -1,
        moviePercent: 100,
        versionCode: '',
        price: '',
        secKillPrice: '',
        flagIsSetad: 0,
        redundantParams: {
          // openMode: 'webpage',
          openMode: 'app',
          webpageUrl: '',
          webpageType: '',
          webAppVersion: '102007',
          videoName: '',
          videoUrl: '',
          pictureUrl: '',
          tabId: '',
          packagename: '',
          versioncode: '-1',
          dowhat: 'startActivity',
          bywhat: 'action',
          byvalue: '',
          data: undefined,
          extendedParams: [{ key: '', value: '' }]
        }
      }
    },
    handleCoverTypeChange(coverType) {
      if (this.mode === 'read') {
        return
      }
      const { activeType, activeIndex } = this
      const contentList = this[activeType + 'ContentList']
      const originContentForm = contentList[activeIndex]
      const contentForm = this.getDefaultContentForm()
      contentForm.coverType = coverType
      if (activeType === 'specific') {
          // 定向运营时保留内容类别和关联人群
          contentForm.resourceType = originContentForm.resourceType; // 内容类别
          contentForm.dmpRegistryInfo = originContentForm.dmpRegistryInfo; // 关联人群
      }
      this.$set(contentList, activeIndex, contentForm)
    },
    handleRemoveContent(index, contentType) {

    },
    handleAddContent(contentType) {
      const contentList = this[contentType + 'ContentList']
      contentList.push(this.getDefaultContentForm())
      this.handleActivate(contentType, contentList.length - 1)
    },
    handleActivate(contentType, index) {
      this.$refs[this.activeType + 'BlockForm'].validate(this.contentForm, (err) => {
        if (!err) {
          this.activeType = contentType
          this.activeIndex = index
        } else {
          this.$message({
            type: 'erro',
            message: err
          })
        }
      })
    },
    setContentList() {
      const block = JSON.parse(JSON.stringify(this.data.block || '{}'))
      const normalContentList = block.videoContentList || []
      const specificContentList = block.specficContentList || []
      const defaultContentForm = this.getDefaultContentForm()
      const parse = (data) => {
        const redundantParams = data.redundantParams
        if (redundantParams) {
          if (redundantParams.byvalue === 'coocaa.intent.action.browser') {
            data.webpageTypeRadio = '1'
          }
          if (redundantParams.byvalue === 'coocaa.intent.action.browser.no_trans') {
            data.webpageTypeRadio = '2'
          }
          if (redundantParams.versionCode) {
            redundantParams.webAppVersion = redundantParams.versionCode
          }
        }

        const cornerList = data.cornerList
        if (cornerList && cornerList.length > 0) {
          data.cornerList = cornerList.reduce((result, item) => {
            result[item.position] = item
            return result
          }, [])
        } else {
          data.cornerList = defaultContentForm.cornerList
        }

        if (data.coverType == "custom") {
            const onclick = JSON.parse(data.onclick);
            // 处理格式奇怪的params属性
            const params = data.params.split(',').reduce((result, item) => {
              const [key, val] = item.split('==')
              result[key] = val
              return result
            })
            const openMode = params.openMode || 'app' // 为兼容业务专辑中没有openMode的params参数 采用app作为默认值
  
            switch (openMode) {
                case "webpage": {
                    onclick.webpageUrl = onclick.params.url;
                    break;
                }
                case "video": {
                    onclick.videoName = onclick.params.name;
                    onclick.videoUrl = onclick.params.url;
                    break;
                }
                case "picture": {
                    onclick.pictureUrl = onclick.params.url;
                    break;
                }
                case "tab": {
                    onclick.tabId = onclick.params.id;
                    onclick.tabType = params.tabType;
                    break;
                }
                case "app": {
                    const onclickParams = onclick.params
                    onclick.extendedParams = Object.keys(onclick.params).map(key => {
                      return {
                        key,
                        value: onclickParams[key]
                      }
                    })
                    break;
                }
                default:
                    break;
            }

            redundantParams = onclick
            redundantParams.openMode = openMode
            delete data.onclick
        }

        return Object.assign(defaultContentForm, data)
      }
      this.normalContentList = normalContentList.length > 0 
        ? normalContentList.map(parse)
        : [this.getDefaultContentForm()]
      this.specificContentList = specificContentList.map(parse)
    },
    parseContentList() {

    }
  },
  created() {
    this.setContentList()
  }
}
</script>

<style lang="stylus" scoped>
.block-content-form >>> .el-input 
  max-width 280px
.post-box 
	border 1px solid #ccc
	overflow hidden
	img 
		width 100%
.post-info 
	position absolute
	bottom 0
	width 100%
	box-sizing border-box
	padding 0 5px
	line-height 20px
	font-size 12px
	background #000
	opacity 0.8
	color #fff
	.score 
		right 0
	.episode 
		left 0
.post-info .post-title,
.post-info .post-sub-title 
	white-space nowrap
	text-overflow ellipsis
	overflow hidden
.post-info .episode,
.post-info .score 
	position absolute
	top -20px
	background #000
	padding 0 5px
.corner-box 
	position relative
	span 
		&.corner 
			position absolute
			width 50px
			height 50px
			text-align center
			cursor pointer
			img 
				width 100%
				height 100%
		&.corner-0 
			top 0
			left 0
		&.corner-1 
			top 0
			right 0
		&.corner-2 
			bottom 0
			right 0
		&.corner-3 
			bottom 0
			left 0
.corner-add-icon-wrapper 
	height 24px
	padding 0 8px
	line-height 22px
	color #12ce66
	border 1px solid #12ce66
	background #fff
.corner-img-wrapper 
	position relative
	i 
		position absolute
		top 0
		right 0
		color #ff4949
		font-size 20px
.addedContents-wrapper 
	margin-bottom 16px
	padding 8px
	border 2px dashed #C0CCDA
	>>> .el-card 
		position relative
		height 120px
		text-align center
		cursor pointer
		.remove-handle 
			position absolute
			top 0
			right 0
			padding 4px
			color #FF4949
			font-weight bolder
		.audit-handle 
			position absolute
			top 0
			right 0
			padding 4px
		img 
			height 120px
.activeContent 
	border 2px dashed #F7BA2A
</style>

