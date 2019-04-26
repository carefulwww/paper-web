<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.id" placeholder="所属科目ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getList" @click="getList(filters.id)">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="questionList" v-loading="loading" fit highlight-current-row :row-key="questionList.uuid" :current-row-key="0" >
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
				<el-table-column label="添加到组卷车" width="70" fixed="left" disabled>
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
			<el-table-column label="试题ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.uuid}}</span>
				</template>
			</el-table-column>
			<el-table-column label="试题类型" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.type}}</span>
				</template>
			</el-table-column>
			<el-table-column label="所属科目ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.subjectId}}</span>
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
		</template>
		<shopping-cart :users="cartList" />
	</section>
</template>
<script>
import QuestionAPI from '@/api/questions'
import shoppingCart from '../../components/shoppingCart'
import Pagination from '@/components/Pagination'
import QuestionsForm from './components/questionsForm'
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
      tmpData: {}
    }
  },
  components: {
    shoppingCart,
    Pagination,
    QuestionsForm
  },
  methods: {
    add(row) {
      row.isAdd = true
      this.cartList.push(row)
      this.$message({
        message: '添加试题到组卷车成功！',
        type: 'success'
      })
      this.$nextTick()
    },
    deleteR(row) {
      row.isAdd = false
      this.cartList.map((e, i) => {
        if (e.id === row.id) {
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
      if (arg) {
        this.listQuery = Object.assign({}, this.listQuery, { subjectId: arg })
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
    }
  },
  mounted() {
    this.getList()
  }
}

</script>

<style scoped>

</style>