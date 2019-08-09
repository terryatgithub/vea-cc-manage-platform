<template>
  <div class="table-box">
    <Table :data="table.data" :props="table.props" :header="table.header" :selection-type="table.selectionType" />
  </div>
</template>
<script>
  import { Table } from 'admin-toolkit'

  export default {
    components: {
      Table
    },
    data() {
      return {
        table: {
          props: {
            border: true,
            size: 'small',
            'row-style': () => { return "height: 20px" },
            'cell-style': () => { return "padding: 0" },
            'header-cell-style': () => { return "padding: 0" }
          },
          header: [
            {
              label: '',
              prop: 'date',
              width: 35
            },
            {
              label: '曝光UV',
              prop: 'exposureUV',
              width: 70
            },
            {
              label: '环比',
              prop: 'dailyGrowth',
              width: 70
            },
            {
              label: '同比',
              prop: 'weeklyGrowth',
              width: 70
            }
          ],
          data: [
            {
              date: '27',
              exposureUV: '178123',
              dailyGrowth: '13.3%',
              weeklyGrowth: '13.3%'
            },
            {
              date: '28',
              exposureUV: '178123',
              dailyGrowth: '13.3%',
              weeklyGrowth: '13.3%'
            },
            {
              date: '29',
              exposureUV: '178123',
              dailyGrowth: '13.3%',
              weeklyGrowth: '13.3%'
            }
          ],
          selectionType: 'none'
        }
      };
    },
    props: ['panelID'],
    methods: {

    },
    created() {
      console.log('panelID', this.panelID);
    }
  };
</script>


<style lang="stylus" scoped>
.table-box 
  position: absolute 
  top: 0% 
  right: -270px
</style>