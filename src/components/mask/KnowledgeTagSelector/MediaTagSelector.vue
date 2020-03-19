<template>
  <div>
    <div class="tree-level" v-for="(level, index) in levels" :key="level.parentId">
      <template v-if="tags[level.parentId] && tags[level.parentId].length > 0 ">
      <div>第 {{ toChineseNumber(index + 1) }} 层</div>
      <div>
        <span
          v-for="tag in tags[level.parentId]"
          :class="{
            'tree-node': true,
            'tree-leaf': tag.nodeType != 0,
            'active': level.activeId === tag.tagCode,
            'checked': selectedIndex[tag.tagCode]
          }"
          :key="tag.tagCode" @click="handleActivateTag(tag, index)">
          <el-radio
            v-if="tag.nodeType !=0 && selectionType === 'single'"
            @click.native.stop=""
            @input="handleSelectTag(tag, index)"
            :label="true"
            :value="!!selectedIndex[tag.tagCode]">
            <span></span>
          </el-radio>
          <el-checkbox
            v-else-if="tag.nodeType !=0"
            @click.native.stop=""
            @input="handleSelectTag(tag, index)"
            :value="!!selectedIndex[tag.tagCode]">
            <span></span>
          </el-checkbox>
          {{ tag.tagCnName }}
        </span>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: [],
      selectedIndex: {},
      levels: [{ parentId: '2167', activeId: undefined }],
      tags: {},
      cache: {}
    }
  },
  props: ['selectionType'],
  methods: {
    getTagsByParentCode (parentCode) {
      if (this.cache[parentCode]) {
        return this.cache[parentCode]
      }
      this.$service.mediaGetInterestList({ categoryId: parentCode, page: 1, rows: 1000000 }).then((data) => {
        this.cache[parentCode] = data
        this.$set(this.tags, parentCode, data)
      })
    },
    handleActivateTag (tag, index) {
      const tagCode = tag.tagCode
      const levels = this.levels.slice(0, index + 1)
      // const selectedIndex = this.selectedIndex
      if (levels[index].activeId === tagCode) {
        // 取消激活
        levels[index].activeId = undefined
      } else {
        // 如果当前 active 的不是它
        levels[index].activeId = tagCode
        levels.push(this.genLevel(tagCode))
        this.getTagsByParentCode(tagCode)
      }
      this.levels = levels
    },
    handleSelectTag (tag, index) {
      const tagCode = tag.tagCode
      // const levels = this.levels.slice(0, index + 1)
      const selected = this.selected
      const selectedIndex = this.selectedIndex
      // if (levels[index].activeId === tagCode) {
      //   // 取消激活
      //   levels[index].activeId = undefined
      // } else {
      //   // 如果当前 active 的不是它
      //   if (!selectedIndex[tagCode]) {
      //     // 未选中, 则，选中并激活
      //     levels[index].activeId = tagCode
      //     levels.push(this.genLevel(tagCode))
      //     this.getTagsByParentCode(tagCode)
      //   }
      // }
      // this.levels = levels
      // eslint-disable-next-line
      if (tag.nodeType != 0) {
        if (this.selectionType === 'single') {
          if (selectedIndex[tagCode]) {
            this.selectedIndex = {}
            this.selected = []
          } else {
            this.selectedIndex = {
              [tagCode]: tag
            }
            this.selected = [tag]
          }
        } else {
          if (selectedIndex[tagCode]) {
            this.$set(selectedIndex, tagCode, undefined)
            this.selected = selected.filter(item => item !== tag)
          } else {
            this.$set(selectedIndex, tagCode, tag)
            this.selected.push(tag)
          }
        }
        this.$emit('get-tag-nodes', this.selected)
      }
    },
    handleRemoveTag (tag) {
      this.selected = this.selected.filter(item => item !== tag)
      this.selectedIndex[tag.tagCode] = undefined
      this.$emit('get-tag-nodes', this.selected)
    },
    genLevel (parentId, activeId) {
      return { parentId, activeId }
    },
    toChineseNumber (number) {
      const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
      const chnUnitChar = ['', '十', '百', '千', '万']
      let unit = 0
      const result = number.toString().split('').reduceRight((result, item, index) => {
        item = +item
        const currentUnit = chnUnitChar[unit++]
        const currentAmount = chnNumChar[item]
        return currentAmount + (item > 0 ? currentUnit : '') + result
      }, '')
      return result.replace(/零+/, '零').replace(/.+零$/, '')
    }
  },
  created () {
    this.getTagsByParentCode('2167')
  }
}
</script>

<style lang="stylus" scoped>
.tree-level
  margin 10px 0
.tree-node
  display inline-block
  border 1px solid #ccc
  margin 0 30px 10px 0
  width 120px
  text-align center
  cursor pointer
  &.active
    border-color #20a0ff
.tree-leaf
  border-color #ccc
  // &.checked
  //   color #fff
  //   background #20a0ff
.tree-node__checkbox
  float left
  position relative
  right -20px
</style>
