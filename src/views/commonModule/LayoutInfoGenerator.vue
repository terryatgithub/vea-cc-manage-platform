<template>
  <ContentCard title="生成布局" @go-back="$emit('go-back','add')">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="layout-dynamic">
      <el-form-item
        prop="spacing"
        label="间距"
        class="spacing"
        :rules="[
         { required: true, message: '间距不能为空', trigger: 'blur' },
         { type: 'number', message: '请输入数字', trigger: 'blur' }
        ]">
        <el-input-number
          v-model="dynamicValidateForm.spacing"
          :min="10"
          :max="totalWidth"
          placeholder="间距"
          @change="setAllBlockWidth">
        </el-input-number>
      </el-form-item>
      <el-form-item label="附加条件">
        <el-checkbox v-model="dynamicValidateForm.hasPrice">价格</el-checkbox>
        <el-checkbox :value="dynamicValidateForm.lengthwiseIs" @input="handleToggleLengthwise">纵向扩展布局</el-checkbox>
        <el-checkbox :value="dynamicValidateForm.isExpander" @input="handleToggleExpander">横向扩展布局</el-checkbox>
      </el-form-item>
      <el-form-item
        v-for="(row, index) in dynamicValidateForm.rows"
        :label="'第' +(index+1)+'行有几块'"
        :key="row.key"
        class="blockList">
        <el-form-item
          :prop="'rows.' + index+ '.blockNum'"
          class="el-form-item__select"
          :rules="[
             { required: true, message: '请选择行数', trigger: 'blur' }
          ]">
          <el-select
            v-model="row.blockNum" placeholder="请选择" @change="setBlockWidth(row)">
            <el-option
              v-for="(v,index) in blockCount"
              :key="index"
              :label="(index+1)+'块'"
              :value="index+1">
              {{ index + 1 }} 块
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :prop="'rows.' + index+ '.height'"
          class="el-form-item__select el-form-item__height"
          :rules="[
            { required: true, message: '请输入高度', trigger: 'blur' },
            { type: 'number', min: 0, message: '请输入不小于 0 的数字', trigger: 'blur'}
          ]">
          <span class="title">高度</span>
          <el-col :span="9">
            <el-select v-model.number="row.height"
            allow-create
            filterable
            default-first-option
            placeholder="请选择">
              <el-option v-for="(v,index) in heightInit" :key="index" :label="v" :value="v">{{v}}</el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-right: 10px">
          <el-checkbox v-model="row.hasTitle">标题</el-checkbox>
        </el-form-item>
        <el-form-item class="el-form-item__block-width" v-if="row.blockWidth.length>0">
          <span>&nbsp;宽度</span>
          <el-form-item
            v-for="(item,i) in row.blockWidth"
            :prop="'rows.' + index + '.blockWidth.' + i"
            :rules="[
              { required: true, message: '请输入宽度', trigger: 'blur' },
              { type: 'number', min: 0, message: '请输入不小于 0 的数字', trigger: 'blur'}
            ]"
            :key="i">
            <el-input v-model.number="row.blockWidth[i]" @change="handleCalSurplusWidth(row)"></el-input>
          </el-form-item>
          <span>剩余的宽度={{row.surplusWidth}}px</span>
        </el-form-item>
        <el-form-item class="el-form-item__delete">
          <el-col :span="2">
            <el-button v-if="index > 0" @click.prevent="handleRemoveRow(index)">删除</el-button>
          </el-col>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handlePreviewLayout">预览布局</el-button>
        <el-button type="primary" @click="handleGenLayoutEnd">生成布局</el-button>
        <el-button type="primary" @click="handleDownloadLayout">导出布局文件</el-button>
        <el-button type="primary" v-if="canHasMultiRow" @click="handleAddRow">添加行数</el-button>
        <el-button @click="handleResetForm" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
    <section>
      <LayoutBlock
        v-if="layoutForPreview.content.contents.length > 0"
        :content="layoutForPreview.content.contents"
        @change-width="changeWidth"
        class="layoutBloack">
      </LayoutBlock>
    </section>
  </ContentCard>
</template>
<script>
import LayoutBlock from './../../components/LayoutBlock'
import { debounce } from 'lodash'
export default {
  components: {
    LayoutBlock
  },
  props: ['layoutVersion', 'layoutSpacing', 'layoutWidth'],
  data () {
    return {
      dynamicValidateForm: {
        rows: [this.genRow()],
        spacing: this.layoutSpacing || 40,
        hasPrice: false,
        lengthwiseIs: false, // 是否纵向扩展布局
        isExpander: false
      },
      totalWidth: this.layoutWidth || 1760,
      titleHeight: 58, // 标题占用的高度
      priceHeight: 52, // 价格占用的高度
      titleSize: 32, // 标题字体大小
      x: 0, // x坐标初始值
      y: 0, // y坐标初始值
      heightInit: [130, 150, 200, 247, 300, 346, 360, 365, 398, 423, 448],
      layoutForPreview: this.genDefaultLayout()
    }
  },
  computed: {
    blockCount () {
      if (this.dynamicValidateForm.isExpander) {
        return 2
      }
      return 8
    },
    canHasMultiRow () {
      const { isExpander, lengthwiseIs } = this.dynamicValidateForm
      return !(isExpander || lengthwiseIs)
    }
  },
  methods: {
    handleToggleExpander (val) {
      const form = this.dynamicValidateForm
      const rows = form.rows || []
      if (val) {
        form.lengthwiseIs = false
      }
      form.isExpander = val
      form.rows = rows.slice(0, 1)
      const firstRow = form.rows[0]
      if (val && firstRow && firstRow.blockNum > 2) {
        firstRow.blockNum = 1
        this.setBlockWidth(firstRow)
      }
    },
    handleToggleLengthwise (val) {
      const form = this.dynamicValidateForm
      const rows = form.rows || []
      if (val) {
        form.isExpander = false
      }
      form.lengthwiseIs = val
      form.rows = rows.slice(0, 1)
    },
    handleGenLayoutEnd () {
      this.validateAndGenLayout(layout => {
        this.$emit('gen-end', {
          fileName: layout.fileName,
          content: JSON.stringify(layout.content)
        })
      })
    },
    genDefaultLayout () {
      return {
        fileName: '',
        content: {
          type: 'Panel',
          parents: '',
          contents: []
        }
      }
    },
    validateAndGenLayout (cb) {
      this.$refs.dynamicValidateForm.validate(valid => {
        if (valid) {
          cb(this.genLayout())
        } else {
          this.$message.error('请把表单填写完整')
        }
      })
    },
    genLayout () {
      const layoutVersion = this.layoutVersion || 'v8'
      const rowNames = ['A', 'B', 'C', 'D']
      const { rows, hasPrice, spacing, lengthwiseIs, isExpander } = this.dynamicValidateForm
      const lastRowIndex = rows.length - 1
      // 生成标题
      const fileName = rows.reduce((fileName, row, rowIndex) => {
        fileName += rowNames[rowIndex] + row.blockNum + '-' + row.height
        if (row.hasTitle) {
          fileName += '-title'
        }
        if (hasPrice) {
          fileName += '-price'
        }
        if (rowIndex < lastRowIndex) {
          fileName += '-'
        } else {
          fileName += '.txt'
        }
        return fileName
      }, '')
      // 生成推荐位
      const contents = rows.reduce((result, row, rowIndex) => {
        let x = 0
        const blocks = row.blockWidth.map((blockWidth, blockIndex) => {
          const width = parseInt(blockWidth)
          let blockItem = {} // 一条数据
          blockItem.height = row.height
          blockItem.title_align = 0
          if (hasPrice) {
            blockItem.parents = 'Block'
            blockItem.type = 'Mall'
            blockItem.mall_resize = {
              x,
              y: parseInt(result.height),
              width: width,
              height: row.height + this.priceHeight
            }
          } else {
            blockItem.parents = ''
            blockItem.type = 'Block'
          }
          if (row.hasTitle) {
            blockItem.resize = {
              x,
              y: parseInt(result.height),
              width: width,
              height: row.height + this.titleHeight
            }
            blockItem.title_info = {
              width,
              height: this.titleHeight,
              size: this.titleSize
            }
          }
          blockItem.width = width
          blockItem.x = x
          blockItem.y = parseInt(result.height)
          blockItem.whichRow = rowIndex
          blockItem.whichBlock = blockIndex
          x = x + width + spacing
          return blockItem
        })
        const currentRowHeight = row.hasTitle
          ? row.height + this.titleHeight
          : row.height
        result.height = parseInt(result.height) + currentRowHeight + spacing
        result.contents = result.contents.concat(blocks)
        return result
      }, { height: 0, contents: [] }).contents

      const layoutType = isExpander
        ? 'Expander'
        : lengthwiseIs
          ? 'Lengthwise'
          : 'Panel'

      const layout = {
        fileName,
        content: {
          type: layoutType,
          contents,
          parents: '',
          version: layoutVersion
        }
      }

      if (layoutType === 'Expander') {
        const firstBlock = layout.content.contents[0]
        layout.content.extra = {
          width: firstBlock.width,
          height: firstBlock.resize ? firstBlock.resize.height : firstBlock.height,
          orientation: 0,
          space: 40
        }
      }
      return layout
    },
    handleResetForm () {
      this.$refs.dynamicValidateForm.resetFields()
    },
    handleCalSurplusWidth (row) {
      const spacing = +this.dynamicValidateForm.spacing
      const totalWidth = this.totalWidth
      const blockCount = row.blockWidth.length
      const allSpacingWidth = (blockCount - 1) * spacing
      const allBlockWidth = row.blockWidth.reduce((sum, width) => sum + parseInt(width), 0)
      row.surplusWidth = totalWidth - allBlockWidth - allSpacingWidth
    },
    /**
     * 根据 块数得到每块的宽度
     */
    setBlockWidth (row) {
      row.blockWidth = []
      row.surplusWidth = 0
      let oneBlockWidth = this.getBlockWidth(row.blockNum)
      for (var i = 0; i < row.blockNum; i++) {
        row.blockWidth.push(oneBlockWidth)
      }
    },
    setAllBlockWidth () {
      this.dynamicValidateForm.rows.forEach(r => {
        this.setBlockWidth(r)
      })
    },
    /*
    点击纵向布局触发的事件
    */
    changeLayout () {
      const dynamicValidateForm = this.dynamicValidateForm
      const rows = dynamicValidateForm.rows || []
      dynamicValidateForm.rows = rows.slice(0, 1)
    },
    /**
     * width 改变后的宽度，whichRow 所在第几行，whichBlock所在哪一行的第几块，contentsIndex为data.contents中所在的索引值
     */
    changeWidth (width, whichRow, whichBlock, contentsIndex) {
    },
    /*
    预览布局
     */
    handlePreviewLayout () {
      this.validateAndGenLayout(layout => {
        this.layoutForPreview = layout
      })
    },
    onLayoutParamsChange () {
      const layoutParams = this.dynamicValidateForm
      // 验证每一行
      const valid = layoutParams.rows.every(row => {
        if (!row.blockNum || !row.height) {
          return false
        }
        return row.blockWidth.every(width => !!(+width))
      })
      if (valid) {
        this.layoutForPreview = this.genLayout()
      } else {
        this.layoutForPreview = this.genDefaultLayout()
      }
    },
    getBlockWidth (blockNum) {
      return Math.floor(
        (this.totalWidth - this.dynamicValidateForm.spacing * (blockNum - 1)) /
          blockNum
      )
    },
    genRow () {
      return {
        value: '',
        key: Date.now(),
        blockNum: null, // 一行有几块
        height: null,
        hasTitle: false,
        blockWidth: [],
        surplusWidth: 0
      }
    },
    handleRemoveRow (index) {
      this.dynamicValidateForm.rows.splice(index, 1)
    },
    handleAddRow () {
      if (this.dynamicValidateForm.rows.length === 4) {
        return this.$message('最多添加4行')
      }
      this.dynamicValidateForm.rows.push(this.genRow())
    },
    handleDownloadLayout () {
      this.validateAndGenLayout(layout => {
        const urlObject = window.URL || window.webkitURL || window
        const blobData = new Blob([JSON.stringify(layout.content)])
        const aElement = document.createElement('a')
        aElement.href = urlObject.createObjectURL(blobData)
        aElement.download = layout.fileName
        aElement.click()
      })
    }
  },
  created () {
    this.onLayoutParamsChange = debounce(this.onLayoutParamsChange, 300)
    this.$watch('dynamicValidateForm', {
      handler: this.onLayoutParamsChange,
      deep: true
    })
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
.el-form-item__block-width >>>
  input
    width: 60px
    margin-right: 5px
  .el-form-item
    margin-bottom 5px
.el-form-item__height
  >>> .el-input__suffix
    right: 20px
.el-form-item__select
  >>> input
    width: 100px
.el-form-item__block-width span
  min-width: 50px
.el-form-item__delete
  margin-left: 10px
section
  background: #f7f0f0
  width: 811px
  margin: auto
</style>
