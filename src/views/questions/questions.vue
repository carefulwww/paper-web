<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.id" placeholder="所属科目ID"></el-input>
				</el-form-item> -->
				<!-- <el-form-item>
					<el-button type="primary" @click="getList('id')">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
        <el-form-item>
					<el-button type="primary" @click="handleExport">导入</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="questionList" v-loading="loading" fit @filter-change="filterQuestionType">
				<el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" >
							<el-form-item label="出题人ID">
                <span>{{ props.row.createUserId }}</span>
              </el-form-item>
              <el-form-item label="试题内容">
                <span>{{ props.row.questionContent }}</span>
              </el-form-item>
              <el-form-item label="试题选项">
                <span>{{ props.row.options }}</span>
              </el-form-item>
              <el-form-item label="试题答案">
                <span>{{ props.row.answer }}</span>
              </el-form-item>
							<el-form-item label="试题分值">
                <span>{{ props.row.score }}</span>
              </el-form-item>
							<el-form-item label="试题难度">
                <span>{{ props.row.difficulty }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
				<el-table-column label="添加到组卷车" width="70" fixed="left">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isAdd" size="small" icon="el-icon-plus" circle @click="add(scope.row)"></el-button>
					<el-button v-else size="small" type="success" icon="el-icon-check" circle @click="deleteR(scope.row)"></el-button>
        </template>
      </el-table-column>
			<el-table-column label="序号" align="center" width="65px">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="试题ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.uuid}}</span>
				</template>
			</el-table-column> -->
			<el-table-column label="试题类型" prop="type" column-key="type" align="center" :filters="questionFilters" :filter-multiple="false">
				<template slot-scope="scope">
					<span>{{scope.row.type}}</span>
				</template>
			</el-table-column>
			<el-table-column label="所属科目" prop="subject" column-key="subject" align="center" :filters="subjectFilters" :filter-multiple="false">
				<template slot-scope="scope">
					<span>{{scope.row.subject.subjectName}}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.createTime*1000|formatDate('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="更新时间" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.updateTime*1000|formatDate('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="160px" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button size="small" type="danger" @click="deleteQuestion(scope.row)">删除</el-button>
				</template>
			</el-table-column>
			</el-table>
			<pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
        style="margin-top:20px"
      />
			<el-dialog
				:key="1"
				:visible.sync="showDialog"
				:title="dialogTitle"
				:before-close="handleClose"
				style="text-align:center;padding: 0 20px"
			>
				<questions-form
					ref="questionsForm"
					:data="tmpData"
					:is-created="dialogTitle!=='新增试题'"
					@add="addQuestion"
					@update="updateQuestion"
					@close="handleClose"
				/>
			</el-dialog>
			<el-dialog
				:key="2"
				:visible.sync="showDialog1"
				title="试卷预览并发布"
				:before-close="handleClose1"
				style="text-align:center;padding: 0 20px"
			>
				<pre-Paper
					ref="prePaperForm"
					:list="cartList"
					@add="addPaper"
					@close="handleClose1"
				/>
			</el-dialog>
      <el-dialog
				:visible.sync="showExportDialog"
				title="导入试题"
				:before-close="handleExportClose"
				style="text-align:center;padding: 0 20px"
			>
				<el-upload
          drag
          ref="upload"
          :action="uploadUrl"
          accept=".xlsx"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
        </el-upload>
        <el-button style="margin-top: 20px;"  type="primary" @click="submitUpload">上 传</el-button><br>
        <el-divider><i class="el-icon-download"></i></el-divider>
        <el-select v-model="subjectId" placeholder="请选择要下载的模板科目">
          <el-option
            v-for="item in subjectList"
            :key="item.uuid"
            :label="item.subjectName"
            :value="item.uuid"
          ></el-option>
        </el-select><br><br>
        <a :href="downloadUrl">点击此处下载试题导入模板excel表</a>
			</el-dialog>
		</template>
		<shopping-cart :list="cartList" @rollOut="rollOut" />
	</section>
</template>
<script>
import SubjectAPI from '@/api/subject.js'
import QuestionAPI from '@/api/questions'
import PaperAPI from '@/api/paper'
import PaperQuestionAPI from '@/api/paperQuestion'
import shoppingCart from './components/shoppingCart'
import Pagination from '@/components/Pagination'
import QuestionsForm from './components/questionsForm'
import prePaper from './components/prePaper'
import QuestionDic from '@/utils/dic/question'
// import NProgress from 'nprogress'
export default {
  data() {
    return {
      filters: {
        id: ''
      },
      loading: false,
      questionList: [
      ],
      cartList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogTitle: '',
      showDialog: false,
      showDialog1: false,
      tmpData: {},
      showExportDialog: false,
      subjectList: [],
      subjectId: '',
      QuestionDic: QuestionDic
    }
  },
  components: {
    shoppingCart,
    Pagination,
    QuestionsForm,
    prePaper
  },
  computed: {
    uploadUrl() {
      return `http://94.191.89.57:8080/import/questions?createId=${this.$store.state.user.uuid}`
    },
    downloadUrl() {
      if (this.subjectId) {
        return `http://94.191.89.57:8080/export/downloadQuestionExcel?subjectId=${this.subjectId}`
      } else {
        return '#'
      }
    },
    questionFilters() {
      const tmp = []
      if (this.QuestionDic) {
        this.QuestionDic.map(e => {
          tmp.push({
            'text': e.label,
            'value': e.label
          })
        })
      }
      return tmp
    },
    subjectFilters() {
      const tmp = []
      if (this.subjectList) {
        this.subjectList.map(e => {
          tmp.push({
            'text': e.subjectName,
            'value': e.uuid
          })
        })
      }
      return tmp
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
    handleExportClose() {
      this.showExportDialog = false
    },
    handleExport() {
      this.showExportDialog = true
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleUploadSuccess(res, file) {
      if (res && res.statusCode === 200 && res.successful) {
        this.$message({
          message: `上传完毕,成功${res.data.successNum}条，失败${res.data.failNum}条`,
          type: 'success'
        })
        this.getList()
      } else {
        this.$message({
          message: res.statusMessage,
          type: 'error'
        })
      }
      this.showExportDialog = false
    },
    add(row) {
      // row.isAdd = true
      this.$set(row, 'isAdd', true)
      this.cartList.push(row)
      // this.$message({
      //   message: '添加试题到组卷车成功！',
      //   type: 'success'
      // })
      this.$nextTick()
    },
    deleteR(row) {
      row.isAdd = false
      this.cartList.map((e, i) => {
        if (e.uuid === row.uuid) {
          this.cartList.splice(i, 1)
          return
        }
      })
      this.$message({
        message: '从组卷车删除试题成功！',
        type: 'success'
      })
    },
    async getList(arg) {
      this.listLoading = true
      const vm = this
      if (arg === 'id') {
        this.listQuery = Object.assign({}, this.listQuery, { subjectId: this.filters.id })
      } else {
        this.$delete(this.listQuery, 'subjectId')
      }
      await QuestionAPI.getQuestion(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.questionList = res.data.data.list
          this.total = res.data.data.total
          // vm.$message({
          //   type: 'success',
          //   message: '用户表加载成功'
          // })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.listLoading = false
      // 重新getlist后，将原先购物车里的题的前面打上勾
      this.cartList.map(e => {
        const tmp = this.questionList.find(i => i.uuid === e.uuid)
        if (tmp) {
          this.$set(tmp, 'isAdd', true)
          e = tmp
          debugger
        } else {
          this.$message({
            type: 'warning',
            message: '以加入购物车的试题可能以及被删除'
          })
        }
      })
    },
    handleAdd() {
      this.dialogTitle = '新增试题'
      this.showDialog = true
      this.$set(this.tmpData, 'createUserId', this.$store.state.user.uuid)
    },
    handleEdit(row) {
      this.dialogTitle = '编辑试题'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
    },
    handleClose() {
      this.tmpData = {}
      this.showDialog = false
      // debugger
      this.$refs.questionsForm.$refs.qusetionsData.resetFields()
    },
    handleClose1() {
      this.showDialog1 = false
      // debugger
      this.$refs.prePaperForm.$refs.prePaperData.resetFields()
    },
    async addQuestion(data) {
      const vm = this
      await QuestionAPI.addQuestion(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '试题添加成功'
          })
          vm.getList()
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.handleClose()
    },
    async addPaper(data) {
      // debugger
      let paperId = ''
      this.$set(data, 'createUserId', this.$store.state.user.uuid)
      await PaperAPI.addPaper(data).then(res => {
        if (res && res.data && res.data.successful) {
          this.$message({
            type: 'success',
            message: '试卷添加成功'
          })
          paperId = res.data.data
        } else {
          this.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      if (paperId) {
        const ids = this.cartList.map(e => e.uuid)
        const data1 = {
          userId: this.$store.state.user.uuid,
          paperId: paperId,
          questionIds: ids
        }
        // debugger
        await PaperQuestionAPI.addRelation(data1).then(res => {
          if (res && res.data && res.data.successful) {
            this.$message({
              type: 'success',
              message: '试卷添加成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.statusMessage
            })
          }
        })
        this.handleClose1()
      }
    },
    async updateQuestion(data) {
      const vm = this
      this.$delete(data, 'updateTime')
      await QuestionAPI.updateQuestion(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '试题更新成功'
          })
          vm.getList()
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.handleClose()
    },
    deleteQuestion(row) {
      const vm = this
      this.$confirm('是否确认删除该试题', '提示', {
        type: 'warning'
      }).then(() => {
        // debugger
        QuestionAPI.delQuestion(row).then(res => {
          // debugger
          if (res && res.status === 200) {
            vm.$message({
              type: 'success',
              message: '删除试题成功'
            })
            vm.getList()
          } else {
            vm.$message({
              type: 'error',
              message: res.data.statusMessage
            })
          }
        })
      }).catch()
    },
    rollOut() {
      this.showDialog1 = true
    },
    filterQuestionType(filters) {
      console.log(filters)
      // debugger
      const vm = this
      // const data = Object.assign({}, this.listQuery)
      if (filters.subject) {
        this.$set(this.listQuery, 'subjectId', filters.subject[0])
      }
      if (filters.type) {
        this.$set(this.listQuery, 'type', filters.type[0])
      }

      QuestionAPI.getQuestion(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.questionList = res.data.data.list
          this.total = res.data.data.total
          // vm.$message({
          //   type: 'success',
          //   message: '用户表加载成功'
          // })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}

</script>

<style scoped>

</style>