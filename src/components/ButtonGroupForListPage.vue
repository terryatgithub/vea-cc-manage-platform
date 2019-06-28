<template>
  <div>
    <ActionList :actions="actions" :target="this" class="buttonGroup"></ActionList>
  </div>
</template>
<script>
import { ActionList } from 'admin-toolkit'
export default {
  components: {
    ActionList
  },
  props: {
    pageName: String,
    notContainBtns: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      actions: {}
    }
  },
  methods: {
    add() {
      this.$emit('add')
    },
    edit() {
      this.$emit('edit')
    },
    delete() {
      this.$emit('delete')
    },
    batchAudit() {
      this.$emit('batch-audit')
    }
  },
  created() {
    this.$service.getButtonGroupForPageList(this.pageName).then(data => {
      let action = {}
      data.filter((item) => {
        return item.runComm !== 'contentAuthSetting'
      }).forEach(v => {
        if (!this.notContainBtns.includes(v.runComm)) {
          switch (v.runComm) {
            case 'add':
              action[v.runComm] = { text: v.runName, type: 'primary' }
              break
            case 'edit':
              action[v.runComm] = { text: v.runName, type: 'success' }
              break
            case 'delete':
              action[v.runComm] = { text: v.runName, type: 'danger' }
              break
            default:
              action[v.runComm] = { text: v.runName, type: 'primary' }
              break
          }
        }
      })
      this.actions = action
    })
  }
}
</script>
<style lang="stylus" scoped>
.buttonGroup
  justify-content: flex-start
  margin: 10px 0px
</style>
