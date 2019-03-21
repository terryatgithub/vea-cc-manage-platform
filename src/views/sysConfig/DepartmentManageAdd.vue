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

export default {
  props: {
    editId: Number,
    default: null
  },

  data() {
    return {
      title: null,
      schema: null,
      formData: {
        deptName: '',
        remark: '',
        disabled: 0,
        pid: 0
      },
      depts: {
        '无': 0
      }
    };
  },

  methods: {
    //保存表单信息
    handleSubmit(err) {
      if (err.length === 0) {
        const data = this.formData
        this.$service.sysDeptSave({jsonStr: data}, '保存成功').then(() => {
          this.$emit('openListPage')
        })
      }
    },
    getDepts() {
      return this.$service.getDepts().then(data => {
        data.forEach(element => {
          this.depts[element.deptName] = element.deptId
        })
      });
    },
    getEditData() {
      this.$service.sysDeptDetailInfo({id: this.editId}).then(data => {
        this.formData = data
      });
    }
  },

  created() {
    // this.getDepts();
    // console.log(this.depts);
    let schema = _.map({
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
      pid: _.o.enum(this.depts).other('form', {
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
    this.getDepts().then(() => {
      this.schema = schema
    })
    if (this.editId) {
      this.title = '编辑'
      this.getEditData()
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