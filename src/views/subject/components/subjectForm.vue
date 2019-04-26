<template>
  <div>
    <el-form
      ref="subjectData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="125px"
    >
    <el-form-item v-if="isCreated" prop="uuid" label="科目ID">
        <el-input v-model="data.uuid" disabled/>
      </el-form-item>
      <el-form-item prop="createUserId" label="创建人ID">
        <el-input v-model="data.createUserId" disabled/>
      </el-form-item>
      <el-form-item prop="subjectName" label="科目名称">
        <el-input v-model="data.subjectName"/>
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
      userDic: userDic
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
    }
  }
}
</script>
