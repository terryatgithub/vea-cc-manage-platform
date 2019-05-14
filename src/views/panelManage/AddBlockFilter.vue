<template>
  <ContentCard title="选择板块" @go-back="$emit('go-back')">
    <el-tabs type="card">
      <el-tab-pane label="内容板块">
        <PannelInfoList ref="pannel" :dataList="contentBlock" v-model="pannelData"/>
      </el-tab-pane>
      <el-tab-pane label="专属板块">
        <AlbumPannelInfoList ref="albumPannel" :dataList="albumBlock" v-model="albumPannelData"/>
      </el-tab-pane>
      <el-tab-pane label="专属影院板块">
        <PrivatePannelInfoList :dataList="privateBlock" v-model="privatePannelData"/>
      </el-tab-pane>
    </el-tabs>

    <div class="btns">
      <el-button type="primary" @click="clickAdd">确定</el-button>
      <el-button @click="$emit('go-back')">取消</el-button>
    </div>
  </ContentCard>
</template>

<script>
import PannelInfoList from '../blockManage/PannelInfoList'
import AlbumPannelInfoList from '../blockManage/AlbumPannelInfoList'
import PrivatePannelInfoList from '../blockManage/PrivatePannelInfoList'
import _ from 'gateschema'
export default {
  components: {
    PannelInfoList,
    AlbumPannelInfoList,
    PrivatePannelInfoList
  },
  props: {
    parentPannelResource: String
  },

  data () {
    return {
      pannelData: [],
      albumPannelData: [],
      privatePannelData: [],
      selected: [],
      contentBlock: {
        filter: {
          pannelType: 1,
          resourceIsNull: true,
          pannelResource: 'qq',
          multiStatus: '3,4'
        },
        filterSchema: {},
        table: {}
      },
      albumBlock: {
        filter: {
          pannelType: 3,
          resourceIsNull: true,
          pannelResource: 'qq',
          multiStatus: '3,4'
        },
        filterSchema: {},
        table: {}
      },
      privateBlock: {
        filter: {
          pannelType: 4,
          resourceIsNull: true,
          pannelResource: 'qq',
          multiStatus: '3,4'
        },
        filterSchema: {},
        table: {}
      },
      table: {
        props: {},
        data: [],
        header: [
          {
            label: 'ID',
            prop: 'pannelGroupId'
          },
          {
            label: '名称',
            prop: 'pannelGroupRemark'
          },
          {
            label: '业务分类',
            prop: 'categoryName'
          },
          {
            label: '布局',
            prop: 'fullLayoutName'
          },
          {
            label: '引用状态',
            prop: 'fullTabName',
            'show-overflow-tooltip': true
          },
          {
            label: '版本/状态',
            prop: 'pannelStatus',
            formatter: (row) => {
              const status = row.pannelStatus
              const currentVersion = row.currentVersion
              return currentVersion + '/' + this.pannelStatusOption.map(function(item) {
                if (status.toString() === item.value) {
                  return item.label
                }
              }).join('')
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            'show-overflow-tooltip': true
          },
          {
            label: '更新人',
            prop: 'userName'
          }
        ],
        selected: [],
        selectionType: 'multiple'
      },
      pannelStatusOption: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ]
    }
  },

  watch: {
  },

  methods: {
    clickAdd() {
      debugger
      const { pannelData, albumPannelData, privatePannelData } = this
      let block = [].concat(pannelData).concat(albumPannelData).concat(privatePannelData)
      this.$emit('add-block', block)
      this.$emit('go-back')
    }
  },
  created() {
    let filterSchema = _.map({
      pannelId: _.o.string.other('form', {
        placeholder: '板块ID',
        component: 'Input'
      }),
      pannelName: _.o.string.other('form', {
        placeholder: '板块名称',
        component: 'Input'
      }),
      tabName: _.o.string.other('form', {
        placeholder: '引用状态',
        component: 'Input'
      }),
      pannelStatus: _.o.enum({ '待审核': '3', '审核通过': '4' }).other('form', {
        placeholder: '审核状态',
        component: 'Select'
      })
    }).other('form', {
      cols: {
        item: 3,
        label: 0,
        wrapper: 23
      },
      layout: 'inline',
      footer: {
        cols: {
          label: 0,
          wrapper: 24
        },
        showSubmit: true,
        submitText: '查询',
        showReset: true,
        resetText: '重置'
      }
    })
    this.contentBlock.filter.pannelResource = this.parentPannelResource
    this.albumBlock.filter.pannelResource = this.parentPannelResource
    this.privateBlock.filter.pannelResource = this.parentPannelResource
    this.contentBlock.filterSchema = filterSchema
    this.contentBlock.table = Object.assign({}, this.table)
    this.albumBlock.filterSchema = filterSchema
    this.albumBlock.table = Object.assign({}, this.table)
    this.privateBlock.filterSchema = filterSchema
    this.privateBlock.table = Object.assign({}, this.table)
  }

}
</script>

<style lang='stylus' scoped>
.btns
  display flex
  justify-content center
</style>
