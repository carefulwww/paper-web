<template>
  <div style="overflow:hidden;">
    <el-form
      ref="prePaperData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="100px">
      <el-form-item prop="paperName" label="试卷名">
        <el-input v-model="data.paperName"/>
      </el-form-item>
      <el-form-item prop="subjectId" label="科目ID">
        <el-input v-model="data.subjectId"/>
      </el-form-item>
    </el-form>
    <div class="prepaper">
      <el-scrollbar style="height:100%">
      <div v-for="(v,k,i) in filterListObj">
        <h1>{{k}}</h1>
        <div v-for="(item,index) in v">
          <p>{{`${index+1}.${item.questionContent}（${item.score}分）`}}</p>
          <p>{{`选项${item.options}`}}</p>
        </div>
      </div>
      </el-scrollbar>
    </div>
    <div>
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isShow: false,
      data: {
        paperName: '',
        subjectId: ''
      },
      rules: {
        paperName: [{ required: true, message: '试卷名为必填项', trigger: 'blur' }],
        subjectId: [{ required: true, message: '科目ID为必填项', trigger: 'blur' }]
      },
      filterListObj: {}
    }
  },
  methods: {
    confirm() {
      this.$emit('add', this.data)
    },
    cancel() {
      this.$emit('close')
    },
    filterQuestions() {
      this.list.map(e => {
        if (e.type in this.filterListObj) {
          this.filterListObj[e.type].push(e)
        } else {
          this.$set(this.filterListObj, e.type, [e])
        }
      })
    }
  },
  mounted() {
    this.filterQuestions()
  }
}
</script>

<style scoped>
.prepaper{
  height:50vh;
  text-align:left;
  padding:10px 50px;
}
</style>
