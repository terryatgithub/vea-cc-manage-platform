<template>
  <el-form label-width="120px">
    <el-form-item label="模式">{{ itemType === 'normal' ? '标准模式' : '儿童模式' }}</el-form-item>
    <el-form-item label="人群">
      <el-button @click="handleSelectCrowdStart">选择人群</el-button>
      <span
        v-show="form.attribute && form.attribute.crowdIds"
      >已选择: {{ getSelectedCrowdNames(form) }}</span>
    </el-form-item>
    <el-form-item label="首页方案">
      <el-button @click="handleSelectHomePageStart(form)">选择首页</el-button>
      <span v-show="form.homepageName">已选择: {{ form.homepageName }}</span>
    </el-form-item>
    <el-form-item label="AB测试">
      <el-switch v-model="form.useABTest" on-text="开启" off-text="关闭"></el-switch>
    </el-form-item>
    <el-form-item label="测试组" v-show="form.useABTest">
      <el-form
        :inline="true"
        v-for="(testItem, index) in form.testHomeList"
        label-width="80px"
        class="test-group"
        :key="index"
      >
        <el-form-item label="编号">
          <el-select v-model="testItem.distributeModel">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="首页方案">
          <el-button @click="handleSelectHomePageStart(testItem)">选择首页</el-button>
          <span v-show="testItem.homepageName">已选择: {{ testItem.homepageName }}</span>
        </el-form-item>
        <el-button class="test-group__remove" type="text" @click="handleRemoveTestItem(testItem)">
          <i class="el-icon-close"></i>
        </el-button>
      </el-form>
      <el-button
        v-show="form.testHomeList && form.testHomeList.length < 4"
        @click="handleAddTestItem"
        type="primary"
      >添加组</el-button>
    </el-form-item>
    <CrowdSelector
      v-if="showSelectCrowdDialog"
      @select-cancel="handleSelectCrowdCancel"
      @select-end="handleSelectCrowdEnd"
    />
    <el-dialog title="选择首页" :visible.sync="showHomePageDialogVisible" width="80%" append-to-body>
      <HomePageModel :homepageModel="itemType" @row-click="rowClick"></HomePageModel>
    </el-dialog>
  </el-form>
</template>
<script>
import CrowdSelector from '@/components/CrowdSelector'
import HomePageModel from './../../components/HomePageModel'
export default {
  components: {
    CrowdSelector,
    HomePageModel
  },
  props: {
    itemType: String
  },
  watch: {
    'form.useABTest': 'handleToggleABTest'
  },
  data() {
    return {
      form: {},
      showSelectCrowdDialog: false,
      showHomePageDialogVisible: false,
      specialNormalHp: [],
      specialChildHp: [],
      crowdsIndexed: {}
    }
  },
  methods: {
    rowClick(row) {
        this.form.homepageId = row.homepageId,
        this.form.homepageVersion = row.homepageVersion,
        this.form.homepageStatus = row.homepageStatus,
        this.form.homepageName = row.homepageName
        this.showHomePageDialogVisible = false
    },
    /**选择首页 */
    handleSelectCrowdStart() {
      const attribute = JSON.parse(JSON.stringify(this.form.attribute || {}))
      this.selectedPolicyIds = attribute.crowdPolicyIds || []
      this.selectedCrowdIds = attribute.crowdIds || []
      this.showSelectCrowdDialog = true
    },
    handleSelectHomePageStart(form) {
      this.showHomePageDialogVisible = true
    },
    handleSelectCrowdCancel() {},
    handleSelectCrowdEnd(policy, crowd) {
      const specialNormalHp = this.specialNormalHp
      const specialChildHp = this.specialChildHp
      let length
      let duplicate
      let duplicateIndex
      length = specialNormalHp.length
      while (--length >= 0) {
        if (specialNormalHp[length].attribute.crowdIds[0] === crowd.value) {
          duplicate = '首页模式'
          duplicateIndex = length
          break
        }
      }
      length = specialChildHp.length
      while (--length >= 0) {
        if (specialChildHp[length].attribute.crowdIds[0] === crowd.value) {
          duplicate = '儿童模式'
          duplicateIndex = length
          break
        }
      }
      if (duplicate) {
        return this.$message({
          type: 'error',
          message:
            duplicate + ' 第' + (duplicateIndex + 1) + '个方案已选择该人群'
        })
      }

      this.$set(this.crowdsIndexed, crowd.value, crowd)
      this.form.attribute = {
        crowdIds: [crowd.value],
        crowdPolicyIds: [policy.value]
      }
      this.showSelectCrowdDialog = false
    },
    getSelectedCrowdNames(specialItem) {
      console.log(specialItem)
      const attribute = specialItem.attribute || {}
      const crowdsIndexed = this.crowdsIndexed
      const crowdIds = attribute.crowdIds
      if (crowdIds) {
        return crowdIds.map(function(item) {
          if (crowdsIndexed[item]) {
            return crowdsIndexed[item].label
          } else {
            return '加载中...'
          }
        })
      }
    },
    /**删除测试组 */
    handleRemoveTestItem(item) {
      const testHomeList = this.form.testHomeList
      testHomeList.splice(testHomeList.indexOf(item), 1)
    },
    handleAddTestItem() {
      this.form.testHomeList.push(this.getInitTestItem())
    },
    getInitTestItem() {
      return {
        distributeModel: undefined,
        homepageId: undefined,
        homepageName: undefined,
        homepageStatus: undefined
      }
    },
    handleToggleABTest(isOn) {
      if (isOn && this.form.testHomeList.length === 0) {
        this.handleAddTestItem()
      }
    },
    getInitSpecialNormal() {
      return {
        homepageId: undefined,
        homepageVersion: '',
        homepageModel: 'normal',
        homepageStatus: undefined,
        distributeModel: 'default',
        attribute: {},
        useABTest: false,
        testHomeList: []
      }
    },
    getInitSpecialChild() {
      return {
        homepageId: undefined,
        homepageVersion: '',
        homepageModel: 'child',
        homepageStatus: undefined,
        distributeModel: 'default',
        attribute: {},
        useABTest: false,
        testHomeList: []
      }
    }
  },
  created() {
    this.form =
      this.itemType === 'child'
        ? this.getInitSpecialChild()
        : this.getInitSpecialNormal()
  }
}
</script>

