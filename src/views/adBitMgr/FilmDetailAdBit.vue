<template>
    <ContentCard>
        <div class="ad-upsert">
            <el-tabs v-model="activeTab">
                <el-tab-pane class="detail-ad-wrapper" label="详情页广告位" name="detail">
                    <img class="detail-ad-1-2" src="../../assets/images/detail-ad-1-2.png" />
                    <img class="detail-ad-3" src="../../assets/images/detail-ad-3.png" />
                        <el-form class="detail-form" ref="form"  label-width="150px">
                            <cc-var v-if="adSwitches.middle" :ad="adSwitches.middle">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        class="detail-ad__1"
                                        :label="ad.label"
                                        >
                                            <el-switch
                                                active-text="开"
                                                inactive-text="关"
                                                :value="ad.value"
                                                @input="handleToggleSwitch(ad)"
                                            >
                                            </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>

                            <cc-var v-if="adSwitches.bottom_serial" :ad="adSwitches.bottom_serial">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        class="detail-ad__2"
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>

                            <cc-var v-if="adSwitches.bottom_movie" :ad="adSwitches.bottom_movie">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        class="detail-ad__3"
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                        </el-form>
                </el-tab-pane>
                <el-tab-pane label="视频播放广告" name="video">

                    <div class="video-ad-wrapper">
                        <p class="ad-title">前贴广告A<span>(加在腾讯、爱奇艺前贴广告之前的，酷开前贴广告)</span></p>
                        <el-form :inline="true" label-width="150px" label-position="left">
                            <cc-var v-if="adSwitches.front_detail_a" :ad="adSwitches.front_detail_a">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>

                            <cc-var v-if="adSwitches.front_loop_a" :ad="adSwitches.front_loop_a">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                            <cc-var v-if="adSwitches.front_topic_a" :ad="adSwitches.front_topic_a">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                        </el-form>
                    </div>

                    <div class="video-ad-wrapper">
                        <p class="ad-title">前贴广告B<span>(仅针对腾讯、爱奇艺不播前贴广告的场景，才播放我们自己的前贴广告B)</span></p>
                        <el-form :inline="true" label-width="150px" label-position="left">
                            <cc-var v-if="adSwitches.front_detail_b" :ad="adSwitches.front_detail_b">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>

                            <cc-var v-if="adSwitches.front_loop_b" :ad="adSwitches.front_loop_b">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                            <cc-var v-if="adSwitches.front_topic_b" :ad="adSwitches.front_topic_b">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                        </el-form>
                    </div>

                    <div class="video-ad-wrapper">
                        <p class="ad-title">中插广告</p>
                        <el-form :inline="true" label-width="150px" label-position="left">
                            <cc-var v-if="adSwitches.middle_detail" :ad="adSwitches.middle_detail">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>

                            <cc-var v-if="adSwitches.middle_loop" :ad="adSwitches.middle_loop">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                            <cc-var v-if="adSwitches.middle_topic" :ad="adSwitches.middle_topic">
                                <template v-slot="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            active-text="开"
                                            inactive-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                        </el-form>
                    </div>

                </el-tab-pane>

                <el-tab-pane label="主页广告" name="homepage">
                    <div class="video-ad-wrapper">
                        <p class="ad-title">主页霸屏广告</p>
                        <el-form :inline="true" label-width="150px" label-position="left">
                            <cc-var v-if="adSwitches.screen" :ad="adSwitches.screen">
                                <template slot-scope="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            on-text="开"
                                            off-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="主页小窗口inline广告" name="homepage-window">
                    <div class="video-ad-wrapper">
                        <p class="ad-title">主页小窗口inline广告</p>
                        <el-form :inline="true" label-width="150px" label-position="left">
                            <cc-var v-if="adSwitches.screen" :ad="adSwitches.screen">
                                <template slot-scope="{ad: ad}">
                                    <el-form-item
                                        :label="ad.label"
                                    >
                                        <el-switch
                                            on-text="开"
                                            off-text="关"
                                            :value="ad.value"
                                            @input="handleToggleSwitch(ad)"
                                        >
                                        </el-switch>
                                    </el-form-item>
                                </template>
                            </cc-var>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </ContentCard>
</template>

<script>
import Var from '@/components/Var.vue'
export default {
  components: {
    'cc-var': Var
  },
  data() {
    return {
      adSwitches: {},
      activeTab: 'detail'
    }
  },
  methods: {
    handleToggleSwitch(item) {
      this.$confirm('确定' + (item.value ? '关闭' : '开启') + '【' + item.label + '】的广告投放权限吗？')
        .then(() => {
          this.$service.advertisementUpsert({
            id: item.id,
            status: item.value ? 0 : 1
          }, '操作成功')
            .then((result) => {
              item.value = !item.value
            })
        }).catch(() => {

        })
    },
    getLabel(type, remark) {
      return this.adSwitches[type + remark].label
    },
    getSwitches() {
      this.$service.advertisementList().then(result => {
        const adSwitches = {}
        result.rows.forEach(function(item) {
          adSwitches[item.remark] = {
            id: item.id,
            label: item.name,
            key: item.remark,
            value: !!item.status
          }
        })
        this.$set(this, 'adSwitches', adSwitches)
      })
    }
  },
  created() {
    this.getSwitches()
  }
}
</script>
<style>
.ad-upsert .el-form--inline > .cc-var {
    display: inline-block;
    margin-right: 40px;
}
.video-ad-wrapper {
    border: 1px dashed #ccc;
    margin: 20px 20px 40px 20px;
    padding: 0 20px;
}
.video-ad-wrapper .ad-title {
    background: #fff;
    position: relative;
    top: -10px;
    display: inline-block;
    padding: 0 10px;
    font-size: 20px;
    font-weight: bold;
}
.video-ad-wrapper .ad-title span {
    margin: 0 10px;
    font-size: 14px;
    font-weight: normal;
}
.detail-form {
    top: 0;
    position: absolute;
}
.detail-ad-1-2,
.detail-ad-3 {
    display: block;
    width: 600px;
    margin-left: 400px;
}
.detail-ad-1-2 {
    margin-bottom: 50px;
}
.detail-ad__1,
.detail-ad__2,
.detail-ad__3 {
    position: absolute;
}
.detail-ad__1 {
    top: 113px;
}
.detail-ad__2 {
    top: 205px;
}
.detail-ad__3 {
    top: 613px;
}
</style>
