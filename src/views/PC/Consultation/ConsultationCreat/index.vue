<template>
  <article-detail :is-edit='isEdit' :uuid="$route.query.uuid"></article-detail>
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'createForm',
  data() {
    return {
      isEdit: false
    }
  },
  created() {
    if(this.$route.query.uuid) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  },
  components: { ArticleDetail }
}
</script>

