<template>
  <div>
    <el-table :data="tab.pannelList" border style="margin-top: 20px; max-width: 80%">
      <el-table-column prop="cornerIconId" label="板块ID"></el-table-column>
      <el-table-column prop="cornerIconName" label="板块名称" ></el-table-column>
      <el-table-column label="图片" prop >
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" width="70px">
        </template>
      </el-table-column>
      <el-table-column prop label="优先级" width="100">
        <template scope="scope">
          <OrderInput
            :key="Math.random().toString()"
            :value="scope.$index + 1"
            @input="handleChangePannelOrderStart(scope.$index,$event)"
            @blur="handleChangePannelOrderEnd(scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import OrderInput from './OrderInput'
export default {
  components: {
      OrderInput
  },
  data() {
    return {
      pagination: {},
      currentPannelIndex: undefined,
      currentPannelOrder: undefined,
      tab: {
        cornerIconId: undefined,
        cornerIconName: undefined,
        imgUrl: undefined,
        pannelList: []
      }
    }
  },
  methods: {
    fetchData() {
      this.$service
        .getGlobalMgrList({
          idPrefix: 10
        })
        .then(data => {
          this.tab.pannelList = data.rows
          const selectedPanelList = this.tab.pannelList
          const selectedPanelListIndexed = selectedPanelList.reduce(function(
            result,
            item,
            index
          ) {
            result[item.cornerIconId] = index
            return result
          },
          {})
          console.log(this.tab.pannelList)
        })
    },
    handleChangePannelOrderStart(currentPannelIndex, order) {
      if (order !== '') {
        order = parseInt(order)
        const pannelList = this.tab.pannelList
        if (isNaN(order) || order > pannelList.length || order <= 0) {
          this.currentPannelIndex = undefined
          this.$message({
            type: 'error',
            message: '序号必须大于0且不能大于总数量'
          })
          this.tab.pannelList = pannelList.slice()
        } else {
          this.currentPannelIndex = currentPannelIndex
          this.currentPannelOrder = order
        }
      }
    },
    handleChangePannelOrderEnd(pannelIndex) {
      if (this.currentPannelIndex === pannelIndex) {
        const newIndex = this.currentPannelOrder - 1
        const oldIndex = pannelIndex
        const pannelList = this.tab.pannelList
        const item = pannelList[oldIndex]
        pannelList.splice(oldIndex, 1)
        this.tab.pannelList = [].concat(
          pannelList.slice(0, newIndex),
          item,
          pannelList.slice(newIndex)
        )
        this.currentPannelIndex = undefined
        this.currentPannelOrder = undefined
      }
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style>
</style>
