<template>
    <div class="global-media-tag-data">
        <ul class="global-media-tag-ul">
            <li v-for="(tag, pIndex) in tagData">
                <div class="global-media-tag-data-intro">
                    <span>第<b>{{sectionToChinese(pIndex+1)}}</b>层</span>
                </div>
                <div class="global-media-tag-data-cont">
                    <el-checkbox-group v-model="tag.tagNode" size="small" @change="changeTag(pIndex, tag.tagNode)">
                        <el-checkbox
                          v-for="item in tag.child" 
                          :key="item.tagCode" 
                          :label="item" 
                          border
                          :class="[item.nodeType === 0 ? 'is-node-type' : 'is-node-tag', isCurrClass(item, tag.tagNode) && 'is-checked']">
                          {{ item.tagCnName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <div v-if="tag.nodeTotal > pageSize && tag.currentPage < tag.nodePage" class="global-media-tag-data-more text-center">
                    <span @click="getMoreNode(pIndex, tag.nodeTotal, tag.nodePage)">加载更多</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  props: {
      movieTags: {
          type: Array,
          default: function () {
              return []
          }
      }
  },
  data() {
      var _this = this;
      return {
          activeNames: ['1', '2'],
          loading: false,
          tagData: [{
              tagCodeOn: '',
              tagNode: [],
              child: [],
              nodeTotal: 0,
              nodePage: 1,
              currentPage: 1
          }],
          tagDataBak: [],
          tagNodeUrl: [{
              perId: '',
              perUrl: []
          },{
              perId: 1,
              perUrl: [1, 5, 10]
          },{
              perId: 2,
              perUrl: [1, 5, 10]
          },{
              perId: 3,
              perUrl: [1, 5, 10]
          },{
              perId: 4,
              perUrl: [1, 5, 10]
          },{
              perId: 5,
              perUrl: [1, 5, 10]
          },{
              perId: 14,
              perUrl: [1, 5, 10]
          },{
              perId: 22,
              perUrl: [1, 5, 10]
          }],
          setNodeUrl: [],
          setNodeFlag: false,
          setNodeIndex: 0,
          setNodePerId: 0,
          tagNodeIndex: 0,
          tagParentCode: '-1',
          tagCodeValue: '',
          tagNodeName: '',
          currentPage: 1, // 当前页
          pageSize: 1000000, // 每页记录数 默认先设置为数据列表显示形式的对应值
          isMoreIndex: 0
      }
  },
  watch: {
      /*movieTags: {
          handler: function () {
              let _this = this;
              let index = 0;
              if (_this.removeTagData.level) {
                  index = _this.removeTagData.level - 1;
              }
              if (index < _this.tagData.length) {
                  let tagNodes = _this.tagData[index].tagNode;
                  $.each(tagNodes, function (i, item) {
                      if (item.tagCode === _this.removeTagData.tagCode) {
                          _this.tagData[index].tagNode.splice(i, 1);
                          return false
                      }
                  })
              }
          },
          deep: true // 深度观察
      },*/
      /*resetTagLoading: {
          handler: function () {
              this.tagParentCode = -1;
              this.currentPage = 1;
              this.pageSize = 100;
              if (this.resetTagLoading) {
                  this.tagNodeIndex = 0;
                  this.tagData = [{
                      tagCodeOn: '',
                      tagNode: [],
                      child: [],
                      nodeTotal: 0,
                      nodePage: 1,
                      currentPage: 1
                  }],
                  this.getTagPageList();
              }
          },
          deep: true
      }*/
  },
  created: function () {
      var _this = this;
      _this.getTagPageList();
      if (window.mode) {
          this.mode = window.mode
      }
  },
  computed: {
  },
  methods: {
      clone: function (obj) {
          var _this = this;
          var o;
          switch (typeof obj) {
              case 'undefined':
                  break;
              case 'string':
                  o = obj + '';
                  break;
              case 'number':
                  o = obj - 0;
                  break;
              case 'boolean':
                  o = obj;
                  break;
              case 'object':
                  if (obj === null) {
                      o = null;
                  } else {
                      if (obj instanceof Array) {
                          o = [];
                          for (var i = 0, len = obj.length; i < len; i++) {
                              o.push(_this.clone(obj[i]));
                          }
                      } else {
                          o = {};
                          for (var k in obj) {
                              o[k] = _this.clone(obj[k]);
                          }
                      }
                  }
                  break;
              default:
                  o = obj;
                  break;
          }
          return o;
      },
      handleRemoveTag(removeTagData) {
          let _this = this;
          let index = 0;
          if (removeTagData.level) {
              index = removeTagData.level - 1;
          }
          if (index < _this.tagData.length) {
              let tagNodes = _this.tagData[index].tagNode;
              tagNodes.forEach((i, item) => {
                  if (item.tagCode === removeTagData.tagCode) {
                      _this.tagData[index].tagNode.splice(i, 1);
                      return false
                  }
              })
          }
      },
      setTagNodeUrl(perId) {
          let _this = this;
          _this.tagData.splice(1, _this.tagData.length);
          _this.tagData[0].tagNode = [];
          _this.setNodePerId = perId;
          _this.tagNodeUrl.forEach((i, item) => {
              if (item.perId === perId) {
                  _this.setNodeUrl = item.perUrl;
                  return false
              }
          })
          _this.setNodeIndex = 0;
          if (_this.setNodeUrl.length > 0) {
              let tagNodes = _this.tagData[_this.setNodeIndex].child;
              let tags = [];
              for (let t=0; t<tagNodes.length; t++) {
                  if (tagNodes[t].tagCode == _this.setNodeUrl[_this.setNodeIndex]) {
                      _this.tagData[_this.setNodeIndex].tagNode.push(tagNodes[t]);
                      tags.push(tagNodes[t]);
                      break
                  }
              }
              _this.setNodeFlag = true;
              _this.changeTag(_this.setNodeIndex, tags);
          }
      },
      resetTagLoading(flag) {
          if (flag) {
              this.tagParentCode = -1;
              this.currentPage = 1;
              this.pageSize = 100;
              this.tagNodeIndex = 0;
              this.tagData = [{
                  tagCodeOn: '',
                  tagNode: [],
                  child: [],
                  nodeTotal: 0,
                  nodePage: 1,
                  currentPage: 1
              }];
              this.getTagPageList();
          }
      },
      getTagPageList: function () {
          let _this = this;
          let params = {};
          let nIndex = _this.tagData.length;
          params.parentCode = _this.tagParentCode;
          params.page = _this.currentPage;
          params.rows = _this.pageSize;
          if (_this.setNodeIndex === _this.setNodeUrl.length-1 && (_this.tagParentCode == 10 || _this.tagParentCode == 11)) {
              params.perspectiveId = _this.setNodePerId;
          }
          _this.$service.mediaGetTagList(params)
              .then((data) => {
                  if (_this.tagNodeIndex >= nIndex) {
                      let tagJson = {
                          tagCodeOn: '',
                          tagNode: [],
                          child: [],
                          nodeTotal: 0,
                          nodePage: 1,
                          currentPage: 1
                      }
                      tagJson.child = data.data.rows;
                      if (data.data.rows.length > 0) {
                          _this.tagData.push(tagJson)
                          _this.tagData[_this.tagNodeIndex].nodeTotal = data.data.total;
                          _this.tagData[_this.tagNodeIndex].nodePage = Math.ceil(data.data.total/_this.pageSize);
                          _this.tagData[_this.tagNodeIndex].child.forEach((i, item) => {
                              _this.movieTags.forEach((t, tag) => {
                                  if (item.tagCode === tag.tagCode) {
                                      _this.tagData[_this.tagNodeIndex].tagNode.push(tag);
                                      return false
                                  }
                              })
                          })
                      }
                  } else {
                      if (_this.isMoreIndex > 0) {
                          _this.tagData[_this.tagNodeIndex].child = _this.tagData[_this.tagNodeIndex].child.concat(data.data.rows);
                      } else {
                          _this.tagData[_this.tagNodeIndex].child = data.data.rows;
                      }
                      _this.tagData[_this.tagNodeIndex].nodeTotal = data.data.total;
                      _this.tagData[_this.tagNodeIndex].nodePage = Math.ceil(data.data.total/_this.pageSize);
                      _this.tagData[_this.tagNodeIndex].child.forEach((i, item) => {
                          _this.movieTags.forEach((t, tag) => {
                              if (item.tagCode === tag.tagCode) {
                                  _this.tagData[_this.tagNodeIndex].tagNode.push(tag);
                                  return false
                              }
                          })
                      })
                  }
                  let tagNodes = [];
                  _this.tagData.forEach((i, item) => {
                      tagNodes = tagNodes.concat(item.tagNode)
                  });
                  _this.tagDataBak = _this.clone(_this.tagData);
                  if (_this.setNodeIndex < _this.setNodeUrl.length-1 && _this.setNodeFlag) {
                      _this.setNodeIndex++;
                      let tagNodes = _this.tagData[_this.setNodeIndex].child;
                      let tags = [];
                      for (let t=0; t<tagNodes.length; t++) {
                          if (tagNodes[t].tagCode == _this.setNodeUrl[_this.tagNodeIndex]) {
                              _this.tagData[_this.tagNodeIndex].tagNode.push(tagNodes[t]);
                              tags.push(tagNodes[t]);
                              break
                          }
                      }
                      _this.changeTag(_this.setNodeIndex, tags);
                  } else {
                      _this.setNodeFlag = false
                  }
              })
              .catch((e) => {
                  _this.$message('网络问题，请重试')
              })
      },
      isCurrClass: function (item, tags) {
          let flag = false;
          tags.forEach((i, tag) => {
              if (item.tagCode === tag.tagCode) {
                  flag = true;
                  return false
              }
          })
          return flag
      },
      changeTag: function (index, tags) {
          console.log(tags);
          let _this = this;
          if (tags === undefined) {
              return false
          }
          let tagNodes = [];
          _this.tagData.forEach((i, item) => {
              tagNodes = tagNodes.concat(item.tagNode)
          });
          let tagDataBakNode = _this.tagDataBak[index].tagNode;
          let tagDataNode = _this.tagData[index].tagNode;
          if (tagDataBakNode.length > tagDataNode.length) {
              //减
              tagDataBakNode.forEach((t, tag) => {
                  let flag = true;
                  tagDataNode.forEach((i, item) => {
                      if (tag.tagCode === item.tagCode) {
                          flag = false;
                          return false
                      }
                  });
                  if (flag && tag.nodeType === 1) {
                      _this.movieTags.forEach((i, item) => {
                          if (tag.tagCode === item.tagCode) {
                              _this.movieTags.splice(i, 1);
                              _this.tagData.splice(index+1, _this.tagData.length);
                              _this.tagDataBak.splice(index+1, _this.tagData.length);
                              return false
                          }
                      });
                      return false
                  } else if (flag) {
                      _this.tagData.splice(index+1, _this.tagData.length);
                      _this.tagDataBak.splice(index+1, _this.tagData.length);
                      return false
                  }
              });
          } else {
              //增
              let tagLast = tags[tags.length-1];
              let flag = true;
              if (tagLast.nodeType === 1) {
                  _this.movieTags.forEach((i, tag) => {
                      if (tagLast.tagCode === tag.tagCode) {
                          flag = false;
                          return false
                      }
                  });
                  if (flag && tagLast.nodeType === 1) {
                      _this.movieTags.push(tagLast)
                  }
              } else {
                  let arrList = [];
                  tagDataNode.forEach((i, item) => {
                      if (item.nodeType === 1 || i === tagDataNode.length-1) {
                          arrList.push(item)
                      }
                  });
                  _this.tagData[index].tagNode = [].concat(arrList)
              }
              _this.getChildTagNode(index, tagLast);
          }
          _this.tagDataBak = _this.clone(_this.tagData);
          _this.$emit('get-tag-nodes', _this.movieTags)
      },
      getChildTagNode: function (index, tags) {
          if (tags === undefined) {
              return false
          }
          this.isMoreIndex = 0;
          this.currentPage = 1;
          this.tagCodeValue = tags.tagCode;
          this.tagParentCode = tags.tagCode;
          this.tagNodeIndex = index+1;
          this.tagData[index].currentPage = 1;
          this.tagData[index].tagCodeOn = tags.tagCode;
          this.tagData.splice(index+1, this.tagData.length);
          this.getTagPageList()
      },
      clickCheckedTagNode: function (index, tag) {
          let _this = this;
          if (tag === undefined) {
              return false
          }
          let flag = true;
          this.tagData[index].tagNode.forEach((i, item) => {
              if (tag.tagCode === item.tagCode) {
                  _this.tagData[index].tagNode.splice(i, 1);
                  flag = false;
                  return false
              }
          });
          if (flag) {
              this.tagData[index].tagNode.push(tag)
          }
          this.changeTag(index, this.tagData[index].tagNode)
      },
      getMoreNode: function (index, total, page) {
          if (total < this.pageSize) {
              return
          }
          if (index === 0) {
              this.tagCodeValue = ''
          } else {
              this.tagCodeValue = this.tagData[index-1].tagNode.tagCode;
              this.tagParentCode = this.tagData[index-1].tagNode.tagCode;
              this.tagNodeIndex = index;
          }
          this.isMoreIndex = index;
          this.tagData[index-1].currentPage++;
          if (this.tagData[index-1].currentPage <= page) {
              this.currentPage = this.tagData[index-1].currentPage;
              this.getTagPageList()
          }
      },
      sectionToChinese: function(section){
          var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
          var chnUnitChar = ["","十","百","千"];
          var strIns = '', chnStr = '';
          var unitPos = 0;
          var zero = true;
          while(section > 0){
              var v = section % 10;
              if(v === 0){
                  if(!zero){
                      zero = true;
                      chnStr = chnNumChar[v] + chnStr;
                  }
              }else{
                  zero = false;
                  strIns = chnNumChar[v];
                  strIns += chnUnitChar[unitPos];
                  chnStr = strIns + chnStr;
              }
              unitPos++;
              section = Math.floor(section / 10);
          }
          return chnStr;
      }
  }
}
</script>
<style lang="stylus" scoped>
.is-node-type >>> .el-checkbox__input
  display none
</style>


<style scoped>
/*  
    .global-media-tag-data .custom-collapse .el-checkbox-button, 
    .global-media-tag-data .el-checkbox-button,
    .global-media-tag-data .el-radio-button {
        margin: 5px;
    }
    .global-media-tag-data .custom-collapse .el-checkbox-button__inner {
        width: 120px;
        border-left: 1px solid #bfcbd9;
        border-radius: 4px;
    }
    .global-media-tag-data .el-checkbox-button__inner,
    .global-media-tag-data .el-radio-button__inner {
        min-width: 120px;
        border-left: 1px solid #bfcbd9;
        border-radius: 4px;
    }
    .global-media-tag-data .custom-collapse .el-checkbox-button.is-checked .el-checkbox-button__inner,
    .global-media-tag-data .el-checkbox-button.is-checked .el-checkbox-button__inner,
    .global-media-tag-data .el-radio-button.is-active .el-radio-button__inner {
        border-left: 0;
    }
    .global-media-tag-data .custom-collapse .el-checkbox-button:last-child .el-checkbox-button__inner,
    .global-media-tag-data .el-checkbox-button:last-child .el-checkbox-button__inner,
    .global-media-tag-data .el-radio-button:last-child .el-radio-button__inner {
        border-radius: 4px;
    }
    .global-media-tag-ul li {
        margin-bottom: 10px;
    }
    .el-checkbox-button.is-node-tag.is-checked .el-checkbox-button__inner {
        background-color: #20a0ff;
    }
    .el-checkbox-button.is-node-tag .el-checkbox-button__inner {
        border-color: #20a0ff;
    }
    .is-node-tag .el-checkbox-button__inner, #app .is-node-tag .el-radio-button__inner {
        border-left: 1px solid #20a0ff;
    }
    .el-checkbox-button.is-node-type.is-checked .el-checkbox-button__inner {
        background-color: #999;
        border-color: #999;
        box-shadow: -1px 0 0 0 #999;
    }
    .global-media-tag-data-cont label.el-checkbox-button {
        position: relative;
        margin-right: 26px;
    }
    .el-checkbox-button__inner .el-icon-remove, .el-checkbox-button__inner .el-icon-circle-plus {
        position: absolute;
        right: -18px;
        top: 5px;
        font-size: 14px;
        color: #333;
        width: 15px;
        height: 15px;
        line-height: 14px;
        font-weight: bold;
        border: 1px solid #ddd;
        border-radius: 15px;
        text-align: center;
        cursor: pointer;
    }
    .el-checkbox-button__inner .global-media-tag-data-cont-input {
        position: absolute;
        right: -28px;
        top: 1px;
        font-size: 14px;
        color: #333;
        width: 20px;
        height: 20px;
        line-height: 14px;
        font-weight: bold;
        border: 1px solid #ddd;
        border-radius: 15px;
        text-align: center;
        cursor: pointer;
    }
    .el-checkbox-button__inner .el-icon-remove, .el-checkbox-button__inner .el-icon-circle-plus:hover {
        background: #20a0ff;
        color: #FFF;
    }
    .el-icon-remove:before {
        content: "-";
    }
    .el-icon-circle-plus:before {
        content: "+";
    }
    .global-media-tag-data-more {
        font-size: 14px;
        color: #00b7ee;
        cursor: pointer;
    }
    .global-media-tag-data-cont {
        max-height:350px;
        overflow-y: auto;
    }
*/
</style>