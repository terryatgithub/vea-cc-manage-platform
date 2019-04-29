<template>
    <div class="crowd-selector">
        <el-dialog
                title="选择策略"
                :visible="showPolicySelector"
                append-to-body
                :before-close="handleClose">
            <div class="name-list">
                <div
                    v-for="item in policy.items"
                    class="name-list__item"
                    @click="handleSelectPolicy(item)"
                    :title="item.label"
                    :key="item.value"
                >
                    {{ item.label }}
                </div>
            </div>

        </el-dialog>

        <el-dialog
                title="选择人群"
                append-to-body
                :visible="showCrowdSelector"
                :before-close="handleSelectCrowdCancel">
            <div v-if="!hasCascadeTag" class="name-list">
                <div
                    v-for="item in crowd.items"
                    class="name-list__item"
                    @click="handleSelectCrowd(item)"
                    :title="item.label"
                    :key="item.value"
                >
                    {{ item.label }}
                </div>
            </div>
            <div v-else>
                <el-cascader
                    :options="crowd.cascadeItems"
                    v-model="selectedCrowd"
                    change-on-select
                ></el-cascader>
                <el-button :disabled="!selectedCrowd" class="marginL" type="primary" @click="handleSelectCascadeCrowd">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      hasCascadeTag: false,
      showPolicySelector: true,
      showCrowdSelector: false,
      selectedPolicy: undefined,
      selectedCrowd: undefined,
      policy: {
        pagination: {},
        items: []
      },
      crowd: {
        pagination: {},
        items: [],
        cascadeItems: []
      }
    }
  },
  props: ['selectedPolicyId', 'selectedCrowdId'],
  methods: {
    handleClose () {
      this.showCrowdSelector = false
      this.showPolicySelector = false
      setTimeout(function () {
        this.$emit('select-cancel')
      }.bind(this), 20)
    },
    handleSelectPolicy (item) {
      this.selectedPolicy = item
      this.$service.crowdRelGet({id: item.value}).then(function(result) {
          if (!result.hasCascadeTag) {
              this.$service.getCrowdOfPolicyWithCache(item.value).then(function(result) {
                  this.hasCascadeTag = false
                  this.crowd.items = result
                  this.showCrowdSelector = true
              }.bind(this))
          } else {
              this.hasCascadeTag = true
              this.crowd.items = result.crowdRelationship.items
              this.crowd.cascadeItems = this.listToTree(result.crowdRelationship.items)
              this.showCrowdSelector = true
          }
      }.bind(this))
    },
    handleSelectCrowd (item) {
      this.selectedCrowd = item
      this.selectEnd()
    },
    handleSelectCascadeCrowd() {
        const selectedCrowdValue = this.selectedCrowd.pop()
        this.selectedCrowd = this.crowd.items.find(function(item) {
            return item.value === selectedCrowdValue
        })
        this.selectEnd()
    },
    handleSelectCrowdCancel() {
      this.showCrowdSelector = false
    },
    selectEnd () {
      this.showCrowdSelector = false 
      this.showPolicySelector = false
      this.$emit('select-end', this.selectedPolicy, this.selectedCrowd)
    },
    listToTree(data, options) {
        data = JSON.parse(JSON.stringify(data))
        options = options || {};
        var ID_KEY = options.idKey || 'value';
        var PARENT_KEY = options.parentKey || 'parentValue';
        var CHILDREN_KEY = options.childrenKey || 'children';
        
        var tree = [], childrenOf = {};
        var item, id, parentId;

        for(var i = 0, length = data.length; i < length; i++) {
            item = data[i];
            id = item[ID_KEY];
            parentId = item[PARENT_KEY] || 0;
            // every item may have children
            childrenOf[id] = childrenOf[id] || [];
            // init its children
            item[CHILDREN_KEY] = childrenOf[id];
            if (parentId != 0) {
            // init its parent's children object
            childrenOf[parentId] = childrenOf[parentId] || [];
            // push it into its parent's children object
            childrenOf[parentId].push(item);
            } else {
            tree.push(item);
            }    
        };

        data.forEach(function(item) {
            if (item.children.length === 0) {
                item.children = undefined
            }
        })

        return tree;
    }
  },
  created () {
    this.$service.getCrowdPolicy().then(function (result) {
      this.policy.items = result
      console.log(result)
    }.bind(this))
  }
}
</script>
<style scoped>
.name-list__item {
    display: inline-block;
    width: 100px;
    border: 1px solid #ddd;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: top;
}
.name-list__item.active,
.name-list__item:hover {
    color: #fff;
    background: #20a0ff;
    border-color: #20a0ff;
}
.crowd-selector .el-cascader {
    width: 600px;
    margin-right: 10px;
}
.crowd-selector .el-cascader .el-input {
    max-width: 600px;
}
.marginL {
 margin-left: 10px;
}
 
</style>