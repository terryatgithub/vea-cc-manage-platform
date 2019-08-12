<template>
  <div>
    {{uvctr.value}}
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      uvctr: {
        value: '',
        dailyGrowth: '',
        weeklyGrowth: ''
      }
    };
  },
  props: ['id'],
  methods: {

  },
  created() {
    this.$service.getBlockSimpleBrowseData({id}).then(data => {
      const uvctr = data.rows[0].data[0].uvctr
      this.uvctr = {
        value: uvctr.value ? this.toPercent(uvctr.value) : 'N/A',
        dailyGrowth: uvctr.dailyGrowth ? this.toPercent(uvctr.dailyGrowth) : 'N/A',
        weeklyGrowth: uvctr.weeklyGrowth ? this.toPercent(uvctr.weeklyGrowth) : 'N/A'
      }
    })
  }
};
</script>

<style lang="stylus" scoped>
</style>