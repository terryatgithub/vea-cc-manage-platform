<template>
  <RemoteSelectorWrapper
    ref="wrapper"
    custom-class="resource-selector"
    @select-start="handleSelectStart">
    <div class="resource-selector__header" slot="title">
      <template v-for="item in SELECTORS" >
        <a
          v-if="selectors.indexOf(item.value) > -1"
          :class="item.value === activeSelector ? 'active' : ''"
          :key="item.value"
          @click="handleActivateSelector(item.value)">
          {{ item.label }}
        </a>
      </template>
    </div>
    <template slot="content" slot-scope="{isShow}">
      <template v-if="isLive ? true : isShow">
          <video-selector
            v-show="activeSelector === 'video'"
            ref="video-selector"
            :disable-partner="disablePartner"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <app-selector
            v-show="activeSelector === 'app'"
            ref="app-selector"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <edu-selector
            v-show="activeSelector === 'edu'"
            ref="edu-selector"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <pptv-selector
            v-show="activeSelector === 'pptv'"
            ref="pptv-selector"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <live-selector
            v-show="activeSelector === 'live'"
            ref="live-selector"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <topic-selector
            v-show="activeSelector === 'topic'"
            ref="topic-selector"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <rotate-selector
            v-show="activeSelector === 'rotate'"
            ref="rotate-selector"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <func-selector
            v-show="activeSelector === 'func'"
            ref="func-selector"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <broadcast-selector
            v-show="activeSelector === 'broadcast'"
            ref="broadcast-selector"
            :source="source"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <short-video-selector
            v-show="activeSelector === 'shortVideo'"
            ref="shortVideo-selector"
            :source="source"
            :disable-partner="disablePartner"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
          <short-video-topic-selector
            v-show="activeSelector === 'shortVideoTopic'"
            ref="shortVideoTopic-selector"
            :source="source"
            :disable-partner="disablePartner"
            :selection-type="selectionType"
            @select-cancel="handleSelectCancel"
            @select-end="handleSelectEnd" />
      </template>
    </template>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../RemoteSelectorWrapper'
import TopicSelector from './TopicSelector'
import AppSelector from './AppSelector'
import BroadcastSelector from './BroadcastSelector'
import LiveSelector from './LiveSelector'
import PPTVSelector from './PPTVSelector'
import EduSelector from './EduSelector'
import VideoSelector from './VideoSelector'
import FuncSelector from './FuncSelector'
import RotateSelector from './RotateSelector'
import ShortVideoTopicSelector from './ShortVideoTopicSelector'

const SELECTORS = [
  {
    label: '影视中心',
    value: 'video'
  },
  {
    label: '应用圈',
    value: 'app'
  },
  {
    label: '教育中心',
    value: 'edu'
  },
  {
    label: 'PPTV资源',
    value: 'pptv'
  },
  {
    label: '直播资源',
    value: 'live'
  },
  {
    label: '专题资源',
    value: 'topic'
  },
  {
    label: '轮播频道',
    value: 'rotate'
  },
  {
    label: '多功能推荐位',
    value: 'func'
  },
  {
    label: '轮播推荐位',
    value: 'broadcast'
  },
  {
    label: '短视频',
    value: 'shortVideo'
  },
  {
    label: '短视频话题',
    value: 'shortVideoTopic'
  }
]
export default {
  name: 'ResourceSelector',
  components: {
    RemoteSelectorWrapper,
    TopicSelector,
    AppSelector,
    BroadcastSelector,
    LiveSelector,
    'pptv-selector': PPTVSelector,
    EduSelector,
    VideoSelector,
    FuncSelector,
    RotateSelector,
    ShortVideoTopicSelector
  },
  data() {
    return {
      showDialog: false,
      activeSelector: undefined,
      shouldAutoFetch: [],
      SELECTORS
    }
  },
  props: {
    source: String,
    disablePartner: Boolean,
    selectors: {
      type: Array,
      default() {
        return SELECTORS.map(item => item.value)
      }
    },
    isLive: Boolean,
    selectionType: {
      type: String,
      default() {
        return 'single'
      }
    },
    // 显示的时候自动查询数据的 selector
    autoFetchSelectors: {
      type: Array,
      default() {
        return ['app', 'pptv', 'live', 'topic', 'rotate', 'func', 'broadcast', 'shortVideo', 'shortVideoTopic']
      }
    }
  },
  methods: {
    handleSelectStart() {
      this.shouldAutoFetch = (this.autoFetchSelectors || []).slice()
      this.handleActivateSelector(this.selectors[0])
    },
    handleActivateSelector(name) {
      this.activeSelector = name
      setTimeout(() => {
        const shouldAutoFetch = this.shouldAutoFetch
        const index = shouldAutoFetch.indexOf(name)
        const $selector = this.$refs[name + '-selector']
        if (index > -1) {
          shouldAutoFetch.splice(index, 1)
          $selector.fetchData()
        }
        window.dispatchEvent(new Event('resize'))
      }, 0)
    },
    handleSelectEnd() {
      const selectionType = this.selectionType
      const activeSelector = this.activeSelector
      const $refs = this.$refs
      $refs.wrapper.handleSelectEnd()
      const result = this.selectors.reduce((result, item) => {
        const ref = $refs[item + '-selector']
        if (selectionType === 'multiple' || (selectionType === 'single' && item === activeSelector)) {
          result[item] = ref.selected
          if (item === 'video') {
            result.episode = { ...ref.selectedEpisodes }
          }
        } else {
          result[item] = []
          if (item === 'video') {
            result.episode = {}
          }
        }
        return result
      }, {})
      if ($refs['video-selector']) {
        Object.defineProperty(result, 'videoSource', {
          value: $refs['video-selector'].filter.partner,
          enumerable: false
        })
      }
      this.$emit('select-end', result)
    },
    handleSelectCancel() {
      this.$refs.wrapper.handleSelectCancel()
    },
    clearSelected() {
      this.selectors.forEach((item) => {
        const $refs = this.$refs
        const ref = $refs[item + '-selector']
        if (ref) {
          ref.$refs.baseSelector.clearSelected()
        }
      })
    }
  },
  created() {
  },
  beforeCreate() {
    // circular reference
    this.$options.components['short-video-selector'] = require('./ShortVideoSelector.vue').default
  },
  mounted() {
  }
}
</script>

<style lang="stylus" scoped>
.resource-selector__header
  border-bottom 1px solid #ccc
  margin 5px 0
  font-size 14px
  a
    display inline-block
    cursor pointer
    margin-right 15px
    padding-bottom 5px
  .active
    color #20a0ff
    border-bottom 1px solid #20a0ff

</style>
