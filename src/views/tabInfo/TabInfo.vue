<template>
  <PageWrapper class="tab-info-wrapper">
    <PageContentWrapper v-show="activePage === 'tab_info'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          ref="commonContent"
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'"
          @copy="handleCopy"
          @edit="mode = 'edit'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @submit-audit="handleSubmitAudit"
          @save-draft="handleSaveDraft"
          @select-version="fetchData"
          @cancel-timing="fetchData(tabInfo.currentVersion)"
          @delete="$emit('upsert-end', $event)"
        >
          <template v-if="mode !== 'read'">
            <el-form ref="tabForm" :rules="rules" :model="tabInfo" label-width="170px">
              <div class="form-legend-header" @click="isCollapseBase = !isCollapseBase">
                <i v-if="isCollapseBase" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>基本信息</span>
              </div>
              <div :style="{display: isCollapseBase ? 'none' : 'block'}">
                <el-form-item label="版面名称" prop="tabName">
                  <el-input v-model.trim="tabInfo.tabName"></el-input>
                </el-form-item>

                <el-form-item label="TAB标题(中文)" prop="tabCnTitle">
                  <el-input v-model.trim="tabInfo.tabCnTitle"></el-input>
                </el-form-item>

                <el-form-item label="TAB标题(英文)" prop="tabEnTitle">
                  <el-input v-model.trim="tabInfo.tabEnTitle"></el-input>
                </el-form-item>

                <el-form-item label="业务分类" prop="tabCategory" class="selectItem">
                  <cc-business-type-selector
                    :is-read="isReplicate"
                    :value="tabInfo.tabCategory"
                    @input="handleChangeTabCategory"
                  />
                </el-form-item>

                <el-form-item v-show="showSystemDefault" label="系统默认" prop="systemDefault">
                  <el-switch
                    on-text="是"
                    off-text="否"
                    :value="!!tabInfo.systemDefault"
                    @input="tabInfo.systemDefault = $event ? 1 : 0"
                  />
                </el-form-item>

                <el-form-item label="AppId" prop="tabAppid" class="selectItem">
                  <cc-appid-selector
                    :is-read="isReplicate"
                    :disabled="disableAppId"
                    v-model="tabInfo.tabAppid"
                  />
                </el-form-item>

                <el-form-item v-if="hasSource" label="内容源" prop="tabResource">
                  <SourceRadioSelector
                    :value="tabInfo.tabResource"
                    @input="handleChangeSource"
                    :disabled="isReplicate"
                  />
                </el-form-item>

                <el-form-item label="TAB对应的icon" prop="pictureName">
                  <el-button type="primary" plain @click="handleSelectIconStart">选择</el-button>
                  <span v-if="tabInfo.iconTypeName" class="marginL">已选择： {{ tabInfo.iconTypeName }}</span>
                </el-form-item>

                <el-form-item label="标题图片">
                  <cc-global-picture-selector
                    title="选择素材"
                    @select-end="handleSelectTitleIcon('imgOnSelected', $event)"
                    picture-resolution="178*80"
                  >
                    <el-form-item class="tab-title-icon-wrapper" prop="imgOnSelected">
                      <template v-if="tabInfo.imgOnSelected">
                        <img :src="tabInfo.imgOnSelected">
                        <i @click.stop="tabInfo.imgOnSelected = ''" class="el-icon el-icon-close tab-title-icon__remove"></i>
                      </template>
                      <div class="tab-title-icon__title">选中</div>
                    </el-form-item>
                  </cc-global-picture-selector>

                  <cc-global-picture-selector
                    title="选择素材"
                    @select-end="handleSelectTitleIcon('imgOnFocus', $event)"
                    picture-resolution="178*80"
                  >
                    <el-form-item class="tab-title-icon-wrapper" prop="imgOnFocus">
                      <template v-if="tabInfo.imgOnFocus">
                        <img :src="tabInfo.imgOnFocus">
                        <i @click.stop="tabInfo.imgOnFocus = ''" class="el-icon el-icon-close tab-title-icon__remove"></i>
                      </template>
                      <div class="tab-title-icon__title">落焦</div>
                    </el-form-item>
                  </cc-global-picture-selector>

                  <cc-global-picture-selector
                    title="选择素材"
                    @select-end="handleSelectTitleIcon('imgOnBlur', $event)"
                    picture-resolution="178*80"
                  >
                    <el-form-item class="tab-title-icon-wrapper" prop="imgOnBlur">
                      <template v-if="tabInfo.imgOnBlur">
                        <img :src="tabInfo.imgOnBlur">
                        <i @click.native="tabInfo.imgOnBlur = ''" class="el-icon el-icon-close tab-title-icon__remove"></i>
                      </template>
                      <div class="tab-title-icon__title">非落焦</div>
                    </el-form-item>
                  </cc-global-picture-selector>
                </el-form-item>

                <el-form-item label="固定刷新时间" prop="timeCycle">
                  <InputMinute v-model="tabInfo.timeCycle" :min="5" :max="360" />
                  <span class="hint remarks">设置范围:5分钟-6小时</span>
                </el-form-item>
              </div>

              <div v-if="mode === 'edit'|| mode ==='replicate'">
              <div class="form-legend-header" @click="handleTabDataClick">
                <i v-if="isCollapseData" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>版面数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                昨日UVCTR：<span>{{tabUVCTR.value?toPercent(tabUVCTR.value):'N/A'}}</span>，
                日环比<span :class="tabUVCTR.dailyGrowth>0 ? 'data-up' : 'data-down'">{{tabUVCTRPercent.dailyGrowth}}</span>；
                周同比<span :class="tabUVCTR.weeklyGrowth>0 ? 'data-up' : 'data-down'">{{tabUVCTRPercent.weeklyGrowth}}</span>
              </div>
              <div v-if="!isCollapseData">
                <div class="chart-box">
                  <div class="chart-box--title">{{clickUvChartData.title}}</div>
                  <VeLine :data="clickUvChartData" :legend-visible="false" :extend="clickUvChartExtend" :settings="clickUvChartSettings"></VeLine>
                </div>
                <div class="chart-box">
                  <div class="chart-box--title">{{uvctrChartData.title}}</div>
                  <VeLine :data="uvctrChartData" :legend-visible="false" :extend="uvctrChartExtend" :settings="uvctrChartSettings"></VeLine>
                </div>
                <div class="chart-box">
                  <div class="chart-box--title">{{uvctrHourChartData.title}}</div>
                  <VeLine :data="uvctrHourChartData" :legend-visible="false" :extend="uvctrHourChartExtend":settings="uvctrHourChartSettings"></VeLine>
                </div>
              </div>
              </div>

              <div class="form-legend-header" @click="isCollapseExtend = !isCollapseExtend">
                <i v-if="isCollapseExtend" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>版块配置</span>
              </div>

              <div :style="{display: isCollapseExtend ? 'none' : 'block'}">
                <el-form-item label="版面属性" prop="tabType">
                  <el-radio-group v-model="tabInfo.tabType" :disabled="isReplicate">
                    <el-radio
                      v-for="(item, key) in TAB_TYPES"
                      :key="key"
                      :label="item.value"
                    >{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>

                <template v-if="tabInfo.tabType === 1">
                  <el-form-item label="是否二级版面" prop="hasSubTab">
                    <el-switch
                      :disabled="isReplicate"
                      :value="!!tabInfo.hasSubTab"
                      @input="handleInputHasSubTab"
                      on-text="是"
                      off-text="否"
                    />
                  </el-form-item>

                  <el-form-item v-if="tabInfo.hasSubTab === 1" label="是否支持记忆" prop="flagIsRecord">
                    <el-switch
                      :value="!!tabInfo.flagIsRecord"
                      @input="tabInfo.flagIsRecord= $event&&1||0"
                      on-text="是"
                      off-text="否"
                    />
                  </el-form-item>

                  <el-form-item label="活动浮窗" prop="floatWindow">
                    <cc-float-window-selector
                      @select-end="handleSelectFloatWindowEnd"
                      :params="floatWindowParams"
                    />
                    <template v-if="tabInfo.activityFloatWindow">
                      已选择: {{ tabInfo.activityFloatWindow.pluginName }}
                      <el-button type="danger" size="small" @click="handleRemoveFloatWindow">删除</el-button>
                    </template>
                  </el-form-item>

                  <el-form-item label="选择版面" v-if="tabInfo.hasSubTab === 1">
                    <cc-tab-selector-el
                      ref="tabSelector"
                      :source="tabInfo.tabResource"
                      :has-sub-tab="0"
                      @select-start="handleSelectTabStart"
                      @select-end="handleSelectTabEnd"
                    />
                    <el-button type="primary" plain @click="handleCreateTab">新建版面</el-button>
                    <div>
                      <OrderableTable
                        ref="subTabTable"
                        v-model="tabInfo.tabList"
                        :header="subTabTableHeader"
                      />
                    </div>
                  </el-form-item>
                </template>

                <template v-if="tabInfo.tabType === 2">
                  <el-form-item label="活动浮窗" prop="floatWindow">
                    <cc-float-window-selector
                      @select-end="handleSelectFloatWindowEnd"
                      :params="floatWindowParams"
                    />
                    <template v-if="tabInfo.activityFloatWindow">
                      已选择: {{ tabInfo.activityFloatWindow.pluginName }}
                      <el-button type="danger" size="small" @click="handleRemoveFloatWindow">删除</el-button>
                    </template>
                  </el-form-item>
                </template>

                <el-form-item label="选择版块" v-if="tabInfo.hasSubTab === 0">
                  <div
                    class="tab-info__virtual-tab-menu"
                    :style="{visibility: isPanelDragging ? 'hidden' : 'visible'}"
                  >
                    <Affix
                      relative-element-selector=".tab-info__virtual-tab"
                      scroll-container-selector=".el-main"
                      style="width: 840px; display: inline-block;background: #fff; z-index: 1;"
                      :offset="{ top: 128, bottom: 50 }"
                    >
                      <cc-panel-selector-el
                        ref="panelSelector"
                        :source="tabInfo.tabResource"
                        @select-end="handleSelectPanelEnd"
                      />
                      <el-dropdown>
                        <el-button type="primary" plain >
                          新建
                          <i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="activePage = 'panel'">常规版块</el-dropdown-item>
                          <el-dropdown-item @click.native="activePage = 'album_panel'">业务专辑</el-dropdown-item>
                          <el-dropdown-item @click.native="activePage = 'private_panel'">专属影院</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <el-button class="marginL" type="primary" plain @click="handleToggleAllPanel(false)">展开所有</el-button>
                      <el-button type="primary" plain @click="handleToggleAllPanel(true)">收起所有</el-button>
                    </Affix>
                  </div>
                  <cc-virtual-tab
                    ref="virtualTab"
                    class="tab-info__virtual-tab"
                    @insert-panel="handleInsertPanel"
                    @reorder-panel="handleReOrderPanel"
                    @remove-panel="handleRemovePanel"
                    @change-crowd="handleChangeCrowdOfPanel"
                    @toggle-type="handleTogglePanelType"
                    @collapse="handleChangeCollapseState"
                    @uncollapse="handleChangeCollapseState"
                    @open-panel="handlePreviewPanel"
                    @change-panel-order="handleChangePanelOrder"
                    @click-block="handleClickBlock"
                    @drag-start="handleDragStart"
                    @drag-end="handleDragEnd"
                    @show-all-panel="handleShowAllPanels"
                    :panels="tabInfo.pannelList"
                    :panel-data="panelListIndexed"
                    :width="840"
                    :ratio="0.4"
                    :show-title="true"
                  />
                </el-form-item>
              </div>

              <template v-if="tabInfo.tabType === 2">
                <div class="form-legend-header" @click="isCollapseSpec = !isCollapseSpec">
                  <i v-if="isCollapseSpec" class="el-icon-arrow-down"></i>
                  <i v-else class="el-icon-arrow-up"></i>
                  <span>专题配置</span>
                </div>

                <div :style="{display: isCollapseSpec || isPanelDragging ? 'none' : 'block'}">
                  <el-form-item label="会员展示">
                      <el-select placeholder="前端不显示" v-model="tabInfo.vipButtonSourceId" :clearable="true">
                          <el-option
                              v-for="(item, index) in vipEnums"
                              :value="item.value"
                              :label="item.label"
                              :key="index">
                          </el-option>
                      </el-select>
                  </el-form-item>

                  <el-form-item label="专题版面大背景" prop="alumbTabBg">
                    <cc-global-picture-selector
                      title="选择素材"
                      @select-end="handleSelectBgEnd"
                      picture-resolution="1920*1080"
                    />
                    <div class="image-preview-wrapper" v-if="tabInfo.alumbTabBg">
                      <img class="image-preview" :src="tabInfo.alumbTabBg">
                    </div>
                  </el-form-item>
                  <el-form-item label="专题版面长图背景图" prop="alumbTabLongBg">
                    <cc-global-picture-selector
                      title="选择长图素材"
                      @select-end="handleSelectLongBgEnd"
                      :query-long-poster="1"
                    />
                    <span class="remarks marginL">备注：长图下最多支持6个版块</span>
                    <div
                      class="image-preview-wrapper image-preview-wrapper--long"
                      v-if="tabInfo.alumbTabLongBg"
                    >
                      <img class="image-preview" :src="tabInfo.alumbTabLongBg">
                      <i
                        title="移除"
                        @click="tabInfo.alumbTabLongBg = undefined"
                        class="el-icon el-icon-close"
                      ></i>
                    </div>
                  </el-form-item>
                  <el-form-item label="启用高清背景切换模式" prop="flagIsBlockBg">
                    <el-switch
                      :value="!!tabInfo.flagIsBlockBg"
                      @input="tabInfo.flagIsBlockBg = $event ? 1 : 0"
                      on-text="是"
                      off-text="否"
                    />
                  </el-form-item>
                  <el-form-item label="版面简介显示高">
                    <el-input-number
                      :min="0"
                      :max="880"
                      :step="1"
                      v-model.number="tabInfo.sinkSize"
                    /><span class="remarks marginL"> 注:数值范围0-880</span>
                  </el-form-item>
                  <el-form-item label="版块标题颜色">
                    <el-color-picker v-model="tabInfo.pannelTitleColor"/>
                  </el-form-item>
                  <el-form-item label="推荐位字体颜色(落焦)">
                    <el-color-picker v-model="tabInfo.blockTitleFocusColor"/>
                  </el-form-item>
                  <el-form-item label="推荐位字体颜色(非落焦)">
                    <el-color-picker v-model="tabInfo.blockTitleUnfocusColor"/>
                  </el-form-item>
                </div>
              </template>

              <div v-if="!tabInfo.hasSubTab" class="form-legend-header" @click="isCollapseCustom = !isCollapseCustom">
                <i v-if="isCollapseCustom" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>版块个性化排序配置</span>
              </div>

              <div v-if="!tabInfo.hasSubTab"  :style="{display: isCollapseCustom ? 'none' : 'block'}">
                <el-form-item label="启动版块个性化推荐">
                  <el-switch 
                    :value="!!tabInfo.panelRecommendConfig.enableRecommend" 
                    @input="handleInputRecommendFlag" />
                </el-form-item>
                <div v-if="tabInfo.panelRecommendConfig.enableRecommend">
                  <el-form-item label="选择版块流" prop="panelRecommendConfig.recommendSign" :rules="[{required: true, message: '请选择版块流'}]">
                    <RecommendStreamSignSelector 
                      confirm="改变版块流将清空优先推荐版块，确认修改？"
                      :value="tabInfo.panelRecommendConfig.recommendSign"
                      @input="handleInputRecommendSign"/>
                    该流可推荐版块: {{ recommendStreamSignPanelCount }} 个
                  </el-form-item>
                  <el-form-item label="从第几个位置开始推荐" prop="panelRecommendConfig.recommendIndex" :rules="[{required: true, message: '请设置开始推荐位置', trigger: 'blur'}]">
                    <InputPositiveInt style="width: 200px" v-model="tabInfo.panelRecommendConfig.recommendIndex" />
                    例: 选择 1， 则整个版面都是个性化推荐, 当前版块总数 {{ tabInfo.pannelList.length }}
                  </el-form-item>
                  <el-form-item label="优先推荐版块">
                    <RecommendPanelSelector 
                      :disabled="!tabInfo.panelRecommendConfig.recommendSign"
                      :title="tabInfo.panelRecommendConfig.recommendSign ? '选择版块' : '请先选择版块流'"
                      :category="tabInfo.panelRecommendConfig.recommendSign" 
                      :source="tabInfo.tabResource" 
                      @select-end="handleSelectRecommendPanelEnd" />

                    <OrderableTable
                      v-model="tabInfo.panelRecommendConfig.panelInfoList"
                      :header="panelRecommendHeader"
                    />
                </el-form-item>
                </div>
              </div>
            </el-form>

            <cc-icon-selector
              v-if="showIconSelector"
              @select-cancel="handleSelectIconCancel"
              @select-end="handleSelectIconEnd"
            />
            <cc-crowd-selector
              v-if="showCrowdSelector"
              @select-cancel="handleSelectCrowdCancel"
              @select-end="handleSelectCrowdEnd"
            />
          </template>
          <template v-if="mode === 'read'">
            <el-form ref="tabForm" :rules="rules" :model="tabInfo" label-width="170px">
              <div class="form-legend-header" @click="isCollapseBase = !isCollapseBase">
                <i v-if="isCollapseBase" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>基本信息</span>
              </div>

              <div :style="{display: isCollapseBase ? 'none' : 'block'}">
                <el-form-item label="版面名称" prop="tabName">{{ tabInfo.tabName }}</el-form-item>

                <el-form-item label="TAB标题(中文)" prop="tabCnTitle">{{ tabInfo.tabCnTitle }}</el-form-item>

                <el-form-item label="TAB标题(英文)" prop="tabEnTitle">{{ tabInfo.tabEnTitle }}</el-form-item>

                <el-form-item label="业务分类" prop="tabCategory">
                  <cc-business-type-selector :is-read="true" v-model="tabInfo.tabCategory"/>
                </el-form-item>

                <el-form-item
                  v-show="showSystemDefault"
                  label="系统默认"
                  prop="systemDefault"
                >{{ tabInfo.systemDefault ? '是' : '否'}}</el-form-item>

                <el-form-item label="AppId" prop="tabAppid">
                  <cc-appid-selector :is-read="true" v-model="tabInfo.tabAppid"/>
                </el-form-item>

                <el-form-item
                  v-if="hasSource"
                  label="内容源"
                  prop="tabResource"
                >{{ $consts.sourceText[tabInfo.tabResource] }}</el-form-item>

                <el-form-item label="TAB对应的icon" prop="pictureName">
                  <span v-if="tabInfo.iconTypeName">{{ tabInfo.iconTypeName }}</span>
                  <div
                    v-if="tabInfo.pictureUrl"
                    class="tab-icon-wrapper"
                    @click="handleSelectIconStart"
                  >
                    <img :src="tabInfo.pictureUrl">
                  </div>
                </el-form-item>

                <el-form-item label="标题图片">
                  <el-form-item class="tab-title-icon-wrapper" prop="imgOnSelected">
                    <img v-if="tabInfo.imgOnSelected" :src="tabInfo.imgOnSelected">
                    <div class="tab-title-icon__title">选中</div>
                  </el-form-item>

                  <el-form-item class="tab-title-icon-wrapper" prop="imgOnFocus">
                    <img v-if="tabInfo.imgOnFocus" :src="tabInfo.imgOnFocus">
                    <div class="tab-title-icon__title">落焦</div>
                  </el-form-item>

                  <el-form-item class="tab-title-icon-wrapper" prop="imgOnBlur">
                    <img v-if="tabInfo.imgOnBlur" :src="tabInfo.imgOnBlur">
                    <div class="tab-title-icon__title">非落焦</div>
                  </el-form-item>
                </el-form-item>

                <el-form-item label="固定刷新时间" prop="timeCycle">{{ parseMinToStr(tabInfo.timeCycle) }}</el-form-item>
              </div>
              
              <div class="form-legend-header" @click="handleTabDataClick">
                <i v-if="isCollapseData" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>版面数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                昨日UVCTR：<span>{{tabUVCTR.value?toPercent(tabUVCTR.value):'N/A'}}</span>，
                日环比<span :class="tabUVCTR.dailyGrowth>0 ? 'data-up' : 'data-down'">{{tabUVCTRPercent.dailyGrowth}}</span>；
                周同比<span :class="tabUVCTR.weeklyGrowth>0 ? 'data-up' : 'data-down'">{{tabUVCTRPercent.weeklyGrowth}}</span>
              </div>
              <div v-if="!isCollapseData">
                <div class="chart-box">
                  <div class="chart-box--title">{{clickUvChartData.title}}</div>
                  <VeLine :data="clickUvChartData" :legend-visible="false" :extend="clickUvChartExtend" :settings="clickUvChartSettings"></VeLine>
                </div>
                <div class="chart-box">
                  <div class="chart-box--title">{{uvctrChartData.title}}</div>
                  <VeLine :data="uvctrChartData" :legend-visible="false" :extend="uvctrChartExtend" :settings="uvctrChartSettings"></VeLine>
                </div>
                <div class="chart-box">
                  <div class="chart-box--title">{{uvctrHourChartData.title}}</div>
                  <VeLine :data="uvctrHourChartData" :legend-visible="false" :extend="uvctrHourChartExtend":settings="uvctrHourChartSettings"></VeLine>
                </div>
              </div>
              
              <div class="form-legend-header" @click="isCollapseExtend = !isCollapseExtend">
                <i v-if="isCollapseExtend" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>配置内容</span>
              </div>

              <div :style="{display: isCollapseExtend ? 'none' : 'block'}">
                <el-form-item
                  label="版面属性"
                  prop="tabType"
                >{{ tabInfo.tabType === 1 ? '普通版面' : '专题版面'}}</el-form-item>

                <template v-if="tabInfo.tabType === 1">
                  <el-form-item
                    label="是否二级版面"
                    prop="hasSubTab"
                  >{{ tabInfo.hasSubTab === 1 ? '是' : '否'}}</el-form-item>

                  <el-form-item
                    v-if="tabInfo.hasSubTab === 1"
                    label="是否支持记忆"
                    prop="flagIsRecord"
                  >{{ tabInfo.flagIsRecord === 1 ? '是' : '否'}}</el-form-item>

                  <el-form-item label="活动浮窗" prop="floatWindow">
                    <template
                      v-if="tabInfo.activityFloatWindow"
                    >{{ tabInfo.activityFloatWindow.pluginName }}</template>
                  </el-form-item>

                  <el-form-item label="选择版面" v-if="tabInfo.hasSubTab === 1">
                    <div>
                      <el-table
                        :data="tabInfo.tabList"
                        border
                        style="margin-top: 20px; max-width: 80%"
                      >
                        <el-table-column prop label="排序" width="100">
                          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                        </el-table-column>
                        <el-table-column prop="tabId" label="版面ID" width="180"></el-table-column>
                        <el-table-column prop="tabName" label="版面名称">
                          <template slot-scope="scope">
                            <el-button
                              @click.native.prevent="handlePreviewTab(scope.row, scope.row.currentVersion, scope.$index)"
                              type="text"
                              size="small"
                            >{{ scope.row.tabName }}</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column prop="duplicateVersion" label="待审核副本" width="120">
                          <template slot-scope="scope">
                            <el-button
                              v-if="scope.row.duplicateVersion"
                              @click.native.prevent="handlePreviewTab(scope.row, scope.row.duplicateVersion, scope.$index)"
                              type="text"
                              size="small"
                            >{{ scope.row.duplicateVersion }}</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </template>

                <template v-if="tabInfo.tabType === 2">
                  <el-form-item label="活动浮窗" prop="floatWindow">
                    <template
                      v-if="tabInfo.activityFloatWindow"
                    >{{ tabInfo.activityFloatWindow.pluginName }}</template>
                  </el-form-item>
                </template>

                <el-form-item label="选择版块" v-if="tabInfo.hasSubTab === 0">
                  <div class="tab-info__virtual-tab-menu">
                    <affix
                      relative-element-selector=".tab-info__virtual-tab"
                      scroll-container-selector=".el-main"
                      style="width: 840px; display: inline-block;background: #fff; z-index: 1;"
                      :offset="{ top: 128, bottom: 50 }"
                    >
                      <el-button @click="handleToggleAllPanel(false)">展开所有</el-button>
                      <el-button @click="handleToggleAllPanel(true)">收起所有</el-button>
                    </affix>
                  </div>
                  <cc-virtual-tab
                    class="tab-info__virtual-tab"
                    @open-panel="handlePreviewPanel"
                    :panels="tabInfo.pannelList"
                    :panel-data="panelListIndexed"
                    @click-block="handleClickBlock"
                    @collapse="handleChangeCollapseState"
                    @uncollapse="handleChangeCollapseState"
                    @show-all-panel="handleShowAllPanels"
                    :read-only="true"
                    :width="840"
                    :ratio="0.4"
                    :show-title="true"
                  />
                </el-form-item>

                <template v-if="tabInfo.tabType === 2">
                  <div class="form-legend-header">
                    <span>专题配置</span>
                  </div>

                  <el-form-item label="会员展示">
                      {{ getVipButtonSourceItem(tabInfo.vipButtonSourceId).sourceName }}
                  </el-form-item>

                  <el-form-item label="专题版面大背景" prop="alumbTabBg">
                    <div class="image-preview-wrapper" v-if="tabInfo.alumbTabBg">
                      <img class="image-preview" :src="tabInfo.alumbTabBg">
                    </div>
                  </el-form-item>

                  <el-form-item label="专题版面长图背景" prop="alumbTabLongBg">
                    <div class="image-preview-wrapper" v-if="tabInfo.alumbTabLongBg">
                      <img class="image-preview" :src="tabInfo.alumbTabLongBg">
                    </div>
                  </el-form-item>

                  <el-form-item label="启用高清背景切换模式" prop="flagIsBlockBg">
                    {{ tabInfo.flagIsBlockBg ? '是' : '否'}}
                  </el-form-item>

                  <el-form-item label="版面简介显示高">{{ tabInfo.sinkSize }}</el-form-item>

                  <el-form-item label="版块标题颜色">
                    <input disabled type="color" :value="tabInfo.pannelTitleColor">
                  </el-form-item>

                  <el-form-item label="推荐位字体颜色(落焦)">
                    <input disabled type="color" :value="tabInfo.blockTitleFocusColor">
                  </el-form-item>

                  <el-form-item label="推荐位字体颜色(非落焦)">
                    <input disabled type="color" :value="tabInfo.blockTitleUnfocusColor">
                  </el-form-item>
                </template>


              </div>

              <div v-if="!tabInfo.hasSubTab"  class="form-legend-header" @click="isCollapseCustom = !isCollapseCustom">
                <i v-if="isCollapseCustom" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
                <span>版块个性化排序配置</span>
              </div>

              <div v-if="!tabInfo.hasSubTab"  :style="{display: isCollapseCustom ? 'none' : 'block'}">
                <el-form-item label="启动版块个性化推荐">
                  {{ tabInfo.panelRecommendConfig.enableRecommend ? '是' : '否' }}
                </el-form-item>
                <template v-if="tabInfo.panelRecommendConfig.enableRecommend">
                  <el-form-item label="选择版块流">
                    <RecommendStreamSignSelector 
                      :is-read="true"
                      confirm="改变版块流将清空优先推荐版块，确认修改？"
                      v-model="tabInfo.panelRecommendConfig.recommendSign" />
                  </el-form-item>
                  <el-form-item label="从第几个位置开始推荐" prop="panelRecommendConfig.recommendIndex" :rules="[{required: true, message: '不能为空'}]">
                    {{ tabInfo.panelRecommendConfig.recommendIndex }}
                  </el-form-item>
                  <el-form-item label="优先推荐版块">
                    <OrderableTable
                      :readonly="true"
                      :hide-action="true"
                      v-model="tabInfo.panelRecommendConfig.panelInfoList"
                      :header="panelRecommendHeader"
                    />
                </el-form-item>
                </template>
              </div>
            </el-form>
          </template>
        </CommonContent>
      </ContentCard>
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'tab'">
      <TabInfo
        :title-prefix="title"
        :id="embedTab.id"
        :version="embedTab.version"
        :init-mode="embedTab.mode"
        @upsert-end="handleTabEmbedBack"
        @go-back="activePage = 'tab_info'"
      />
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'panel_preview'">
      <PrivatePanelInfo
        v-if="[5, 9, 10].indexOf(panelPreview.dataType) > -1"
        :title-prefix="title"
        :init-mode="panelPreview.initMode"
        :id="panelPreview.id"
        :version="panelPreview.version"
        @upsert-end="handlePreviewPanelEnd"
        @go-back="handlePreviewPanelEnd"
      />
      <PanelInfo
        v-else
        :title-prefix="title"
        :init-mode="panelPreview.initMode"
        :id="panelPreview.id"
        :version="panelPreview.version"
        :panel-data-type="panelPreview.dataType"
        :init-group-index="panelPreview.initGroupIndex"
        :init-block-index="panelPreview.initBlockIndex"
        @upsert-end="handlePreviewPanelEnd"
        @go-back="handlePreviewPanelEnd"
      />
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'panel'">
      <PanelInfo
        :title-prefix="title"
        init-mode="create"
        :panel-data-type="1"
        @upsert-end="activePage = 'tab_info'"
        @go-back="activePage = 'tab_info'"
      />
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'album_panel'">
      <PanelInfo
        :title-prefix="title"
        init-mode="create"
        :panel-data-type="3"
        @upsert-end="activePage = 'tab_info'"
        @go-back="activePage = 'tab_info'"
      />
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'private_panel'">
      <PrivatePanelInfo
        :title-prefix="title"
        init-mode="create"
        @upsert-end="activePage = 'tab_info'"
        @go-back="activePage = 'tab_info'"
      />
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import { getAppIDByTabCategory } from '../../utlis/bizUtil'
import { Table } from 'admin-toolkit'
import Var from '@/components/Var'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import SourceRadioSelector from '@/components/SourceRadioSelector'
import CommonContent from '@/components/CommonContent'
import ContentCard from '@/components/ContentCard'
import PanelSelector from '@/components/selectors/PanelSelector'
import TabSelector from '@/components/selectors/TabSelector'
import BusinessTypeSelector from '@/components/selectors/BusinessTypeSelector'
import AppIdSelector from '@/components/selectors/AppIdSelector'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
import FloatWindowSelector from '@/components/selectors/FloatWindowSelector'
import IconSelector from '@/components/selectors/IconSelector'
import TimeSpinner from '@/components/TimeSpinner'
import VirtualTab from '@/components/VirtualTab'
import CrowdSelector from '@/components/CrowdSelector'
import InputOrder from '@/components/InputOrder'
import { Affix } from 'vue-affix'
import titleMixin from '@/mixins/title'
import OrderableTable from '@/components/OrderableTable'
import PanelInfo from '../panelInfo/PanelInfo'
import PrivatePanelInfo from '../blockManage/PrivatePannelInfo'
import InputMinute from '@/components/InputMinute'
import RecommendStreamSignSelector from '@/components/selectors/RecommendStreamSign'
import InputPositiveInt from '@/components/InputPositiveInt'
import RecommendPanelSelector from '@/components/selectors/RecommendPanelSelector'
import VeLine from 'v-charts/lib/line.common'

export default {
  name: 'TabInfo',
  mixins: [titleMixin],
  components: {
    'cc-var': Var,
    'cc-table-el': Table,
    'cc-tab-selector-el': TabSelector,
    'cc-panel-selector-el': PanelSelector,
    'cc-business-type-selector': BusinessTypeSelector,
    'cc-appid-selector': AppIdSelector,
    'cc-global-picture-selector': GlobalPictureSelector,
    'cc-float-window-selector': FloatWindowSelector,
    'cc-icon-selector': IconSelector,
    'cc-time-spinner': TimeSpinner,
    'cc-virtual-tab': VirtualTab,
    'cc-crowd-selector': CrowdSelector,
    InputPositiveInt,
    Table,
    CommonContent,
    Affix,
    ContentCard,
    SourceRadioSelector,
    InputOrder,
    OrderableTable,
    PageWrapper,
    PageContentWrapper,
    PanelInfo,
    PrivatePanelInfo,
    InputMinute,
    RecommendStreamSignSelector,
    RecommendPanelSelector,
    OrderableTable,
    VeLine
  },
  data() {
    const STATUS = {
      draft: 2,
      waiting: 3,
      accepted: 4,
      rejected: 5,
      processing: 7
    }
    const STATUS_TEXT = {
      '0': '下架',
      '2': '草稿',
      '3': '待审核',
      '4': '审核通过',
      '5': '审核不通过',
      '7': '审核通过未上线'
    }
    const extend = {
      grid: {
        top: "2%",
        left: "5%",
        right: "5%",
        bottom: "10%",
        containLabel: true
      },
      series: v => {
        v[0].smooth = false
        return v
      },
      xAxis: {
        axisLabel: {
          rotate: 45,
          formatter: function(val) {
            let mark = val.indexOf('(')
            if(mark === -1)
            {
              return val
            }else {
              let version = val.slice(mark-val.length)
              let date = val.slice(0, mark)
              return [`{a|${version}}`, date].join('')
            }
          },
          rich: {
            a: { color: 'red' }
          }
        }
      },
      color: ['#1E90FF ','#2f4554'],
    }
    this.clickUvChartSettings = {
      labelMap: {
        y: '点击UV'
      }
    }
    this.uvctrChartSettings = {
      labelMap: {
        y: 'UVCTR'
      }
    }
    this.uvctrHourChartSettings = {
      labelMap: {
        y: 'UVCTR'
      }
    }

    return {
      UVCTR: {
        value: '',
        dailyGrowth: '',
        weeklyGrowth: ''
      },
      tabUVCTR: {
        value: '',
        dailyGrowth: '',
        weeklyGrowth: ''
      },
      tabUVCTRPercent: {
        value: 'N/A',
        dailyGrowth: 'N/A',
        weeklyGrowth: 'N/A'
      },
      clickUvChartData: {
        title: '',
        columns: ['x', 'y'],
        rows: [],
        unit: ''
      },
      uvctrChartData: {
        title: '',
        columns: ['x', 'y'],
        rows: [],
        unit: ''
      },
      uvctrHourChartData: {
        title: '',
        columns: ['x', 'y'],
        rows: [],
        unit: ''
      },
      clickUvChartExtend: Object.assign({}, extend),
      uvctrChartExtend: Object.assign({}, extend),
      uvctrHourChartExtend: Object.assign({}, extend),
      mode: 'create',
      activePage: 'tab_info',
      panelPreview: {
        panel: null,
        id: undefined,
        version: undefined,
        initMode: undefined,
        initGroupIndex: undefined,
        initBlockIndex: undefined
      },
      recommendStreamSignOptions: [],
      recommendStreamSignPanelCount: '-',
      resourceName: '版面',
      embedTab: undefined,
      isCollapseBase: false,
      isCollapseExtend: false,
      isCollapseSpec: false,
      isCollapseCustom: false,
      isCollapseData: true,
      isPanelDragging: false,
      STATUS: STATUS,
      STATUS_TEXT: STATUS_TEXT,
      urls: {
        save: '/tab/save.html',
        historyList: '/v1/hvi/historyList.html'
      },
      showIconSelector: false,
      showFloatWindowSelector: false,
      showBgSelector: false,
      showLongBgSelector: false,
      showPanelSelector: false,
      showCrowdSelector: false,
      SOURCE: [
        {
          label: '腾讯',
          value: 'o_tencent'
        },
        {
          label: '爱奇艺',
          value: 'o_iqiyi'
        },
        {
          label: '优酷',
          value: 'o_youku'
        }
      ],
      TAB_TYPES: [
        {
          label: '普通版面',
          value: 1
        },
        {
          label: '专题版面',
          value: 2
        }
      ],
      panelListIndexed: {},
      vipEnums: [],
      vipEnumsData: [],
      tabInfo: {
        tabId: undefined,
        currentVersion: undefined,
        tabParentType: 'home',
        tabType: 1,
        hasSubTab: 0,
        flagIsBlockBg: 0,
        tabName: undefined,
        tabCnTitle: undefined,
        tabEnTitle: undefined,
        // 预设值
        tabCategory: 67,
        // 预设值
        tabAppid: -1,
        tabResource: 'o_tencent',

        iconTypeName: undefined,
        pictureName: undefined,

        tabParams: {},
        tabStatus: undefined,
        tabOnclick: undefined,
        systemDefault: 0,
        timeCycle: 120,
        cornerIconName: undefined,
        flagIsRecord: 0,
        isTiming: 0,
        releaseTime: undefined,
        tabExtArr: {},
        pannelList: [],
        tabList: [],
        sinkSize: 0,
        isShowvip: 1,
        alumbTabBg: undefined,
        alumbTabLongBg: undefined,
        pannelTitleColor: undefined,
        blockTitleFocusColor: undefined,
        blockTitleUnfocusColor: undefined,

        // 自动推荐
        // 活动浮窗
        activityFloatWindow: undefined,

        imgOnBlur: undefined,
        imgOnFocus: undefined,
        imgOnSelected: undefined,

        vipButtonSourceId: undefined,

        // 个性化推荐
        panelRecommendConfig: {
          // 是	Integer	启动推荐，状态:1为开启,0为关闭
          enableRecommend: 0,
          // 是	String	版块推荐流 recommendStreamSign-推荐流标记-数据字典 dictCnName
          recommendSign: '',
          // 是	Integer	开始推荐的位置，默认4,前3屏运营配置，保证质量
          recommendIndex: undefined,
          // 否	List	优先推荐的版块列表信息
          panelInfoList: []
        }
      },
      versionList: [],

      panelNormalDuplicates: {},
      panelSpecDuplicates: {},
      subTabTableHeader: [
        {
          label: '版面ID',
          prop: 'tabId',
          width: 180
        },
        {
          label: '版面名称',
          prop: 'tabName',
          render: (h, { $index, row }) => {
            return h(
              'el-button',
              {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handlePreviewTab(row, row.currentVersion, $index)
                  }
                }
              },
              row.tabName
            )
          }
        },
        {
          label: '待审核副本',
          width: 120,
          render: (h, { $index, row }) => {
            return h(
              'el-button',
              {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handlePreviewTab(row, row.duplicateVersion, $index)
                  }
                }
              },
              row.duplicateVersion
            )
          }
        }
      ],
      panelRecommendHeader: [
        {
          label: '版块ID',
          prop: 'pannelGroupId'
        },
        {
          label: '版块名称',
          prop: 'pannelName'
        },
        // {
        //   label: '生效',
        //   render: (h, {row}) => {
        //     const recommendSign = this.tabInfo.panelRecommendConfig.recommendSign
        //     if (row.panelGroupCategory.indexOf(`[${recommendSign}]`) === -1) {
        //       return <span class="color-red">版块不在本流中， 无法生效</span>
        //     }
        //   }
        // }
      ]
    }
  },
  props: ['id', 'version', 'init-mode'],
  computed: {
    resourceInfo() {
      const tabInfo = this.tabInfo
      if (tabInfo.tabId) {
        return {
          id: tabInfo.tabId,
          version: tabInfo.currentVersion,
          status: tabInfo.tabStatus,
          type: 'tab',
          menuElId: 'tabInfo'
        }
      }
    },
    floatWindowParams() {
      const sourceMap = {
        o_tencent: '0,1',
        o_iqiyi: '0,2',
        o_youku: '0,3'
      }
      return {
        sourceArray: sourceMap[this.tabInfo.tabResource] || '0'
      }
    },
    isReplicate() {
      return this.mode === 'replicate'
    },
    rules() {
      return {
        tabName: [
          { required: true, message: '请输入版面名称', trigger: 'blur' },
          { max: 45, message: '不超过 45 个字符' }
        ],
        tabCnTitle: [
          { required: true, message: '请输入中文标题', trigger: 'blur' },
          { max: 45, message: '不超过 45 个字符' }
        ],
        tabEnTitle: [
          { required: true, message: '请输入英文标题', trigger: 'blur' },
          { max: 45, message: '不超过 45 个字符' }
        ],
        pictureName: [
          { required: true, message: '请选择Tab对应的icon', trigger: 'blur' }
        ],
        alumbTabBg: [
          { required: true, message: '请设置大背景', trigger: 'blur' }
        ]
      }
    },
    showSystemDefault() {
      const tabCategory = this.tabInfo.tabCategory
      return tabCategory == 60 || tabCategory == 61 || tabCategory == 66
    },
    hasSource() {
      const tabCategory = this.tabInfo.tabCategory
      return tabCategory == 67 || tabCategory == 31
    },
    disableAppId() {
      return +getAppIDByTabCategory(this.tabInfo.tabCategory) != -1
    },
    couldSetReleaseTime() {
      const mode = this.mode
      const currentVersion = this.tabInfo.currentVersion
      const isCreatingOrCopying = mode === 'create' || mode === 'copy'
      const isEditingV1 = mode === 'edit' && currentVersion === 'V1'
      const isCoocaa = this.$consts.idPrefix == '10'
      return isCoocaa && !(isCreatingOrCopying || isEditingV1)
    }
  },
  watch: {
    'tabInfo.tabResource': 'getVipButtonSource'
  },
  methods: {
    toPercent: decimal => {
      return (Math.round(decimal * 10000) / 100.00 + "%")
    },
    toArrowPercent (decimal) {
      const rs = this.toPercent(Math.abs(decimal))
      return rs + (decimal>0 ? ' ↑' : ' ↓')
    },
    parseMinToStr(min) {
      const hours = Math.floor(min / 60)
      const mins = min % 60
      const hoursStr = hours > 9 ? '' + hours : '0' + hours
      const minsStr = mins > 9 ? '' + mins : '0' + mins
      return hoursStr + ':' + minsStr
    },
    openPannelWin(pannelType) {
      const FastDevTool = this.FastDevTool
      const url = basicFn.numToPannelTypeUrl(pannelType) + '/add.html'
      FastDevTool.createDialogWin('add-view', {
        confirmInfo: true,
        fit: true,
        iconCls: 'icon-edit',
        minimizable: false,
        maximizable: true,
        title: '版块页面',
        content: FastDevTool.createIframe(url)
      })
    },
    handleDragStart() {
      setTimeout(
        function() {
          this.isPanelDragging = true
        }.bind(this)
      )
    },
    handleDragEnd() {
      setTimeout(
        function() {
          this.isPanelDragging = false
        }.bind(this)
      )
    },
    handleCreateTab() {
      this.activePage = 'tab'
      this.embedTab = {
        mode: 'create'
      }
    },
    handleOpenPanel() {
      console.log(arguments)
    },
    handleShowAllPanels(index) {
      this.$set(this.tabInfo.pannelList[index], 'isShowAll', true)
    },
    handleTogglePanelType(index) {
      const pannelList = this.tabInfo.pannelList
      const panelItem = pannelList[index]
      if (panelItem.type === 'SPEC') {
        const panel = panelItem.crowdPanels[0]
        panel.dmpInfo = undefined
        this.$set(pannelList, index, {
          type: 'NORMAL',
          panel: panel,
          isCollapse: panelItem.isCollapse
        })
        this.updateDuplicates()
      } else {
        this.selectCrowdCallback = function(dmpInfo) {
          panelItem.panel.dmpInfo = dmpInfo
          this.$set(pannelList, index, {
            type: 'SPEC',
            crowdPanels: [panelItem.panel],
            isShowAll: false,
            isCollapse: panelItem.isCollapse
          })
          this.updateDuplicates()
        }
        this.selectCrowdForIndex = index
        this.handleSelectCrowdStart()
      }
    },
    handleToggleAllPanel(isCollapse) {
      this.tabInfo.pannelList.forEach(
        function(item) {
          this.$set(item, 'isCollapse', isCollapse)
        }.bind(this)
      )
    },
    handleChangeTabCategory(tabCategory) {
      const tabInfo = this.tabInfo
      const originTabCategory = tabInfo.tabCategory
      // 从不分源切换到分源，要清除内容
      const originHasSource = [67, 31].indexOf(originTabCategory) > -1
      const hasSource = [67, 31].indexOf(tabCategory) > -1
      const shouldClearContents = !originHasSource && hasSource
      const doChange = function() {
        if (hasSource) {
          if (tabInfo.tabResource === '') {
            tabInfo.tabResource = 'o_tencent'
          }
        } else {
          // 不分源
          tabInfo.tabResource = ''
        }
        if (!(tabCategory == 60 || tabCategory == 61 || tabCategory == 66)) {
          tabInfo.systemDefault = 0
        }
        tabInfo.tabAppid = +getAppIDByTabCategory(tabCategory)
        tabInfo.tabCategory = tabCategory
        if (shouldClearContents) {
          this.clearContents()
        }
      }.bind(this)
      if (shouldClearContents) {
        this.$confirm(
          '是否要切换业务分类，从不分源分类切换到分源分类之后所选择的版块或二级版面数据将会清除掉?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(doChange)
          .catch(function() {})
      } else {
        doChange()
      }
      /*
            $('#tabCategory').change(function () {
                if ($(this).val() == 67 || $(this).val() == 31) {
                    $('#tabResource_box').css('display', 'block')
                } else {
                    $('#tabResource_box').css('display', 'none')
                }
                if ($(this).val() == 60 || $(this).val() == 61 || $(this).val() == 66) {
                    $('.system_default').show();
                } else {
                    $('#systemDefault').prop('checked', false);
                    $('.system_default').hide();
                }
                var appID = _this.FastDevTool.getAppIDByTabCategory($(this).val());
                $("#tabAppId").attr("disabled", appID == -1 ? false : true).val(appID);
            });
            */
    },
    openPannelWin: function(pannelType) {
      var url = this.basicFn.numToPannelTypeUrl(pannelType) + '/add.html'
      this.FastDevTool.createDialogWin('add-view', {
        confirmInfo: true,
        fit: true,
        iconCls: 'icon-edit',
        minimizable: false,
        maximizable: true,
        title: '版块页面',
        content: this.FastDevTool.createIframe(url)
      })
    },
    handlePreviewPanel(panel) {
      const row = this.panelListIndexed[panel.panelId]
      const version = row.duplicateVersion || row.currentVersion
      this.activePage = 'panel_preview'
      this.panelPreview = {
        panel: row,
        initMode: 'read',
        id: row.pannelGroupId,
        dataType: row.pannelType,
        version
      }
    },
    handlePreviewPanelEnd() {
      const panel = this.panelPreview.panel
      this.updatePanelVersion(
        panel,
        function() {
          this.loadPanelDetail(panel)
        }.bind(this)
      )
      this.panelPreview = null
      this.activePage = 'tab_info'
    },
    handleClickBlock(data) {
      const idPrefix = this.$consts.idPrefix
      const index = data.index
      const crowdIndex = data.crowdIndex
      const activeIndex = data.activeIndex
      const blockIndex = data.blockIndex
      const panel = this.getPanelByIndex(index, crowdIndex)
      const panelData = this.panelListIndexed[panel.id]
      const panelStatus = panelData.pannelStatus
      const STATUS = this.STATUS

      const version = panelData.duplicateVersion || panelData.currentVersion
      const isJiangSu = idPrefix === '11'
      const panelPreview = {
        panel: panelData,
        dataType: panelData.pannelType,
        initMode: 'read',
        id: panelData.pannelGroupId,
        version: panelData.currentVersion,
        initGroupIndex: undefined,
        initBlockIndex: undefined
      }
      switch (true) {
        case isJiangSu && panelData.pannelGroupId.toString().indexOf(10) === 0:
          // 江苏泰州的不能编辑酷开(10)这边的
          break
        case panelStatus === STATUS.draft:
          // 如果是草稿，直接修改
          panelPreview.initMode = 'edit'
          panelPreview.initGroupIndex = activeIndex
          panelPreview.initBlockIndex = blockIndex
          break
        case panelStatus === STATUS.accepted:
          // 创建副本
          panelPreview.initMode = 'replicate'
          panelPreview.initGroupIndex = activeIndex
          panelPreview.initBlockIndex = blockIndex
          break
        case panelStatus === STATUS.waiting:
          break
      }
      this.panelPreview = panelPreview
      this.activePage = 'panel_preview'
    },
    handleChangeSource(val) {
      this.$confirm(
        '是否要切换内容源，切换内容源之后所选择的版块或二级版面数据将会清除掉！',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(
          function() {
            this.tabInfo.tabResource = val
            this.resetPanelRecommendConfig()
            this.clearContents()
          }.bind(this)
        )
        .catch(function(e) {
          throw e
        })
    },
    clearContents() {
      const tabSelector = this.$refs.tabSelector
      this.tabInfo.vipButtonSourceId = undefined
      this.tabInfo.tabList = []
      if (tabSelector) {
        tabSelector.handleRemoteSelectClear()
      }
      this.tabInfo.pannelList = []
    },
    handleClose() {},
    handleSelectTitleIcon(type, post) {
      this.tabInfo[type] = post.pictureUrl
    },
    handleSelectIconStart() {
      this.showIconSelector = true
    },
    handleSelectIconCancel() {
      this.showIconSelector = false
    },
    handleSelectIconEnd(icon) {
      this.showIconSelector = false
      this.tabInfo.pictureName = icon.pictureName
      this.tabInfo.iconTypeName = icon.iconTypeName
      this.tabInfo.pictureUrl = icon.pictureUrl
    },
    handleSelectFloatWindowEnd(data) {
      this.showFloatWindowSelector = false
      this.tabInfo.activityFloatWindow = {
        pluginId: data.pluginId,
        pluginName: data.pluginName,
        pluginType: data.pluginType
      }
    },
    handleRemoveFloatWindow() {
      this.tabInfo.activityFloatWindow = undefined
    },
    handleSelectBgStart() {
      this.showBgSelector = true
    },
    handleSelectBgCancel() {
      this.showBgSelector = false
    },
    handleSelectBgEnd(data) {
      this.showBgSelector = false
      this.tabInfo.alumbTabBg = data.pictureUrl
    },

    handleSelectLongBgStart() {
      this.showLongBgSelector = true
    },
    handleSelectLongBgCancel() {
      this.showLongBgSelector = false
    },
    handleSelectLongBgEnd(data) {
      this.showLongBgSelector = false
      this.tabInfo.alumbTabLongBg = data.pictureUrl
    },

    handleSelectCrowdStart() {
      this.showCrowdSelector = true
    },
    handleSelectCrowdCancel() {
      this.showCrowdSelector = false
    },
    handleSelectCrowdEnd(policy, crowd) {
      const dmpInfo = {
        crowdId: crowd.value,
        crowdName: crowd.label,
        policyId: policy.value,
        policyName: policy.label
      }
      const selectCrowdForIndex = this.selectCrowdForIndex
      const panelItem = this.tabInfo.pannelList[selectCrowdForIndex]
      if (selectCrowdForIndex !== undefined && panelItem.type === 'SPEC') {
        const crowdPanels = panelItem.crowdPanels
        let length = crowdPanels.length
        while (--length >= 0) {
          if (crowdPanels[length].dmpInfo.crowdId === dmpInfo.crowdId) {
            break
          }
        }
        if (length >= 0) {
          return this.$message({
            type: 'error',
            message: '该定向版块组第' + (length + 1) + '个版块已选择该人群'
          })
        }
        // 检查重复
      }
      this.selectCrowdCallback(dmpInfo)
      this.showCrowdSelector = false
      this.selectCrowdCallback = undefined
    },
    handleChangeCrowdOfPanel(index, crowdIndex) {
      this.selectCrowdCallback = function(dmpInfo) {
        this.tabInfo.pannelList[index].crowdPanels[crowdIndex].dmpInfo = dmpInfo
      }
      this.selectCrowdForIndex = index
      this.handleSelectCrowdStart()
    },
    handleSelectPanelEnd(data) {
      // 新添加的，将成为普通版块加在最后面
      const pannelList = this.tabInfo.pannelList
      const start = pannelList.length - 1
      data.forEach(
        function(item, index) {
          this.doInsertPanel(item, {
            index: start + index,
            type: 'NORMAL'
          })
        }.bind(this)
      )
      this.showPanelSelector = false
      this.$refs.virtualTab.isDragging = false
    },
    handleInsertPanel(panel, dropInfo) {
      if (dropInfo.type !== 'NORMAL' && !panel.dmpInfo) {
        this.selectCrowdCallback = function(dmpInfo) {
          panel.dmpInfo = dmpInfo
          this.doInsertPanel(panel, dropInfo)
        }
        this.selectCrowdForIndex = dropInfo.index
        this.handleSelectCrowdStart()
      } else {
        this.doInsertPanel(panel, dropInfo)
      }
    },
    handleChangeCollapseState(index) {
      const panel = this.tabInfo.pannelList[index]
      this.$set(panel, 'isCollapse', !panel.isCollapse)
    },
    doInsertPanel(panel, dropInfo) {
      const panelId = panel.pannelGroupId
      const dmpInfo = panel.dmpInfo
      const type = dropInfo.type
      const index = dropInfo.index
      const crowdIndex = dropInfo.crowdIndex
      const panelList = this.tabInfo.pannelList
      if (type === 'NORMAL') {
        const item = {
          type: type,
          panel: {
            id: panelId,
            isDuplicate: false,
            activeIndex: 0,
            dmpInfo: undefined
          },
          isCollapse: false
        }
        panelList.splice(index + 1, 0, item)
      } else {
        const item = panelList[index]
        item.crowdPanels.splice(crowdIndex + 1, 0, {
          id: panelId,
          isDuplicate: false,
          activeIndex: 0,
          dmpInfo: dmpInfo
        })
      }

      this.loadPanelDetail(panel)
      this.updateDuplicates()
    },
    loadPanelDetail(panel, checkDuplicateVersion) {
      this.$set(this.panelListIndexed, panel.pannelGroupId, panel)
      const id = panel.pannelGroupId
      // 如果有草稿或者待审核副本，则加载， 否则， 加载当前版本
      const version = panel.duplicateVersion || panel.currentVersion
      this.$service.panelGetDetail({ id, version }).then(panelDetail => {
        if (!panelDetail.pannelGroupId) {
          // 接口没状态吗。。。
          return
        }
        const originPanelList = panelDetail.pannelList || []
        const panelList = originPanelList.map(
          function(item) {
            return {
              panelTitle: item.pannelTitle,
              blocks:
                panelDetail.parentType === 'function'
                  ? []
                  : this.getPanelBlocks(item)
            }
          }.bind(this)
        )
        delete panelDetail.currentVersion
        delete panelDetail.duplicateVersion
        this.panelListIndexed[panel.pannelGroupId] = Object.assign(
          {},
          panel,
          panelDetail,
          {
            panelList: panelList,
            pannelStatus: panelDetail.pannelList[0].pannelStatus
          }
        )
      })
    },
    updatePanelVersion(panel, cb) {
      this.$service.panelPageList({
        pannelType: panel.pannelType,
        pannelId: panel.pannelGroupId
      }).then(data => {
        const result = data.rows[0]
        panel.currentVersion = result.currentVersion
        panel.duplicateVersion = result.duplicateVersion
        cb()
      })
    },
    handleReOrderPanel(dragInfo, dropInfo) {
      const dragType = dragInfo.type
      const dragIndex = dragInfo.index
      const dragCrowdIndex = dragInfo.crowdIndex
      const dropType = dropInfo.type
      const dropIndex = dropInfo.index
      const dropCrowdIndex = dropInfo.crowdIndex

      const panelList = this.tabInfo.pannelList
      const dragPanelItem = panelList[dragIndex]
      switch (true) {
        case dragType === 'SPEC' && dropType === 'NORMAL': {
          // 拖动整个定向组到某个位置
          // 删除
          this.doRemovePanel(dragIndex)
          // 插入
          const targetIndex = dragIndex <= dropIndex ? dropIndex : dropIndex + 1
          panelList.splice(targetIndex, 0, dragPanelItem)
          break
        }
        case dragType === 'SPEC' && dropType === 'CROWD': {
          // 拖动整个定向组到别的定向版块组里
          this.$message({
            type: 'error',
            message: '定向版块组不能拖到别的定向版块组里边'
          })
          break
        }
        case dragType === 'CROWD' && dropType === 'NORMAL': {
          // 拖动定向版块到某个外面某个位置
          // 创建新的定向版块
          const panelItem = {
            type: 'SPEC',
            crowdPanels: [dragPanelItem.crowdPanels[dragCrowdIndex]]
          }
          // 从旧的地方删除
          if (dragPanelItem.crowdPanels.length === 1) {
            // 由于只有一个定向版块，移除后，整个组将被移除
            this.doRemovePanel(dragIndex, dragCrowdIndex)
            panelList.splice(
              dragIndex <= dropIndex ? Math.max(dropIndex, 0) : dropIndex + 1,
              0,
              panelItem
            )
          } else {
            this.doRemovePanel(dragIndex, dragCrowdIndex)
            panelList.splice(dropIndex + 1, 0, panelItem)
          }
          break
        }
        case dragType === 'CROWD' && dropType === 'CROWD': {
          // 拖动定向版块到另外一个定向版块位置
          const dragCrowdPanels = panelList[dragIndex].crowdPanels
          const dropCrowdPanels = panelList[dropIndex].crowdPanels
          const panelItem = dragCrowdPanels[dragCrowdIndex]

          if (dragIndex === dropIndex) {
            // 定向版块内部调整
            dropCrowdPanels.splice(dragCrowdIndex, 1)
            dropCrowdPanels.splice(
              dragCrowdIndex <= dropCrowdIndex
                ? dropCrowdIndex
                : dropCrowdIndex + 1,
              0,
              panelItem
            )
          } else {
            let length = dropCrowdPanels.length
            while (--length >= 0) {
              if (
                dropCrowdPanels[length].dmpInfo.crowdId ===
                panelItem.dmpInfo.crowdId
              ) {
                break
              }
            }
            if (length >= 0) {
              return this.$message({
                type: 'error',
                message: '该定向版块组第' + (length + 1) + '个版块已选择该人群'
              })
            }
            // 拖向另外一个定向版块
            // 先插入到新的位置
            dropCrowdPanels.splice(dropCrowdIndex + 1, 0, panelItem)
            // 从旧的地方删除
            this.doRemovePanel(dragIndex, dragCrowdIndex)
          }
          break
        }
        case dragType === 'NORMAL' && dropType === 'NORMAL': {
          // 删除
          this.doRemovePanel(dragIndex)
          // 插入
          panelList.splice(
            dragIndex <= dropIndex ? dropIndex : dropIndex + 1,
            0,
            dragPanelItem
          )
          break
        }
        case dragType === 'NORMAL' && dropType === 'CROWD': {
          // 拖动一个普通版块到某个定向版块组
          this.selectCrowdCallback = function(dmpInfo) {
            this.$set(dragPanelItem.panel, 'dmpInfo', dmpInfo)
            // 插入
            panelList[dropIndex].crowdPanels.splice(
              dropCrowdIndex + 1,
              0,
              dragPanelItem.panel
            )
            // 删除原来的
            this.doRemovePanel(dragIndex)
            this.updateDuplicates()
          }
          this.selectCrowdForIndex = dropIndex
          this.handleSelectCrowdStart()
          break
        }
      }
    },
    getPanelIdByIndex(index, crowdIndex) {
      return this.getPanelByIndex(index, crowdIndex).id
    },
    getPanelByIndex(index, crowdIndex) {
      let panel
      const panelList = this.tabInfo.pannelList
      if (crowdIndex !== undefined) {
        panel = panelList[index].crowdPanels[crowdIndex]
      } else {
        panel = panelList[index].panel
      }
      return panel
    },
    handleRemovePanel(index, crowdIndex) {
      const panelList = this.tabInfo.pannelList
      const panelItem = panelList[index]
      let msg
      if (crowdIndex === undefined && panelItem.type === 'SPEC') {
        // 删除组
        const id = this.getPanelIdByIndex(index, 0)
        const panelData = this.panelListIndexed[id]
        msg = '是否确定删除版块组 ' + panelData.pannelGroupRemark
      } else {
        const id = this.getPanelIdByIndex(index, crowdIndex)
        const panelData = this.panelListIndexed[id]
        msg = '是否确定删除版块 ' + panelData.pannelGroupRemark
      }
      this.$confirm(msg)
        .then(
          function() {
            this.doRemovePanel(index, crowdIndex)
            this.updateDuplicates()
          }.bind(this)
        )
        .catch(function() {})
    },
    doRemovePanel(index, crowdIndex) {
      const panelList = this.tabInfo.pannelList
      if (crowdIndex !== undefined) {
        const crowdPanels = panelList[index].crowdPanels
        crowdPanels.splice(crowdIndex, 1)
        if (crowdPanels.length === 0) {
          panelList.splice(index, 1)
        }
      } else {
        panelList.splice(index, 1)
      }
    },
    getPanelBlocks(panel) {
      const parentType = panel.parentType
      const contentList = panel.contentList
      const layoutJson = JSON.parse(panel.layoutInfo.layoutJson)
      const type = layoutJson.type
      const blocks = layoutJson.contents
      const originBlockCount = blocks.length
      const blockCount = blocks.length

      const currentPannelIndex = 0
      const currentPannel = panel
      const selectedResources = panel.contentList

      const lastBlock = blocks[originBlockCount - 1]
      const layoutWidth = lastBlock.x + lastBlock.width
      const lastBlockResize = lastBlock.resize || {}
      const layoutHeight =
        lastBlock.y + (lastBlockResize.height || lastBlock.height)

      const calculateFactory = function() {
        if (type === 'Expander' && originBlockCount === 2) {
          const space = layoutJson.extra.space
          return function(n) {
            const index = n % originBlockCount
            // 复制第 2 个推荐位
            const targetBlock = blocks[1]
            const resize = targetBlock.resize
            const titleInfo = targetBlock.title_info
            const x =
              layoutWidth + (n - 2) * space + (n - 3) * targetBlock.width
            const y = targetBlock.y
            const result = {
              height: targetBlock.height,
              width: targetBlock.width,
              x: x,
              y: y,
              isExtra: true,
              title_info: titleInfo,
              loop: targetBlock.loop,
              type: targetBlock.type
            }

            if (titleInfo && resize) {
              result.resize = {
                height: resize.height,
                width: resize.width,
                x: x,
                y: y
              }
            }
            return result
          }
        } else if (type === 'Expander') {
          const space = layoutJson.extra.space
          return function(n) {
            const times = Math.floor(n / originBlockCount) - 1
            const index = n % originBlockCount
            const targetBlock = blocks[index]
            const resize = targetBlock.resize
            const titleInfo = targetBlock.title_info
            const x = targetBlock.x + times * layoutWidth + times * space
            const y = targetBlock.y
            const result = {
              height: targetBlock.height,
              width: targetBlock.width,
              x: x,
              y: y,
              isExtra: true,
              title_info: titleInfo,
              loop: targetBlock.loop,
              type: targetBlock.type
            }

            if (titleInfo && resize) {
              result.resize = {
                height: resize.height,
                width: resize.width,
                x: x,
                y: y
              }
            }
            return result
          }
        }

        if (type === 'Lengthwise') {
          const space = 0
          return function(n) {
            const times = Math.ceil(n / originBlockCount) - 1
            const index = n - originBlockCount * times - 1
            const targetBlock = blocks[index]
            const resize = targetBlock.resize
            const titleInfo = targetBlock.title_info
            const x = targetBlock.x
            const y = targetBlock.y + times * layoutHeight + times * space
            const result = {
              height: targetBlock.height,
              width: targetBlock.width,
              x: x,
              y: y,
              isExtra: true,
              title_info: titleInfo
            }

            if (titleInfo && resize) {
              result.resize = {
                height: resize.height,
                width: resize.width,
                x: x,
                y: y
              }
            }

            return result
          }
        }
      }

      if (type === 'Expander' || type === 'Lengthwise') {
        // 如果时横线拓展布局或者纵向拓展布局, 按照资源数量或者设定的推荐位个数填充
        const calculate = calculateFactory()
        const count =
          parentType === 'group'
            ? blockCount
            : Math.max(blockCount, selectedResources.length)
        let i = blocks.length
        while (i++ < count) {
          blocks.push(calculate(i))
        }
      }

      // 检查重复
      const resourceIndexed = {}
      const blocksWithResources = blocks.map(function(item, index) {
        const resource = selectedResources[index] || {}
        const contentList = resource.videoContentList || []
        const content = contentList[0]
        // 有 extraValue1 才判断重复
        if (content && content.extraValue1) {
          const id = content.extraValue1 + (content.extraValue5 || '')
          const duplicatedItem = resourceIndexed[id]
          if (duplicatedItem) {
            duplicatedItem.duplicated = true
            resource.duplicated = true
          } else {
            resource.duplicated = false
            resourceIndexed[id] = resource
          }
        } else {
          resource.duplicated = false
        }
        resource.videoContentList = contentList
        resource.contentPosition = Object.assign({}, item, {
          resize: undefined
        })
        resource.titleInfo = item.title_info
        resource.resize = item.resize
        resource.isExtra = item.isExtra
        return resource
      })
      return blocksWithResources
    },

    updateDuplicates() {
      const panelList = this.tabInfo.pannelList
      const normalDuplicates = {}
      const specDuplicates = {}
      const normalPanelIndexd = {}
      const specPanelIndexed = {}
      panelList.forEach(function(item, index) {
        if (item.type === 'NORMAL') {
          const panel = item.panel
          const pannelGroupId = panel.id

          // 所有版块 索引
          // 普通版块不能跟任何一个重复
          if (normalPanelIndexd[pannelGroupId]) {
            normalDuplicates[pannelGroupId] = true
          } else {
            normalPanelIndexd[pannelGroupId] = true
          }

          if (specPanelIndexed[pannelGroupId]) {
            specPanelIndexed[pannelGroupId].forEach(function(sIndex) {
              specDuplicates[sIndex] = specDuplicates[sIndex] || {}
              specDuplicates[sIndex][pannelGroupId] = true
            })
            normalDuplicates[pannelGroupId] = true
          }
        } else {
          const crowdPanels = item.crowdPanels
          const crowdPanelIndexed = {}
          const duplicates = specDuplicates[index] || {}
          crowdPanels.forEach(function(cItem, index) {
            const panel = cItem
            const pannelGroupId = panel.id

            // 判断定向里面是否有重复
            if (crowdPanelIndexed[pannelGroupId]) {
              duplicates[pannelGroupId] = true
            } else {
              crowdPanelIndexed[pannelGroupId] = true
            }

            // 判断跟普通的是否重复
            specPanelIndexed[pannelGroupId] =
              specPanelIndexed[pannelGroupId] || []
            specPanelIndexed[pannelGroupId].push(index)
            if (normalPanelIndexd[pannelGroupId]) {
              duplicates[pannelGroupId] = true
              normalDuplicates[pannelGroupId] = true
            }
          })
          specDuplicates[index] = duplicates
        }
      })

      console.log(normalDuplicates)
      console.log(specDuplicates)

      panelList.forEach(function(item, index) {
        if (item.type === 'NORMAL') {
          if (normalDuplicates[item.panel.id + '']) {
            item.panel.isDuplicate = true
          } else {
            item.panel.isDuplicate = false
          }
        } else {
          const crowdDuplicates = specDuplicates[index] || {}
          item.crowdPanels.forEach(function(cItem) {
            if (crowdDuplicates[cItem.id + '']) {
              cItem.isDuplicate = true
            } else {
              cItem.isDuplicate = false
            }
          })
        }
      })
      console.log('panelList', panelList)
    },
    handleSelectTabStart() {
      this.$nextTick(
        function() {
          const tabSelector = this.$refs.tabSelector
          this.tabInfo.tabList.forEach(function(item) {
            tabSelector.handleTableRowSelectionAdd(item)
          })
        }.bind(this)
      )
    },
    handleSelectTabEnd(data) {
      this.$refs.subTabTable.handleAppendData(data, 'tabId')
    },
    handleChangePanelOrder(index, order) {
      const newIndex = order - 1
      const oldIndex = index
      const panelList = this.tabInfo.pannelList
      const item = panelList[oldIndex]
      panelList.splice(oldIndex, 1)
      this.tabInfo.pannelList = [].concat(
        panelList.slice(0, newIndex),
        item,
        panelList.slice(newIndex)
      )
    },
    openTabWin: function(pannelType) {
      var url = this.basicFn.numToPannelTypeUrl(pannelType) + '/add.html'
      this.FastDevTool.createDialogWin('add-view', {
        confirmInfo: true,
        fit: true,
        iconCls: 'icon-edit',
        minimizable: false,
        maximizable: true,
        title: '版块页面',
        content: this.FastDevTool.createIframe(url)
      })
    },
    handleTabEmbedBack() {
      this.activePage = 'tab_info'
      const { index, id, version, mode } = this.embedTab
      if (index !== undefined) {
        this.$service.tabInfoList({ tabId: id }).then(data => {
          Object.assign(this.tabInfo.tabList[index], data.rows[0])
        })
      }
      this.embedTab = undefined
    },
    handlePreviewTab(row, version, index) {
      this.activePage = 'tab'
      this.embedTab = {
        index: index,
        id: row.tabId,
        version: version,
        mode: 'read'
      }
    },
    handleShowTimeShelf() {
      const data = this.getFormData()
      data.tabStatus = this.STATUS.waiting
      this.validateFormData(
        data,
        function() {
          this.showTimeShelf = true
        }.bind(this)
      )
    },
    handleCopy(status) {
      const STATUS = this.$consts.status
      if (status === STATUS.waiting) {
        this.handleSubmitAudit()
      } else {
        this.handleSaveDraft()
      }
    },
    handleSaveDraft() {
      const data = this.getFormData()
      data.isTiming = undefined
      data.releaseTime = undefined
      data.tabStatus = this.$consts.status.draft
      this.validateFormData(data, () => {
        this.upsertTabInfo(data)
      })
    },
    handleSubmitAudit(timing) {
      const data = this.getFormData()
      data.tabStatus = this.$consts.status.waiting
      this.validateFormData(data, () => {
        if (this.couldSetReleaseTime) {
          if (timing) {
            data.isTiming = timing.isTiming
            data.releaseTime = timing.releaseTime
            this.upsertTabInfo(data)
          } else {
            this.$refs.commonContent.showReleaseTimeSetter = true
          }
        } else {
          this.upsertTabInfo(data)
        }
      })
    },
    handleSelectRecommendPanelEnd(selected) {
      const selectedPanelList = (selected || []).map((item) => {
        return {
          pannelGroupId: item.panelGroupId,
          pannelName: item.panelGroupName
        }
      })
      const originSelectPanelList = this.tabInfo.panelRecommendConfig.panelInfoList || []
      const originSelectedPanelListIndexed = originSelectPanelList.reduce(function(result, item, index) {
        result[item.pannelGroupId] = index
        return result
      }, {})

      let panelList = []
      selectedPanelList.forEach(function(item) {
        const index = originSelectedPanelListIndexed[item.pannelGroupId]
        // 把之前没选中都添加到列表里
        if (index === undefined) {
          panelList.push(item)
        }
      })
      // 把新添加都加到后面
      this.tabInfo.panelRecommendConfig.panelInfoList = originSelectPanelList.concat(panelList)
    },
    getFormData() {
      const data = JSON.parse(JSON.stringify(this.tabInfo))
      const mode = this.mode
      if (mode === 'replicate') {
        data.currentVersion = ''
      }
      if (mode === 'copy') {
        data.tabId = undefined
        data.currentVersion = ''
      }
      return data
    },
    validateFormData(data, cb) {
      const STATUS = this.STATUS
      const tabStatus = data.tabStatus
      const enableRecommend = data.panelRecommendConfig.enableRecommend 
      const showError = function(message) {
        this.$message({
          type: 'error',
          message: message
        })
      }.bind(this)

      let error
      if (tabStatus === STATUS.draft) {
        let fields = ['tabName']
        if (enableRecommend) {
          fields = fields.concat([
            'panelRecommendConfig.recommendIndex',
            'panelRecommendConfig.recommendSign'
          ])
        }
        let count = fields.length
        let isValid = true
        const validateFieldCb = (error) => {
          count--
          if (error) {
            isValid = false
          }
          if (count === 0) {
            if (!isValid) {
              showError('请把表单填写完整')
            } else {
              cb()
            }
          }
        }
        this.$refs.tabForm.validateField(fields, validateFieldCb)
      } else {
        this.$refs.tabForm.validate(function(valid) {
          if (!valid) {
            showError('请把表单填写完整')
          } else {
            // 如果是普通版面，并且是二级版面
            if (data.tabType == 1 && data.hasSubTab === 1) {
              if (data.tabList.length === 0) {
                error = '请选择二级版面'
              }
            } else if (data.pannelList.length === 0) {
              error = '请选择版块'
            } else {
              // 检查重复版块
              const panelList = data.pannelList
              checkPanelDuplicated: for (
                let i = 0, length = panelList.length;
                i < length;
                i++
              ) {
                const item = panelList[i]
                if (item.type === 'NORMAL') {
                  if (item.panel.isDuplicate) {
                    error = '含有重复版块'
                    break checkPanelDuplicated
                  }
                } else {
                  const crowdPanels = item.crowdPanels
                  for (
                    let j = 0, lengthJ = crowdPanels.length;
                    j < lengthJ;
                    j++
                  ) {
                    if (crowdPanels[j].isDuplicate) {
                      error = '含有重复版块'
                      break checkPanelDuplicated
                    }
                  }
                }
              }
            }

            if (
              data.tabType === 2 &&
              data.alumbTabLongBg &&
              data.pannelList.length > 6
            ) {
              //  专题版面且含有长图
              error = '长图专题版块不能超过6个'
            }

            const panelRecommendConfig = data.panelRecommendConfig
            const panelListLength = data.pannelList.length
            if (panelRecommendConfig.enableRecommend && 
                panelRecommendConfig.recommendIndex > panelListLength
            ) {
              error = `推荐开始位置不能大于版面的版块数, 当前版块总数 ${panelListLength}`
            }

            if (error) {
              showError(error)
            } else {
              cb()
            }
          }
        })
      }
    },

    parseTabInfo(tabInfo) {
      let panelInfoList = []
      {
        const panelList = tabInfo.pannelList
        for (let i = 0, length = panelList.length; i < length; i++) {
          const item = panelList[i]
          let panelInfoItem
          if (item.type === 'NORMAL') {
            panelInfoItem = {
              pannelGroupId: item.panel.id,
              pannelSequence: i,
              isDmpPanel: 0
            }
          } else {
            panelInfoItem = {
              pannelSequence: i,
              isDmpPanel: 1
            }
            panelInfoItem.dmpPanelList = item.crowdPanels.map(function(
              p,
              pIndex
            ) {
              return {
                pannelGroupId: p.id,
                pannelSequence: pIndex,
                dmpPolicyId: p.dmpInfo.policyId,
                dmpPolicyName: p.dmpInfo.policyName,
                dmpCrowdId: p.dmpInfo.crowdId,
                dmpCrowdName: p.dmpInfo.crowdName
              }
            })
          }
          panelInfoList.push(panelInfoItem)
        }
      }

      let tabTitleIcons = {
        selected_img_url: tabInfo.imgOnSelected,
        focus_img_url: tabInfo.imgOnFocus,
        unfocus_img_url: tabInfo.imgOnBlur
      }
      tabTitleIcons = JSON.stringify(tabTitleIcons)

      let tabExtArr = {
        isShowvip: tabInfo.isShowvip,
        alumbTabBg: tabInfo.alumbTabBg,
        alumbTabLongBg: tabInfo.alumbTabLongBg,
        sinkSize: tabInfo.sinkSize,
        pannelTitleColor: tabInfo.pannelTitleColor,
        blockTitleFocusColor: tabInfo.blockTitleFocusColor,
        blockTitleUnfocusColor: tabInfo.blockTitleUnfocusColor,
        flagIsBlockBg: tabInfo.flagIsBlockBg
      }

      const vipButtonSourceId = tabInfo.vipButtonSourceId
      if (vipButtonSourceId) {
        const vipButton = this.getVipButtonSourceItem(vipButtonSourceId)
        tabExtArr.vipButtonSourceId = vipButtonSourceId
        tabExtArr.vipButtonSourceName = vipButton.sourceName
        tabExtArr.vipButtonSourceSign = vipButton.sourceSign
      }

      let tabParams = {}
      {
        tabParams = JSON.stringify(tabParams)
      }

      let systemPluginList = []
      {
        const activityFloatWindow = tabInfo.activityFloatWindow
        if (activityFloatWindow) {
          systemPluginList.push({
            pluginId: activityFloatWindow.pluginId,
            pluginType: activityFloatWindow.pluginType
          })
        }
      }

      let tabJson
      if (tabInfo.hasSubTab && tabInfo.tabList.length > 0) {
        tabJson = tabInfo.tabList.map(function(item, index) {
          return {
            subTabId: item.tabId,
            subSequence: index
          }
        })
        tabJson = JSON.stringify(tabJson)
      }

      let panelRecommendConfig = tabInfo.panelRecommendConfig
      if (panelRecommendConfig.enableRecommend) {
        panelRecommendConfig.panelInfoList = panelRecommendConfig.panelInfoList.map((item, index) => {
          return {
            panelRecommendConfig: index,
            pannelGroupId: item.pannelGroupId
          }
        }) 
      } else {
        panelRecommendConfig = {
          enableRecommend: 0,
          recommendSign: '',
          recommendIndex: 1,
          panelInfoList: []
        }
      }

      const data = {
        cornerIconName: tabInfo.cornerIconName,
        currentVersion: tabInfo.currentVersion,
        flagIsRecord: tabInfo.flagIsRecord,
        hasSubTab: tabInfo.hasSubTab,
        isTiming: tabInfo.isTiming,
        panelInfoList: panelInfoList,
        pictureName: tabInfo.pictureName,
        releaseTime: tabInfo.releaseTime,
        systemDefault: tabInfo.systemDefault || 0,
        systemPluginList: systemPluginList,
        tabAppid: tabInfo.tabAppid,
        tabCategory: tabInfo.tabCategory,
        tabCnTitle: tabInfo.tabCnTitle,
        tabEnTitle: tabInfo.tabEnTitle,
        tabExtArr: tabExtArr,
        tabId: tabInfo.tabId,
        tabJson: tabJson,
        tabName: tabInfo.tabName,
        tabOnclick: tabInfo.tabOnclick,
        tabParams: tabParams,
        tabParentType: tabInfo.tabParentType,
        tabResource: tabInfo.tabResource,
        tabStatus: tabInfo.tabStatus,
        tabTitleIcons: tabTitleIcons,
        tabType: tabInfo.tabType,
        timeCycle: tabInfo.timeCycle,
        panelRecommendConfig 
      }
      return data
    },
    setTabInfo(data) {
      const tabInfo = this.tabInfo
      const tabTitleIcons = JSON.parse(data.tabTitleIcons || '{}')
      const tabExtArr = data.tabExtArr || data.tabExtArrEntity || {}
      const tabParams = JSON.parse(data.tabParams || '{}')

      let activityFloatWindow
      const systemPluginList = data.systemPluginList || []
      const floatWindowPlugin = systemPluginList[0]
      if (floatWindowPlugin) {
        activityFloatWindow = {
          pluginId: floatWindowPlugin.pluginId,
          pluginName: floatWindowPlugin.pluginName,
          pluginType: floatWindowPlugin.pluginType
        }
      }

      let pannelList = []
      if (data.panelInfoList) {
        const panelToLoad = []
        pannelList = data.panelInfoList.map(
          function(item) {
            if (item.isDmpPanel) {
              return {
                type: 'SPEC',
                isCollapse: false,
                isShowAll: false,
                crowdPanels: item.dmpPanelList.map(
                  function(pItem) {
                    this.$set(this.panelListIndexed, pItem.pannelGroupId, pItem)
                    panelToLoad.push(pItem)
                    return {
                      id: pItem.pannelGroupId,
                      isDuplicate: false,
                      activeIndex: 0,
                      dmpInfo: {
                        crowdId: pItem.dmpCrowdId,
                        policyId: pItem.dmpPolicyId,
                        crowdName: pItem.dmpCrowdName,
                        policyName: pItem.dmpPolicyName
                      }
                    }
                  }.bind(this)
                )
              }
            } else {
              this.$set(this.panelListIndexed, item.pannelGroupId, item)
              panelToLoad.push(item)
              return {
                type: 'NORMAL',
                isCollapse: false,
                panel: {
                  id: item.pannelGroupId,
                  isDuplicate: false,
                  activeIndex: 0,
                  dmpInfo: undefined
                }
              }
            }
          }.bind(this)
        )
        setTimeout(
          function() {
            panelToLoad.forEach(this.loadPanelDetail.bind(this))
          }.bind(this),
          50
        )
      }

      const panelRecommendConfig = data.panelRecommendConfig 
        ? data.panelRecommendConfig
        : tabInfo.panelRecommendConfig
      panelRecommendConfig.panelInfoList = panelRecommendConfig.panelInfoList || []
      this.tabInfo = Object.assign({}, tabInfo, {
        tabId: data.tabId,
        currentVersion: data.currentVersion,
        tabParentType: data.tabParentType,
        tabType: data.tabType,
        hasSubTab: data.hasSubTab,
        flagIsBlockBg: tabExtArr.flagIsBlockBg,
        tabName: data.tabName,
        tabCnTitle: data.tabCnTitle,
        tabEnTitle: data.tabEnTitle,
        tabCategory: data.tabCategory,
        tabAppid: data.tabAppid,
        tabResource: data.tabResource,

        iconTypeName: data.iconTypeName,
        pictureName: data.pictureName,

        tabStatus: data.tabStatus,
        tabOnclick: undefined,
        systemDefault: data.systemDefault,
        timeCycle: data.timeCycle,
        cornerIconName: data.cornerIconName,
        flagIsRecord: data.flagIsRecord,
        isTiming: data.isTiming,
        releaseTime: data.releaseTime,
        pannelList: pannelList,
        tabList: data.tabList,

        alumbTabBg: tabExtArr.alumbTabBg,
        alumbTabLongBg: tabExtArr.alumbTabLongBg,
        isShowvip: tabExtArr.isShowvip,
        pannelTitleColor: tabExtArr.pannelTitleColor,
        blockTitleFocusColor: tabExtArr.blockTitleFocusColor,
        blockTitleUnfocusColor: tabExtArr.blockTitleUnfocusColor,
        sinkSize: tabExtArr.sinkSize,

        activityFloatWindow: activityFloatWindow,

        imgOnBlur: tabTitleIcons.unfocus_img_url,
        imgOnFocus: tabTitleIcons.focus_img_url,
        imgOnSelected: tabTitleIcons.selected_img_url,
        vipButtonSourceId: tabExtArr.vipButtonSourceId,
        panelRecommendConfig: panelRecommendConfig 
      })

      this.updateDuplicates()
      this.setRecommendStreamSignPanelCount()
    },
    upsertTabInfo(tabInfo) {
      const formData = this.parseTabInfo(tabInfo)
      this.$service.tabInfoUpsert(formData, '操作成功').then(() => {
        this.$emit('upsert-end')
      })
    },
    fetchData(version) {
      this.$service.tabInfoGet({ id: this.id, version }).then(data => {
        this.setTabInfo(data)
      })
    },
    getSimpleBrowseData() {
      this.$service.getTabSimpleBrowseData({ id: this.id }).then(data => {
<<<<<<< Updated upstream
        const tabUVCTR = data.rows[0].data[0] ? data.rows[0].data[0].uvctr : 'N/A'
        this.tabUVCTR = tabUVCTR
        tabUVCTR.dailyGrowth ? this.tabUVCTRPercent.dailyGrowth = this.toArrowPercent(tabUVCTR.dailyGrowth) : 'N/A'
        tabUVCTR.weeklyGrowth ? this.tabUVCTRPercent.weeklyGrowth = this.toArrowPercent(tabUVCTR.weeklyGrowth) : 'N/A'
=======
        const tabUVCTR = data.rows[0].data[0].uVCTR
        this.UVCTR = Object.assign({}, tabUVCTR)
        console.log('tab', this.tabUVCTR);
>>>>>>> Stashed changes
      })
    },
    getVipButtonSourceItem(id) {
      const result = this.vipEnumsData.find(function(item) {
        return item.sourceId === id
      })
      return result || {}
    },
    getVipButtonSource() {
      let params = null
      const source = this.tabInfo.tabResource
      if (source) {
        params = {
          source: source
        }
      }
      this.$service.getVipButtonSource(params).then((data) => {
        this.vipEnumsData = data
        this.vipEnums = data.map(function(item) {
          return {
            value: item.sourceId,
            label: item.sourceName
          }
        })
      })
    },
    handleModeChange(mode) {
      if (mode === 'edit' || mode === 'copy' || mode === 'replicate') {
        this.isCollapseBase = true
      }
    },
    handleInputRecommendFlag(val) {
      this.tabInfo.panelRecommendConfig.enableRecommend = val ? 1 : 0
    },
    handleInputRecommendSign(val) {
      const panelRecommendConfig = this.tabInfo.panelRecommendConfig
      panelRecommendConfig.recommendSign = val
      this.resetPanelRecommendConfig()
    },
    handleInputHasSubTab(val) {
      this.tabInfo.hasSubTab = val ? 1 : 0
      // 含有二级版面的，没有推荐
      this.tabInfo.panelRecommendConfig.enableRecommend = 0
    },
    setRecommendStreamSignPanelCount() {
      const tabInfo = this.tabInfo
      const recommendSign = tabInfo.panelRecommendConfig.recommendSign
      this.recommendStreamSignPanelCount = '-'
      if (recommendSign) {
        this.$service.panelRecommendList({
          source: tabInfo.tabResource, 
          panelGroupCategory: recommendSign
        }).then((data) => {
          this.recommendStreamSignPanelCount = data.total
        })
      }
    },
    resetPanelRecommendConfig() {
      const panelRecommendConfig = this.tabInfo.panelRecommendConfig
      panelRecommendConfig.panelInfoList = []
      panelRecommendConfig.recommendIndex = undefined
      this.setRecommendStreamSignPanelCount()
    },
    equipChartStyle() {
      const yAxis = {
        axisLabel: {
          formatter: '{value}%'
        }
      }
      this.uvctrChartExtend.yAxis = yAxis
      this.uvctrHourChartExtend.yAxis = yAxis
    },
    // 点击版面数据展示折线图
    handleTabDataClick() {
      this.isCollapseData = !this.isCollapseData
      if(this.clickUvChartData.title !== '') {
        return
      }
      this.$service.getTabChartData({ id: this.id }).then(data => {
        const rows = data.rows
        this.clickUvChartData.rows = rows[0].data
        this.clickUvChartData.title = rows[0].title
        this.clickUvChartData.unit = rows[0].unit
        this.uvctrChartData.rows = rows[1].data
        this.uvctrChartData.title = rows[1].title
        this.uvctrChartData.unit = rows[1].unit
        this.uvctrHourChartData.rows = rows[2].data
        this.uvctrHourChartData.title = rows[2].title
        this.uvctrHourChartData.unit = rows[2].unit
      })
    }
  },
  created() {
    const mode = this.initMode
    this.mode = mode
    this.$watch('mode', this.handleModeChange, { immediate: true })
    if (this.id) {
      this.fetchData(this.version)
      this.getSimpleBrowseData()
    }
    this.getVipButtonSource()
    this.equipChartStyle()
  }
}
</script>
<style scoped>
.tab-title-icon-wrapper {
  display: inline-block;
  width: 180px;
  height: 82px;
  margin-right: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  vertical-align: top;
}
.tab-title-icon-wrapper img {
  max-width: 100%;
  max-height: 100%;
}
.tab-title-icon-wrapper >>> .el-form-item__content {
  height: 100%;
}
.tab-title-icon__title {
  position: absolute;
  right: 0px;
  bottom: 0;
  padding: 0 10px;
  background: #000;
  opacity: 0.8;
  color: #fff;
}
.tab-icon-wrapper {
  margin-top: 10px;
  width: 60px;
  height: 60px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.tab-title-icon__remove {
  position: absolute;
  right: 3px;
  top: 3px;
  color: red;
}

.tab-info__virtual-tab {
  display: inline-block;
  vertical-align: top;
}
</style>

<style lang="stylus" scoped>
.image-preview-wrapper
  position: relative
  max-width: 400px
  .el-icon-close
    position: absolute
    top: 5px
    left: 5px
    cursor: pointer
    color: red
.image-preview
  max-width: 100%
  display: block
  margin-top: 10px
.image-preview-wrapper--long
  max-width: unset
.image-preview-wrapper--long img
  height: 300px
.chart-box--title
  height: 44px
  line-height: 44px
  text-align: center
  font-size: 25px
.data-up
  color: red
.data-down
  color: #00AA00
</style>
