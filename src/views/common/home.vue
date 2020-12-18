<template>
  <div class="mod-home">
    <h3>项目介绍</h3>
  </div>
</template>
<script>
  export default {
    created(){//跳转回阿里妈妈登录
      if(location.href.lastIndexOf('back=1')!==-1){
        this.$router.push('alimama')
      }else{
          this.$router.push('cloud/distribution')
      }
    }
  }
</script>
<style>
  .mod-home {
    line-height: 1.5;
  }
</style>

