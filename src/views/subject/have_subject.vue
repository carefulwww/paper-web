<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true">
        <div style="display:none">

        <el-form-item>
          <el-input v-model="searchName" placeholder="科目名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList(searchName)">查询</el-button>
        </el-form-item>
        </div>

        <!--管理员才可以进行新增操作-->
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading" fit style="width: 100%;">
      <el-table-column label="序号" align="center" width="65px">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
      <!-- <el-table-column label="科目ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.uuid}}</span>
				</template>
			</el-table-column> -->
      <el-table-column label="创建人ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.createUserId}}</span>
				</template>
			</el-table-column>
      <el-table-column label="科目名称" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.subjectName}}</span>
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

      <el-table-column label="操作" align="center" width="160px" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteSubject(scope.row)">删除</el-button>
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
				<subject-form
					ref="subjectForm"
					:data="tmpData"
					:is-created="dialogTitle!=='新增科目'"
					@add="addSubject"
					@update="updateSubject"
					@close="handleClose"
				/>
			</el-dialog>
  </section>
</template>

<script>
import SubjectAPI from '@/api/subject'
import Pagination from '@/components/Pagination'
import SubjectForm from './components/subjectForm'
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogTitle: '',
      showDialog: false,
      tmpData: {},
      searchName: ''
    }
  },
  components: { Pagination, SubjectForm },
  created() {
    this.getList()
  },
  methods: {
    async getList(arg) {
      this.listLoading = true

      const vm = this
      if (arg) {
        this.listQuery = Object.assign({}, this.listQuery, { subjectName: arg })
      } else {
        this.$delete(this.listQuery, 'subjectName')
      }
      await SubjectAPI.getSubject(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.list = res.data.data.list
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
      this.dialogTitle = '新增科目'
      this.showDialog = true
      this.$set(this.tmpData, 'createUserId', this.$store.state.user.uuid)
    },
    handleEdit(row) {
      this.dialogTitle = '编辑科目'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
    },
    handleClose() {
      this.tmpData = {}
      this.showDialog = false
      // debugger
      this.$refs.subjectForm.$refs.subjectData.resetFields()
    },
    async addSubject(data) {
      const vm = this
      await SubjectAPI.addSubject(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '科目添加成功'
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
    async updateSubject(data) {
      const vm = this
      this.$delete(data, 'updateTime')
      await SubjectAPI.updateSubject(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '科目更新成功'
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
    deleteSubject(row) {
      const vm = this
      this.$confirm('是否确认删除该科目', '提示', {
        type: 'warning'
      }).then(() => {
        // debugger
        SubjectAPI.delSubject(row).then(res => {
          // debugger
          if (res && res.status === 200) {
            vm.$message({
              type: 'success',
              message: '删除科目成功'
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
  }
}
</script>

<style scoped>
</style>
