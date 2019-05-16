<template>
  <div>
    <el-form
      ref="autoPaperData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="120px"
      style="margin-top:20px"
    >
      <el-form-item prop="createUserId" label="创建人ID" style="display:none">
        <el-input v-model="data.createUserId" disabled/>
      </el-form-item>
      <el-form-item prop="paperName" label="试卷名称">
        <el-input v-model="data.paperName"/>
      </el-form-item>
      <el-form-item prop="difficulty" label="难度系数">
        <el-slider v-model="data.difficulty" :max="1" :step="0.1" show-stops></el-slider>
      </el-form-item>
      <el-form-item prop="subjectId" label="科目">
        <el-select v-model="data.subjectId" placeholder="请选择" style="float:left">
          <el-option
            v-for="item in subjectList"
            :key="item.uuid"
            :label="item.subjectName"
            :value="item.uuid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.subjectId" prop="pointIds" label="涉及的章节">
        <div v-if="pointIds&&pointIds.length>0"><el-tag v-for="(tag,index) in pointIds" :key="index" closable @close="tagClose(index)">{{tag.chapterName}}</el-tag></div>
        <span v-else>本科目暂无章节</span>
      </el-form-item>
      <el-form-item label="试题种类选择">
        <el-select v-model="questionTypeList" multiple placeholder="请选择" style="float:left">
          <el-option
            v-for="item in questionDic"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
    <el-form-item v-for="(val,key,index) in data.typeNum" :key="index" :label="key+'数量'">
        <el-input-number v-model="data.typeNum[key]" :min="1" label="试题数量"></el-input-number>
        <label for="score" style="color:#606266;margin-left:20px">{{`${key}分值`}}</label>
        <el-input-number prop="score" v-model="data.typeScore[key]" :min="1" label="试题分值"></el-input-number>
      </el-form-item>
      <el-form-item label="试卷总分">
        <span>{{data.totalMark}}</span>
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button type="primary" @click="autoPaper">自动出卷</el-button>
    </div>
  </div>
</template>

<script>
import SubjectAPI from '@/api/subject.js'
import ChapterAPI from '@/api/chapter'
import AutoAPI from '@/api/autoPaper'
import questionDic from '@/utils/dic/question'
export default {
  data() {
    return {
      data: {
        createUserId: this.$store.state.user.uuid,
        pointIds: [],
        typeNum: {},
        typeScore: {},
        totalMark: 0
      },
      subjectList: [],
      questionTypeList: [],
      questionDic: questionDic,
      pointIds: [],
      rules: {
        createUserId: [{ required: true, message: '用户id为必填项', trigger: 'blur' }],
        paperName: [{ required: true, message: '试卷名称为必填项', trigger: 'blur' }],
        difficulty: [{ required: true, message: '难度系数为必填项', trigger: 'blur' }],
        subjectId: [{ required: true, message: '科目为必填项', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'data.subjectId': {
      handler(nv, ov) {
        if (nv) {
        //   debugger
          const data = {
            subjectId: nv
          }
          ChapterAPI.getChapter(data).then(res => {
            if (res && res.data && res.data.successful) {
              // debugger
              this.pointIds = res.data.data.list
            } else {
              this.$message({
                type: 'error',
                message: res.data.statusMessage
              })
            }
          })
        }
      }
    },
    questionTypeList: {
      handler(nv, ov) {
        if (nv) {
          this.data.typeNum = {}
          this.data.typeScore = {}
          for (let i = 0; i < nv.length; i++) {
            this.$set(this.data.typeNum, nv[i], 1)
            this.$set(this.data.typeScore, nv[i], 1)
          }
          this.data.totalMark = 0
          for (const i in this.data.typeNum) {
            this.data.totalMark += this.data.typeScore[i] * this.data.typeNum[i]
          }
        }
      },
      deep: true
    },
    'data.typeNum': {
      handler(nv, ov) {
        if (nv) {
          this.data.totalMark = 0
          for (const i in nv) {
            // debugger
            this.data.totalMark += nv[i] * this.data.typeScore[i]
          }
        }
      },
      deep: true
    },
    'data.typeScore': {
      handler(nv, ov) {
        if (nv) {
          this.data.totalMark = 0
          for (const i in nv) {
            this.data.totalMark += nv[i] * this.data.typeNum[i]
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.getSubjectList()
  },
  methods: {
    getSubjectList() {
      const vm = this
      const data = {
        pageNum: 1
      }
      SubjectAPI.getSubject(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.subjectList = res.data.data.list
          // debugger
        } else {
          vm.$message({
            message: '获取科目列表出错',
            type: 'error'
          })
        }
      })
    },
    autoPaper() {
      const vm = this
      if (this.data.pointIds.length === 0) {
        this.message({
          message: '章节必选',
          type: 'error'
        })
        return false
      }
      if (this.data.typeNum === {}) {
        this.message({
          message: '题型必选',
          type: 'error'
        })
        return false
      }
      this.pointIds.map(e => {
        if (e.uuid) {
          this.data.pointIds.push(e.uuid)
        }
      })
      AutoAPI.autoPaper(this.data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            message: '自动出卷成功',
            type: 'success'
          })
          this.$route.push({ path: '/paperManager' })
        } else {
          vm.$message({
            message: res.data.statusMessage,
            type: 'error'
          })
        }
      })
    },
    tagClose(i) {
      this.pointIds.splice(i, 1)
    }
  }
}
</script>

<style scoped>
</style>
