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
          :key="tag.tagCode" @click="handleSelectTag(tag, index)">
          {{ tag.tagCnName }}
          <el-checkbox @input="handleSelectTag(tag, index)" class="tree-node__checkbox" v-if="tag.nodeType !=0" :value="!!selectedIndex[tag.tagCode]" />
        </span>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected:[] ,
      selectedIndex: {},
      levels: [{parentId: '-1', activeId: undefined}],
      tags: {},
      cache: {}
    }
  },
  methods: {
    getTagsByParentCode(parentCode) {
      if (this.cache[parentCode]) {
        return this.cache[parentCode]
      }
      this.$service.mediaGetTagList({parentCode, page: 1, rows: 1000000}).then((data) => {
        this.cache[parentCode] = data.rows
        this.$set(this.tags, parentCode, data.rows)
      })
    },
    handleSelectTag(tag, index) {
      const tagCode = tag.tagCode
      const levels = this.levels.slice(0, index + 1)
      const selected = this.selected
      const selectedIndex = this.selectedIndex
      if (levels[index].activeId === tagCode) {
        // 取消激活
        levels[index].activeId = undefined
      } else {
        // 如果当前 active 的不是它
        if (!selectedIndex[tagCode]) {
          // 未选中, 则，选中并激活
          levels[index].activeId = tagCode
          levels.push(this.genLevel(tagCode))
          this.getTagsByParentCode(tagCode)
        } 
      }
      this.levels = levels
      if (tag.nodeType != 0) {
        if (selectedIndex[tagCode]) {
          this.$set(selectedIndex, tagCode, undefined)
          this.selected = selected.filter(item => item !== tag)
        } else {
          this.$set(selectedIndex, tagCode, tag)
          this.selected.push(tag)
        }
        this.$emit('get-tag-nodes', this.selected)
      }
    },
    handleRemoveTag(tag) {
      this.selected = this.selected.filter(item => item != tag)
      this.selectedIndex[tag.tagCode] = undefined
      this.$emit('get-tag-nodes', this.selected)
    },
    genLevel(parentId, activeId) {
      return {parentId, activeId}
    },
    toChineseNumber(number) {
      const chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
      const chnUnitChar = ["","十","百","千", "万"];
      let unit = 0
      const result = number.toString().split('').reduceRight((result, item, index) => {
        item = +item
        const currentUnit = chnUnitChar[unit++]
        const currentAmount = chnNumChar[item]
        return  currentAmount + (item > 0 ? currentUnit : '') + result
      }, '')
      return result.replace(/零+/, '零').replace(/.+零$/, '')
    }
  },
  created() {
    this.getTagsByParentCode('-1')
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
    background #999
    color #fff
.tree-leaf
  border-color #20a0ff
  &.checked
    color #fff
    background #20a0ff
.tree-node__checkbox
  float right
  position relative
  right -20px
</style>

