<template>
  <div> 
    <el-button 
      v-for="(item, index) in actions || defaultAction" 
      :key="index"
      :type="item.type"
      @click="$emit(item.value, $event)">
      {{ item.label }}
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultAction: [
        {
          label: '新建',
          value: 'create',
          type: 'primary'
        },
        {
          label: '编辑',
          value: 'edit',
          type: 'primary'
        },
        {
          label: '删除',
          value: 'delete',
          type: 'danger'
        }
      ]
    }
  },
  props: ['actions']
}
</script>

<style>

</style>
