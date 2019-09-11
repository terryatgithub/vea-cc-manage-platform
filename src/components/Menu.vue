<template>
  <el-menu
    class="menu"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    :defaultActive="defaultActive"
    @select="handleSelect"
    :collapse="isCollapse"
  >
    <template v-for="(item, index) in items">
      <el-submenu v-if="item.children" :key="index"  :index="index + ''">
        <div @click="handleClickMenu(item.title)" slot="title">
          <i v-if="item.icon" :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </div>

        <template v-for="(child, idx) in item.children">
          <el-menu-item
            v-if="typeof(child.children)=== 'undefined'"
            @click="handleClickMenu(child.title)" 
            :key="idx"
            :index="child.route"
          >
            <i v-if="child.icon" :class="child.icon"></i>
            <span slot="title">{{ child.title }}</span>
          </el-menu-item>
          <el-submenu v-else :key="idx" :index="index +'_'+idx">
            <div @click="handleClickMenu(child.title)" slot="title">
              <i v-if="child.icon" :class="child.icon"></i>
              <span>{{ child.title }}</span>
            </div>
            <template v-for="(c,n) in child.children">
              <el-menu-item @click="handleClickMenu(c.title)" :key="n" :index="c.route">
                <i v-if="c.icon" :class="c.icon"></i>
                <span slot="title">{{c.title}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-submenu>
      <el-menu-item  v-else @click="handleClickMenu(item.title)" :key="index" :index="item.route">
        <i v-if="item.icon" :class="item.icon"></i>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      itemsIndexed: {}
    }
  },
  props: [
    'isCollapse',
    'items',
    'defaultActive',
    'textColor',
    'activeTextColor',
    'backgroundColor'
  ],
  methods: {
    handleSelect (name) {
      this.$emit('select', name, this.itemsIndexed[name])
    },
    buildIndex(items = []) {
      const index = {}
      function walk(item) {
        if (item.route) {
          index[item.route] = item
        }
        if (item.children) {
          item.children.forEach(walk)
        }
        if (Array.isArray(item)) {
          item.forEach(walk)
        }
      }
      walk(items)
      this.itemsIndexed = index
    },
    handleClickMenu(name) {
      this.$sendEvent({
        type: 'menu_click',
        payload: {
          menu_name: name
        }
      })
    }
  },
  created() {
    this.$watch('items', this.buildIndex, { immediate: true })
  }
}
</script>
