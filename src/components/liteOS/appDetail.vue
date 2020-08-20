<template>
  <ContentCard title="选择应用海报" @go-back="goBack">
    <el-form class="appForm">
        <el-form-item label="当前应用:">
          {{appData.materialName}}
        </el-form-item>
        <el-form-item label="选择海报:">
            <ul>
                <li v-for="(url, index) in appData.materialPics" :key="index" @click="radioSel(index)">
                    <div class="grid-content">
                        <el-image :src="url.pic" lazy></el-image>
                        <el-radio v-model="radio" :label="index">{{''}}</el-radio>
                    </div>
                </li>
            </ul>
        </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel">
        取消
      </el-button>
      <el-button type="primary" @click="create">
        确定
      </el-button>
    </div>
  </ContentCard>
</template>
<script>
import ContentCard from '@/components/ContentCard'
export default {
  components: {
    ContentCard
  },
  props: {
    material: {
      type: Object,
      default: () => ({
        materialId: '',
        random: ''
      })
    }
  },
  watch: {
    'material.random' (newVal, oldVal) {
      this.detail()
    }
  },
  data () {
    return {
      radio: 0,
      appData: {}
    }
  },
  methods: {
    goBack () {
      this.appData = {}
      this.$emit('goApp')
    },
    detail () {
      if (this.material.materialId) {
        this.$service.getAppManageMaterialId({ materialId: this.material.materialId }).then(data => {
          if (data.code === 0) {
            this.appData = data.data
            this.appData.materialPics = JSON.parse(this.appData.materialPics)
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      }
    },
    radioSel (index) {
      this.radio = index
    },
    cancel () {
      this.$emit('close')
    },
    create () {
      this.$emit('appSure', this.appData.materialId, this.appData.materialName, this.appData.materialPics[this.radio].pic, this.appData.materialPics[this.radio].type)
    }
  },
  created () {
    this.detail()
  }
}
</script>
<style lang='scss'>
.appForm {
    .el-form-item {
        .el-form-item__label {
            width: 90px;
            text-align: right;
        }
        ul {
            max-height: 230px;
            min-height: 230px;
            overflow-y: scroll;
            padding: 0;
        }
        li {
            width: 22%;
            height: 110px;
            display: inline-block;
            margin: 0 5px;
            border-radius: 4px;
        }
        .grid-content {
            border-radius: 4px;
            text-align: center;
            .el-image {
              width: 100%;
              height: 100px;
            }
            .el-radio {
                position: relative;
                bottom: 10px;
            }
        }
    }
}
</style>
