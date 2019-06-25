<template>
  <div class="cc-level">
      <template
        v-for="(level, levelIndex) in levels">
        <div v-if="levelIndex > 0" class="cc-level-buttons">
          <i class="el-icon-arrow-right" />
        </div>
        <div class="cc-level-wrapper">
          <div class="cc-level-title">
              <el-input :value="level.label" @input="$emit('level-label-change', $event, levelIndex)" />
          </div>
          <slot name="item-add" :level-index="levelIndex">
            <div class="cc-level-add">
              <el-input v-model="itemToAdd[levelIndex]"></el-input>
              <el-button @click="handleAddItem(levelIndex)">添加</el-button>
            </div>
          </slot>
          </el-form>
          <div class="cc-level-item-list">
            <template v-for="(item, index) in items">
              <div
                v-if="item.parentValue === level.parentValue && item.level === levelIndex"
                :class="['cc-level-item', item.value === level.activeValue ? 'active' : '']"
                :key="item.value"
                @click="$emit('item-activate', item, levelIndex)"
              >
                <span :title="item.label">{{ item.label }}</span>
                <i
                  class="cc-level-item-remove el-icon-circle-close"
                  title="删除"
                  @click="$emit('item-remove', item)"
                />
              </div>
            </template>
          </div>
          <i
            class="cc-level-level-remove el-icon-circle-close"
            title="删除"
            @click="$emit('level-remove', levelIndex)"
          />
        </div>
      </template>
      <el-button v-show="maxDepth ? levels.length < maxDepth : true" class="cc-level__add-level" type="primary" @click="$emit('level-add')">添加下一级</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemToAdd: {
      }
    }
  },
  props: ['levels', 'items', 'maxDepth'],
  methods: {
    handleAddItem(levelIndex) {
      this.$emit('item-add', this.itemToAdd[levelIndex])
    }
  }
}
</script>
<style scoped>
.cc-level-buttons,
.cc-level-wrapper {
  display: inline-block;
  vertical-align: middle;
}
.cc-level-buttons {
  margin: 0 10px;
}
.cc-level-buttons .el-button {
  display: block;
  margin: 10px auto;
}
.cc-level-wrapper {
  position: relative;
  width: 250px;
  height: 400px;
  border: 1px solid #ccc;
  overflow: visible;
  margin-top: 5px;
}
.cc-level-level-remove {
  display: none;
  position: absolute;
  top: -5px;
  right: -5px;
  cursor: pointer;
}
.cc-level-wrapper:hover .cc-level-level-remove {
  display: block;
}
.cc-level-item {
  cursor: pointer;
  padding: 2px 5px;
}
.cc-level-title {
  position: relative;
}
.cc-level-item {
  position: relative;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cc-level-item:hover {
  background: #eee;
}
.cc-level-item.active {
  background: #4db3ff;
  color: #fff;
}
.cc-level-item-remove {
  display: none;
  position: absolute;
  top: 10px;
  right: 5px;
}
.cc-level-item:hover .cc-level-item-remove {
  display: inline-block;
}

.cc-level-add {
  padding: 5px;
}
.cc-level-add .el-input,
.cc-level-add .el-button {
  display: inline-block;
}
.cc-level-add .el-input,
.cc-level-add .el-input__inner {
  width: 170px;
}
.cc-level-item-list {
  overflow: auto;
  height: 320px;
}
.cc-level__add-level {
  margin-left: 10px;
}

</style>
