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
          <broadcast-selector 
            v-show="activeSelector === 'broadcast'"
            ref="broadcast-selector" 
            :source="source"
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
    value: 'broadcast'
  }
]
export default {
  components: {
    RemoteSelectorWrapper,
    TopicSelector,
    AppSelector,
    BroadcastSelector,
    LiveSelector,
    'pptv-selector': PPTVSelector,
    EduSelector,
    VideoSelector,
  },
  data() {
    return {
      showDialog: false,
      activeSelector: undefined,
      SELECTORS
    }
  },
  props: {
    source: String,
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
    }
  },
  methods: {
    handleSelectStart() {
      this.handleActivateSelector(this.selectors[0])
    },
    handleActivateSelector(name) {
      this.activeSelector = name
      this.$nextTick(() => {
        this.$refs[name + '-selector'].$refs.baseSelector.setTableHeight()
      })
    },
    handleSelectEnd() {
      const $refs = this.$refs
      $refs.wrapper.handleSelectEnd()
      const result = this.selectors.reduce((result, item) => {
        const ref = $refs[item + '-selector']
        if (ref) {
          result[item] = ref.selected
          if (item === 'video') {
            result.episode = {...ref.selectedEpisodes}
          } 
        } else {
          result[item] = []
        }
        return result
      }, {})
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