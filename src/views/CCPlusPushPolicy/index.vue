<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="二级菜单" name="first">
            <SecondaryMenu class="el-tab-pane-preview" />
        </el-tab-pane>
        <el-tab-pane label="内页" name="second">
            <InnerPage class="el-tab-pane-preview" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import SecondaryMenu from "./SecondaryMenu";
import InnerPage from "./InnerPage";

export default {
    name: 'CCPlusPushPolicy',
    components: {
        SecondaryMenu, 
        InnerPage
    },
    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {
        handleClick() {
            console.log('handleClick.');
        }
    },
}
</script>

<style lang="scss" scoped>
.el-tab-pane-preview >>> .page-content-wrapper {
    position: relative;
    width: 100%;
    top: 0;
}
</style>