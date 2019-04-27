<template>
  <el-card shadow="never">
    <h1>用户名：{{$store.state.user.userName}}</h1>
    <h1>用户类型：{{$store.state.user.type|filterByDic(userDic)}}</h1>
  </el-card>
</template>

<script>
import userDic from '@/utils/dic/user'
export default{
  data() {
    return {
      userDic: userDic
    }
  },
  filters: {
    filterByDic(val, dic) {
      // debugger
      if (val && dic) {
        return dic.find(e => e.value === val).label
      }
    }
  }
}
</script>