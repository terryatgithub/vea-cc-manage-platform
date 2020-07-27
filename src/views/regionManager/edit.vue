<template>
    <div>
        <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempArticleData"
        style="width: 400px;"
        :inline="true"
      >
        <el-form-item label='客户&品牌'>
          <el-cascader
            placeholder='请选择'
            :options='userOptions'
            :props="{ expandTrigger: 'hover' }"
            size='mini'
            :clearable='true'
            @change='brandIdSel'
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="create">
          确定
        </el-button>
      </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    type: {
      type: String
    }
  },
  data () {
    return {
      userOptions: [
        { key: 'CN', displayName: 'China' },
        { key: 'US', displayName: 'USA' },
        { key: 'JP', displayName: 'Japan' },
        { key: 'EU', displayName: 'Eurozone' }
      ]
    }
  },
  methods: {
    cancel () {

    },
    create () {

    }
  }
}
</script>
<style lang='stylus' scoped>

</style>
