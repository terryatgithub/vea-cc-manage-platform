<template>
  <div id="layout" class="pannel-wrap" :style="{ height: boundary.y * ratio + 'px', width: contentWidth+'px'}">
    <div v-for="(v,index) in content" :key="index">
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
          class="single-blcok pannel-content"
          :style="{
          top: v.y * ratio+'px',
          left: v.x * ratio+'px',
          width: v.width * ratio+'px',
          height: v.height * ratio+'px'
       }">
          <span class="seq-num">{{index+1}}</span>
          <span class="size-mark">{{v.width}}*{{v.height}}</span>
          <!-- <span class="changeWidth">
              <input type="primary" :value="v.width" @blur="changeWidth($event,v,index)"  />
          </span> -->
          <div name="topLeft" class="corner-img" style="position: absolute;top: 0px;left: 0"></div>
          <div name="topRight" class="corner-img" style="position: absolute;top: 0px;right: 0"></div>
          <div name="bottomLeft" class="corner-img" style="position: absolute;bottom: 30px;left: 0"></div>
          <div
            name="bottomRight"
            class="corner-img"
            style="position: absolute;bottom: 30px;right: 0"></div>
          <!-- <span class="close-block">×</span> -->
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
       }"
        >
          <span name="titleName">title</span>
        </div>
      </div>
      <div v-else>
        <div
          class="single-blcok pannel-content"
          :style="{
          top: v.y * ratio+'px',
          left: v.x * ratio+'px',
          width: v.width * ratio+'px',
          height: v.height * ratio+'px',
          position: 'absolute'
       }"
          draggable="true"
        >
          <span class="seq-num">{{index+1}}</span>
          <span class="size-mark">{{v.width}}*{{v.height}}</span>
          <!-- <span class="changeWidth">
            <input type="primary" :value="v.width" @blur="changeWidth($event,v,index)"  />
          </span> -->
          <div name="topLeft" class="corner-img" style="position: absolute;top: 0px;left: 0"></div>
          <div name="topRight" class="corner-img" style="position: absolute;top: 0px;right: 0"></div>
          <div name="bottomLeft" class="corner-img" style="position: absolute;bottom: 0px;left: 0"></div>
          <div
            name="bottomRight"
            class="corner-img"
            style="position: absolute;bottom: 0px;right: 0"
          ></div>
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
              :style="{'font-size': '10px !important'}"
            >
              <span name="secKillPrice" class="secKillPrice"></span>
              <s name="price" class="price"></s>
            </div>
          </div>
          <!-- <span class="close-block">×</span> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: Array
    },
    contentWidth: {
      type: Number,
      default: 811
    }
  },
  data() {
    return {
    }
  },
  computed: {
    boundary () {
      let x = 0; let y = 0
      this.content.forEach(val => {
        val = val.resize ? val.resize : val
        x = Math.max(x, val.x + val.width)
        y = Math.max(y, val.y + val.height)
      })
      return { x, y }
    },
    ratio () {
      const defaultRatio = 1
      const contentWidth = this.contentWidth
      const { x } = this.boundary
      if (x > contentWidth) {
        return contentWidth / x
      }
      return defaultRatio
    }
  },
  methods: {
  },
  created() {
  }
}
</script>
<style lang="stylus" scoped>
.pannel-wrap
  position relative
.pannel-wrap>div
   display inline-block
   margin-right 10px

.pannel-content
   border 1px solid #ccc
   box-sizing border-box
   display flex
   justify-content center
   align-items center
.seq-num
  position absolute
  top 5px
  left 10px
  color red
.close-block
  position absolute
  top 0px
  right 10px
  color red
.changeWidth
  width 70px
  input
    width 60px
</style>
