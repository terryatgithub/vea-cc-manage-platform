/*
[
    {
        type: "SPEC", // SPEC | NORMAL
        crowdPanels: [
            panel1,
            panel2,
            ...
        ]
    },
    {
        type: "NORMAL",
        panel: panel
    }
]
*/
<template>
  <div
    :class="{
            'cc-virtual-tab': true,
            'collapse-all': isDragging,
        }"
    :style="{width: width + 'px'}">
    <!-- placeholder top -->
    <div
      v-if="!readOnly"
      class="panel-placeholder panel-placeholder__normal"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop($event, {type: 'NORMAL', index: -1})">
    </div>

    <template v-for="(panelItem, index) in panels">
      <div
        v-if="show"
        :key="'panel-' + index"
        :class="{
          'tab-placeholder': true,
          'tab-placeholder--normal': panelItem.type === 'NORMAL',
          'collapse': panelItem.isCollapse,
          'is-dragable': !readOnly,
          'tab-placeholder--dragging': draggingCrowdIndex === undefined && draggingIndex === index
        }"
        v-shadow-drag="{type: panelItem.type, index: index}"
        @shadow-drag-start="handleDragStart($event, index)"
        @shadow-drag-end="handleDragEnd">
        <div class="panel-group-title">
          <i
            v-if="!panelItem.isCollapse"
            class="el-icon-arrow-up"
            @click="handleCollapse(true, index)"
          ></i>
          <i v-else class="el-icon-arrow-down" @click="handleCollapse(false, index)"></i>
          <template
            v-if="panelItem.type === 'SPEC'">
            {{ getPanelInfo(panelItem.crowdPanels[0]).panelName }} ({{ panelItem.crowdPanels.length }})
          </template>
          <template v-else>{{ getPanelInfo(panelItem.panel).panelName }}</template>
          <InputOrder
            size="small"
            clearable
            :key="Math.random().toString()"
            class="tab-placeholder__index"
            :value="index + 1"
            :disabled="readOnly"
            draggable="true"
            @dragstart.native="disableDrag"
            @input="$emit('change-panel-order', index, $event)"
          />
          <i
            v-if="!readOnly"
            title="删除组"
            @click="handleRemovePanel(index)"
            class="tab-placeholder__group-remove el-icon-close"
          ></i>
        </div>

        <div class="panel-group-content">
          <!-- SPEC panel -->
          <div v-if="panelItem.type === 'SPEC'">
            <div
              v-if="!readOnly"
              class="panel-placeholder"
              @dragenter="handleDragEnter"
              @dragleave="handleDragLeave"
              @dragover="handleDragOver"
              @drop="handleDrop($event, {type: 'CROWD', index: index, crowdIndex: -1})">
            </div>

            <template v-for="(item, crowdIndex) in panelItem.crowdPanels">
              <cc-var
                :key="crowdIndex"
                v-show="isDragging || panelItem.isShowAll || crowdIndex === 0"
                :class="{
                  'tab-placeholder__panel-wrapper': true,
                  'panel-duplicate': item.isDuplicate,
                  'tab-placeholder__panel-wrapper--dragging': draggingCrowdIndex === crowdIndex && draggingIndex === index
                }"
                v-shadow-drag="{type: 'CROWD', index: index, crowdIndex: crowdIndex}"
                @shadow-drag-start.native="handleDragStart($event, index, crowdIndex)"
                @shadow-drag-end.native="handleDragEnd"
                :panel="getPanelInfo(item)">
                <template slot-scope="{panel: panel}">
                  <div class="panel-tools">
                    <!-- <a class="panel-tools-btn" @click="">撤销修改</a>
                    <a class="panel-tools-btn" @click="">提交修改</a> -->
                    <template v-if="!readOnly">
                      <a
                        v-if="panelItem.crowdPanels.length === 1"
                        @click="$emit('toggle-type', index)"
                        class="panel-tools-btn">
                        取消定向
                      </a>
                      <a v-else class="panel-tools-btn panel-tools-btn--disabled" title="请将版块移出版块组，再取消定向">取消定向</a>
                      <i
                        title="删除"
                        @click="handleRemovePanel(index, crowdIndex)"
                        class="panel-tools-btn panel-tools-btn--remove el-icon-close">
                      </i>
                    </template>
                  </div>
                  <div class="tab-plcacholder-info">
                    <div class="tab-placeholder-info__link" @click="handleOpenPanel(panel)">
                      <vue-lazy-component @before-init="$emit('lazy-init', item)">
                        {{ panel.panelId }}
                      </vue-lazy-component>
                      <span
                        class="panel-status--waiting"
                        v-show="panel.status !== 4">
                        ({{ STATUS_TEXT[panel.status] }})
                      </span>
                    </div>
                    <div
                      class="tab-placeholder-info__link"
                      @click="handleOpenPanel(panel)">
                      {{ panel.panelName }}
                    </div>
                    <div
                      class="tab-placeholder-info__link"
                      v-if="item.dmpInfo"
                      @click="$emit('change-crowd', index, crowdIndex)">
                      人群: {{ item.dmpInfo.crowdName }}
                    </div>
                  </div>
                  <div class="tab-placeholder__panel">
                    <div
                      class="tab-placeholder__panel-title"
                      @click="handleOpenPanel(panel)">
                      {{ panel.panelTitle }}
                    </div>
                    <cc-virtual-panel-group
                      :key="crowdIndex"
                      :panel="panelData[item.id]"
                      :ratio="ratio"
                      :active="item.activeIndex"
                      :show-chart-btn="showChartBtn"
                      :show-exchange-tool="showExchangeTool"
                      :show-title="showTitle"
                      @copy-block="handleCopyBlock({
                        panelGroupId: item.id,
                        groupIndex: arguments[0],
                        blockIndex: arguments[1]
                      })"
                      @exchange-block="handleExchangeBlock({
                        panelGroupId: item.id,
                        groupIndex: arguments[0],
                        blockIndex: arguments[1]
                      })"
                      @activate="handleActivate(item, $event)"
                      @click-block="handleClickBlock({
                        index: index,
                        crowdIndex: crowdIndex,
                        activeIndex: arguments[0],
                        blockIndex:arguments[1]
                      })">
                      <PanelStatisticTable
                        slot="stat"
                        v-if="panelData[item.id].panelList"
                        :key="item.id"
                        :panelID="item.id"
                        :isShow="!panelItem.isCollapse" />
                    </cc-virtual-panel-group>
                  </div>
                </template>
              </cc-var>

              <div
                v-if="!readOnly"
                :key="'crowd-' + crowdIndex"
                v-show="isDragging || panelItem.isShowAll || crowdIndex === 0"
                class="panel-placeholder"
                @dragenter="handleDragEnter"
                @dragleave="handleDragLeave"
                @dragover="handleDragOver"
                @drop="handleDrop($event, {type: 'CROWD', index: index, crowdIndex: crowdIndex})"
              ></div>
            </template>
            <div
              class="btn-show-all"
              v-show="!isDragging && !panelItem.isShowAll && panelItem.crowdPanels.length > 1">
              <a @click="handleShowAllPanels(index)" title="显示所有版块">
                <i class="el-icon-arrow-down"></i>
                共 {{ panelItem.crowdPanels.length }} 个版块
              </a>
            </div>
          </div>
          <!-- normal panel -->
          <div v-else class="tab-placeholder__normal-panel">
            <cc-var
              :class="{
                'tab-placeholder__panel-wrapper': true,
                'panel-duplicate': panelItem.panel.isDuplicate
              }"
              :panel="getPanelInfo(panelItem.panel)">
              <template slot-scope="{panel: panel}">
                <div class="panel-tools">
                  <!-- <a class="panel-tools-btn" @click="">撤销修改</a>
                  <a class="panel-tools-btn" @click="">提交修改</a> -->
                  <template v-if="!readOnly">
                    <a class="panel-tools-btn btn-crowd--set" @click="$emit('toggle-type', index)">设置定向</a>
                    <i
                      title="删除"
                      @click="handleRemovePanel(index)"
                      class="panel-tools-btn panel-tools-btn--remove el-icon-close">
                    </i>
                  </template>
                </div>
                <div class="tab-plcacholder-info">
                  <div class="tab-placeholder-info__link" @click="handleOpenPanel(panel)">
                    <vue-lazy-component @before-init="$emit('lazy-init', panelItem.panel)">
                      {{ panel.panelId }}
                    </vue-lazy-component>
                    <span
                      class="panel-status--waiting"
                      v-show="panel.status !== 4">
                      ({{ STATUS_TEXT[panel.status] }})
                    </span>
                  </div>
                  <div
                    class="tab-placeholder-info__link"
                    @click="handleOpenPanel(panel)"
                  >{{ panel.panelName }}</div>
                </div>
                <div class="tab-placeholder__panel">
                  <div
                    class="tab-placeholder__panel-title"
                    @click="handleOpenPanel(panel)">
                    {{ panel.panelTitle }}
                  </div>
                  <cc-virtual-panel-group
                    :panel="panelData[panelItem.panel.id]"
                    :active="panel.activeIndex"
                    :ratio="ratio"
                    :show-title="showTitle"
                    :show-chart-btn="showChartBtn"
                    :show-exchange-tool="showExchangeTool"
                    @copy-block="handleCopyBlock({
                      panelGroupId: panelItem.panel.id,
                      groupIndex: arguments[0],
                      blockIndex: arguments[1]
                    })"
                    @exchange-block="handleExchangeBlock({
                      panelGroupId: panelItem.panel.id,
                      groupIndex: arguments[0],
                      blockIndex: arguments[1]
                    })"
                    @activate="handleActivate(panelItem.panel, $event)"
                    @click-block="handleClickBlock({
                      index: index,
                      activeIndex: arguments[0],
                      blockIndex:arguments[1]
                    })"
                  >
                  </cc-virtual-panel-group>
                </div>
                <PanelStatisticTable
                  v-if="panelData[panelItem.panel.id].panelList"
                  :key="panelItem.panel.id"
                  :panelID="panelItem.panel.id"
                  :isShow="!panelItem.isCollapse" />
              </template>
            </cc-var>
          </div>
        </div>
        <!-- table right -->
        <!-- <PanelStatisticTable v-if="panelItem.panel" :panelID="panelItem.panel.id" :isShow="!panelItem.isCollapse"/> -->
      </div>

      <!-- placeholder bottom -->
      <div
        v-if="!readOnly"
        :key="'placeholder-' + index"
        class="panel-placeholder panel-placeholder__normal"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover="handleDragOver"
        @drop="handleDrop($event, {type: 'NORMAL', index:index})">
      </div>
    </template>
  </div>
</template>

<script>
import Var from './Var'
import VirtualPanelGroup from './VirtualPanelGroup'
import InputOrder from '@/components/InputOrder'
import PanelStatisticTable from './PanelStatisticTable'
import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'
// import VueLazyComponent from '@/components/LazyLoad'

export default {
  components: {
    'cc-var': Var,
    'cc-virtual-panel-group': VirtualPanelGroup,
    InputOrder,
    PanelStatisticTable,
    VueLazyComponent
  },
  data () {
    this.table = {
      props: {
        border: true,
        size: 'small',
        'row-style': () => { return 'height: 20px' },
        'cell-style': () => { return 'padding: 0' },
        'header-cell-style': () => { return 'padding: 0' }
      },
      header: [
        {
          label: '',
          prop: 'date',
          width: 35
        },
        {
          label: '曝光UV',
          prop: 'exposureUV',
          width: 70
        },
        {
          label: '环比',
          prop: 'dailyGrowth',
          width: 70
        },
        {
          label: '同比',
          prop: 'weeklyGrowth',
          width: 70
        }
      ],
      data: [
        {
          date: '27',
          exposureUV: '178123',
          dailyGrowth: '13.3%',
          weeklyGrowth: '13.3%'
        },
        {
          date: '28',
          exposureUV: '178123',
          dailyGrowth: '13.3%',
          weeklyGrowth: '13.3%'
        },
        {
          date: '29',
          exposureUV: '178123',
          dailyGrowth: '13.3%',
          weeklyGrowth: '13.3%'
        }
      ],
      selectionType: 'none'
    }
    this.table2 = {
      props: {
        border: true,
        size: 'small',
        'row-style': () => { return 'height: 20px' },
        'cell-style': () => { return 'padding: 0' },
        'header-cell-style': () => { return 'padding: 0' }
      },
      header: [
        {
          label: '',
          prop: 'date',
          width: 35
        },
        {
          label: 'UVCTR',
          prop: 'UVCTR',
          width: 70
        },
        {
          label: '环比',
          prop: 'dailyGrowth',
          width: 70
        },
        {
          label: '同比',
          prop: 'weeklyGrowth',
          width: 70
        }
      ],
      data: [
        {
          date: '27',
          UVCTR: '178123',
          dailyGrowth: '13.3%',
          weeklyGrowth: '13.3%'
        },
        {
          date: '28',
          UVCTR: '178123',
          dailyGrowth: '13.3%',
          weeklyGrowth: '13.3%'
        },
        {
          date: '29',
          UVCTR: '178123',
          dailyGrowth: '13.3%',
          weeklyGrowth: '13.3%'
        }
      ],
      selectionType: 'none'
    }
    return {
      show: true,
      isDragging: false,
      draggingIndex: undefined,
      draggingCrowdIndex: undefined,
      STATUS_TEXT: this.$consts.statusText
    }
  },
  props: ['panels', 'ratio', 'width', 'panelData', 'showTitle', 'readOnly', 'showExchangeTool', 'showChartBtn'],
  methods: {
    refresh () {
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    disableDrag (event) {
      event.stopPropagation()
      event.preventDefault()
    },
    getPanelInfo (tabPanel) {
      const panel = this.panelData[tabPanel.id]
      const activeIndex = tabPanel.activeIndex || 0
      const result = {
        duplicateVersion: panel.duplicateVersion,
        dmpInfo: tabPanel.dmpInfo,
        panelId: panel.pannelGroupId,
        status: panel.pannelStatus,
        panelName: panel.pannelName,
        panelTitle: panel.panelTitle,
        activeIndex
      }
      if (panel.parentType) {
        const activePanel = panel.pannelList[activeIndex]
        result.panelTitle = activePanel.pannelTitle || ' '
        result.panelName = activePanel.pannelName
      }
      return result
    },
    hasDuplicateVersion (panel) {
      const v = panel.duplicateVersion
      if (v && v !== 'no') {
        return v
      }
    },
    handleActivate (panel, index) {
      this.$set(panel, 'activeIndex', +index)
    },
    handleDragStart (event, index, crowdIndex) {
      if (this.readOnly) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      this.$emit('drag-start')
      setTimeout(
        function () {
          this.isDragging = true
          this.draggingIndex = index
          this.draggingCrowdIndex = crowdIndex
        }.bind(this),
        0
      )
    },
    handleDragEnd () {
      this.isDragging = false
      this.draggingIndex = undefined
      this.draggingCrowdIndex = undefined
      this.$emit('drag-end')
    },
    handleCollapse (isCollapse, index) {
      this.$emit(isCollapse ? 'collapse' : 'uncollapse', index)
    },
    handleDragEnter (e) {
      e.currentTarget.classList.add('active')
    },
    handleDragLeave (e) {
      e.currentTarget.classList.remove('active')
    },
    handleAddPanel (type, index, crowdIndex) {
      this.$emit('add-panel', {
        type: type,
        index: index,
        crowdIndex: crowdIndex
      })
    },
    handleDrop (dragEvent, dropInfo) {
      // this.isDragging = false
      this.handleDragLeave(dragEvent)
      const dragInfo = JSON.parse(dragEvent.dataTransfer.getData('text/plain'))
      // dragEnd 事件还没触发，dom变太早的话，造成 dragEnd 事件被解绑导致触发不了
      setTimeout(
        function () {
          if (dragInfo.pannelGroupId) {
            // 插入版块
            this.$emit('insert-panel', dragInfo, dropInfo)
          } else {
            this.$emit('reorder-panel', dragInfo, dropInfo)
          }
        }.bind(this),
        20
      )
    },
    handleDragOver (e) {
      e.preventDefault()
    },
    handleOpenPanel (panel) {
      this.$emit('open-panel', panel)
    },
    handleInsertPanel () {},
    handleRemovePanel (index, crowdIndex) {
      this.$emit('remove-panel', index, crowdIndex)
    },
    handleClickBlock (data) {
      this.$emit('click-block', data)
    },
    handleShowAllPanels (index) {
      this.$emit('show-all-panel', index)
    },
    handleCopyBlock (options) {
      this.$emit('copy-block', options)
    },
    handleExchangeBlock (options) {
      this.$emit('exchange-block', options)
    }
  }
}
</script>
<style>
.cc-virtual-tab .tab-placeholder {
  margin: 3px 0;
  line-height: 1;
  position: relative;
  border: 1px solid #ccc;
}
.cc-virtual-tab .is-dragable {
  cursor: move;
}
.cc-virtual-tab .tab-placeholder__index {
  margin-right: 40px;
  width: 60px;
  float: right;
  line-height: 20px;
  top: 5px;
}
.cc-virtual-tab .tab-placeholder__group-remove {
  position: absolute;
  top: 8px;
  right: 10px;
  color: #ccc;
  cursor: pointer;
  background: #fff;
  padding: 5px;
}
.cc-virtual-tab .panel-group-content {
  padding: 5px 10px;
}
.cc-virtual-tab .tab-placeholder.collapse .panel-group-content {
  display: none;
}
.cc-virtual-tab .tab-placeholder.active .panel-group-content {
  display: block !important;
}

.cc-virtual-tab.collapse-all .tab-placeholder--normal .panel-group-content {
  display: none;
}
.cc-virtual-tab.collapse-all .tab-placeholder .tab-plcacholder-info,
.cc-virtual-tab.collapse-all .tab-placeholder .cc-virtual-panel-group {
  display: none;
}

.cc-virtual-tab .tab-placeholder__panel-wrapper {
  display: flex;
  position: relative;
  padding: 0;
  border: 1px dashed #ccc;
}
.cc-virtual-tab .tab-placeholder__panel {
  width: 660px;
  display: inline-block;
  overflow-x: auto;
}

.tab-placeholder__panel-title {
  line-height: 35px;
}
.tab-placeholder__panel-title {
  cursor: pointer;
  text-decoration: underline;
}

.cc-virtual-tab .tab-plcacholder-info {
  display: inline-block;
  width: 150px;
  height: auto;
  color: #000;
  padding: 5px;
  margin-right: 10px;
  line-height: 25px;
  vertical-align: top;
  box-sizing: border-box;
  background: #f3f3f3;
  min-height: 200px;
}
.cc-virtual-tab .panel-status--waiting {
  color: red;
}
.cc-virtual-tab .tab-placeholder-info__link {
  cursor: pointer;
  text-decoration: underline;
  margin-bottom: 15px;
}
.cc-virtual-tab .tab-placeholder-info__link:last-child {
  margin-bottom: 0;
}

.cc-virtual-tab .cc-virtual-pannel {
  width: 100%;
}

.cc-virtual-tab .cc-virtual-pannel__block {
  border: none;
}
.cc-virtual-tab .cc-virtual-pannel__block-title {
  color: #fff;
}
.cc-virtual-tab .panel-placeholder {
  height: 20px;
  width: 100%;
  line-height: 20px;
  color: #000;
  font-size: 10px;
  text-align: center;
  border: 1px dashed transparent;
  box-sizing: border-box;
}
.cc-virtual-tab .panel-placeholder.active {
  border-color: #ccc;
  background: #ccc;
}

.cc-virtual-tab  .panel-tools {
  position: absolute;
  top: 5px;
  right: 0px;
  font-size: 10px;
  cursor: pointer;
  display: inline-block
}
.cc-virtual-tab .panel-tools .panel-tools-btn {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 5px 10px;
  font-size: 10px;
  cursor: pointer;
  margin-right: 7px;
}
.cc-virtual-tab .panel-tools .panel-tools-btn--remove {
  border: none;
  margin-right: 0;
}
.cc-virtual-tab .panel-tools .panel-tools-btn--disabled {
  color: #ccc;
  cursor: not-allowed;
}

.cc-virtual-tab .tab-placeholder--normal .panel-group-title {
  background: #ccc;
}
.cc-virtual-tab .tab-placeholder__panel-wrapper--dragging,
.cc-virtual-tab .tab-placeholder--dragging {
  height: 30px;
  border: 1px dashed #000;
}
.cc-virtual-tab .tab-placeholder__panel-wrapper--dragging > *,
.cc-virtual-tab .tab-placeholder--dragging .panel-group-title {
  display: none;
}
.cc-virtual-tab .panel-group-title {
  padding: 0 10px;
  background: #20a0ff;
  color: #fff;
  line-height: 40px;
}
.cc-virtual-tab .panel-group-title i {
  cursor: pointer;
}

.cc-virtual-tab .btn-show-all {
  display: block;
  margin: 0 auto;
  text-align: center;
}
.cc-virtual-tab .btn-show-all a {
  cursor: pointer;
}
.cc-virtual-tab .el-icon-arrow-up,
.cc-virtual-tab .el-icon-arrow-down {
  margin-right: 10px;
}
.cc-virtual-tab
  .cc-virtual-pannel__block:hover
  .cc-virtual-pannel__block-remove {
  display: none;
}
/* width */
.cc-virtual-tab .el-tab-pane::-webkit-scrollbar,
.cc-virtual-tab .tab-placeholder__panel::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/* Track */
.cc-virtual-tab .el-tab-pane::-webkit-scrollbar-track,
.cc-virtual-tab .tab-placeholder__panel::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Handle */
.cc-virtual-tab .el-tab-pane::-webkit-scrollbar-thumb,
.cc-virtual-tab .tab-placeholder__panel::-webkit-scrollbar-thumb {
  background: #888;
}
/* Handle on hover */
.cc-virtual-tab .el-tab-pane::-webkit-scrollbar-thumb:hover,
.cc-virtual-tab .tab-placeholder__panel::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.cc-virtual-tab .panel-duplicate {
  border: 1px solid red;
}
</style>
