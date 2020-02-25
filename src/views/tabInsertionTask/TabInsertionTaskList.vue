<template>
  <ContentCard>
    <ListLayout
      :pagination="pagination"
      @pagingation-change="fetchData">
      <el-form :inline="true"  slot="filter">
        <el-form-item >
          <el-select v-model="filter.enableTask" clearable placeholder="开启状态">
            <el-option
              v-for="item in taskStatusOptions"
              :label="item.label"
              :value="item.value"
              :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select v-model="filter.source" clearable placeholder="内容源">
            <el-option
              v-for="item in $consts.sourceOptions"
              :label="item.label"
              :value="item.value"
              :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="handleFilter">查询</el-button>
        <el-button type="primary" @click="handleResetFilter">重置</el-button>
      </el-form>
      <ActionList
        slot="actions"
        :actions="[
        {
          label: '新建',
          value: 'create',
          type: 'primary'
        }]"
        @create="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
       />
      <Table
        slot="table"
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange" />
    </ListLayout>
    <el-dialog
      :visible.sync="showEnableTaskDialog"
      :append-to-body="true"
      width="400px">
      <el-form :model="taskInfo" :rules="taskInfoRules" ref="taskStatusForm">
        <el-form-item prop="aliveTime">
          任务持续时间
          <div class="display-inline-block">
            <InputPositiveInt v-model.number="taskInfo.aliveTime" />
          </div>
          小时
          <p>开启 24 小时即可覆盖 65% 用户, 建议不要超过 168 小时</p>
        </el-form-item>
        <el-button class="h-center" type="primary" @click="handleUpsertTaskStatus">确定</el-button>
      </el-form>
    </el-dialog>
  </ContentCard>
</template>
<script>
import { components } from 'admin-base'
import { Table } from 'admin-toolkit'
import ListLayout from '@/components/ListLayout'
import ActionList from '@/components/ActionList'
import InputPositiveInt from '@/components/InputPositiveInt'
import { cloneDeep } from 'lodash'
export default {
  extends: components.ResourceBaseList,
  components: {
    Table,
    ActionList,
    ListLayout,
    InputPositiveInt
  },
  data () {
    return {
      taskStatusOptions: [
        {
          label: '开启',
          value: 1
        },
        {
          label: '关闭',
          value: 0
        }
      ],
      filter: this.genDefaultFilter(),
      effictientFilter: this.genDefaultFilter(),
      selected: [],
      table: {
        props: {},
        selected: [],
        selectionType: 'multiple',
        header: [
          {
            prop: 'taskId',
            label: '任务ID'
          },
          {
            prop: 'taskName',
            label: '任务名称',
            render: (h, { row }) => {
              return <el-button type="text" onClick={() => this.handleRead(row)}>{ row.taskName }</el-button>
            }
          },
          {
            prop: 'source',
            label: '内容源',
            render: (h, { row }) => {
              return this.$consts.sourceText[row.source]
            }
          },
          {
            prop: 'tabName',
            label: '版面'
          },
          {
            prop: 'insertIndex',
            label: '强插位置'
          },
          {
            prop: 'aliveTime',
            label: '任务持续时间',
            render: (h, { row }) => {
              if (row.enableTask) {
                return row.aliveTime + '小时'
              }
            }
          },
          {
            prop: 'endTime',
            label: '距离结束时间',
            render: (h, { row }) => {
              if (row.enableTask) {
                return row.endTime + '小时'
              }
            }
          },
          {
            label: '是否开启',
            prop: 'enableTask',
            render: (h, { row }) => {
              return h('el-switch', {
                props: {
                  value: !!row.enableTask
                },
                nativeOn: {
                  click (event) {
                    event.stopPropagation()
                  }
                },
                on: {
                  input: (val) => {
                    this.handleToggleTask(row, val)
                  }
                }
              })
            }
          }
        ],
        data: [
        ]
      },
      pagination: {
        currentPage: 1,
        total: 0
      },
      showEnableTaskDialog: false,
      taskInfo: {},
      taskInfoRules: {
        aliveTime: [
          { required: true, message: '请填入任务持续时间' }
        ]
      }
    }
  },
  methods: {
    genTaskInfo ({ taskId, enableTask, aliveTime }) {
      return {
        taskId,
        aliveTime,
        enableTask
      }
    },
    genDefaultFilter () {
      return {
        enableTask: undefined,
        source: undefined
      }
    },
    handleFilter () {
      this.pagination.currentPage = 1
      this.effictientFilter = cloneDeep(this.filter)
      this.fetchData()
    },
    handleResetFilter () {
      this.pagination.currentPage = 1
      this.filter = this.genDefaultFilter()
      this.effictientFilter = this.genDefaultFilter()
      this.fetchData()
    },
    getFilter () {
      const pagination = this.pagination
      const filter = cloneDeep(this.effictientFilter)
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.tabInsertionTaskGetList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    handleToggleTask (row, enableTask) {
      enableTask = enableTask ? 1 : 0
      this.taskInfo = this.genTaskInfo({ taskId: row.taskId, aliveTime: row.aliveTime, enableTask })
      if (enableTask) {
        this.showEnableTaskDialog = true
      } else {
        this.handleUpsertTaskStatus()
      }
    },
    handleUpsertTaskStatus () {
      const taskInfo = this.taskInfo
      const enableTask = taskInfo.enableTask
      const doUpsert = () => {
        const task = this.table.data.find(({ taskId }) => taskId === taskInfo.taskId)
        task.enableTask = enableTask
        if (enableTask) {
          task.aliveTime = taskInfo.aliveTime
          task.endTime = taskInfo.aliveTime
        }
        return this.$service.tabInsertionTaskStatusUpsert(taskInfo, '操作成功').catch(() => {
          task.enableTask = !enableTask
        })
      }
      if (enableTask) {
        this.$refs.taskStatusForm.validate((valid) => {
          if (valid) {
            doUpsert().then(() => {
              this.showEnableTaskDialog = false
            })
          } else {
            this.$message.error('请把表单填写完整')
          }
        })
      } else {
        doUpsert()
      }
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style lang="stylus" scoped>
</style>
