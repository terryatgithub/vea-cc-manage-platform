<template>
    <ContentCard class="global-picture" :title="title" @go-back="$emit('go-back')">
      <CommonContent
        :mode="mode"
        :resource-info="resourceInfo"
        @edit="mode = 'edit'"
        @unaudit="$emit('upsert-end')"
        @shelves="fetchData"
        @audit="$emit('upsert-end')"
        @select-version="fetchData"
        @delete="$emit('upsert-end', $event)"
      >
        <div slot="auditAndDraft">
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
        <div class="layout-upsert" v-if="mode !== 'read'">
          <div class="form-legend-header">
            <i class="el-icon-edit">基本信息</i>
          </div>

          <el-form :model="form" :rules="formRules" ref="form" label-width="120px" class="el-form-add">
            <el-form-item label="角标分类名称" prop="typeName">
              <el-input v-model="form.typeName" placeholder="角标名称"></el-input>
            </el-form-item>
            <el-form-item label="角标位置" prop="typePosition">
              <el-select v-model="form.typePosition" placeholder="角标位置">
                <el-option
                  v-for="item in $consts.cornerIconPositionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优先级" prop="typePriority">
              <el-input-number v-model="form.typePriority" :min="1" label="优先级"></el-input-number>
              <!-- <el-input v-model="form.typePriority" placeholder="优先级"></el-input> -->
            </el-form-item>
          </el-form>

        </div>
        <div class="layout-read" v-if="mode === 'read'">
        </div>
      </CommonContent>
    </ContentCard>
</template>

<script>
import CommonContent from '@/components/CommonContent.vue'
import titleMixin from '@/mixins/title'
export default {
  mixins: [titleMixin],
  components: {
    CommonContent
  },
  data () {
    return {
      mode: 'create',
      resourceName: '角标分类',
      form: {
        typeId: undefined,
        typeName: null,
        typePosition: null,
        typePriority: null
      },
      formRules: {
        // 表单规则
        typeName: [
          { required: true, message: '请输入角标名称', trigger: 'blur' },
          { max: 45, message: '不能超过45个字符', trigger: 'blur' }
        ],
        typePosition: [
          { required: true, message: '请输入角标位置', trigger: 'blur' }
        ],
        typePriority: [
          { required: true, message: '请输入角标优先级', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['initMode', 'id'],
  computed: {
    // eslint-disable-next-line
    resourceInfo() {
      const form = this.form
      if (form.typeId) {
        return {
          id: form.typeId,
          type: 'icon',
          menuElId: 'globalCornerIcon',
          version: form.currentVersion,
          status: form.typeStatus
        }
      }
    }
  },
  methods: {
    fetchData (version) {
      this.$service
        .globalCornerIconTypeDetail({ id: this.id })
        .then(data => {
          this.form = Object.assign({}, this.form, data)
        })
    },
    handleSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service
            .globalCornerIconTypeSave(this.form, '保存成功')
            .then(_ => {
              this.$emit('upsert-end')
            })
        }
      })
    }
  },
  created () {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
  }
}
</script>

<style scoped>
.global_icon_actions {
  padding: 15px;
  margin-bottom: 20px;
}
.global-picture .upload-pic-list__item,
.global-picture .pic-info {
  display: inline-block;
  vertical-align: top;
}
.global-picture__label,
.global-picture__uploader {
  display: inline-block;
  vertical-align: top;
}
.global-picture__label {
  width: 80px;
  text-align: right;
  margin-right: 20px;
}
.global-picture .upload-pic-list__item {
  width: 180px;
  height: 180px;
}
.global-picture .upload-pic-list__item-wrapper {
  width: 600px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  position: relative;
}

.global-picture .upload-pic-list__item {
  position: relative;
}
.global-picture .upload-pic-list__item img {
  max-width: 100%;
  max-height: 100%;
}
.global-picture .upload-pic-list__error {
  position: absolute;
  background: #000;
  opacity: 0.7;
  color: #fff;
  width: 100%;
  font-size: 12px;
  padding: 5px;
  display: block;
  box-sizing: border-box;
}

.global-picture .upload-pic-list__remove {
  position: absolute;
  color: red;
  cursor: pointer;
  top: 10px;
  right: 10px;
}
.global-pic-type-selector .el-tag {
  margin: 10px;
  cursor: pointer;
}
</style>
