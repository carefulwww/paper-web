<template>
  <div>这是作品详情页 作品id:{{id}}</div>
</template>

<script>
export default {
  data(){
    return {
      id:''
    }
  },
  created(){
    this.id = this.$route.query.id
  }
}
</script>
