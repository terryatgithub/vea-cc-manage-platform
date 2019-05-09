<template>
    <el-dialog
        title="选择 ICON"
        :visible="true"
        :before-close="handleClose">
        <div class="icon-selector__wrapper">
            <img
                v-for="(item, i) in options"
                :class="selected && selected.pictureId === item.pictureId ? 'active' : ''"
                @click="selected = item"
                :src="item.pictureUrl" 
                alt="图标" 
                :title="item.iconTypeName"
            />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSelectEnd">确 定</el-button>
        </span>
    </el-dialog>

</template>

<script>
export default {
    data() {
        return {
            selected: undefined,
            options: []
        }
    },
    props: ['value'],
    methods: {
        handleClose() {
            this.selected = undefined
            this.$nextTick(function() {
                this.$emit('select-cancel')
            }.bind(this))
        },
        handleSelectEnd() {
            this.$emit('select-end', this.selected)
        }
    },
    created() {
      this.$service.tabIconList().then((data) => {
        this.options = data.rows
      })
    }
}
</script>
<style scoped>
.icon-selector__wrapper img {
    cursor: pointer;
    border: 1px solid #fff;
}
.icon-selector__wrapper .active {
    border: 1px solid #20a0ff;
}
</style>