<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div class="btGroup">
      <el-button type="primary" @click="$refs.gateForm.handleSubmit()">确定</el-button> 
      <el-button type="info" @click="$emit('go-back')">取消</el-button>
    </div>
    
    <GateSchemaForm 
      :schema="schema" 
      v-model="formData"
      ref="gateForm"
      @submit="handleSubmit"
    >
    </GateSchemaForm>
  </ContentCard>
</template>

<script>
import _ from '../../utlis/gateschema'
const schema = _.map({
  deptName: _.o.string.required.other("form", {
    label: "部门名称"
  }),
  deptTel: _.o.string.required.other('form', {
    label: "部门电话"
  }),
  deptFax: _.o.string.required.other('form', {
    label: '部门传真',
  }),
  remark: _.o.string.required.other('form', {
    label: '备注',
  }),
  seq: _.o.number.required.other('form', {
    label: '排序'
  }),
  pid: _.o.enum({ '酷开-研发': 57, '酷开-运营': 58, '酷开-测试': 59 }).other('form', {
    component: 'Select',
    label: '上级部门'
  }),
  disabled: _.o.enum({ 是: 1, 否: 0 }).other('form', {
    label: '是否禁用'
  })
}).other('form', {
    cols: {
      label: 3,
      wrapper: 5
    }
})
export default {
  props: {
    editId: Number,
    default: null
  },

  data() {
    return {
      title: null,
      schema,
      formData: {
        pid: 57,
        disabled: 0
      }
    };
  },

  methods: {
    //保存表单信息
    handleSubmit(err) {
      if (err.length === 0) {
        this.$service.sysDeptSave(this.formData, '保存成功');
        this.$emit('openListPage');
      }
    },
    getDepts() {
      return this.$service.getDepts().then(data => {
        this.departmentList = data;
      });
    },
    getEditData() {
      this.$service.sysDeptDetailInfo({id: this.editId});
    }
  },

  created() {
    this.getDepts();
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.getEditData();
    } else {
      this.title = '新增'
    }
  }
};
</script>

<style lang='stylus' scoped>
.btGroup
  margin 20px
</style>