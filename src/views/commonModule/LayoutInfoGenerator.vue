<template>
  <ContentCard title="生成布局" @go-back="$emit('go-back','add')">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="layout-dynamic"
    >
      <el-form-item
        prop="spacing"
        label="间距"
        class="spacing"
        :rules="[
         { required: true, message: '间距不能为空', trigger: 'blur' },
         { type: 'number', message: '请输入数字', trigger: 'blur' }
        ]"
      >
        <el-input-number
          v-model="dynamicValidateForm.spacing"
          :min="10"
          :max="totalWidth"
          placeholder="间距"
          @change="setAllBlockWidth"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="附加条件">
        <el-checkbox v-model="dynamicValidateForm.hasPrice">价格</el-checkbox>
        <el-checkbox v-model="dynamicValidateForm.lengthwiseIs" @change="changeLayout">纵向扩展布局</el-checkbox>
      </el-form-item>
      <el-form-item
        v-for="(row, index) in dynamicValidateForm.rows"
        :label="'第' +(index+1)+'行有几块'"
        :key="row.key"
        class="blockList"
      >
        <el-form-item
          :prop="'rows.' + index+ '.blockNum'"
          class="el-form-item__select"
          :rules="[
             { required: true, message: '请选择行数', trigger: 'blur' }
          ]"
        >
          <el-col :span="9">
            <el-select v-model="row.blockNum" placeholder="请选择" @change="setBlockWidth(row)">
              <el-option
                v-for="(v,index) in blockCount"
                :key="index"
                :label="(index+1)+'块'"
                :value="index+1"
              >{{index+1}}块</el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          :prop="'rows.' + index+ '.height'"
          class="el-form-item__select el-form-item__height"
          :rules="[
            { required: true, message: '请输入高度', trigger: 'blur' }
          ]"
        >
          <span class="title">高度:</span>
          <el-col :span="9">
            <el-select v-model="row.height" 
            allow-create 
            clearable
            filterable
            default-first-option
            placeholder="请选择">
              <el-option v-for="(v,index) in heightInit" :key="index" :label="v" :value="v">{{v}}</el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <span class="title" style="margin-left:10px;">标题:</span>
          <el-col :span="1">
            <el-checkbox v-model="row.hasTitle"></el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item__block-width" v-if="row.blockWidth.length>0">
          <span>宽度:</span>
          <div v-for="(item,i) in row.blockWidth" :key="i">
            <el-input v-model="row.blockWidth[i]" @change="surplusWidth(row)"></el-input>
          </div>
          <span>剩余的宽度={{row.surplusWidth}}px</span>
        </el-form-item>
        <el-form-item class="el-form-item__delete">
          <el-col :span="2">
            <el-button v-if="index>0" @click.prevent="removeDomain(row)">删除</el-button>
          </el-col>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reviewLayout('dynamicValidateForm')">预览布局</el-button>
        <el-button type="primary" @click="submitForm()">生成布局</el-button>
        <el-button type="primary" @click="export_raw">导出布局文件</el-button>
        <el-button type="primary" v-if="!dynamicValidateForm.lengthwiseIs" @click="addDomain">添加行数</el-button>
        <el-button @click="resetForm('dynamicValidateForm')" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
    <section>
      <LayoutBloack :content="data.contents"  @change-width="changeWidth" class="layoutBloack"></LayoutBloack>
    </section>
  </ContentCard>
</template>
<script>
import LayoutBloack from './../../components/LayoutBlock'
export default {
  components: {
    LayoutBloack
  },
  data() {
    return {
      dynamicValidateForm: {
        rows: [
          {
            value: '',
            key: Date.now(),
            blockNum: null, // 一行有几块
            height: null,
            hasTitle: false,
            blockWidth: [],
            surplusWidth: 0 // 剩余的宽度
          }
        ],
        spacing: 0,
        hasPrice: false,
        lengthwiseIs: false // 是否纵向扩展布局
      },
      blockCount: 6, // 块数
      totalWidth: 1622,
      titleHeight: 58, // 标题占用的高度
      priceHeight: 52, // 价格占用的高度
      titleSize: 32, // 标题字体大小
      x: 0, // x坐标初始值
      y: 0, // y坐标初始值
      heightInit: [130, 150, 200, 247, 300, 346, 360, 365, 398, 423, 448],
      data: {
        contents: [], // 布局的contents字段
        parents: '',
        type: 'Panel'
      },
      fileName: ''
    }
  },
  methods: {
    submitForm(type) {
      this.$refs.dynamicValidateForm.validate(valid => {
        if (valid) {
          this.genLayout(type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /** 生成布局
     * type undefined 时生产布局，type= download 为导出
     */
    genLayout(type) {
      var fileName = ''
      var lineName = new Array('A', 'B', 'C', 'D')
      var rows = this.dynamicValidateForm.rows
      for (var i = 0; i < rows.length; i++) {
        fileName += lineName[i] + rows[i].blockNum + '-' + rows[i].height
        if (rows[i].hasTitle) fileName += '-title'
        if (this.dynamicValidateForm.hasPrice) fileName += '-price'
        if (i < rows.length - 1) fileName = fileName + '_'
      }
      fileName = fileName + '.txt'
      this.fileName = fileName
      if (this.data.contents.length === 0) {
        this.getLayoutData()
      }
      if (type === undefined) {
        this.$emit('generator-layout', {
          fileName: fileName,
          content: JSON.stringify(this.data)
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    surplusWidth(row) {
      row.surplusWidth = 0
      row.surplusWidth =
        this.totalWidth -
        row.blockWidth.reduce((result, current, index) => {
          if (index > 0) { return result + parseInt(current) + this.dynamicValidateForm.spacing } else return result + parseInt(current)
        }, 0)
    },
    /**
     * 根据 块数得到每块的宽度
     */
    setBlockWidth(row) {
      row.blockWidth = []
      row.surplusWidth = 0
      let oneBlockWidth = this.getBlockWidth(row.blockNum)
      for (var i = 0; i < row.blockNum; i++) {
        row.blockWidth.push(oneBlockWidth)
      }
    },
    setAllBlockWidth() {
      this.dynamicValidateForm.rows.forEach(r => {
        this.setBlockWidth(r)
      })
    },
    /*
    点击纵向布局触发的事件
    */
    changeLayout() {
      if (this.dynamicValidateForm.rows.length > 1) {
        let arr = []
        arr.push(this.dynamicValidateForm.rows.shift())
        this.dynamicValidateForm.rows = arr
        // this.getLayoutData()
      }
    },
    /*
    生存JSON数据
    */
    getLayoutData() {
      this.data.contents = []
      this.dynamicValidateForm.rows.reduce(
        (result, current, index) => {
          let x = 0
          for (var i = 0; i < current.blockNum; i++) {
            let width = parseInt(current.blockWidth[i])
            let row = {} // 一条数据
            row['height'] = current.height
            row['title_align'] = 0
            if (this.dynamicValidateForm.hasPrice) {
              row['parents'] = 'Block'
              row['type'] = 'Mall'
              row['mall_resize'] = {
                x: x,
                y: parseInt(result.height),
                width: width,
                height: current.height + this.priceHeight
              }
            } else {
              row['parents'] = ''
              row['type'] = 'Block'
            }
            if (current.hasTitle) {
              row['resize'] = {
                x: x,
                y: parseInt(result.height),
                width: width,
                height: current.height + this.titleHeight
              }
              row['title_info'] = {
                width: width,
                height: this.titleHeight,
                size: this.titleSize
              }
            }
            row['width'] = width
            row['x'] = x
            row['y'] = parseInt(result.height)
            row['whichRow'] = index
            row['whichBlock'] = i
            this.data.contents.push(row)
            x = x + width + this.dynamicValidateForm.spacing
          }
          let h = current.hasTitle
            ? current.height + this.titleHeight
            : current.height
          result.height =
            parseInt(result.height) + h + this.dynamicValidateForm.spacing
          return result
        },
        { height: 0 }
      )
      if (!this.lengthwiseIs) {
        // 非纵向扩展布局
        this.data.type = 'Panel'
      } else {
        this.data.type = 'Lengthwise'
      }
    },
    /**
     * width 改变后的宽度，whichRow 所在第几行，whichBlock所在哪一行的第几块，contentsIndex为data.contents中所在的索引值
     */
    changeWidth(width, whichRow, whichBlock, contentsIndex) {
      let row = this.dynamicValidateForm.rows[whichRow]
    },
    /*
    预览布局
     */
    reviewLayout(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getLayoutData()
        } else {
          return false
        }
      })
    },
    getBlockWidth(blockNum) {
      return Math.floor(
        (this.totalWidth - this.dynamicValidateForm.spacing * (blockNum - 1)) /
          blockNum
      )
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.rows.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.rows.splice(index, 1)
      }
    },
    addDomain() {
      if (this.dynamicValidateForm.rows.length === 4) {
        this.$message('最多添加4行')
        return
      }
      this.dynamicValidateForm.rows.push({
        value: '',
        key: Date.now(),
        blockNum: null, // 一行有几块
        height: null,
        hasTitle: false,
        blockWidth: [],
        surplusWidth: 0
      })
    },
    fake_click(
      obj //* ************模拟一个UI事件，做到自动下载
    ) {
      var ev = document.createEvent('MouseEvents')
      ev.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      obj.dispatchEvent(ev)
    },
    export_raw() { //* ******************导出文件函数
      if (this.fileName === '') {
        this.submitForm('download')
        return
      }
      var urlObject = window.URL || window.webkitURL || window
      var export_blob = new Blob([JSON.stringify(this.data)])
      var save_link = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'a'
      )
      save_link.href = urlObject.createObjectURL(export_blob)
      save_link.download = this.fileName
      this.fake_click(save_link)
    }
  }
}
</script>
<style lang="stylus" scoped>
.title
  margin-right: 10px
  text-align: right
  width: 70px
.spacing
  >>> .el-input-number
    width: 190px
.layout-dynamic
  >>> .el-select
    width: 100%
.blockList
  >>> .el-form-item__content
    display: flex
    .el-col
      width: 100%
.el-form-item__height
  >>> .el-form-item__error
    left: 60px
.layoutBloack
  >>> .size-mark
    display: none
.el-form-item__block-width
  >>> input
    width: 60px
    margin-right: 5px
.el-form-item__height
  >>> .el-input__suffix
    right: 20px
.el-form-item__select
  >>> input
    width: 150px
.el-form-item__block-width span
  min-width: 50px
.el-form-item__delete
  margin-left: 10px
section
  background: #f7f0f0
  width: 811px
  margin: auto
</style>
