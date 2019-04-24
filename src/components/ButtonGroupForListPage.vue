<template>
  <div>
    <ActionList :actions="actions" :target="this" class ="buttonGroup"></ActionList>
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
       default: function () {
        return []
       }
    }
  },
  data() {
    return {
      actions: {

      }
    }
  },
  methods: {
    add() {
      this.$emit("add")
    },
    edit(){
      this.$emit("edit")
    },
    delete(){
      this.$emit("delete")
    }
  },
  created() {
    this.$service.getButtonGroupForPageList(this.pageName).then((data) =>{
       let action = {}
        data.forEach(v => {
          if (!this.notContainBtns.includes(v.runComm)) {
            action[v.runComm] = { text: v.runName, type: 'primary' }
          }
        })
        this.actions = action
    })
  }
}
</script>
<style lang="stylus" scoped>
.buttonGroup 
    justify-content flex-start
</style>


