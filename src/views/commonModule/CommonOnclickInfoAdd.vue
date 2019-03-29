<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="160px">
          <!-- <el-form-item label="菜单ID" prop="commonOnclickId">
            <el-input v-model="form.commonOnclickId" placeholder="菜单ID"></el-input>
          </el-form-item> -->
          <el-form-item label="点击事件名称" prop="onlickName">
            <el-input v-model="form.onlickName" placeholder="点击事件名称"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item label="点击事件json串" prop="onlickJson">
            <el-input type="textarea" v-model="form.onlickJson" placeholder="异常处理(exception)"></el-input>
          </el-form-item>
          <el-form-item label="应用包名" prop="packagename">
            <el-input v-model="form.packagename" placeholder="应用包名"></el-input>
          </el-form-item>
          <el-form-item label="应用版本号" prop="versioncode">
            <el-input v-model="form.versioncode" placeholder="应用版本号"></el-input>
          </el-form-item>
          <el-form-item label="启动动作" prop="dowhat">
            <el-select v-model="form.dowhat" placeholder="请选择活动区域">
              <el-option label="startActivity" value="startActivity"></el-option>
              <el-option label="startService" value="startService"></el-option>
              <el-option label="sendBroadcast" value="sendBroadcast"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启动方式" prop="bywhat">
            <el-select v-model="form.bywhat" placeholder="请选择活动区域">
              <el-option label="action" value="action"></el-option>
              <el-option label="class" value="class"></el-option>
              <el-option label="uri" value="uri"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启动参数" prop="byvalue">
            <el-input v-model="form.byvalue" placeholder="启动参数"></el-input>
          </el-form-item>
          <el-form-item label="扩展参数" prop="params">
            <ul class="cc-params-ul">
              <li v-for="(item, index) in paramsList">
                <el-input v-model="item.key" :value="item.key" placeholder="key"></el-input>
                <el-input v-model="item.value" :value="item.value" placeholder="value"></el-input>
                <el-button v-show="paramsList.length > 1" type="danger" size="mini" @click="paramsRedBtn(index)" title="删除">-</el-button>
              </li>
            </ul>
            <div class="cc-params-btn">
              <el-button type="primary" size="mini" @click="paramsAddBtn" title="增加">+</el-button>
            </div>
          </el-form-item>
          <el-form-item label="异常处理(exception)" prop="exception">
            <el-input type="textarea" v-model="form.exception" placeholder="异常处理(exception)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitBtn">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </ContentCard>
</template>
<script>
export default {
  props: {
    editId: Number,
    default: null
  },
  //  prop: ['editId'],
  data() {
    return {
      title: null,
      form: {
        //commonOnclickId: null,
        onlickName: null,
        remark: null,
        onlickJson: null,
        packagename: null,
        versioncode: '-1',
        dowhat:'startActivity',
        bywhat:'action',
        byvalue:null,
        params:null,
        exception:null
      },
      formRules: {
        //表单规则
        onlickName: [{ required: true, message: "请输入点击事件名称", trigger: "blur" }],
        packagename: [{ required: true, message: "请输入应用包名", trigger: "blur" }],
        byvalue: [{ required: true, message: "请输入启动参数", trigger: "blur" }]
      },
      paramsList: [{
        key: '',
        value: ''
      }]
    };
  },
  methods: {
    paramsAddBtn() {
      this.paramsList.push({
        key: '',
        value: ''
      })
    },
    paramsRedBtn(index) {
      this.paramsList.splice(index, 1)
    },
    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {}
          let jsonStr = {}
          this.paramsList.forEach(function (item) {
            if(item.key.trim() != '') {
              params[item.key] = item.value;
            }
          })
          this.form.params = JSON.stringify(params)
          jsonStr.jsonStr = JSON.stringify(this.form)
          console.log(this.form)
          this.$service.commonOnclickInfoSave(jsonStr, "保存成功").then(data => {
            this.$emit("openListPage");
          });
        }
      });
    },
    getEditData() {
      let obj = this;
      this.$service.getCommonOnclickInfoEdit({ id: this.editId }).then(data => {
        Object.keys(this.form).forEach(v => {
          obj.form[v] = data[v];
          if (v === 'params') {
            let arrs = []
            let lists = JSON.parse(data[v])
            console.log(lists)
            Object.keys(lists).forEach(p => {
              let jsons = {}
              jsons.key = p
              jsons.value = lists[p]
              arrs.push(jsons)
            })
            if (data[v] !== '{}') {
              obj.paramsList = arrs
            }
          }
        });
      });
    },
  },
  created() {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = "编辑";
      this.getEditData();
    } else {
      this.title = "新增";
    }
  }
};
</script>
<style lang="stylus" scoped>
.cc-params-ul, .cc-params-ul li 
  list-style none
  margin 0
  padding 0
.cc-params-ul li 
  margin-bottom 8px
.cc-params-ul li > div 
  display inline-block
  width 20%
  margin-right 5px
</style>
