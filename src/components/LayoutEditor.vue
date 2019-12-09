<template>
  <div class="layout-editor-wrapper">
    <div class="layout" :style="{ height: boundary.y * ratio + 'px', width: width + 'px'}">
      <div
        v-for="(v,index) in layout.contents"
        :key="index"
        @click="handleActiveBlock(index)">
        <div
          v-if="v.resize"
          draggable="true"
          :style="{
            top: v.resize.y * ratio+'px',
            left: v.resize.x * ratio+'px',
            width: v.resize.width * ratio+'px',
            height: v.resize.height * ratio+'px',
            position: 'absolute'
          }">
          <div
            :class="{
              'layout-block-content': true,
              'layout-block-content--active': activeIndex === index
            }"
            :style="{
              top: v.y * ratio + 'px',
              left: v.x * ratio + 'px',
              width: v.width * ratio + 'px',
              height: v.height * ratio + 'px'
            }">
            <span class="seq-num">{{index+1}}</span>
            <span class="size-mark">{{v.width}}*{{v.height}}</span>
            <div
              name="bottomRight"
              class="corner-img"
              style="position: absolute;bottom: 30px;right: 0"></div>
            <div v-if="v.type === 'Mall'" name="smallPrice" class="specialSamll">
              <div v-if="v.resize.width * ratio < 150">
                <span
                  name="secKillPrice"
                  class="secKillPrice"
                  :style="{
                    'font-size': '10px',
                    'margin-right': '5px'
                  }"
                ></span>
                <s name="price" class="price" :style="{'font-size': '10px'}"></s>
              </div>
              <div v-else>
                <span name="secKillPrice" class="secKillPrice"></span>
                <s name="price" class="price"></s>
              </div>
            </div>
          </div>
          <div
            v-if="v.title_info"
            :style="{
            width: v.title_info.width * ratio+'px',
            height: v.title_info.height * ratio+'px',
            'font-size': v.title_info.size * ratio+'px',
            'text-align': 'center'
            }">
            <span>title</span>
          </div>
        </div>
        <div v-else>
          <div
            :class="{
              'layout-block-content': true,
              'layout-block-content--active': activeIndex === index
            }"
            :style="{
            top: v.y * ratio+'px',
            left: v.x * ratio+'px',
            width: v.width * ratio+'px',
            height: v.height * ratio+'px',
            position: 'absolute'}"
            draggable="true">
            <span class="seq-num">{{ index + 1 }}</span>
            <span class="size-mark">{{ v.width }} * {{ v.height }}</span>
            <div
              name="bottomRight"
              class="corner-img"
              style="position: absolute;bottom: 0px;right: 0">
            </div>
            <div v-if="v.width * ratio >=150">
              <div v-if="v.type === 'Mall'" style="bottom:5px" class="specialSamll" name="smallPrice">
                <span name="secKillPrice" class="secKillPrice"></span>
                <s name="price" class="price"></s>
              </div>
            </div>
            <div v-else>
              <div
                v-if="v.type === 'Mall'"
                style="bottom:5px"
                class="specialSamll"
                name="smallPrice"
                :style="{'font-size': '10px !important'}">
                <span name="secKillPrice" class="secKillPrice"></span>
                <s name="price" class="price"></s>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="config">
      <el-form v-if="activeBlock" label-width="60px">
        <el-form-item label="x">
          <el-input v-model="activeBlock.x" />
        </el-form-item>
        <el-form-item label="y">
          <el-input v-model="activeBlock.y" />
        </el-form-item>
        <el-form-item label="宽">
          <el-input v-model="activeBlock.width" />
        </el-form-item>
        <el-form-item label="高">
          <el-input v-model="activeBlock.height" />
        </el-form-item>
        <el-form-item label="标题">
          <el-switch v-model="activeBlock.hasTitle" />
        </el-form-item>
        <el-form-item label="价格">
          <el-switch v-model="activeBlock.hasPrice" />
        </el-form-item>
      </el-form>
      {{ JSON.stringify(activeBlock)}}
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeIndex: undefined,
      titleHeight: 58, // 标题占用的高度
      priceHeight: 52, // 价格占用的高度
      layout: this.genDefaultLayout()
    }
  },
  props: {
    width: {
      type: Number,
      default: 810
    },
    version: String,
    value: Object,
    space: Number
  },
  computed: {
    activeBlock () {
      const activeIndex = this.activeIndex
      return this.layout.contents[activeIndex]
    },
    boundary () {
      const layout = this.layout
      let x = 0; let y = 0
      layout.contents.forEach(val => {
        val = val.resize ? val.resize : val
        x = Math.max(x, val.x + val.width)
        y = Math.max(y, val.y + val.height)
      })
      return { x, y }
    },
    ratio () {
      const defaultRatio = 1
      const width = this.width
      const { x } = this.boundary
      if (x > width) {
        return width / x
      }
      return defaultRatio
    }
  },
  methods: {
    handleActiveBlock (index) {
      this.activeIndex = index
    },
    genDefaultLayout () {
      return {
        contents: [],
        parents: '',
        type: 'Panel',
        version: this.version
      }
    },
    parseLayout (layout) {
      layout = JSON.parse(JSON.stringify(layout))
      layout.contents = layout.contents.map(item => {
        return {
          type: item.type,
          parents: item.parents,
          height: item.height,
          width: item.width,
          x: item.x,
          y: item.y,
          hasTtile: !!item.title_info,
          hasPrice: !!item.mall_resize,
          resize: item.resize,
          title_info: item.title_info,
          mall_resize: item.mall_resize
        }
      })
      return layout
    }
  },
  created () {
    const initLayout = this.value
    if (initLayout) {
      this.layout = this.parseLayout(initLayout)
    }
  }
}
</script>
<style lang="stylus" scoped>
.layout-editor-wrapper
  display flex
.layout
  position relative

.layout-block-content
   border 1px solid #ccc
   box-sizing border-box
   display flex
   justify-content center
   align-items center
.layout-block-content--active
  border 1px solid #409EFF
.seq-num
  position absolute
  top 5px
  left 10px
  color red
.config
  width 200px
</style>
