<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="searchName" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getList('name')">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
        <el-form-item>
					<el-button type="primary" @click="handleExport">导入</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table highlight-current-row v-loading="listLoading" :data="userList" fit>

			<!-- <el-table-column type="selection" min-width="10%"></el-table-column> -->
			<el-table-column label="序号" align="center" width="65px">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>

			<!-- <el-table-column label="ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.uuid}}</span>
				</template>
			</el-table-column> -->
			<el-table-column label="用户名" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.userName}}</span>
				</template>
			</el-table-column>

      <el-table-column label="昵称" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.nickname}}</span>
				</template>
			</el-table-column>

			<!-- <el-table-column prop="password" min-width="25%" label="密码"></el-table-column> -->

			<el-table-column label="用户类型" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.type|filterByDic(userDic)}}</span>
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
					<el-button size="small" @click="resetPassword(scope.row)">重置密码</el-button>
					<el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
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
				<user-info-form
					ref="userForm"
					:data="tmpData"
					:is-created="dialogTitle!=='新增用户'"
					@add="addUser"
					@update="updateUser"
					@close="handleClose"
				/>
			</el-dialog>
      <el-dialog
				:visible.sync="showExportDialog"
				title="导入用户"
				:before-close="handleExportClose"
				style="text-align:center;padding: 0 20px"
			>
				<el-upload
          drag
          ref="upload"
          action="http://94.191.89.57:8080/import/user"
          accept=".xlsx"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传excel文件,<a href="http://94.191.89.57:8080/export/downloadUserExcel">点击此处下载用户导入模板excel表</a></div>
        </el-upload>
        <el-button style="margin-top: 20px;"  type="primary" @click="submitUpload">上 传</el-button>
			</el-dialog>
	</section>
</template>

<script>
import UserAPI from '@/api/user'
import Pagination from '@/components/Pagination'
import userDic from '@/utils/dic/user'
import UserInfoForm from './components/userInfoForm'
export default {
  data() {
    return {
      listLoading: false,
      userList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      userDic: userDic,
      dialogTitle: '',
      showDialog: false,
      tmpData: {},
      searchName: '',
      showExportDialog: false
    }
  },
  components: { Pagination, UserInfoForm },
  filters: {
    filterByDic(val, dic) {
      // debugger
      if (val && dic) {
        return dic.find(e => e.value === val).label
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    async getList(arg) {
      this.listLoading = true

      const vm = this
      if (arg === 'name') {
        this.listQuery = Object.assign({}, this.listQuery, { userName: this.searchName })
      } else {
        // debugger
        this.$delete(this.listQuery, 'userName')
      }
      await UserAPI.getUser(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.userList = res.data.data.list
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
      this.dialogTitle = '新增用户'
      this.showDialog = true
      this.$set(this.tmpData, 'password', '123456')
    },
    handleEdit(row) {
      this.dialogTitle = '编辑用户'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
    },
    handleExport() {
      this.showExportDialog = true
    },
    resetPassword(row) {
      const vm = this
      this.$confirm('是否将该用户密码重置为123456？', '提示', {
        type: 'warning'
      }).then(() => {
        const data = Object.assign({}, row, { password: '123456', currentId: this.$store.state.user.uuid })
        UserAPI.updateUser(data).then(res => {
          debugger
          if (res && res.data && res.data.successful) {
            vm.$message({
              type: 'success',
              message: '用户信息更新成功'
            })
            vm.getList()
          } else {
            vm.$message({
              type: 'error',
              message: res.data.statusMessage
            })
          }
        })
      })
    },
    handleClose() {
      this.tmpData = {}
      this.showDialog = false
      // debugger
      this.$refs.userForm.$refs.userInfoData.resetFields()
    },
    handleExportClose() {
      this.showExportDialog = false
    },
    async addUser(data) {
      const vm = this
      await UserAPI.addUser(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '用户添加成功'
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
    async updateUser(data) {
      const vm = this
      this.$delete(data, 'updateTime')
      await UserAPI.updateUser(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '用户信息更新成功'
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
    deleteUser(row) {
      const vm = this
      this.$confirm('是否确认删除该用户', '提示', {
        type: 'warning'
      }).then(() => {
        // debugger
        UserAPI.deleteUser(row).then(res => {
          // debugger
          if (res && res.status === 200) {
            vm.$message({
              type: 'success',
              message: '删除用户成功'
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

