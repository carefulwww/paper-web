<template>
  <div>
    <el-form
      ref="qusetionsData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="125px"
    >
    <el-form-item v-if="isCreated" prop="uuid" label="试题ID">
        <el-input v-model="data.uuid" disabled/>
      </el-form-item>
      <el-form-item prop="createUserId" label="出题人ID">
        <el-input v-model="data.createUserId" disabled/>
      </el-form-item>
      <el-form-item prop="type" label="试题类型">
        <!-- <el-input v-model="data.type"/> -->
        <el-select v-model="data.type" placeholder="请选择" style="float:left">
          <el-option
            v-for="item in questionDic"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="subjectId" label="所属科目">
        <!-- <el-input v-model="data.subjectId"/> -->
        <el-select v-model="data.subjectId" placeholder="请选择" style="float:left">
          <el-option
            v-for="item in subjectList"
            :key="item.uuid"
            :label="item.subjectName"
            :value="item.uuid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="questionContent" label="试题内容">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="data.questionContent"/>
      </el-form-item>
      <el-form-item prop="options" label="试题选项">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="data.options"/>
      </el-form-item>
      <el-form-item prop="answer" label="试题答案">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="data.answer"/>
      </el-form-item>
      <el-form-item prop="score" label="试题分值">
        <el-input v-model="data.score"/>
      </el-form-item>
      <el-form-item prop="difficulty" label="试题难度">
        <el-input v-model="data.difficulty"/>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import userDic from '@/utils/dic/user'
import sexDic from '@/utils/dic/sex'
import nationDic from '@/utils/dic/nation'
import questionDic from '@/utils/dic/question'
import SubjectAPI from '@/api/subject.js'
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号为必填项', trigger: 'blur' }],
        uuid: [{ required: true, message: 'ID为必填项', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱为必填项', trigger: 'blur' },
          {
            pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            message: '邮箱格式有误',
            trigger: 'blur'
          }
        ]
      },
      sexDic: sexDic,
      nationDic: nationDic,
      userDic: userDic,
      questionDic: questionDic,
      subjectList: []
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    isCreated: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getSubjectList()
  },
  methods: {
    confirm() {
      if (this.isCreated) {
        this.$emit('update', this.data)
      } else {
        this.$emit('add', this.data)
      }
    },
    cancel() {
      this.$emit('close')
    },
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
    }
  }
}
</script>
