<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="科目名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>

        <!--教师用户只能对自己进行关联科目操作-->
        <el-form-item>
          <el-button type="primary">新增</el-button>
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
      <el-table-column label="教师科目关联ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.uuid}}</span>
				</template>
			</el-table-column>
      <el-table-column label="教师ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.teacherId}}</span>
				</template>
			</el-table-column>
      <el-table-column label="科目ID" align="center" width="280px">
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
      <el-table-column label="操作" align="center" fixed="right">
        <template>
          <el-button size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
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
  </section>
</template>

<script>
import SubjectTeacherAPI from '@/api/subjectTeacher'
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  components: { Pagination },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true

      const vm = this
      await SubjectTeacherAPI.getRelation(this.listQuery).then(res => {
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
    }
  }
}
</script>

<style scoped>
</style>
