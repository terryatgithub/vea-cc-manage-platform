<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <template v-if="mode !== 'create'">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="流名称" prop="name">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>
        <el-form-item label="源" prop="source">
          <el-radio-group v-model="createForm.source">
            <el-radio v-for="item in $consts.sourceOptions" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="base-info">
        创建流后，默认是关闭状态的。填充完内容后，找产品或开发去开启状态;
      </div>
      <el-row class="createBtn-container">
        <el-button type="primary" @click="handleCreate">创建</el-button>
        <el-button type="success" @click="$emit('go-back')">取消</el-button>
      </el-row>
    </template>

    <template v-else>
      <div class="form-legend-header" @click="isCollapseBase = !isCollapseBase">
        <i v-if="isCollapseBase" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
        <span>&nbsp;流基本设置</span>
      </div>
      <div :style="{display: isCollapseBase ? 'none' : 'block'}">
        <el-form :model="basicForm" label-width="150px">
          <el-form-item label="推荐流ID">123123</el-form-item>
          <el-form-item label="推荐流名称">
            <el-input class="title-input"/>
          </el-form-item>
          <el-form-item label="源">
            <el-radio-group v-model="createForm.source">
              <el-radio v-for="item in $consts.sourceOptions" :label="item.value" disabled>{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="源状态">
            关闭
          </el-form-item>
        </el-form>
      </div>

      <div class="form-legend-header" @click="isCollapseVideo = !isCollapseVideo">
        <i v-if="isCollapseVideo" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
        <span>&nbsp;影片选择</span>
      </div>
      <div :style="{display: isCollapseVideo ? 'none' : 'block'}">
        <div class="video-select--header">
          <InputPositiveInt v-model="newVideoTabNum" class="num-input"/>
          <el-button type="primary" @click="handleAddVideoTab(newVideoTabNum)">添加</el-button>
          <ResourceSelector
            ref="resourceSelector"
            :is-live="false"
            :selectors="['video']"
            selection-type="multiple"
            :source="createForm.source"
            @select-end="handleSelectResourcesEnd"
          >
            <el-button type="primary" class="batch-btn">批量选择资源</el-button>
          </ResourceSelector>
          <el-button type="primary" @click="isVisibleSize = !isVisibleSize">添加尺寸</el-button>
          <el-tag 
            v-for="(sizeTag, index) in sizeTags"
            :key="index"
            type="primary" 
            closable 
            class="size-tag"
            @close="handleTagClose(sizeTag)"
          >
              {{sizeTag.width}}&nbsp;x&nbsp;{{sizeTag.height}}
          </el-tag>
        </div>
        <div v-for="(videoTab, index) in videoTabs" :key="index" class="videoTab--wrapper">
          <AssignVideoTab
            v-model="videoTabs[index]"
            :index="index"
            :source="basicForm.source"
            :input-tags="sizeTags"
            @handle-delTab="handleDelTab"
            @blur="handleBlurSort(index)"
          />
        </div>
      </div>
    </template>

    <!-- 添加尺寸dialog -->
    <el-dialog title="添加尺寸" :visible.sync="isVisibleSize" width="30%">
      <el-row :gutter="10"><el-col :span="12" class="text-center-align">宽</el-col><el-col :span="12" class="text-center-align">高</el-col></el-row>
      <el-row>
        <el-col :span="10"><InputPositiveInt v-model="newTabSize.width"/></el-col>
        <el-col :span="4" class="text-center-align">X</el-col>
        <el-col :span="10"><InputPositiveInt v-model="newTabSize.height"/></el-col>
      </el-row>
      <div class="size-btn-group">
        <el-button type="primary" @click="handleAddTabSize">确定</el-button>
        <el-button type="success" @click="newTabSize={};isVisibleSize=!isVisibleSize">取消</el-button>
      </div>
    </el-dialog>
  </ContentCard>
</template>

<script>
import InputPositiveInt from '@/components/InputPositiveInt'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import AssignVideoTab from './AssignVideoTab'
export default {
  components: {
    InputPositiveInt,
    ResourceSelector,
    AssignVideoTab
  },
  data() {
    return {
      title: '',
      createForm: {
        name: '',
        source: 'o_tencent'
      },
      basicForm: {
        source: 'o_tencent'
      },
      isCollapseBase: false,
      isCollapseVideo: false,
      isVisibleSize: false,
      videoTabs: [],
      newVideoTabNum: undefined,
      sizeTags: [],
      newTabSize: {
        width: undefined,
        height: undefined
      }
    }
  },

  props: ['id', 'initMode'],

  methods: {
    handleCreate() {

    },
    handleAddVideoTab(tabNum) {
      if(!this.newVideoTabNum || this.newVideoTabNum >100 || this.newVideoTabNum <=0){
        this.$message.error("请输入0~100之间的数字")
      }else if(this.sizeTags.length === 0){
        this.$message.error("请先添加尺寸")
      }else {
        for(let i=0; i<tabNum; i++) {
          this.videoTabs.push({})
        }
        this.newVideoTabNum = undefined
        this.$message.success("添加成功")
      }
    },
    handleAddTabSize() {
      let newTabSize = Object.assign({}, this.newTabSize)
      if(!newTabSize.width || !newTabSize.height) {
        this.$message.error("宽或高不能为空")
        return
      }
      this.sizeTags.push(newTabSize)
      this.newTabSize = {}
      this.isVisibleSize = false
    },
    handleTagClose(tag) {
      this.$confirm('删除本尺寸后，本流中配置的本尺寸海报图也会删除，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sizeTags.splice(this.sizeTags.indexOf(tag), 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })         
      })
    },
    handleDelTab(index) {
      this.videoTabs.splice(index, 1)
      this.$message.success("删除成功")
    },
    handleSelectResourcesEnd(resources) {
      // const contentPreset = {
      //   coverType: this.isMall ? 'custom' : 'media',
      //   // hideTitleOptions 表示强制需要标题，无法关闭
      //   showTitle: this.hideTitleOptions ? 1 : 0,
      // }
      // const contentList = genResourceContentList(resources, contentPreset)
      // this.normalContentList.splice(this.activeIndex, contentList.length, ...contentList)
    },
    handleBlurSort(index) {
      console.log('index', index);
    }
  },

  created() {
    this.mode = this.initMode || 'create'
    switch (this.mode) {
      case 'create':
        this.title = '新增'
        this.disabled = false
        break
      case 'copy':
        this.title = '复制'
        this.disabled = false
        break
      case 'edit':
        this.title = '编辑'
        this.disabled = false
        break
      case 'replica':
        this.title = '创建副本'
        this.disabled = false
      case 'read':
        this.title = '预览'
        this.disabled = true
        break
    }
  }
}
</script>

<style  type="stylus" scoped>
.base-info {
  margin: 10px 0;
  padding: 10px;
  font-size: 13px;
  border: 1px solid #e7e4c2;
  background: #fef8b8;
}
.el-row .el-button {
  width: 85px;
}
.createBtn-container {
  margin: 27px 0 0 27px;
}
.video-select--header {
  margin: 20px 0;
}
.num-input {
  width: 100px;
  margin: 0 20px;
}
.title-input {
  width: 357px;
}
.text-center-align {
  text-align: center;
}
.size-btn-group {
  margin-top: 20px;
}
.size-btn-group .el-button{
  width: 85px;
}
.size-tag {
  margin-left: 10px;
}
.videoTab--wrapper {
  width: 75%;
  margin: 20px;
}
.batch-btn {
  margin: 0 10px;
}
</style>