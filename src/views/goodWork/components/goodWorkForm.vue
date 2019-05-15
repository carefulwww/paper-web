<template>
  <div>
    <el-form
      ref="goodWorkData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="125px"
    >
      <el-form-item v-if="isCreated" prop="createUserId" label="创建人ID">
        <el-input v-model="data.createUserId" disabled/>
      </el-form-item>
      <el-form-item prop="workName" label="作品名">
        <el-input v-model="data.workName"/>
      </el-form-item>
      <el-form-item prop="subjectId" label="所属科目">
        <el-select v-model="data.subjectId" placeholder="请选择" style="float:left">
          <el-option
            v-for="item in subjectList"
            :key="item.uuid"
            :label="item.subjectName"
            :value="item.uuid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="code" label="代码">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 50}"
          placeholder="请输入代码"
          v-model="data.code">
        </el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import SubjectAPI from '@/api/subject.js'
export default {
  data() {
    return {
      rules: {
        createUserId: [{ required: true, message: '创建人ID为必填项', trigger: 'blur' }],
        workName: [{ required: true, message: '作品名为必填项', trigger: 'blur' }],
        subjectId: [{ required: true, message: '所属科目为必填项', trigger: 'blur' }],
        code: [{ required: true, message: '代码为必填项', trigger: 'blur' }]
      },
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
        // debugger
        // this.data.code.replace(/\n/g,'<br>')
        // console.log(this.data.code)
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
