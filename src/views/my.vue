<template>
  <el-card shadow="never">
    <h1>用户名：{{$store.state.user.userName}}</h1>
    <h1>用户类型：{{$store.state.user.type|filterByDic(userDic)}}</h1>
    <h1>昵称：{{$store.state.user.nickname}}</h1>
    <h3 v-if="$store.state.user.newFlag === '1'" style="color:#F56C6C">
      TIP:检测到您的密码已被重置，请更改密码否则无法进入系统
    </h3>
    <el-button size="small" type="primary" @click="updatePassword">修改密码</el-button>
  </el-card>
</template>

<script>
import userDic from '@/utils/dic/user'
import UserAPI from '@/api/user'
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
  },
  methods: {
    updatePassword() {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{6,}$/,
        inputErrorMessage: '密码至少六位'
      }).then(({ value }) => {
        const data = {
          password: value,
          uuid: this.$store.state.user.uuid,
          currentId: this.$store.state.user.uuid
        }
        UserAPI.updateUser(data).then(res => {
          if (res && res.data && res.data.successful) {
            this.$message({
              type: 'success',
              message: '修改密码成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.statusMessage
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消更新'
        })
      })
    }
  }
}
</script>