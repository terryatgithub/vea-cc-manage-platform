<template>
  <div>
    <HomePageInfoList 
      v-show='isShowList' 
      ref="list" 
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
    />
    <HomePageInfo 
      v-if='!isShowList' 
      :id="id" 
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </HomePageInfo>
  </div>
</template>
<script>
import HomePageInfo from './HomePageInfo'
import HomePageInfoList from './HomePageInfoList'
export default {
  components: {
    HomePageInfo,
    HomePageInfoList
  },
  data () {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined
    }
  },
  methods: {
    handleCreate() {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit(item) {
      this.id = item.homepageId
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(item, version) {
      this.id = item.homepageId
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleCopy(item) {
      this.id = item.homepageId
      this.mode = 'copy'
      this.isShowList = false
    },
    handleUpsertEnd () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
      this.mode = 'list'
      this.version = undefined
    },
    goBack () {
     this.isShowList = true
     this.mode = 'list'
     this.version = undefined
    }
  }
}
</script>