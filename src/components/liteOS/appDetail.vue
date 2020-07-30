<template>
  <ContentCard title="选择应用海报" @go-back="goBack">
    <el-form class="appForm">
        <el-form-item label="当前应用:">
            xxxxx
        </el-form-item>
        <el-form-item label="选择海报:">
            <ul>
                <li v-for="(url, index) in urls" :key="index" @click="radioSel(index)">
                    <div class="grid-content">
                        <el-image :src="url" lazy></el-image>
                        <el-radio v-model="radio" :label="index"></el-radio>
                    </div>
                </li>
            </ul>
        </el-form-item>
    </el-form>

  </ContentCard>
</template>
<script>
import ContentCard from '@/components/ContentCard'
export default {
  components: {
    ContentCard
  },
  data () {
    return {
      radio: 1,
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ]
    }
  },
  methods: {
    goBack () {
      this.$emit('goApp')
    },
    radioSel (index) {
      this.radio = index
    }
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
            overflow: hidden;
            padding: 0;
        }
        li {
            width: 22%;
            height: 110px;
            margin: 0 5px;
            float: left;
            border-radius: 4px;
        }
        .grid-content {
            border-radius: 4px;
            text-align: center;
            .el-radio {
                position: relative;
                bottom: 10px;
            }
        }
    }
}
</style>
