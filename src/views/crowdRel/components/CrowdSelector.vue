<template>
  <el-dialog
    title="选择人群"
    :visible="true"
    :before-close="handleClose"
  >
    <div
      class="name-list"
    >
      <div>
        <el-input v-model="keyword" placeholder="搜素人群ID， 人群名称" />
      </div>
      <el-checkbox 
        v-for="item in availableTags" 
        class="name-list__item" 
        v-model="selectMap[item.value]"
        :title="item.label"
        :key="item.value"
        :disabled="!!(item.disabled || disablesIndexed[item.value])"
      >
        {{ item.label }}
      </el-checkbox>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <el-button type="primary" @click="handleSelectEnd">添加</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Fuse from 'fuse.js'
export default {
  props: {
    tags: {
      type: Array
    },
    selected: {
      type: Array
    },
    disables: {
      type: Array
    }
  },
  data() {
    return {
      keyword: undefined,
      selectedIndexed: {},
      disablesIndexed: {},
      selectMap: {},
    }
  },
  computed: {
    availableTags() {
      const keyword = this.keyword
      if (keyword) {
        const fuse = new Fuse(this.tags, {keys: ['label', 'value']}); 
        return fuse.search(keyword);
      } else {
        return this.tags
      }
    }
  },
  watch: {
    selected: 'updateSelectedIndex',
    disables: 'updateDisablesIndex'
  },
  methods: {
    handleSelectEnd() {
      const selectMap = this.selectMap
      const selections = this.tags.reduce(function(result, item) {
        if (selectMap[item.value]) {
          result.push(item)
        }
        return result
      }, [])
      this.$emit('select-end', selections)
    },
    updateSelectedIndex() {
      this.buildIndex('selected', 'selectedIndexed')
    },
    updateDisablesIndex() {
      this.buildIndex('disables', 'disablesIndexed')
    },
    buildIndex(propKey, dataKey) {
      this[dataKey] = (this[propKey] || []).reduce(function(result, item) {
        result[item] = true
        return result
      }, {})
    },
    handleClose() {
      this.$emit('select-cancel')
    }
  },
  created() {
    this.buildIndex('selected', 'selectedIndexed')
    this.buildIndex('disables', 'disablesIndexed')
    const selectMap = {}
    const selectedIndexed = this.selectedIndexed
    this.tags.forEach(function(item) {
      selectMap[item.value] = selectedIndexed[item.value] ? true : false
    })
    this.selectMap = selectMap
  }
}
</script>
<style scoped>
.name-list__item {
    display: inline-block;
    width: 140px;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: top;
}
.name-list__item + .name-list__item {
  margin-left: 5px
}
</style>