<template>
  <div>
    <el-switch
  v-model="value"
  active-value="1"
  inactive-value="100"
  active-color="#13ce66"
  @change="change"
  inactive-color="#ff4949">
</el-switch>

  </div>
</template>

<script>
export default {
   data() {
      return {
        value: '1'
      }
    },
    methods:{
      change(){
        // this.value='100'
      }
      
    }
}
</script>
<style scoped>
</style>
