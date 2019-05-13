<template>
  <div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchName" placeholder="章节名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList('name')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table highlight-current-row v-loading="listLoading" :data="chapterList" fit>

			<el-table-column label="序号" align="center" width="65px">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>

			<el-table-column label="章节名" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.chapterName}}</span>
				</template>
			</el-table-column>

			<el-table-column label="科目名" align="center">
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

			<el-table-column label="操作" width="300px" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button size="small" type="danger" @click="deleteChapter(scope.row)">删除</el-button>
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
				<chapter-info-form
					ref="chapterForm"
					:data="tmpData"
					:is-created="dialogTitle!=='新增章节'"
					@add="addChapter"
					@update="updateChapter"
					@close="handleClose"
				/>
			</el-dialog>
  </div>
</template>

<script>
import ChapterAPI from '@/api/chapter'
import Pagination from '@/components/Pagination'
import ChapterInfoForm from './components/chapterForm'
export default {
  data() {
    return {
      listLoading: false,
      chapterList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      searchName: '',
      dialogTitle: '',
      showDialog: false,
      tmpData: {}
    }
  },
  components: { Pagination, ChapterInfoForm },
  created() {
    this.getList()
  },
  methods: {
    async getList(arg) {
      this.listLoading = true

      const vm = this
      if (arg === 'name') {
        this.listQuery = Object.assign({}, this.listQuery, { chapterName: this.searchName })
      } else {
        // debugger
        this.$delete(this.listQuery, 'chapterName')
      }
      await ChapterAPI.getChapter(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.chapterList = res.data.data.list
          this.total = res.data.data.total
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.listLoading = false
    },
    handleClose() {
      this.tmpData = {}
      this.showDialog = false
      // debugger
      this.$refs.chapterForm.$refs.chapterInfoData.resetFields()
    },
    handleAdd() {
      this.dialogTitle = '新增章节'
      this.showDialog = true
      this.$set(this.tmpData, 'createUserId', this.$store.state.user.uuid)
    },
    handleEdit(row) {
      this.dialogTitle = '编辑章节'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
    },
    async addChapter(data) {
      const vm = this
      await ChapterAPI.addChapter(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '章节添加成功'
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
    async updateChapter(data) {
      const vm = this
      this.$delete(data, 'updateTime')
      await ChapterAPI.updateChapter(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '章节更新成功'
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
    deleteChapter(row) {
      const vm = this
      this.$confirm('是否确认删除该章节', '提示', {
        type: 'warning'
      }).then(() => {
        // debugger
        ChapterAPI.delChapter(row).then(res => {
          // debugger
          if (res && res.status === 200) {
            vm.$message({
              type: 'success',
              message: '删除章节成功'
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
