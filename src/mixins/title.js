const titleMap = {
  'create': '创建',
  'read': '预览',
  'edit': '编辑',
  'replicate': '',
  'copy': '复制'
}
export default {
  props: ['titlePrefix'],
  computed: {
    title () {
      const mode = this.mode
      const resourceName = this.resourceName || ''
      const title = mode === 'replicate'
        ? `创建${resourceName}副本`
        : ((titleMap[mode] || '') + resourceName)
      const titlePrefix = this.titlePrefix
      return titlePrefix ? `${titlePrefix} / ${title}` : title
    }
  }
}
