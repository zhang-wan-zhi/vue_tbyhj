<template>
 <div>
    <transition name="fade">
    <router-view></router-view>
  </transition>
 </div>
 
</template>

<script>
  export default {
     data() {
       return {
        screenWidth: document.body.clientWidth, // 屏幕宽度
        fontSize:document.documentElement
       }
     },
     mounted() {
     window.onresize=()=>{
       return (()=>{
              this.screenWidth=document.body.clientWidth
       })()
     }
     },

  }
</script>
