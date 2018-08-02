<!-- 三级路由中转 keep-alive提供缓存 -->

<template>
  <transition name="fade" mode="out-in">
    <!--<keep-alive :include='cachedViews'>-->
      <router-view></router-view>
    <!--</keep-alive>-->
  </transition>
</template>

<script>
export default {
  name: 'SystemMaintenance',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>
