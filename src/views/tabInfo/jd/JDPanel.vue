<template>
  <div class="tablayout custom-scrollbar" :style="styleObj">
    <ul>
      <li v-for="(item, index) in layoutData" :key="index" :style="styleLi[index]" :title="imgData[index].title">
        <div v-if="item.resize">
          <div v-if="imgData[index]" :style="{ width: (item.resize.width/multiple) + 'px', height: (item.height/multiple) + 'px'}" class="layout-block">
            <img :src="imgData[index].imgUrl" referrerpolicy="no-referrer">
            <div v-if="imgData[index].priceInfo && imgData[index].priceInfo.price" class="price-info">
              <div v-if="imgData[index].priceInfo.secKillPrice && imgData[index].priceInfo.secKillPrice >= 0">
                <span style="color:#e68f3c">{{imgData[index].priceInfo.price}}</span>
                <s>{{imgData[index].priceInfo.secKillPrice}}</s>
              </div>
              <div v-else>
                <span style="color:#e68f3c">{{imgData[index].priceInfo.price}}</span>
              </div>
            </div>
          </div>
          <div v-else :style="{ width: (item.resize.width/multiple) + 'px', height: (item.resize.height/multiple) + 'px'}" class="layout-block"></div>
          <div v-if="item.title_info" :style="{ width: (item.title_info.width/multiple) + 'px', height: (item.title_info.height/multiple) + 'px'}" class="layout-title">{{imgData[index].title}}</div>
        </div>
        <div v-else>
          <div v-if="imgData[index]" :style="{ width: (item.width/multiple) + 'px', height: (item.height/multiple) + 'px'}" class="layout-block">
            <img :src="imgData[index].imgUrl" referrerpolicy="no-referrer">
          </div>
          <div v-else :style="{ width: (item.width/multiple) + 'px', height: (item.height/multiple) + 'px'}" class="layout-block"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    layoutData: Array,
    imgData: Array
  },
  data () {
    return {
      multiple: 2, // 缩放比例
      lastArr: this.layoutData[this.layoutData.length - 1],
      conWidth: '',
      conHeight: ''
    }
  },
  computed: {
    styleObj: function () {
      return {
        // width: (this.lastArr.x + this.lastArr.width) / this.multiple + 20 + 'px',
        width: 811 + 'px',
        height: this.lastArr.resize ? (this.lastArr.resize.y + this.lastArr.resize.height) / this.multiple + 38 + 'px' : (this.lastArr.y + this.lastArr.height) / this.multiple + 10 + 'px'
      }
    },
    styleLi: function () {
      let liArr = [];
      let _this = this;
      for (let item of this.layoutData) {
        if (item.resize) {
          liArr.push({
            width: (item.resize.width) / this.multiple + 'px',
            height: (item.resize.height) / this.multiple + 'px',
            left: (item.resize.x) / this.multiple + 'px',
            top: (item.resize.y) / this.multiple + 'px'
          });
          _this.isActive = true;
        } else {
          liArr.push({
            width: (item.width) / this.multiple + 'px',
            height: (item.height) / this.multiple + 'px',
            left: (item.x) / this.multiple + 'px',
            top: (item.y) / this.multiple + 'px'
          })
        }
      }
      return liArr
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.tablayout
  max-width: 100%
  // border: dashed 1px #bbb;
  overflow: auto
  max-height: 500px
  // padding: 10px 0;
  // margin: 0 auto;
  ul
    position: relative
    height: auto
    width: auto
    li
      position: absolute
      cursor: pointer
      .layout-block
        border: 1px solid #ccc
        img
          width: 100%
          height: 100%
      .price-info
        width: 90%
        position: absolute
        bottom: 16%
        left: 5%
        height: 28px
        line-height: 28px
        background: #eee
        border-radius: 10px
        span
          display: inline-block
          margin-right: 18px
      .layout-title
        text-align: center
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
      .img-content
        width: 100%
        height: 100%
</style>
