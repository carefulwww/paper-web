<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchName" placeholder="作品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList('name')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table highlight-current-row :data="excellentWorkList" v-loading="listLoading">
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>

      <el-table-column label="作品名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.workName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属科目" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.subject.subjectName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="作者" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.user.nickname}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
					<span>{{scope.row.createTime*1000|formatDate('yyyy-MM-dd')}}</span>
				</template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="$store.state.user.type === '3'" size="small" @click="$router.push({path:'/workDetail',query:{work:scope.row}})">查看</el-button>
          <div v-else>
            <el-button size="small" @click="$router.push({path:'/workDetail',query:{work:scope.row}})">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteGoodWork(scope.row)">删除</el-button>
          </div>
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
				<good-work-form
					ref="goodWorkForm"
					:data="tmpData"
					:is-created="dialogTitle!=='新增优秀作品'"
					@add="addGoodWork"
					@update="updateGoodWork"
					@close="handleClose"
				/>
			</el-dialog>
  </section>
</template>

<script>
import GoodWorkForm from './components/goodWorkForm'
import ExcellentWorkAPI from '@/api/excellentWork'
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      listLoading: false,
      excellentWorkList: [],
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
  components: { Pagination, GoodWorkForm },
  created() {
    this.getList()
  },
  methods: {
    async getList(arg) {
      this.listLoading = true

      const vm = this
      if (arg === 'name') {
        this.listQuery = Object.assign({}, this.listQuery, { name: this.searchName })
      } else {
        // debugger
        this.$delete(this.listQuery, 'name')
      }
      await ExcellentWorkAPI.getExcellentWork(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.excellentWorkList = res.data.data.list
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
      this.$refs.goodWorkForm.$refs.goodWorkData.resetFields()
    },
    handleAdd() {
      this.dialogTitle = '新增优秀作品'
      this.showDialog = true
      this.$set(this.tmpData, 'createUserId', this.$store.state.user.uuid)
    },
    handleEdit(row) {
      this.dialogTitle = '编辑优秀作品'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
    },
    async addGoodWork(data) {
      const vm = this
      await ExcellentWorkAPI.addExcellentWork(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '优秀作品添加成功'
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
    async updateGoodWork(data) {
      const vm = this
      this.$delete(data, 'updateTime')
      await ExcellentWorkAPI.updateExcellentWork(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '优秀作品更新成功'
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
    deleteGoodWork(row) {
      const vm = this
      this.$confirm('是否确认删除该作品', '提示', {
        type: 'warning'
      }).then(() => {
        // debugger
        ExcellentWorkAPI.delExcellentWork(row).then(res => {
          // debugger
          if (res && res.status === 200) {
            vm.$message({
              type: 'success',
              message: '删除作品成功'
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
