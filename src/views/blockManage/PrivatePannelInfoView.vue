<template>
   <ContentCard :title="title" @go-back="$emit('go-back')"></ContentCard>
</template>

<script>
export default {
data() {
    return {
        title: null

    }
},
props:['viewData'],
methods: {

},
created() {
    this.title = '预览'
}
}
</script>

<style>

</style>
