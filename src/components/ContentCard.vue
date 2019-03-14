<template>
    <div class="content-card">
        <div v-if="title !== undefined" class="content-card__header">
            {{ title }}
            <div class="actions">
                <slot name="actions">
                    <el-button type="text" @click="$emit('go-back')">返回</el-button>
                </slot>
            </div>
        </div>
        <div class="content-card__main">
            <slot name="default" />
        </div>
    </div>
</template>

<script>
export default {
    props: ['title']
}
</script>

<style lang="stylus" scoped>
.content-card__main
    position relative
    padding 20px
    background #fff
.content-card__header
    position relative
    height 50px
    text-indent 20px
    line-height 50px
    font-size 18px
    font-weight bold
    border-bottom 1px solid #f0f0f0
    background #fff
    .actions
        padding 0 20px
        float right
</style>



