<template>
<div>
  <el-dialog title="添加定向首页方案"  :visible.sync="dialogVisible" width="80%" :before-close="addHomePageClose">
  <el-form label-width="120px">
    <el-form-item label="模式">{{ itemType === 'normal' ? '标准模式' : '儿童模式' }}</el-form-item>
    <el-form-item label="人群">
      <el-button @click="handleSelectCrowdStart">选择人群</el-button>
      <span class="marginL"
        v-show="form.attribute && form.attribute.crowdIds"
      >已选择: {{form.attribute.crowdName}}
       </span>
    </el-form-item>
    <el-form-item label="首页方案">
      <el-button @click="handleSelectHomePageStart()">选择首页</el-button>
      <span v-show="form.homepageName" class="marginL">已选择: {{ form.homepageName }}</span>
    </el-form-item>
    <el-form-item label="AB测试">
      <el-switch v-model="form.useABTest" on-text="开启" off-text="关闭"></el-switch>
    </el-form-item>
    <el-form-item label="测试组" v-show="form.useABTest">
      <el-form
        :inline="true"
        v-for="(testItem, index) in form.testHomeList"
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
          <el-button @click="handleSelectHomePageStart(testItem)" >选择首页</el-button>
          <span v-show="testItem.homepageName" class="marginL">已选择: {{ testItem.homepageName }}</span>
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
  </el-form>
     <span slot="footer" class="dialog-footer">
        <el-button @click="addHomePageClose">取 消</el-button>
        <el-button type="primary" @click="addHomePageSubmit">确 定</el-button>
      </span>
  </el-dialog>
      <CrowdSelector
      v-if="showSelectCrowdDialog"
      @select-cancel="handleSelectCrowdCancel"
      @select-end="handleSelectCrowdEnd"
    />
    <el-dialog title="选择首页" :visible.sync="showHomePageDialogVisible" width="80%" append-to-body>
      <HomePageModel :homepageModel="itemType" @row-click="rowClick"></HomePageModel>
    </el-dialog>
</div>
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
    itemType: String,
    editHomePageData: Object,
    selectedCrowds:Array
  },
  watch: {
    'form.useABTest': 'handleToggleABTest'
  },
  data() {
    return {
      form: {},
      dialogVisible: true,
      showSelectCrowdDialog: false,
      showHomePageDialogVisible: false,
      specialNormalHp: [],
      specialChildHp: [],
      crowdsIndexed: {},
      useABTestHomePage: undefined, // 添加测试组时正在使用的对象
      // 正在编辑的方案
      activeItem: undefined,
      // 正在选择首页的测试组, 默认组也属于这一项
      activeGroup: undefined
    }
  },
  methods: {
    addHomePageClose(){
      this.$emit('add-home-page-close')
    },
     /** 添加定向首页方案*/
     addHomePageSubmit () {
      // validate 
      const form = this.form
      const crowdIds = form.attribute.crowdIds
      if (!crowdIds || crowdIds.length === 0) {
        return this.$message('请选择人群')
      }

      if (!form.homepageId) {
        return this.$message('请选择首页')
      }

      if (form.useABTest) {
        const testHomeList = form.testHomeList
        const distributeModels = []
        const homepages = []
        let emptyDm
        let emptyHp
        let duplicateDm
        let duplicateHp
        let item
        for (let i = 0, length = testHomeList.length; i < length; i++) {
          item = testHomeList[i]
          const dm = item.distributeModel
          const hp = item.homepageId
          if (distributeModels.indexOf(dm) > -1) {
            duplicateDm = dm
            break
          } else {
            if (!dm) {
              emptyDm = i
              break
            }
            distributeModels.push(dm)
          }
          if (homepages.indexOf(hp) > -1) {
            duplicateHp = item.homepageName
            break
          } else {
            if (!hp) {
              emptyHp = dm
              break
            }
            homepages.push(hp)
          }
        }
        if (emptyDm !== undefined) {
          return this.$message('请选择第' + (emptyDm + 1) + '测试组的编号')
        }
        if (emptyHp) {
          return this.$message('请选择测试组' + emptyHp + '的首页')
        }
        if (duplicateHp) {
          return this.$message('测试组含有重复首页: ' + duplicateHp)
        }
        if (duplicateDm) {
          return this.$message('含有重复测试组编号: ' + duplicateDm)
        }
      }

      // 处理 testHomeList
      // 如果不用测试组, 设为空数组
      form.testHomeList = form.useABTest
        ? form.testHomeList
        : []

      // if (this.activeItem) {
      //   Object.assign(this.activeItem, form)
      // } else {
      //   const itemList = this.itemType === 'child'
      //     ? this.specialChildHp
      //     : this.specialNormalHp
      //   itemList.push(form)
      // }
      // this.activeItem = undefined
      // this.itemType = undefined
      if(JSON.stringify(this.editHomePageData) !== '{}') {
        this.$emit("create-home-page", this.form, true)
      } else {
         this.$emit("create-home-page", this.form, false)
      }
      
    },
    // handleRemoveItem (itemType, item) {
    //   const specialHp = itemType === 'child'
    //     ? this.specialChildHp
    //     : this.specialNormalHp
    //   specialHp.splice(specialHp.indexOf(item), 1)
    // },
    // handleEditItem (itemType, item) {
    //   let form
    //   if (item) {
    //     form = JSON.parse(JSON.stringify(item))
    //     this.activeItem = item
    //   } else {
    //     form = itemType === 'child'
    //       ? this.getInitSpecialChild()
    //       : this.getInitSpecialNormal()
    //     this.activeItem = undefined
    //   }
    //   form.useABTest = form.testHomeList.length > 0
    //   this.form = form
    //   this.itemType = itemType
    //   // this.tableList.home.url = itemType === 'child'
    //   //   ? $basePath + '/homepageInfo/dataList.html?homepageModel=child&&homepageStatusArray=4&&homepageResource=tencent'
    //   //   : $basePath + '/homepageInfo/dataList.html?homepageModel=normal&&homepageStatusArray=4&&homepageResource=tencent'
    // },
    rowClick(row) {
        if(this.useABTestHomePage !== undefined) {
          this.useABTestHomePage.homepageId = row.homepageId,
          this.useABTestHomePage.homepageStatus = row.homepageStatus,
          this.useABTestHomePage.homepageName = row.homepageName
        } else {
          this.form.homepageId = row.homepageId,
          this.form.homepageVersion = row.homepageVersion,
          this.form.homepageStatus = row.homepageStatus,
          this.form.homepageName = row.homepageName
        }
        this.showHomePageDialogVisible = false
    },
    /**选择首页 */
    handleSelectCrowdStart() {
      const attribute = JSON.parse(JSON.stringify(this.form.attribute || {}))
      this.selectedPolicyIds = attribute.crowdPolicyIds || []
      this.selectedCrowdIds = attribute.crowdIds || []
      this.showSelectCrowdDialog = true
    },
    handleSelectHomePageStart(item) {
      this.useABTestHomePage = item
      this.showHomePageDialogVisible = true
    },
    handleSelectCrowdCancel() {},
    /**选择人群 */
    handleSelectCrowdEnd(policy, crowd) {
      // const specialNormalHp = this.specialNormalHp
      // const specialChildHp = this.specialChildHp
      // let length
      // let duplicate
      // let duplicateIndex
      // length = specialNormalHp.length
      // while (--length >= 0) {
      //   if (specialNormalHp[length].attribute.crowdIds[0] === crowd.value) {
      //     duplicate = '首页模式'
      //     duplicateIndex = length
      //     break
      //   }
      // }
      // length = specialChildHp.length
      // while (--length >= 0) {
      //   if (specialChildHp[length].attribute.crowdIds[0] === crowd.value) {
      //     duplicate = '儿童模式'
      //     duplicateIndex = length
      //     break
      //   }
      // }
      // if (duplicate) {
      //   return this.$message({
      //     type: 'error',
      //     message:
      //       duplicate + ' 第' + (duplicateIndex + 1) + '个方案已选择该人群'
      //   })
      // }
     if(this.isContainCrowdName(crowd.value)) {
          this.$message({
                type: 'error',
                message: '已经存在相同的人群'
           })
           return
      }
      this.$set(this.crowdsIndexed, crowd.value, crowd)
      this.form.attribute = {
        crowdIds: [crowd.value],
        crowdName: crowd.label,
        crowdPolicyName: policy.label,
        crowdPolicyIds: [policy.value]
      }
     
      this.showSelectCrowdDialog = false
    },
    isContainCrowdName(crowdId) {
     return this.selectedCrowds.some((item) => {
         return item.attribute.crowdIds[0] === crowdId
      })
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
    if (JSON.stringify(this.editHomePageData) !=='{}') {
      this.form = this.editHomePageData
    }
  }
}
</script>
<style lang="stylus" scoped>
  .marginL
     margin-left 10px
</style>


