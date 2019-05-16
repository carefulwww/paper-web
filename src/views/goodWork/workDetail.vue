<template>
  <div>
    <div>
      <span style="font-size:16px;line-height:20px;">作品:{{work.workName}}</span>
      <el-button v-if="isCodeChange" size="small" type="primary" style="float:right" @click="updataCode">更新</el-button>
    </div>
    <codemirror
      v-model="code"
      :options="{
          mode: 'text/x-csrc',
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: true,
          readOnly: readOnlyVal,
      }"
      ref="myEditor"></codemirror>
  </div>
</template>

<script>
import 'codemirror/mode/clike/clike'
import ExcellentWorkAPI from '@/api/excellentWork'
export default {
  data() {
    return {
      work: {},
      code: '',
      isCodeChange: false
    }
  },
  computed: {
    editor() {
      return this.$refs.myEditor
    },
    readOnlyVal() {
      if (this.$store.state.user.type === '3') {
        return 'nocursor'
      } else {
        return false
      }
    }
  },
  watch: {
    code(nv, ov) {
      // debugger
      if (nv !== this.work.code) {
        this.isCodeChange = true
      } else {
        this.isCodeChange = false
      }
    }
  },
  created() {
    this.work = this.$route.query.work
    this.code = this.work.code
  },
  methods: {
    updataCode() {
      const vm = this
      const data = Object.assign({}, this.work, { code: this.code })
      debugger
      ExcellentWorkAPI.updateExcellentWork(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '代码更新成功'
          })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
