<template>
  <ContentCard title="人群关系管理" @go-back="$emit('go-back')">
    <div class="dmp-relationship">
      <div class="actions">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
      <el-form label-width="120px">
        <el-form-item label="人群策略">
          <el-select :disabled="!!id" v-model="rel.policyId" placeholder="请选择">
            <el-option
              v-for="item in policyOptions"
              :key="item.value"
              :disabled="!!item.disable"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" :disabled="!rel.policyId" :loading="isRefreshing" @click="handleRefreshCrowd">{{ isRefreshing ? '刷新中' : '刷新人群列表' }}</el-button>
        </el-form-item>
        <el-form-item label="人群关系图">
          <cc-level 
            v-show="rel.policyId"
            :levels="rel.levels" 
            :items="rel.items" 
            @level-label-change="handleChangeLevelLabel"
            @level-add="handleAddLevel"
            @level-remove="handleRemoveLevel"
            @item-remove="handleRemoveItem"
            @item-activate="handleActivateItem"
          >
            <template slot="item-add" scope="scope">
              <div class="crowd-add-wrapper">
                <el-autocomplete
                  :disabled="scope.levelIndex > 0 && rel.levels[scope.levelIndex-1].activeValue === undefined"
                  :value="itemToAdd[scope.levelIndex]" 
                  @input="$set(itemToAdd, scope.levelIndex, $event)"
                  placeholder="人群ID，人群名称"
                  custom-item="crowd-search-item"
                  :trigger-on-focus="false"
                  :fetch-suggestions="handleSearchCrowd" 
                  @select="handleAddCrowdFromInput($event, scope.levelIndex)"
                />
                <el-button :disabled="scope.levelIndex > 0 && rel.levels[scope.levelIndex-1].activeValue === undefined" @click="handleAddItem(scope.levelIndex)">添加</el-button>
              </div>
            </template>
          </cc-level>
        </el-form-item>
      </el-form>
      <cc-tag-selector 
        v-if="showCrowdSelector" 
        :tags="availableCrowdOptions" 
        :disables="disabledCrowdIds"
        @select-end="handleSelectCrowdEnd"
        @select-cancel="showCrowdSelector = false"
      />
    </div>
  </ContentCard>
</template>

<script>
import CCLevel from './Level'
import CrowdSelector from './CrowdSelector'
export default {
  components: {
    'cc-level': CCLevel,
    'cc-tag-selector': CrowdSelector
  },
  data() {
    return {
      isRefreshing: false,
      showCrowdSelector: false,
      crowdKeyword: '',
      rel: {
        policyId: undefined,
        levels: this.getDefaultLevels(),
        items: [
        ]
      },
      policyOptions: [],
      availableCrowdOptions: [],
      crowdOptions: [],
      disabledCrowdIds: [],
      selectedLevelIndex: undefined,
      itemToAdd: {},
    }
  },
  props: ['id', 'mode'],
  watch: {
    'rel.policyId': 'handlePolicyIdChange'
  },
  methods: {
    getDefaultLevels() {
      return [
        {
          level: 0,
          label: '一级',
          parentValue: undefined,
          activeValue: undefined
        },
        {
          level: 1,
          label: '二级',
          parentValue: undefined,
          activeValue: undefined
        },
        {
          level: 2,
          label: '三级',
          parentValue: undefined,
          activeValue: undefined
        },
      ]
    },
    handleAddCrowdFromInput(crowd, levelIndex) {
      if (crowd.value !== undefined) {
        this.addCrowdToLevel(crowd, levelIndex)
      }
      this.itemToAdd[levelIndex] = ''
    },
    handleSearchCrowd(keyword, cb) {
      let result = []
      if (keyword) {
        const relItemsIndexed = this.rel.items.reduce(function(result, item) {
          result[item.value] = item
          return result
        }, {})
        const list = this.crowdOptions.filter(function(item) {
          return relItemsIndexed[item.value] === undefined
        })
        const fuse = new Fuse(list, {keys: ['label', 'value']}); // "list" is the item array
        result = fuse.search(keyword);
      }
      if (result.length === 0) {
        result.push({
          label: '没有相关结果...'
        })
      }
      cb(result)
    },
    handleAddLevel() {
      const levels = this.rel.levels
      levels.push({
        id: undefined,
        label: levels.length + 1 + '级',
        selected: {}
      })
    },
    handleChangeLevelLabel(label, levelIndex) {
      this.rel.levels[levelIndex].label = label
    },
    handleRemoveLevel(levelIndex) {
      const level = this.rel.levels[levelIndex]
      this.$confirm('删除后所有后面的层级也会被删除', '是否确认删除整个 ' + level.label + '  层级')
        .then(function() {
          const items = this.rel.items.filter(function(item) {
            return item.level === levelIndex
          })
          items.forEach(this.doRemoveItem)
          this.rel.levels = this.rel.levels.slice(0, levelIndex)
        }.bind(this))
        .catch(function() {})
    },
    handleAddItem(levelIndex) {
      this.showCrowdSelector = true
      this.selectedLevelIndex = levelIndex
      const hiddenItemsIndexed = {}
      this.rel.items.forEach(function(item) {
        hiddenItemsIndexed[item.value] = true
      })
      this.availableCrowdOptions = this.crowdOptions.filter(function(item) {
        return !hiddenItemsIndexed[item.value] 
      })
    },
    handleActivateItem(item, levelIndex) {
      const notExists = !this.rel.items.find(function(selectedItem) {
        return selectedItem.value === item.value
      })
      if (notExists) {
        return
      }
      this.rel.levels.slice(levelIndex + 1).forEach(function(item) {
        item.parentValue = undefined
        item.activeValue = undefined
      })
      const nextGroup = this.rel.levels[levelIndex + 1]
      if (nextGroup) {
        nextGroup.parentValue = item.value
      }
      this.rel.levels[levelIndex].activeValue = item.value
    },
    doRemoveItem(targetItem) {
      const items = this.rel.items
      const removeList = {}
      const levelsActiveValueMap = this.rel.levels.reduce(function(result, item) {
        if (item.activeValue) {
          result[item.activeValue] = item
        }
        return result
      }, {})

      let removeCount = 0
      // 记录需要删除的 value
      const mark = function(value) {
        removeCount++
        removeList[value] = true
        items.forEach(function(item) {
          if (item.parentValue === value) {
            mark(item.value)
          }
        })
        if (levelsActiveValueMap[value]) {
          levelsActiveValueMap[value].activeValue = undefined
        }
      }
      mark(targetItem.value)
      this.rel.items = items.filter(function(item) {
        return !removeList[item.value]
      })
    },
    handleRemoveItem(targetItem) {
      const hasChild = this.rel.items.some(function(item) {
        return item.parentValue === targetItem.value
      })
      const doRemoveItem = this.doRemoveItem.bind(this) 
      if (hasChild) {
          this.$confirm('删除后将同时删除 ' + targetItem.label + ' 下的标签', '是否确认删除 ' + targetItem.label + ' 分组')
            .then(function() {
              doRemoveItem(targetItem)
            }.bind(this))
            .catch(function() {})
        } else {
          doRemoveItem(targetItem)
        }
    },
    handlePolicyIdChange(id) {
      this.clearDmpRel()
      this.$service.crowdRelGet({id: id}).then(function(result) {
        if (result.hasCascadeTag) {
          this.setDmpRel(result)
          if (!this.id) {
            this.$message('该策略下已经创建了人群关系')
          }
        }
      }.bind(this))
      this.$service.getCrowdOfPolicy({id: id}).then(function(data) {
        this.crowdOptions = data
      }.bind(this))
    },
    handleSelectCrowdEnd(selectedList) {
      const currentLevelIndex = this.selectedLevelIndex
      if (selectedList) {
        selectedList.forEach(function(item) {
          this.addCrowdToLevel(item, currentLevelIndex)
        }.bind(this))
      }
      this.showCrowdSelector = false
    },
    addCrowdToLevel(crowd, levelIndex) {
        const currentLevel = this.rel.levels[levelIndex]
        const newItem = {
          parentValue: currentLevel.parentValue,
          label: crowd.label,
          value: crowd.value,
          level: levelIndex
        }
        this.rel.items.push(newItem)
    },
    handleSubmit() {
      // 校验层级标题
      this.validate(this.rel, function(error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error
          })
        } else {
          this.$service.crowdRelUpsert(this.parseDataToApi(this.rel), '保存成功').then(function() {
            this.$emit('upsert-end')
          }.bind(this))
        }
      }.bind(this))
    },
    validate(data, cb) {
      const levels = data.levels
      for(let i = 0 ,length = levels.length; i < length; i++) {
        if (levels[i].label == '') {
          return cb('请填写第' + (i + 1) + '个层级的标题')
        }
      }
      cb()
    },
    parseDataToApi(data) {
      data = JSON.parse(JSON.stringify(data))
      const finalData = {
        policyId: data.policyId,
        crowdRelationship: {}
      }
      finalData.crowdRelationship.levels = data.levels.map(function(item) {
        return {
          label: item.label
        }
      })
      finalData.crowdRelationship.items = data.items
      return finalData
    },
    parseApiToData(data) {
      data = JSON.parse(JSON.stringify(data))
      const crowdRelationship = data.crowdRelationship
      data.levels = crowdRelationship.levels.map(function(item, index) {
        return {
          level: index,
          label: item.label,
          parentValue: undefined,
          activeValue: undefined
        }
      })
      data.items = crowdRelationship.items.map(function(item) {
        return {
          label: item.label,
          value: +item.value,
          parentValue: item.parentValue ? +item.parentValue : undefined,
          level: item.level
        }
      })
      data.crowdRelationship = undefined
      return data
    },
    setDmpRel(data) {
      const rel = {}
      data = this.parseApiToData(data)
      rel.policyId = data.policyId
      rel.levels = data.levels
      rel.items = data.items
      this.rel = rel
      console.log(this.rel)
    },
    clearDmpRel() {
      this.rel.levels = this.getDefaultLevels()
      this.rel.items = []
    },
    getPolicyOptions() {
      return this.$service.getCrowdPolicy().then(function(data) {
        this.policyOptions = data
      }.bind(this))
    },
    handleRefreshCrowd() {
      this.isRefreshing = true
      this.$service.crowdRefresh().then(function() {
        this.$service.getCrowdOfPolicy({id: this.rel.policyId}).then(function(data) {
          this.crowdOptions = data
          const crowdOptionsIndexed = data.reduce(function(result, item) {
            result[item.value] = item
            return result
          }, {})
          this.rel.items.forEach(function(item) {
            const upstreamItem = crowdOptionsIndexed[item.value]
            if (upstreamItem) {
              this.$set(item, 'label', upstreamItem.label)
            }
          }.bind(this))
          this.isRefreshing = false
          this.$message('刷新成功')
        }.bind(this))
      }.bind(this)).catch(function() {
          this.isRefreshing = false
          this.$message('刷新失败')
      })
    }
  },
  created() {
    this.getPolicyOptions()
    if (this.id) {
      this.$service.crowdRelGet({id: this.id}).then(function(result) {
        this.setDmpRel(result)
      }.bind(this))
    } 
  }
}
</script>
<style scoped>
.crowd-add-wrapper {
  padding: 5px;
}
.crowd-add-wrapper .el-input,
.crowd-add-wrapper .el-input__inner {
  width: 170px;
}
.dmp-relationship .actions {
  margin: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}
.dmp-relationship .cc-level-wrapper:nth-child(1) .cc-level-level-remove,
.dmp-relationship .cc-level-wrapper:nth-child(3) .cc-level-level-remove,
.dmp-relationship .cc-level-wrapper:nth-child(5) .cc-level-level-remove {
  display: none;
}
</style>