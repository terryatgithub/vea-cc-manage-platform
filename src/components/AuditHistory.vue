<template>
  <div v-if="data.length > 0">
    <div class="form-legend-header">
        <span>审核者备注</span>
    </div>
    <table class="audit-history-table">
      <tr v-for="(item, index) in data" :key="index">
        <td>
          {{ item.lastUpdateDate }}
        </td>
        <td>
          {{ item.auditor }}
        </td>
        <td>
          {{ $consts.statusText[item.auditFlag] }}
        </td>
        <td>
          {{ item.auditDesc }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.audit-history-table
  color #999
  font-size 14px
.audit-history-table tr:last-child 
  color #000
</style>
