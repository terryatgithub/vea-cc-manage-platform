<template>
<ContentCard title="首页方案" @go-back="$emit('go-back')">
    <CommonContent 
      :mode="mode" 
      :resource-info="resourceInfo"
      @replicate="mode = 'replicate'"
      @edit="mode = 'edit'"
      @unaudit="fetchData"
      @shelves="fetchData"
      @audit="$emit('upsert-end')"
      @submit-audit="handleSubmitAudit"
      @save-draft="handleSaveDraft"
      @select-version="fetchData"
    >
      <div class="hompage-upsert" v-if="mode !== 'read'">
        <el-form ref="homepageForm" :model="homepage" :rules="rules" label-width="140px">
          <div class="form-legend-header">
              <span>基本信息</span>
          </div>
          <el-form-item label="首页名称" prop="homepageName">
            <el-input v-model="homepage.homepageName" placeholder="首页名称" />
          </el-form-item>
          <el-form-item label="首页模式" prop="homepageModel">
            <el-radio-group v-model="homepage.homepageModel">
              <el-radio label="normal">标准模式</el-radio>
              <el-radio label="child">儿童模式</el-radio>
              <el-radio label="old">老人模式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="首页版本号" prop="homepageVersion">
            <el-input v-model="homepage.homepageVersion" placeholder="首页版本号"></el-input>
          </el-form-item>

          <div class="form-legend-header">
              <span>数据列表配置</span>
          </div>
          <el-form-item label="首页版面">
            <TabSelector
                @select-end="handleSelectTabEnd"
            />
            <el-button type="warning" @click="handleCreateTab">新建版面</el-button>
            <span class="cc-form-annotation">至少选择1个版面</span>
            <div>
                <el-table
                    :data="tabGroupList"
                    border
                    style="margin-top: 20px;">
                    <el-table-column
                        prop=""
                        label="排序"
                        width="100">
                        <template scope="scope">
                          <InputOrder
                            :key="Math.random().toString()"
                            :value="scope.$index + 1" 
                            @input="handleChangeTabOrder(scope.$index, $event)"
                          />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tabId"
                        label="版面ID"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="tabName"
                        width="180"
                        label="版面名称">
                        <template scope="scope">
                        <el-button
                            @click.native.prevent="handleShowTabGroup(scope.$index)"
                            type="text"
                            size="small">
                            {{ scope.row.tabName }}
                        </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tabCnTitle"
                        label="TAB标题(中文)"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="tabEnTitle"
                        label="TAB标题(英文)"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="默认落焦"
                        width="100"
                        align="center"
                      >
                      <template scope="scope">
                        <el-radio 
                          :title="scope.row.canBeDefaultFocusTab ? '' : '只有普通版面或设了默认版面的定向版面组才能设为默认落焦'"
                          :disabled="!scope.row.canBeDefaultFocusTab" 
                          v-model="homepage.defaultFocusIndex" 
                          :label="scope.$index"
                        >&nbsp;</el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="版面数"
                      width="100"
                    >
                      <template scope="scope">
                        <span> {{ scope.row.tabCount }} </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="默认版面"
                      width="150"
                    >
                      <template scope="scope">
                        {{ scope.row.isDefaultTab ? '有' : '无'}}
                      </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="80"
                    >
                        <template scope="scope">
                        <el-button
                            @click.native.prevent="handleRemoveTab(scope.$index)"
                            type="text"
                            size="small">
                            删除
                        </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="homepage-read" v-if="mode === 'read'">
        <el-form label-width="140px">
          <div class="form-legend-header">
              <span>基本信息</span>
          </div>
          <el-form-item label="首页名称" prop="homepageName">
            {{ homepage.homepageName }}
          </el-form-item>
          <el-form-item label="首页模式" prop="homepageModel">
            {{ HOME_MODE_MAP[homepage.homepageModel] }}
          </el-form-item>
          <el-form-item label="首页版本号" prop="homepageVersion">
            {{ homepage.homepageVersion }}
          </el-form-item>

          <div class="form-legend-header">
              <span>数据列表配置</span>
          </div>
          <el-form-item label="首页版面">
            <div>
                <el-table :data="tabGroupList" border>
                    <el-table-column
                        prop=""
                        label="排序"
                        width="100">
                        <template scope="scope">
                        {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tabId"
                        label="版面ID"
                        width="180">
                    </el-table-column>

                    <el-table-column
                        prop="tabName"
                        width="180"
                        label="版面名称">
                        <template scope="scope">
                        <el-button
                            @click.native.prevent="handleShowTabGroup(scope.$index)"
                            type="text"
                            size="small">
                            {{ scope.row.tabName }}
                        </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tabCnTitle"
                        label="TAB标题(中文)"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="tabEnTitle"
                        label="TAB标题(英文)"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="默认落焦"
                        width="100"
                        align="center"
                      >
                      <template scope="scope">
                        <span>{{ homepage.defaultFocusIndex === scope.$index ? '是' : '否' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="版面数"
                      width="100"
                    >
                      <template scope="scope">
                        <span> {{ scope.row.tabCount }} </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="默认版面"
                      width="150"
                    >
                      <template scope="scope">
                        {{ scope.row.isDefaultTab ? '有' : '无' }}
                      </template>
                    </el-table-column>

                </el-table>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </CommonContent>

  <cc-crowd-selector
      v-if="showCrowdSelector"
      @select-cancel="handleSelectCrowdCancel"
      @select-end="handleSelectCrowdEnd"
  />


  <cc-homepage-tab-group-setter
    v-if="showTabGroupSetter" 
    :tabs="homepage.tabInfos[activeTabGroupIndex]"
    :readonly="mode === 'read'"
    @set-end="handleSetTabGroupEnd"
    @set-cancel="showTabGroupSetter = false"
  />

  <div id="add-view"></div>

  <el-dialog title="审核" :visible.sync="showAuditDialog">
      <el-form>
      <el-form-item label="审核意见">
          <el-radio class="radio" v-model="auditForm.auditFlag" :label="4">通过</el-radio>
          <el-radio class="radio" v-model="auditForm.auditFlag" :label="5">打回</el-radio>
      </el-form-item>
      <el-form-item label="意见说明">
          <el-input type="textarea" v-model="auditForm.auditDesc"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      <el-button @click="showAuditDialog = false">取 消</el-button>
      <el-button type="primary" @click="handleAudit">确 定</el-button>
      </div>
  </el-dialog>
</ContentCard>

</template>

<script>
import CommonContent from '@/components/CommonContent.vue'
import TabSelector from '@/components/selectors/TabSelector'
import InputOrder from '@/components/InputOrder'
export default {
  components: {
    CommonContent,
    TabSelector,
    InputOrder
  },
  data() {
    return {
      mode: 'create',
      showTabGroupSetter: false,
      showCrowdSelector: false,
      showAuditDialog: false,
      selectedTabList: [],
      selectedTabListIndexed: {},
      activeTabGroupIndex: undefined,
      auditHistories: [],
      auditForm: {
        auditFlag: 4,
        auditDesc: ''
      },
      urls: {
        preview: '/homepageInfo/preview.html',
        edit: '/homepageInfo/edit.html',
        tools: '/buttonManage/getAuditDetailButton.html',
        edit_history_view: '/homepageInfo/editHistory.html',
      },
      versionList: [],
      homepage: {
        homepageId: undefined,
        homepageName: undefined,
        homepageModel: 'normal',
        homepageVersion: undefined,
        homepageStatus: undefined,
        currentVersion: undefined,
        defaultFocusIndex: undefined,
        tabInfos: []
      },
      HOME_MODE_MAP: {
        normal: '普通模式',
        child: '儿童模式',
        old: '老人模式'
      },
      rules: {
        homepageName: [
          { required: true, message: '请输入首页名称'}
        ],  
        homepageModel: [
          { required: true, message: '请选择首页模式'}
        ],  
        homepageVersion: [
          { required: true, message: '请输入首页版本号'}
        ]  
      }
    }
  },
  computed: {
    resourceInfo() {
      const homepage = this.homepage
      if (homepage.homepageId) {
        return {
          id: homepage.homepageId,
          type: 'homepage',
          menuElId: 'homepageInfo',
          version: homepage.currentVersion,
          status: homepage.homepageStatus
        }
      }
    },
    tabGroupList() {
      const homepage = this.homepage
      const defaultFocusIndex = homepage.defaultFocusIndex
      const tabInfos = homepage.tabInfos || []
      const tabGroupList = []
      tabInfos.forEach(function(tabList) {
        const defaultTabIndex = tabList.findIndex(function(item) {
          return item.isDefaultTab
        })
        const tabItem = {
          tabCount: tabList.length,
          canBeDefaultFocusTab: false
        }
        const tabItemToShow = tabList[defaultTabIndex > -1 ? defaultTabIndex : 0]
        // 只有普通版面和已经设了默认版面的版面组可以默认落焦
        if (defaultTabIndex > -1 || (tabItem.tabCount === 1 && tabItemToShow.dmpInfo === undefined)) {
          tabItem.canBeDefaultFocusTab = true
        }
        Object.assign(tabItem, tabItemToShow)
        tabGroupList.push(tabItem)
      })
      if (defaultFocusIndex !== undefined && !tabGroupList[defaultFocusIndex].canBeDefaultFocusTab) {
        // 如果当前默认落焦不能被设为默认落焦, 则取消当前默认落焦
        homepage.defaultFocusIndex = undefined
      }
      console.log(tabGroupList)
      return tabGroupList
    },
    buttonGroupParams() {
      const homepage = this.homepage || {}
      return  {
        type: 'homepage',
        menuElId: 'homepageInfo',
        status: homepage.homepageStatus,
        resourceId: homepage.homepageId,
        version: homepage.currentVersion
      }
    },
    isAllowCopy() {
        const STATUS = this.$consts.status
        const found = this.versionList.some(function(item) {
          const status = item.row.status
            return status === STATUS.draft || status === STATUS.waiting || status === STATUS.rejected
        })
        return !found
    },
  },
  props: ['id', 'initMode'],
  methods: {
    handleShowTabGroup(index) {
      this.activeTabGroupIndex = index
      this.showTabGroupSetter = true
    },
    handleSetTabGroupEnd(tabList) {
      this.showTabGroupSetter = false
      this.$set(this.homepage.tabInfos, this.activeTabGroupIndex, tabList)
    },
    handleSaveDraft() {
      const data = JSON.parse(JSON.stringify(this.homepage))
      data.homepageStatus = 2
      if (this.mode === 'replicate') {
        data.currentVersion = undefined
      }
      this.submit(data)
    },
    handleSubmitAudit() {
      const data = JSON.parse(JSON.stringify(this.homepage))
      data.homepageStatus = 3
      if (this.mode === 'replicate') {
        data.currentVersion = undefined
      }
      this.submit(data)
    },
    validate(data, cb) {
      this.$refs.homepageForm.validate(function(valid) {
        if (valid) {
          const tabInfos = data.tabInfos
          let error = ''
          if (data.homepageStatus === 3) {
            if (data.tabInfos.length === 0) {
              return cb('请至少选择一个版面')
            }

            if (data.defaultFocusIndex === undefined) {
              return cb('请选择默认落焦版面')
            }
            
            // 检查重复版面
            // 默认版面与普通版面之间不能重复
            // 定向版面不能与默认版面和普通版面重复
            // 定向版面之间不能重复
            const normalTabListIndexed = {}
            const specTabListIndexed = {}
            // 普通版面重复检查
            for(let i = 0, length = tabInfos.length; i < length; i++) {
              const tabGroup = tabInfos[i]
              let tab
              let isNormalTab 
              if (tabGroup.length === 1 && tabGroup[0].dmpInfo === undefined){
                // 普通版面
                isNormalTab = true
                tab = tabGroup[0]
              } else {
                // 含有2个或以上版面，不是普通版面, 找出默认版面
                isNormalTab = false
                tab = tabGroup.find(function(item) {
                  return item.isDefaultTab
                })
              }
              if (tab) {
                const duplicateIndex = normalTabListIndexed[tab.tabId] 
                if (duplicateIndex !== undefined) {
                  return cb('第 ' + (i + 1) + ' 个版面与第 ' + (duplicateIndex + 1) + ' 个版面或默认版面重复')
                } else {
                  normalTabListIndexed[tab.tabId] = i
                }
              }
            }
            
            checkDmp:
            for(let i = 0, length = tabInfos.length; i < length; i ++) {
              const tabGroup = tabInfos[i]
              // 定向版面之间不能重复
              // 也不能与其他的默认版面和普通版面重复
              if (tabGroup.length === 1 && tabGroup[0].dmpInfo === undefined) {
                // 普通版面，跳过
                continue
              }
              for(let j = 0, lengthJ = tabGroup.length; j < lengthJ; j++) {
                // 不需要再检测同组的版面是否重复，因为在设定组内版面的时候保证了唯一
                // 下面只需要判断定向的有没有与普通版面和默认版面重复
                const duplicateIndex = normalTabListIndexed[tabGroup[j].tabId]
                const dmpInfo = tabGroup[j].dmpInfo || {}
                if (!tabGroup[j].isDefaultTab) {
                  if (dmpInfo.dmpCrowdId === undefined) {
                    return cb('请设置第 ' + (i + 1) + ' 个组第 ' + (j+1) + ' 个版面的人群')
                  } else if (duplicateIndex !== undefined) {
                    return cb('第 ' + (i + 1) + ' 个版面组里的第' + (j + 1) + '个版面与第 ' + (duplicateIndex + 1) + ' 个版面组的版面重复')
                  }
                }
              }
            }
          }
          cb()
        } else {
          cb('请把表单填写完整')
        } 
      })
    },
    submit(data) {
      this.validate(data, function(err) {
        if (!err) {
          this.$service.homePageInfoSave(this.parseDataToApi(data), '保存成功').then((result) => {
            this.$emit('upsert-end')
          })
        } else {
          this.$message({
            type: 'error',
            message: err
          })
        }
      }.bind(this))
    },
    parseApiToData(data) {
      const finalData = JSON.parse(JSON.stringify(data))
      const defaultFocusIndex = finalData.tabInfos.findIndex(function(item) {
        return item.tabIsFocus === 1
      })
      finalData.defaultFocusIndex = defaultFocusIndex > -1 ? defaultFocusIndex : undefined
      const tabInfos = []
      ;(finalData.tabInfos || []).forEach(function(item, index) {
        const tabInfoItem = []
        if (item.tabId) {
          // 那是一个普通的版面
          tabInfoItem.push({
            tabId: item.tabId,
            tabName: item.tabName,
            tabCnTitle: item.tabCnTitle,
            tabEnTitle: item.tabEnTitle,
            currentVersion: item.currentVersion,
            isDefaultTab: false
          })
        } 
        if (item.dmpTabList) {
          item.dmpTabList.forEach(function(dItem) {
            // 人群为 -1 的是默认版面
            const currentItem = {
              isDefaultTab: false,
              tabId: dItem.tabId,
              tabName: dItem.tabName,
              tabCnTitle: dItem.tabCnTitle,
              tabEnTitle: dItem.tabEnTitle,
              currentVersion: dItem.currentVersion,
            }
            if (dItem.dmpCrowdId === -1) {
              currentItem.isDefaultTab = true
            } else if(dItem.dmpCrowdId !== undefined) {
              currentItem.dmpInfo = {
                dmpPolicyId: dItem.dmpPolicyId,
                dmpPolicyName: dItem.dmpPolicyName,
                dmpCrowdName: dItem.dmpCrowdName,
                dmpCrowdId: dItem.dmpCrowdId
              }
            }
            tabInfoItem.push(currentItem)
          })
        }

        tabInfos.push(tabInfoItem)
      })
      finalData.tabInfos = tabInfos
      return finalData 
    },
    parseDataToApi(data) {
      const finalData = JSON.parse(JSON.stringify(data))
      const defaultFocusIndex = finalData.defaultFocusIndex
      const tabInfos = []
      finalData.tabInfos.forEach(function(item, index) {
        const tabInfoItem = {
          isDmpTab: 0,
          tabIsFocus: index === defaultFocusIndex ? 1 : 0
        }
        const dmpTabList = []
        let tabSequence = 0
        const itemLength = item.length
        item.forEach(function(tItem) {
          // 如果只有一个版面，并且版面没有设人群，那它是一个普通的版面
          if (tItem.dmpInfo === undefined && item.length === 1) {
            tabInfoItem.tabId = tItem.tabId
            tabInfoItem.tabSequence = index
          } else {
            // 否则，它不是普通版面
            if (tItem.isDefaultTab) {
              // 如果它是默认版面
              tabInfoItem.tabId = tItem.tabId
              tabInfoItem.tabSequence = index
            } else {
              const dmpInfo = tItem.dmpInfo || {}
              dmpTabList.push({
                tabId: tItem.tabId,
                tabSequence: tabSequence++,
                dmpPolicyId: dmpInfo.dmpPolicyId,
                dmpCrowdId: dmpInfo.dmpCrowdId,
                dmpPolicyName: dmpInfo.dmpPolicyName,
                dmpCrowdName: dmpInfo.dmpCrowdName
              })
            }
          }
        })
        if (dmpTabList.length > 0) {
          if (tabInfoItem.tabId) {
            // 如果有默认版面，又有dmp，把默认版面dmp列表最后
            dmpTabList.push({
              tabId: tabInfoItem.tabId,
              tabSequence: tabSequence++,
              dmpPolicyName: '不限',
              dmpCrowdName: '不限',
              dmpPolicyId: -1,
              dmpCrowdId: -1,
            })
            tabInfoItem.tabId = undefined
          }
          tabInfoItem.isDmpTab = 1
          tabInfoItem.dmpTabList = dmpTabList
        }
        tabInfos.push(tabInfoItem)
      })

      finalData.tabInfos = tabInfos
      delete finalData.defaultFocusIndex
      return finalData
    },
    setHomepage(data) {
      data = this.parseApiToData(data)
      Object.assign(this.homepage, data)
      this.selectedTabList = data.tabInfos.map(function(item) {
        return {
          id: item.tabId,
          label: item.tabName,
          data: item
        }
      })
    },
    handleSelectTabEnd(data) {
      this.showTabSelector = false
      const tabInfos = this.homepage.tabInfos
      data.forEach(function(item) {
        tabInfos.push([
          Object.assign({}, item.data)
        ])
      })
    },
    handleChangeTabOrder(index, order) {
        const homepage = this.homepage
        const tabList = homepage.tabInfos
        if (order > tabList.length) {
          order = tabList.length
        }
        const newIndex = order - 1
        const oldIndex = index
        const item = tabList[oldIndex]
        const defaultFocusIndex = homepage.defaultFocusIndex
        const defaultFocusItem = tabList[defaultFocusIndex]
        tabList.splice(oldIndex, 1)
        const newTabList = [].concat(tabList.slice(0, newIndex), [item], tabList.slice(newIndex))
        homepage.tabInfos = newTabList
        if (defaultFocusIndex > -1) {
          homepage.defaultFocusIndex = newTabList.findIndex(function(item) {
            return item === defaultFocusItem
          })
        }
    },
    handleCreateTab() {
        const url = $basePath + '/tabInfo/add.html';
        const FastDevTool = this.FastDevTool
        FastDevTool.createDialogWin('add-view', {
            confirmInfo: true,
            fit: true,
            iconCls: 'icon-edit',
            minimizable: false,
            maximizable: true,
            title: '版面页面',
            content: FastDevTool.createIframe(url)
        });
    },
    handleRemoveTab(index) {
        const homepage = this.homepage
        const defaultFocusIndex = homepage.defaultFocusIndex
        this.homepage.tabInfos.splice(index, 1)
        homepage.defaultFocusIndex = index < defaultFocusIndex
          ? defaultFocusIndex - 1
          : index === defaultFocusIndex
            ? undefined
            : defaultFocusIndex
    },
    handleSelectVersion(version) {
        const homepage = this.homepage
        const href = location.pathname + '?id=' + homepage.homepageId + '&version=' + version
        location.href = href
    },
    handleEdit() {
        const homepage = this.homepage
        window.location.href = this.urls.edit + '?id=' + homepage.homepageId + '&version=' + homepage.currentVersion
    },
    handleDelete() {
        const FastDevTool = this.FastDevTool
        const urls = this.urls
        const homepage = this.homepage
        FastDevTool.createConfirmWin({ // 审核
            title: '提示',
            content: '确认删除该版本吗?'
        }, function () {
          this.$service.homepageDeleteHistory({
            id: homepage.homepageId, 
            version: homepage.currentVersion
          }, '删除成功').then(function() {
            if (this.versionList.length > 1) { // 有其他版本时 切换到其他版本详情页
                window.location.href = urls.preview + '?id=' + homepage.homepageId;
                window.parent.$('#list-view').datagrid('reload');
            } else { // 没有其他版本时 返回到版面列表页
                FastDevTool.closeParentDialogWin('edit-view', 'list-view');
            }
            }.bind(this))
        }.bind(this));
    },
    handleAudit() {
        const FastDevTool = this.FastDevTool
        const auditForm = this.auditForm
        const homepage = this.homepage
        if (auditForm.auditDesc.trim() === '') {
            FastDevTool.createAlertWin('请填写意见说明');
        } else {
            this.$service.audit({
                id: homepage.homepageId,
                version: homepage.currentVersion,
                type: 'homepage',
                auditFlag: auditForm.auditFlag,
                auditDesc: auditForm.auditDesc
            }).then(function(result) {
              this.showAuditDialog = false
              FastDevTool.closeParentDialogWin('edit-view', 'list-view');
            }.bind(this), '操作成功')
        }
    },
    handleUnAudit() {
      const homepage = this.homepage
      const FastDevTool = this.FastDevTool
      this.$confirm('您确定要撤销审核吗?', '提示')
        .then(function() {
          this.$service.revokeAudit({
            id: homepage.homepageId,
            version: homepage.currentVersion,
            type: 'homepage'
          }).then(function() {
            FastDevTool.closeParentDialogWin('edit-view', 'list-view');
          }.bind(this))
        }.bind(this))
        .catch(function(){})
    },
    handleCreateReplica() {
      const homepage = this.homepage
      const href = this.urls.edit_history_view + '?id=' + homepage.homepageId + '&version=' + homepage.currentVersion
      window.location.href = href
    },
    handleCopy() {
      const data = JSON.parse(JSON.stringify(this.homepage))
      data.homepageId = undefined
      data.currentVersion = '';
      this.submit(data)
    },
    handleShelves() {
      const homepage = this.homepage
      this.$service.shelves({
        id: homepage.homepageId,
        version: homepage.currentVersion,
        type: 'homepage'
      }).then(function() {
        window.location.reload();
      })
    },
    fetchData(version) {
      this.$service.homePageGetDetail({id: this.id, version}).then((data) => {
        this.setHomepage(data)
      })
    }
  },
  created() {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData()
    }
  }
}
</script>
<style scoped>
.version-selector {
  width: 350px;
}
.version-selector .el-input {
  max-width: 350px
}
.status {
  display: inline-block;
  width: 120px;
  height: 30px;
  line-height: 30px;
  padding: 0 5px;
  background: #4fc71b;
  color: #fff;
  text-align: center;
}
</style>