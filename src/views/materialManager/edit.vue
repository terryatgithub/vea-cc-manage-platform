<template>
    <div>
        <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempArticleData"
        label-position="left"
        style="width: 400px;"
        v-if="type === 'brand'"
      >
        <el-form-item
          label="选择客户"
        >
          <el-select
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="输入客户">
          <el-input
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="输入品牌">
          <el-input
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempArticleData"
        label-position="left"
        style="width: 400px;"
        v-if="type === 'model'"
      >
        <el-form-item
          label="选择机芯"
        >
          <el-select
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="输入机芯">
          <el-input
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="输入机型">
          <el-input
            placeholder="Please input"
          />
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
