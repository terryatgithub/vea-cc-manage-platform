<template>
  <div class="click-copy" :title="title || '复制'" @click.stop="handleCopy">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['title', 'content', 'successMsg', 'errorMsg'],
  methods: {
    handleCopy () {
      this.doCopy(this.content)
        .then(() => {
          this.$message.success(this.successMsg || '已复制到剪贴板')
        })
        .catch(() => {
          this.$message.error(this.errorMsg || '复制失败')
        })
    },
    doCopy (content) {
      if (navigator.clipboard) {
        return navigator.clipboard.writeText(content)
      } else if (document.execCommand) {
        const textarea = document.createElement('textarea')
        textarea.value = content
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        const result = document.execCommand('copy')
        document.body.removeChild(textarea)
        // eslint-disable-next-line
        return result ? Promise.resolve() : Promise.reject()
      }

      return Promise.reject(new Error('浏览器不支持复制'))
    }
  }
}
</script>
<style lang="stylus" scoped>
.click-copy
  display inline-block
</style>
