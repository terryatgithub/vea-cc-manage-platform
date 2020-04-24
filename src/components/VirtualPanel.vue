<template>
  <div
    :class="{
            'cc-virtual-pannel': true,
            'cc-virtual-pannel--show-title': showTitle
        }"
    :style="pannelStyle">
      <div v-for="(block, index) in blockItems" :key="`${block.content.vContentId}-${index}`">
        <el-popover
          placement="top"
          trigger="hover"
          :disabled="!(showPopover)"
          popper-class="show-chart-popper">
          <!-- 看数据按钮 -->
          <div v-if="showChartBtn">
            <BlockStatChartViewer
              v-if="blocks[index].vcId != -101"
              :panel-group="panelGroup"
              :panel-index="panelIndex"
              :block-index="index">
              <el-button
                type="success"
                class="popover-tool-btn">
                整体数据
              </el-button>
            </BlockStatChartViewer>
            <BlockStatDmpChartViewer
              v-if="block.specificContentList && block.specificContentList.length !== 0"
              :panel-group="panelGroup"
              :panel-index="panelIndex"
              :block-index="index">
              <el-button
                type="success"
                class="popover-tool-btn">
                DMP
              </el-button>
            </BlockStatDmpChartViewer>
            <!-- <br v-if="block.specificContentList && block.specificContentList.length !== 0"/> -->
            <!-- <el-button
              type="success"
              class="popover-tool-btn"
              @click.stop="handleAnalyzeSimpleData(index, true)"
            >整体实时数据</el-button>
            <el-button
              type="success"
              class="popover-tool-btn"
              v-if="block.specificContentList && block.specificContentList.length !== 0"
              @click.stop="handleAnalyzeDmpData(index, true)"
            >DMP实时数据</el-button> -->
          </div>
          <!-- 交换 -->
          <div v-if="showExchangeTool">
            <el-button
              type="warning"
              class="popover-tool-btn"
              :class="disableExchangeTool ? 'is-disabled el-button--disabled' : ''"
              @click.stop="$emit('copy-block', index)">
              复制
            </el-button>
            <el-button
              type="warning"
              class="popover-tool-btn"
              :class="disableExchangeTool ? 'is-disabled el-button--disabled' : ''"
              @click.stop="$emit('exchange-block', index)">
              交换
            </el-button>
          </div>

          <!-- 内容 -->
          <div
            slot="reference"
            :draggable="draggable"
            @dragstart="handleDragStart(index, $event)"
            @dragover="handleDragOver(index, $event)"
            @drop="handleDrop"
            @click="handleClickBlock(index)"
            :class="{
                      'cc-virtual-pannel__block': true,
                      'cc-virtual-pannel__block--duplicated': block.duplicated
                  }"
            :style="block.style">
            <img
              referrerpolicy="no-referrer"
              loading="lazy"
              class="cc-virtual-pannel__block-post"
              v-if="block.img"
              :src="block.img"
              :key="block.img"
            />

            <template v-for="(corner, index) in block.cornerList">
              <img
                class="corner-img"
                v-if="corner.imgUrl"
                referrerpolicy="no-referrer"
                loading="lazy"
                :src="corner.imgUrl"
                :key="index"
                :style="{
                    position: 'absolute',
                    top: corner.position === 0 || corner.position === 1 ? 0 : undefined,
                    buttom: corner.position === 2 || corner.position === 3 ? 0 : undefined ,
                    left: corner.position === 0 || corner.position === 3 ? 0 : undefined,
                    right: corner.position === 1 || corner.position === 2 ? 0 : undefined,
                }"
              />
            </template>

            <div class="cc-virtual-pannel__block-base-info">
              <span class="seq-num">{{ block.content.vContentId || (index + 1) }}</span>
              <span class="size-mark">{{ block.width }}*{{ block.height }}</span>
            </div>

            <span
              v-if="block.isExtra && !isNotExtra"
              class="cc-virtual-pannel__block-remove"
              @click.stop="handleRemoveBlock(index)"
            >x</span>
            <template v-if="block.content">
              <div
                v-if="block.content.secKillPrice > 0"
                name="smallPrice"
                class="specialSamll cc-virtual-pannel__block-price"
              >
                <span class="sec-kill-price">￥{{ fixPrice(block.content.secKillPrice) }}</span>
                <span>￥{{ fixPrice(block.content.price) }}</span>
              </div>
              <div
                v-else-if="block.content.price > 0"
                name="smallPrice"
                class="specialSamll cc-virtual-pannel__block-price"
              >
                <span>￥{{ fixPrice(block.content.price) }}</span>
              </div>
              <div
                v-if="showTitle"
                :title="block.content.title"
                class="cc-virtual-pannel__title"
              >{{ block.content.title}}</div>
            </template>
          </div>
        </el-popover>

        <div
          class="cc-virtual-pannel__block-title"
          v-if="block.titleStyle"
          :style="block.titleStyle"
          :title="block.content.title"
        >{{ block.content.title || 'title' }}</div>
      </div>
  </div>
</template>

<script>
import BlockStatChartViewer from '@/components/statViewer/BlockStatChartViewer'
import BlockStatDmpChartViewer from '@/components/statViewer/BlockStatDmpChartViewer'
export default {
  template: '#cc-virtual-panel',
  components: {
    BlockStatChartViewer,
    BlockStatDmpChartViewer
  },
  data () {
    return {
      blockItems: [],
      pannelStyle: {},
      dragIndex: undefined,
      dropIndex: undefined
    }
  },
  props: ['panelGroup', 'panelIndex', 'blocks', 'ratio', 'draggable', 'showTitle', 'mode', 'showChartBtn', 'showExchangeTool', 'disableExchangeTool', 'isNotExtra'],
  computed: {
    showPopover () {
      return this.showChartBtn || this.showExchangeTool
    }
  },
  watch: {
    blocks: 'computeBlockItems'
  },
  methods: {
    handleDragStart (index) {
      this.dragIndex = index
    },
    handleDragOver (index, event) {
      this.dropIndex = index
      event.preventDefault()
    },
    handleDrop () {
      const dragIndex = this.dragIndex
      const dropIndex = this.dropIndex
      if (dragIndex !== undefined && dropIndex !== undefined) {
        this.$emit('drag', dragIndex, dropIndex)
        this.dragIndex = this.dropIndex = undefined
      }
    },
    handleRemoveBlock (index) {
      this.$emit('remove-block', index)
    },
    handleAnalyzeSimpleData (index, isRealTime) {
      this.$emit('show-simple-chart', {
        index,
        isRealTime
      })
    },
    handleAnalyzeDmpData (index, isRealTime) {
      this.$emit('show-dmp-chart', {
        index,
        isRealTime
      })
    },
    handleClickBlock (index) {
      this.$emit('click-block', index)
    },
    fixPrice (price) {
      return Number((price / 100).toFixed(2))
    },
    computeBlockItems () {
      const blocks = this.blocks || []
      if (blocks.length === 0) {
        this.blockItems = []
        this.pannelStyle = { height: 0 }
        return
      }

      const ratio = this.ratio || 0.5
      const blockItems = this.blocks.map(function (item) {
        const block = {
          title: item.title,
          isExtra: item.isExtra,
          duplicated: item.duplicated,
          specificContentList: item.specificContentList
        }
        const position = item.contentPosition
        const resize = item.resize || {}
        const videoContentList = item.videoContentList || []
        const content = videoContentList[0] || {}
        const titleInfo = item.titleInfo

        // 如果有 resize 用 resize 的
        // resize 考虑了 title 的高度
        const top = resize.y || position.y
        const left = resize.x || position.x
        // 块的高度和宽度还是原来的高度和宽度
        const height = position.height
        const width = position.width

        block.top = top
        block.left = left
        block.height = height
        block.width = width

        block.style = {
          top: top * ratio + 'px',
          left: left * ratio + 'px',
          height: height * ratio + 'px',
          width: width * ratio + 'px'
        }
        const pictureUrl = content.pictureUrl
        if (pictureUrl) {
          const BLOCK_SIGN_IMG_SRC = process.env.BASE_URL + 'block/sign.png'
          block.img = pictureUrl === '/themes/images/block/sign.png'
            ? BLOCK_SIGN_IMG_SRC
            : pictureUrl
          // block.style['background-image'] = 'url(' + content.pictureUrl + ')'
        }

        if (titleInfo) {
          const titleWidth = titleInfo.width
          const titleHeight = titleInfo.height
          block.titleStyle = {
            top: (top + height) * ratio + 'px',
            left: left * ratio + 'px',
            width: titleWidth * ratio + 'px',
            height: titleHeight * ratio + 'px',
            'line-height': titleHeight * ratio + 'px'
          }
        }

        block.content = content

        block.cornerList = block.content.cornerList || []

        return block
      })

      const lastBlock = blockItems[blockItems.length - 1]
      const lastBlockStyle = lastBlock.style
      const lastBlockTitleStyle = lastBlock.titleStyle || {}
      const pannelHeight =
        parseFloat(lastBlockStyle.top) +
        parseFloat(lastBlockStyle.height) +
        parseFloat(lastBlockTitleStyle.height || 0) +
        'px'
      this.pannelStyle = { height: pannelHeight }

      this.blockItems = blockItems
    },
    isOverFlow (style) {
      let height = parseFloat(style.height.slice(0, -2))
      return height > 96
    }
  },
  created () {
    this.computeBlockItems()
  }
}
</script>
<style scoped>
.cc-virtual-pannel {
  position: relative;
  text-align: center;
  height: 50vh;
  max-width: 80vw;
  resize: both;
}
.cc-virtual-pannel .seq-num {
  color: #5dc8fe;
}
.cc-virtual-pannel__block {
  border: 1px solid #ccc;
  position: absolute;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
  cursor: pointer;
}
.cc-virtual-pannel__block-title {
  position: absolute;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cc-virtual-pannel__block-price {
  position: absolute;
  bottom: 0;
  color: #fff;
  opacity: 0.7;
  text-align: left;
}
.cc-virtual-pannel__block-price span {
  display: inline-block;
  background: #ba0506;
  padding: 0 2.5px;
}
.cc-virtual-pannel__block-price .sec-kill-price {
  font-weight: bold;
}
.cc-virtual-pannel__block-price .sec-kill-price + span {
  text-decoration: line-through;
}
.cc-virtual-pannel--show-title .cc-virtual-pannel__block-price {
  bottom: 18px;
}
.cc-virtual-pannel__block-remove {
  position: absolute;
  display: none;
  color: red;
  right: 5px;
  top: 5px;
  cursor: pointer;
}
.cc-virtual-pannel__block-post {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.cc-virtual-pannel__block:hover .cc-virtual-pannel__block-remove{
  display: block;
}
.cc-virtual-pannel__block:hover .analyze-data--container {
  display: block;
}
.cc-virtual-pannel__block:hover .analyze-data--container-row {
  display: flex;
}
.cc-virtual-pannel__block--duplicated {
  border: 5px solid red;
}
.cc-virtual-pannel__block-base-info {
  float: left;
  overflow: hidden;
  max-width: 100%;
  text-align: left;
  padding: 2px;
  color: #fff;
  font-size: 8px;
  line-height: 1;
}
.cc-virtual-pannel__block-base-info span {
  display: inline-block;
  background: #000;
  opacity: 0.8;
}

.cc-virtual-pannel__title {
  position: absolute;
  background: #000;
  bottom: 0px;
  overflow: hidden;
  border: 0;
  width: 100%;
  opacity: 0.8;
  color: #fff;
  text-align: left;
  line-height: 1.3;
  box-sizing: border-box;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 8px;
}
.corner-img {
  max-width: 40px;
  max-height: 28px;
}
.corner-img + .cc-virtual-pannel__block-base-info {
  position: relative;
  top: 28px;
  padding: 0;
}

.analyze-data--container {
  line-height: 25px !important;
  display: none;
  position: absolute;
  top: 15px;
  left: 0;
}

.analyze-data--container-row {
  display: none;
  position: absolute;
  top: 20px;
  left: 0;
}

.popover-tool-btn {
  margin: 3px;
}

.margin-bottom-6 {
  margin-bottom: 6px;
}
.el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
  line-height: 25px;
}
</style>
<style>
.show-chart-popper {
  min-width: 100px;
}
</style>
