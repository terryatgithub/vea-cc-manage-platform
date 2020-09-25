<template>
  <div>
    <el-form>
      <el-form-item>
        <el-input
          class="region-item"
          ref="search"
          placeholder="搜索"
          v-model="searchKey"
          clearable
          :disabled="scheduleStatus === 5 || scheduleStatus === 11"
        >
          <el-button slot="append" class="input-append">搜索</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col>
        <div class="byted-select-panel">
          <div class="bui-select-panel-left">
            <div class="bui-select-panel-left-moduler">
              <div class="byted-select-panel-moduler">
                <div class="byted-select-panel-moduler-header">地区</div>
                <div class="region">
                  <el-cascader-panel :props="{}" :options="options" disabled :key="isResourceShow">
                    <div slot-scope="{node, data}">
                      <el-checkbox
                        v-if="data.value === '-1'"
                        :indeterminate="isIndeterminate(data)"
                        :disabled="!isClosable"
                        @click.stop
                        :value="isAllChildrenSelected(data)"
                        @input="handleToggleSelectAll(data)"
                      />
                      <el-checkbox
                        v-else-if="data.label === '全部'"
                        :indeterminate="isIndeterminate(data)"
                        @click.stop
                        :disabled="!isClosable"
                        :value="isSelectedItem(data)"
                        @input="handleToggleSelect(data)"
                      />
                      <el-checkbox
                        v-else
                        @click.stop
                        :disabled="!isClosable"
                        :value="isSelected(data)"
                        @input="handleToggleSelect(data)"
                      />
                      <span>&nbsp;&nbsp;{{ data.label }}</span>
                    </div>
                  </el-cascader-panel>
                </div>
              </div>
            </div>
          </div>
          <div class="bui-select-panel-right">
            <div class="byted-select-panel-moduler">
              <div class="byted-select-panel-moduler-header">
                <span>已选</span>
                <span class="byte-select-panel-moduler-header-clean" @click="handleCleanAllData">清空</span>
              </div>
              <div class="byted-select-panel-moduler-container">
                <el-tag
                  class="region-input-item"
                  v-for="item in value"
                  :key="item"
                  :closable="isClosable"
                  @close="handleRemoveItem({value: item})"
                >{{ optionsIndexed[item] && optionsIndexed[item].label }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      val: [],
      // options: [],
      InitOptions: [],
      optionsIndexed: null,
      searchKey: '',
      isResourceShow: 0
    }
  },
  props: ['value', 'regionsData', 'scheduleStatus'],
  computed: {
    isClosable() {
      let closable = true
      if (this.scheduleStatus === 5 || this.scheduleStatus === 11) {
        closable = false
      }
      return closable
    },
    originOptions() {
      return this.setOptions(this.regionsData)
    },
    options() {
      const originOptions = this.originOptions
      const searchKey = this.searchKey
      if (!searchKey) {
        return originOptions
      }
      const isMatched = item => {
        if (item.label.includes(searchKey)) {
          return true
        }
        return (item.children || []).some(isMatched)
      }
      if (originOptions.filter(isMatched).length === 1) {
        if (originOptions.filter(isMatched)[0].label.includes(searchKey)) {
          this.handleChangeKey() // 级联面板的options更新，key页需要更新
          return originOptions.filter(isMatched)
        } else {
          this.handleChangeKey()
          return originOptions.filter(isMatched)[0].children.filter(item => item.label.includes(searchKey))
        }
      } else {
        this.handleChangeKey()
        return originOptions.filter(isMatched)
      }
    }
  },
  methods: {
    handleChangeKey() {
      ++this.isResourceShow
    },
    isSelected(data) {
      return this.isSelectedItem(data) || this.isSelectedParent(data)
    },
    isSelectedItem(data) {
      return this.value.indexOf(data.value) > -1
    },
    isSelectedParent(data) {
      return this.value.indexOf(data.parentValue) > -1
    },
    isIndeterminate(data) {
      if (!this.isSelectedItem(data)) {
        const childrenValMap = data.childrenValMap || {}
        const childrenVals = Object.keys(childrenValMap)
        const count = childrenVals.filter(id => this.value.includes(id)).length
        return count > 0 && count < childrenVals.length
      }
      return false
    },
    setOptions(data) {
      const optionsIndexed = {}
      const options = []
      data.forEach(({ value, label, children = [] }) => {
        const provinceName = label
        const province = value
        const cityList = children
        const item = {
          label: provinceName,
          value: province + '',
          children: [],
          childrenValMap: {},
          disabled:
            this.scheduleStatus === 5 ? true : this.scheduleStatus === 11
        }
        optionsIndexed[item.value] = item
        cityList.forEach(({ label, value }) => {
          const cityName = label
          const city = value
          const childItem = {
            parentValue: province + '',
            label: cityName,
            value: city + '',
            disabled:
              this.scheduleStatus === 5 ? true : this.scheduleStatus === 11
          }
          optionsIndexed[childItem.value] = childItem
          item.children.push(childItem)
          item.childrenValMap[childItem.value] = true
        })
        item.children.unshift({
          label: '全部',
          value: item.value,
          childrenValMap: item.childrenValMap
        })
        options.push(item)
      })
      const all = {
        label: '全部',
        value: '-1',
        children: [],
        childrenValMap: options.reduce((result, item) => {
          result[item.value] = true
          return result
        }, {})
      }
      options.unshift(all)
      optionsIndexed[all.value] = all
      this.optionsIndexed = optionsIndexed
      // console.log(options)
      return options
    },
    handleToggleSelect(item) {
      if (this.isSelected(item)) {
        this.handleRemoveItem(item)
      } else {
        this.handleSelectItem(item)
      }
    },
    isAllChildrenSelected(item) {
      return Object.keys(item.childrenValMap).every(id =>
        this.value.includes(id)
      )
    },
    handleToggleSelectAll(allItem) {
      if (this.isIndeterminate(allItem) || this.value.length === 0) {
        this.$emit('input', Object.keys(allItem.childrenValMap))
      } else {
        this.$emit('input', [])
      }
    },
    handleSelectItem(item) {
      let value = this.value.slice()
      value.push(item.value)
      const childrenValMap = item.childrenValMap
      const parentValue = item.parentValue
      if (parentValue) {
        // 如果选具体一个市, 检查一下是否所有兄弟已经被选中，是的话，直接选中省
        const parentItem = this.optionsIndexed[parentValue]
        const isAllChildrenSelected = Object.keys(
          parentItem.childrenValMap
        ).every(id => value.includes(id))
        if (isAllChildrenSelected) {
          return this.handleSelectItem(parentItem)
        }
      }
      if (childrenValMap) {
        // 如果选择的了一个省，把下面的市去掉
        value = value.filter(id => !childrenValMap[id])
      }
      this.$emit('input', value)
      // console.log(value)
    },
    handleRemoveItem(item) {
      const currentValue = this.value
      let value
      if (this.isSelectedParent(item)) {
        const childrenValMap = this.optionsIndexed[item.parentValue]
          .childrenValMap
        // 把所有兄弟都加上, 把父级和自己移除
        value = currentValue
          .concat(Object.keys(childrenValMap))
          .filter(id => id !== item.parentValue && id !== item.value)
      } else {
        value = currentValue.filter(id => id !== item.value)
      }
      this.$emit('input', value)
      // console.log(value)
    },
    handleCleanAllData() {
      let value = []
      this.$emit('input', value)
    }
  },
  created() {
    // this.setOptions(this.regionsData)
  }
}
</script>
<style lang="stylus" scoped>
.region-item {
  margin: 10px 0px;
  width: 396px;
}

>>>.el-cascader-panel.is-bordered {
  border: none;
  border-radius: none;
}

>>>.el-cascader-node__prefix {
  display: none;
}

>>>.el-scrollbar__wrap--hidden-default {
  width: 225px;
}
>>>.el-cascader-node__label, .>>>.el-cascader-node__label.in-active-path {
  border: 1px solid #000;
  padding: 0px;
}

>>>.el-cascader-menu {
  border: none;
}

>>> .el-tag {
  width: 95%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 5px;
}

.byted-select-panel {
  display: flex;
  height: 236px;
}

.bui-select-panel-left {
  width: 432px;
  margin-right: 10px;
}

.byted-select-panel-moduler-header {
  border-bottom: 1px solid #dadfe3;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 22px;
  padding: 8px 12px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.byted-select-panel-moduler {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #dadfe3;
  border-radius: 4px;
  overflow: hidden;
  height: 236px;
}

.byted-select-panel .bui-select-panel-right {
  display: inline-block;
  height: 236px;
  width: 231px;
}

.byted-select-panel .bui-select-panel-right-none .byted-select-panel-moduler-container {
  display: flex;
  align-items: center;
}

.byted-select-panel-moduler-container {
  padding: 6px 0;
  overflow-y: auto;
  position: relative;
  height 186px
}

.byte-select-panel-moduler-header-clean {
  color: #ff8b00;
  cursor: pointer;
}

.byte-select-panel-moduler-header-clean:hover {
  color: #ffa233;
}

.input-append {
  width: 100px;
  font-size: 12px;
}
</style>
